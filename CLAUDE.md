# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

SEDEC.NEWS — an internal news/intranet portal. Strapi 5 (headless CMS/backend) + Next.js 16 (App Router frontend), reverse-proxied by nginx, deployed via Docker Compose. Content is in Portuguese (`Artigo`, `Comunicado`, `Aniversariante`, etc.).

## Architecture

Three-service stack behind a single nginx proxy:

- `backend-strapi/` — Strapi 5 CMS. Owns the Postgres database and all content types.
- `frontend-nextjs/` — Next.js 16 frontend, `output: 'standalone'`, consumes the Strapi REST API.
- `nginx/` — reverse proxy (HTTP only, port 80): `/backend/*` → strapi:1337 (stripped prefix), `/*` → frontend:3000. `client_max_body_size` (upload limit) lives here — keep this in sync with Strapi's own upload size config.

### Backend (Strapi)

- Content types live under `backend-strapi/src/api/<name>/` (collections: `article`, `comunicado`, `category`, `author`, `tutorial`, `aniversariante`, `link-util`; single type: `global`, `about`). Each has `content-types/<name>/schema.json`, `controllers/`, `routes/`, `services/` — mostly Strapi-generated boilerplate unless customized.
- Reusable content blocks (dynamic zones) live in `backend-strapi/src/components/shared/`: `rich-text`, `quote`, `media`, `slider`, `seo`. `article` and `comunicado` both use a `blocks` dynamic zone built from these.
- Config in `backend-strapi/config/*.ts`: `database.ts` supports sqlite/mysql/postgres via `DATABASE_CLIENT` env var (postgres in Docker); `server.ts` reads `PUBLIC_URL`/`APP_KEYS` from env.
- Env vars: copy `backend-strapi/.env.example` to `.env` for local dev (secrets need real values, not the placeholder `tobemodified` strings).

### Frontend (Next.js)

- **Routes live in the root `app/` directory**, not `frontend-nextjs/src/app/` — the latter only holds `actions.ts` (server actions). Don't confuse the two when adding pages.
- `src/lib/strapi.ts` centralizes all Strapi REST calls (`fetchArticles`, `fetchArticleBySlug`, `fetchComunicados`, `fetchGlobalAgendaUrl`, etc.) — add new Strapi queries here rather than fetching ad hoc from components. `STRAPI_URL` prefers `STRAPI_INTERNAL_URL` (server-to-server, e.g. Docker network) over the public `NEXT_PUBLIC_STRAPI_URL`.
- `src/app/actions.ts` holds `"use server"` actions (e.g. `getComunicadoDetails`) used by client components to fetch data without exposing the Strapi URL to the browser.
- `src/components/blocks/` renders the dynamic-zone block types from Strapi (`RichText`, `Quote`, `MediaBlock`, `SliderBlock`); `src/components/Blocks.tsx` switches on `block.__component` to dispatch — when adding a new shared component in Strapi, add both the schema in `backend-strapi/src/components/shared/` and a matching case here.
- `src/types/strapi.ts` has the corresponding TypeScript types for Strapi responses/blocks.
- Images are unoptimized (`images.unoptimized: true` in `next.config.ts`) and only `localhost:1337/uploads/**` is whitelisted for remote patterns — update this if the Strapi upload host changes.

## Commands

### Backend (`backend-strapi/`)
```bash
npm run develop   # Strapi dev server with autoReload (admin UI at :1337/admin)
npm run start     # production mode, no autoReload
npm run build     # build the admin panel
npm run console   # Strapi console
```

### Frontend (`frontend-nextjs/`)
```bash
npm run dev       # Next.js dev server
npm run build
npm run start
npm run lint
```

### Docker (repo root)
```bash
# local
docker compose build
docker compose up -d

# homologação / produção — env file selects config (DB creds, PUBLIC_URL, image tags, etc.)
docker compose --env-file .env.hml build && docker compose --env-file .env.hml up -d
docker compose --env-file .env.prod build && docker compose --env-file .env.prod up -d
```

## Notes

- No test suite is configured in either package.
- A `.agent/` directory exists at the repo root containing a third-party "Antigravity Kit" multi-agent template (agents/skills/workflows for Gemini CLI, keyed off `.agent/rules/GEMINI.md`). It is generic tooling unrelated to this project's actual architecture — do not treat its contents as project-specific guidance.
