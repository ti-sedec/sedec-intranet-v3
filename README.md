# SEDEC.NEWS — Intranet

Portal interno de notícias/intranet. Stack composta por três serviços por trás de um proxy nginx:

| Serviço | Pasta | Descrição |
|---|---|---|
| Backend | `backend-strapi/` | CMS Strapi 5 — dono do banco Postgres e de todo o conteúdo (artigos, comunicados, categorias, etc). |
| Frontend | `frontend-nextjs/` | Next.js 16 (App Router) que consome a API REST do Strapi. |
| Proxy | `nginx/` | Roteia `/backend/*` → Strapi (`:1337`) e `/*` → Next.js (`:3000`), tudo na porta `80`. |

> Todo o código vive num único repositório — **não há submódulos git**. Um `git clone` simples já traz tudo.

---

## 1. Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/) (v2, `docker compose`, sem hífen).
- Git.
- (Opcional, só se quiser rodar sem Docker) Node.js 20+ e npm.

## 2. Clonando o repositório

Como não existem submódulos, um clone normal já é suficiente:

```bash
git clone <url-do-repositorio>
cd sedec-intranet-v3
```

## 3. Configurando as variáveis de ambiente

O `docker-compose.yml`/`docker-compose.dev.yml` leem um arquivo `.env` na raiz do projeto (não versionado). Crie o seu a partir do modelo abaixo:

```bash
cp backend-strapi/.env.example .env
```

Depois edite o `.env` e complete com os campos abaixo (o `.env.example` do backend só cobre os segredos do Strapi):

```dotenv
# Server
HOST=0.0.0.0
PORT=1337

# Secrets do Strapi — gere valores únicos, nunca reaproveite os de exemplo
APP_KEYS=chave1,chave2,chave3,chave4
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
ENCRYPTION_KEY=...
JWT_SECRET=...

# Banco de dados
DATABASE_CLIENT=postgres
DATABASE_PORT=5432
DATABASE_ETERNAL_PORT=5505
DATABASE_NAME=sedec_intranet_db
DATABASE_USERNAME=sedec
DATABASE_PASSWORD=escolha-uma-senha-forte
DATABASE_SSL=false

# Ambiente
NODE_ENV=development

# Docker Hub (usado para nomear/publicar as imagens)
DOCKER_HUB_USER=seu-usuario
DOCKER_IMAGE_NAME=strapi-intranet-prod
APLICATION_VERSION=0.0.1

# URLs
STRAPI_INTERNAL_URL=http://backend:1337
PUBLIC_URL=http://localhost/backend
```

Cada segredo (`APP_KEYS`, `*_SALT`, `*_SECRET`, `ENCRYPTION_KEY`) pode ser gerado com:

```bash
openssl rand -base64 32
```

> Para produção, duplique esse arquivo como `.env.prod` e ajuste `PUBLIC_URL` para o domínio real (ex.: `https://intranet.suaempresa.com/backend`) e use senhas/segredos diferentes dos de desenvolvimento.

---

## 4. Rodando em desenvolvimento

Use o `docker-compose.dev.yml`: ele monta o código-fonte do host dentro dos containers, então alterações em `backend-strapi/src`, `backend-strapi/config` ou em qualquer arquivo de `frontend-nextjs/` são refletidas automaticamente — **sem precisar rodar build/deploy a cada mudança**.

```bash
# primeira vez (ou sempre que o Dockerfile/dependências mudarem)
docker compose -f docker-compose.dev.yml up --build

# nas próximas vezes
docker compose -f docker-compose.dev.yml up -d
```

O que sobe:

- **Postgres** — `localhost:5505`
- **Strapi** (`npm run develop`, com autoReload) — [http://localhost:1337/admin](http://localhost:1337/admin)
- **Next.js** (`npm run dev`, com fast refresh) — [http://localhost:3000](http://localhost:3000)

Não há nginx nesse modo — acesse frontend e backend diretamente pelas portas acima.

Para ver os logs em tempo real:

```bash
docker compose -f docker-compose.dev.yml logs -f
```

Para parar:

```bash
docker compose -f docker-compose.dev.yml down
```

### Alternativa sem Docker

Se preferir rodar direto na máquina (precisa de um Postgres à parte, ou trocar `DATABASE_CLIENT` para `sqlite` no `.env` do backend):

```bash
# backend
cd backend-strapi
npm install
npm run develop

# frontend (em outro terminal)
cd frontend-nextjs
npm install
npm run dev
```

---

## 5. Rodando em produção

Use o `docker-compose.yml` (raiz do projeto) com o arquivo `.env.prod`:

```bash
docker compose --env-file .env.prod build
docker compose --env-file .env.prod up -d
```

O que sobe:

- **Postgres** — dados persistidos em volume Docker (`sedec-data`)
- **Strapi** — build de produção (`Dockerfile.prod`), porta `1337`
- **Next.js** — build de produção (`output: standalone`), porta `3000`
- **nginx** — único ponto de entrada, porta `80`, roteando `/backend/*` para o Strapi e `/*` para o Next.js

Para acompanhar os logs:

```bash
docker compose --env-file .env.prod logs -f
```

Para atualizar após alterações no código (rebuild + subir de novo):

```bash
docker compose --env-file .env.prod build
docker compose --env-file .env.prod up -d
```

Para parar:

```bash
docker compose --env-file .env.prod down
```

> Há também suporte a um ambiente de homologação seguindo o mesmo padrão, com um `.env.hml`:
> `docker compose --env-file .env.hml build && docker compose --env-file .env.hml up -d`

---

## 6. Comandos úteis

| Comando | O que faz |
|---|---|
| `docker compose ps` | Lista os containers e seus status |
| `docker compose logs -f <serviço>` | Acompanha os logs de um serviço específico (`db`, `backend`, `frontend`, `proxy`) |
| `docker compose exec backend sh` | Abre um shell dentro do container do Strapi |
| `docker compose down -v` | Para os containers **e apaga os volumes** (perde os dados do banco/uploads) — use com cuidado |

---

## 7. Estrutura do repositório

```
.
├── backend-strapi/     # Strapi 5 (CMS)
├── frontend-nextjs/     # Next.js 16 (App Router fica em ./app, não em src/app)
├── nginx/               # Configuração e Dockerfile do proxy reverso
├── docker-compose.yml       # Produção/homologação
├── docker-compose.dev.yml   # Desenvolvimento com hot-reload
├── .env                 # Variáveis locais/dev (não versionado)
└── .env.prod            # Variáveis de produção (não versionado)
```

Mais detalhes de arquitetura (content types do Strapi, organização das rotas do Next.js, etc.) estão em [CLAUDE.md](CLAUDE.md).
