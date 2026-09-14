# DESIGN.md — SEDEC.NEWS (novo layout)

Este documento descreve o sistema de design que vai substituir o layout "brutalista" atual do frontend. Foi extraído a partir do mockup `SEDEC NEWS Portal.html` (export de um Artifact/Claude Design) e serve como referência única de estilo, componentes e páginas para a refatoração do `frontend-nextjs`.

Tom geral: editorial, institucional e calmo — tipografia forte para títulos, muito uso de `IBM Plex Mono` em maiúsculas para metadados (categoria, data, labels), fundo levemente bege (não branco puro), acentos em laranja queimado e um bloco escuro (navy) para o mural de aniversariantes e o rodapé. Sem modo escuro — tema único.

## 1. Tipografia

Três famílias, carregadas via `next/font/google` (self-hosted pelo Next, sem depender de `fonts.googleapis.com` em runtime):

| Família | Uso | Pesos usados |
|---|---|---|
| **Archivo** | Títulos (`h1`–`h3`), logo, números de destaque | 600, 700, 800 |
| **IBM Plex Sans** | Corpo de texto, navegação, parágrafos | 400, 500, 600 |
| **IBM Plex Mono** | Metadados: categoria, data, tempo de leitura, labels de UI, botões secundários — sempre uppercase com `letter-spacing` positivo | 500, 600 |

Escala aproximada (usar `clamp()` nos títulos de página para responsividade):

- H1 de página: `clamp(30px, 4.4vw, 52px)` / peso 800 / `letter-spacing: -1.4px` / `line-height: 1`
- H1 de artigo (detalhe): `clamp(30px, 4.6vw, 54px)` / peso 800 / `line-height: 1.04`
- H2 de seção: 26px / peso 800
- H2 destaque (hero): `clamp(24px, 3vw, 38px)` / peso 700
- H3 de card: 18–19px / peso 600–700
- Corpo: 14–17px / `line-height: 1.5–1.68`
- Metadado mono: 10–12px / uppercase / `letter-spacing: 0.08em–0.14em`

Regra de ouro: **nenhum título ou parágrafo em uppercase** (isso pertence só aos elementos mono de metadado/UI). Isso inverte o padrão brutalista atual, que usa uppercase agressivo em tudo.

## 2. Cores

Paleta única (não há variante dark). Definir como tokens Tailwind v4 em `@theme`.

| Token | Valor | Uso |
|---|---|---|
| `--color-bg` | `#f6f4f0` | fundo geral da página |
| `--color-surface` | `#ffffff` | cards, painéis |
| `--color-surface-alt` | `#fbfaf7` | hover de linha em listas |
| `--color-ink` | `#171b26` | texto principal, header/footer escuros, botão primário |
| `--color-ink-soft` | `#454b5a` | subtítulos, dek |
| `--color-body` | `#2b3040` | corpo de texto longo (artigo) |
| `--color-muted` | `#5c6270` | texto secundário |
| `--color-faint` | `#6b7080` | metadado mono |
| `--color-faint-2` | `#8b8f9c` | metadado mono mais apagado / placeholders de imagem |
| `--color-border` | `#e3ded4` | bordas padrão |
| `--color-border-strong` | `#d9d4c9` / `#c9c3b6` | divisores, bordas de botão outline |
| `--color-accent` | `oklch(0.62 0.17 45)` (~`#e2611f`) | laranja queimado — acento primário, links, hover |
| `--color-accent-strong` | `oklch(0.55 0.17 45)` (~`#c8500f`) | categoria/kicker sobre fundo claro |
| `--color-accent-soft` | `oklch(0.75 0.14 45)` (~`#e8925c`) | acento sobre fundo escuro (mural) |
| `--color-link` | `oklch(0.52 0.12 250)` (~`#3f5aa8`) | links azuis (ex.: "todos os links") |
| `--color-navy-panel` | `#1f2431` | cards dentro do bloco escuro (mural) |
| `--color-navy-border` | `#2c3242` | bordas dentro do bloco escuro |

Tailwind v4 aceita `oklch()` nativamente — manter os valores em oklch no `@theme` (não converter para hex) para ficar fiel ao mockup.

## 3. Espaçamento, grid, bordas, sombras

- Largura máxima de conteúdo: `max-width: 1280px`, `margin: 0 auto`, padding lateral `24px`.
- Sem sombras (`box-shadow`) em nenhum componente — o mockup usa só bordas de 1px e mudança de cor de borda no hover. **Isso substitui o `brutalist-shadow` atual.**
- `border-radius`: 3–6px nos cards/botões, `100px` (pill) nos filtros de categoria, `50%` nos avatares.
- Bordas de 1px (`#e3ded4`) como padrão; nunca `2px` preto como no brutalista.
- Placeholder de imagem (enquanto não há capa real): `repeating-linear-gradient(135deg, #e8e4db 0 12px, #f1eee7 12px 24px)` com label mono centralizada — usar como fallback visual quando `cover`/`file` vier nulo, no lugar do espaço vazio atual.

## 4. Componentes

### 4.1 Header
- Sticky (`top: 0`), fundo igual ao body (`--color-bg`), borda inferior 1px.
- Logo: quadrado 40×40 laranja com "SD" em mono + wordmark "SEDEC" + ".NEWS" (o ".NEWS" na cor de acento) + linha pequena mono com o nome completo da secretaria.
- Nav: Home, Notícias, Tutoriais, Links úteis, Sobre — botões simples, hover com fundo cinza claro (`#ebe7df`), sem sublinhado.
- CTA "Agenda" à direita, botão sólido `--color-ink`, hover vira laranja.
- Filete decorativo de 2px abaixo do header: gradiente segmentado laranja/navy/borda (puramente decorativo, pode ser um `<div>` com `linear-gradient` fixo).

### 4.2 Home — Boletim (hero)
- Título de página "Boletim interno" + data por extenso em mono, na mesma linha (baseline).
- Grid: card do artigo mais recente (2/3) + lista "Em destaque" com 3 itens secundários (1/3).
- Card principal: imagem 16:8, kicker de categoria em accent, H2, dek (1 parágrafo, `max-width: 62ch`), rodapé com autor · data · tempo de leitura em mono.
- Itens secundários: sem imagem, só kicker + H3 + dek curto, separados por borda inferior.

### 4.3 Mural de aniversariantes (seção escura)
- Fundo `--color-ink`, texto branco, `padding: 48px 0`.
- Kicker "Mural" em accent-soft + H2 "Aniversariantes de {mês}" + texto de apoio à direita.
- Grid `repeat(auto-fill, minmax(168px,1fr))` de cards escuros (`--color-navy-panel`), cada um com: avatar circular com iniciais, dia do mês em mono grande (accent-soft), badge "hoje" (accent) quando aplicável, nome e unidade/setor.
- Seção sempre visível (nunca some do layout); sem aniversariantes no mês, mostra a mensagem "Nenhum aniversariante neste mês." no lugar do grid.

### 4.4 Últimas notícias + sidebar
- Duas colunas: lista de notícias em grid (2/3) + aside (1/3).
- Cards de notícia: imagem 16:10, kicker, H3, dek, rodapé data · tempo de leitura.
- Aside: bloco "Acesso rápido" (até 5 links úteis com índice `01`, `02`…) + CTA laranja sólido para a central de tutoriais.

### 4.5 Arquivo de notícias (`/noticias`)
- H1 "Notícias e comunicados" + filtros de categoria em pills (`100px` radius): pill ativa = fundo `--color-ink`; inativas = outline, hover escurece a borda.
- Lista vertical (não grid) com layout `grid-template-columns: repeat(auto-fit, minmax(240px,1fr))` por item: imagem à esquerda, texto ocupando 2 colunas à direita (kicker, H3, dek, autor · data · leitura). Hover: fundo `--color-surface-alt`.

### 4.6 Tutoriais (`/tutoriais`)
- H1 "Tutoriais" + grid de cards (`minmax(300px,1fr)`).
- Card: badge numérico (`01`, `02`…) + grupo (mono uppercase) + H3 + dek + rodapé "N etapas · leitura".

### 4.7 Links úteis (`/links-uteis`)
- H1 "Links úteis" + grid de cards (`minmax(290px,1fr)`).
- Card: grupo (mono) + ícone `↗` à direita + H3 + dek + host da URL em azul (`--color-link`), sem o `https://`.

### 4.8 Página de detalhe (artigo / tutorial / sobre)
- Botão "← Voltar" em mono acima do título.
- Kicker (categoria ou "Tutorial · {grupo}" ou "Institucional") + H1 + dek + linha de meta (avatar iniciais + autor + data · leitura) — a linha de meta só aparece para artigos.
- Capa 16:7 abaixo do header (só quando existe).
- Corpo em duas colunas quando há índice (`hasIndex`, usado só em tutorial): aside sticky com lista numerada de passos + coluna de blocos (`max-width: 720px`).
- Blocos de conteúdo (dynamic zone), na ordem em que vierem do Strapi:
  - **rich-text**: heading opcional (H2) + parágrafos, `font-size: 17px`, `line-height: 1.68`.
  - **quote**: card com borda esquerda de 4px laranja, título (H-ish, peso 700), corpo, e **atribuição** (`who`) em mono uppercase.
  - **media**: figura com imagem 16:9 + legenda abaixo.
  - **slider**: carrossel simples (setas ← →, contador "N / total", legenda), badge "Galeria" no canto.
- "Leia também" no fim (3 artigos relacionados) — só para artigos, não para tutorial/sobre.

### 4.9 Footer
- Fundo `--color-ink`, 3 colunas: identidade (logo + descrição), navegação, institucional (link da agenda, ramal, e-mail).
- Barra inferior fina com copyright + "Publicado via Strapi".

## 5. Interações e responsividade

- Hover em cards de clique: só muda a cor da borda (`border-color: --color-ink` ou accent) — nunca eleva/sombra.
- Botões: fundo sólido (`--color-ink` ou accent) para ações primárias; outline para secundárias; hover inverte para preenchido.
- Grids usam `auto-fill`/`auto-fit` com `minmax()` — sem breakpoints manuais por página; o próprio grid resolve 1/2/3 colunas.
- `text-wrap: pretty` em títulos e deks.
- Sidebar sticky no detalhe de tutorial (`top: 110px`) — cuidado para não colidir com o header sticky em telas pequenas (recomenda-se desativar o sticky do índice abaixo de `md`).

## 6. Mapeamento para o conteúdo do Strapi

| Elemento do mockup | Origem de dados hoje | Gap |
|---|---|---|
| `featured`, `secondary`, `latest`, `feed` | `Article` (title, description→dek, cover, category, author, publishedAt) | falta **tempo de leitura** — calcular no frontend a partir do texto dos blocks, não precisa de campo novo |
| `cats` (pills) | `Category` | nenhum |
| `birthdays` (nome, dia, **unidade**, hoje) | `Aniversariante` (nome, dataAniversario) | falta campo **unidade/setor** — novo atributo no content-type |
| `tutorials` (grupo, **etapas**, leitura) | `Tutorial` (titulo, descricao, conteudo) | falta **grupo** (categoria do tutorial) — novo atributo; "etapas" pode ser a contagem de blocos `rich-text` com heading, sem campo novo |
| `links` (grupo, host) | `LinkUtil` (titulo, descricao, url) | falta **grupo** — novo atributo; host é derivado da URL no frontend |
| `quote.who` (atribuição) | `shared.quote` (title, body) | falta **atribuição** — novo atributo no componente |
| `media.caption` / `slider` legendas | `shared.media`/`shared.slider` → arquivo Strapi | **sem gap**: usar `caption`/`alternativeText` já existentes no media da Strapi, não precisa de campo novo |
| Nav "Sobre" | `About` (title, blocks) | nenhum — já tem dynamiczone compatível |
| CTA "Agenda" | `Global.agendaUrl` | nenhum |
| Rodapé (ramal, e-mail) | — | não existe hoje; propor novos campos em `Global` (`contactPhone`, `contactEmail`) |

## 7. Decisões em aberto (não assumidas neste documento)

1. **Comunicados**: no mockup, "Comunicados" é só mais uma categoria dentro do arquivo único de notícias. Hoje é um content-type separado (`Comunicado`, sem capa/categoria/autor). Precisa decidir: unificar em `Article` (com uma categoria "Comunicados") ou manter separado e mesclar só na consulta do frontend.
2. **Agenda**: o mockup trata "Agenda" como link externo (`↗`, nova aba). O site atual tem uma página `/eventos` com o Google Calendar embutido — melhor experiência, mas diferente do mockup. Recomendação: manter `/eventos` embutido e só restilizar.
3. ~~**Toggles de seção**~~ — resolvido: ver §8 (estados vazios). Não existem flags no Strapi; toda seção é sempre renderizada e trata a ausência de registros com uma mensagem de estado vazio.
4. **Dark mode**: o `globals.css` atual tem um bloco `prefers-color-scheme: dark`. O novo design é single-theme; proposta é remover esse bloco.

## 8. Estados vazios (regra geral)

Nenhuma seção de conteúdo desaparece por falta de registros — ela sempre é renderizada (título, moldura, layout), e quando não há dados mostra uma frase curta e discreta no lugar da lista/grid (ex.: "Nenhum aniversariante neste mês.", "Nenhuma outra notícia publicada no momento."). Isso vale hoje para: mural de aniversariantes, "Em destaque" (home), "Acesso rápido" (home) e "Leia também" (detalhe do artigo). Objetivo: o editor de conteúdo nunca vê uma seção "sumir" do site sem explicação — ele vê a seção vazia e sabe que falta cadastrar algo.
