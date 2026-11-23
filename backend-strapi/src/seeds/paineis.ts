import type { Core } from '@strapi/strapi';
import paineis from './paineis.json';

const SEED_KEY = 'seed-paineis-v1';
const PERMISSIONS_KEY = 'seed-paineis-permissions-v1';
const PUBLIC_ACTIONS = ['api::painel.painel.find', 'api::painel.painel.findOne'];

/**
 * Carga inicial dos painéis (src/seeds/paineis.json).
 * Roda uma única vez por banco (flag no strapi store), depois que o schema já foi sincronizado.
 * Editar/apagar painéis no admin não faz a carga ser repetida.
 */
export async function seedPaineis(strapi: Core.Strapi) {
  const store = strapi.store({ type: 'core', name: 'seeds' });
  await seedPublicPermissions(strapi, store);
  if (await store.get({ key: SEED_KEY })) return;

  const documents = strapi.documents('api::painel.painel');

  // Banco que já tem painéis cadastrados manualmente: só marca como feito.
  if ((await documents.count({})) === 0) {
    for (const painel of paineis) {
      await documents.create({ data: painel, status: 'published' });
    }
    strapi.log.info(`[seed] ${paineis.length} painéis importados`);
  }

  await store.set({ key: SEED_KEY, value: true });
}

/**
 * Libera find/findOne de /api/paineis para o papel Public (uma única vez).
 * Se alguém revogar a permissão depois pelo admin, ela não é reaplicada.
 */
async function seedPublicPermissions(strapi: Core.Strapi, store: ReturnType<Core.Strapi['store']>) {
  if (await store.get({ key: PERMISSIONS_KEY })) return;

  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  if (!publicRole) return;

  const permissions = strapi.db.query('plugin::users-permissions.permission');
  for (const action of PUBLIC_ACTIONS) {
    const exists = await permissions.findOne({ where: { action, role: publicRole.id } });
    if (!exists) await permissions.create({ data: { action, role: publicRole.id } });
  }

  strapi.log.info('[seed] permissões públicas de /api/paineis liberadas');
  await store.set({ key: PERMISSIONS_KEY, value: true });
}
