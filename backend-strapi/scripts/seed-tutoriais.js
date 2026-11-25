'use strict';

/**
 * Seed de tutoriais.
 *
 * Cada tutorial é uma pasta em seeds/tutoriais/<pasta>/ com:
 *   - tutorial.json  -> { titulo, slug, grupo, descricao }
 *   - NN-*.md        -> um bloco "Rich text" por arquivo, na ordem alfabética
 *   - imagens/       -> arquivos referenciados nos .md como ![alt](imagens/arquivo.png)
 *
 * As imagens são enviadas para a Media Library (com o alt do markdown como texto
 * alternativo) e o caminho no texto é trocado pela URL do upload.
 *
 * Uso (dentro do container/pasta do Strapi):
 *   npm run seed:tutoriais                    # cria os que ainda não existem
 *   npm run seed:tutoriais -- --update        # também atualiza os já existentes
 *   npm run seed:tutoriais -- <slug> [...]    # apenas os slugs informados
 */

const fs = require('fs');
const path = require('path');

const SEEDS_DIR = path.join(__dirname, '..', 'seeds', 'tutoriais');
const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};
const IMAGE_REF = /!\[([^\]]*)\]\((imagens\/[^)\s]+)\)/g;

function loadTutorial(dir) {
  const meta = JSON.parse(fs.readFileSync(path.join(dir, 'tutorial.json'), 'utf8'));
  for (const key of ['titulo', 'slug', 'descricao']) {
    if (!meta[key]) throw new Error(`tutorial.json sem o campo obrigatório "${key}"`);
  }
  const blocks = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => fs.readFileSync(path.join(dir, f), 'utf8').trim());
  if (blocks.length === 0) throw new Error('nenhum arquivo .md de bloco encontrado');

  // Valida antes de enviar qualquer coisa
  const images = new Map(); // caminho relativo -> alt
  for (const body of blocks) {
    for (const [, alt, rel] of body.matchAll(IMAGE_REF)) {
      if (!fs.existsSync(path.join(dir, rel))) throw new Error(`imagem não encontrada: ${rel}`);
      if (!images.has(rel)) images.set(rel, alt);
    }
  }
  return { meta, blocks, images };
}

async function ensureImage(dir, slug, rel, alt) {
  const file = path.basename(rel);
  const name = `${slug}--${file}`;
  const existing = await strapi.db.query('plugin::upload.file').findOne({ where: { name } });
  if (existing) return existing.url;

  const filepath = path.join(dir, rel);
  const [uploaded] = await strapi.plugin('upload').service('upload').upload({
    data: { fileInfo: { name, alternativeText: alt || file } },
    files: {
      filepath,
      originalFilename: name,
      mimetype: MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      size: fs.statSync(filepath).size,
    },
  });
  return uploaded.url;
}

async function seedTutorial(folder, { update }) {
  const dir = path.join(SEEDS_DIR, folder);
  const { meta, blocks, images } = loadTutorial(dir);
  const docs = strapi.documents('api::tutorial.tutorial');

  const [existing] = await docs.findMany({ filters: { slug: meta.slug }, limit: 1 });
  if (existing && !update) {
    console.log(`= ${meta.slug}: já existe (use --update para atualizar)`);
    return;
  }

  const urls = new Map();
  for (const [rel, alt] of images) urls.set(rel, await ensureImage(dir, meta.slug, rel, alt));

  const conteudo = blocks.map((body) => ({
    __component: 'shared.rich-text',
    body: body.replace(IMAGE_REF, (_, alt, rel) => `![${alt}](${urls.get(rel)})`),
  }));
  const data = { titulo: meta.titulo, slug: meta.slug, grupo: meta.grupo, descricao: meta.descricao, conteudo };

  if (existing) {
    await docs.update({ documentId: existing.documentId, data, status: 'published' });
    console.log(`~ ${meta.slug}: atualizado`);
  } else {
    await docs.create({ data, status: 'published' });
    console.log(`+ ${meta.slug}: criado`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const update = args.includes('--update');
  const only = args.filter((a) => !a.startsWith('--'));

  const folders = fs
    .readdirSync(SEEDS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && (only.length === 0 || only.includes(d.name)))
    .map((d) => d.name);
  if (folders.length === 0) {
    console.log('Nenhum tutorial encontrado em seeds/tutoriais.');
    return;
  }

  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'error';

  let failed = false;
  for (const folder of folders) {
    try {
      await seedTutorial(folder, { update });
    } catch (error) {
      failed = true;
      console.error(`! ${folder}: ${error.message}`);
    }
  }

  // Sai direto, sem app.destroy(): tudo já foi gravado (cada operação é aguardada) e o
  // encerramento do pool de conexões aborta operações internas pendentes do Strapi,
  // derrubando o processo com código 1 mesmo quando o seed deu certo.
  process.exit(failed ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
