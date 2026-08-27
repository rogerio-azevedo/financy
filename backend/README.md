# Financy — backend

API GraphQL para organização financeira pessoal.

Stack: Fastify, Mercurius, TypeScript, Prisma 7, SQLite, JWT, bcrypt, Zod.

## Pré-requisitos

- Node.js 22+
- pnpm 11

## Setup

```bash
cp .env.example .env
# preencha JWT_SECRET (mínimo 16 caracteres)
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm dev
```

GraphQL Playground (dev): [http://localhost:4000/graphql](http://localhost:4000/graphql)

Healthcheck: `GET http://localhost:4000/health`

## Variáveis

Ver `.env.example`:

- `JWT_SECRET` — obrigatório
- `DATABASE_URL` — `file:./dev.db`
- `PORT` — `4000`
- `NODE_ENV` — `development` | `production`
- `CORS_ORIGIN` — origin do Vite (`http://localhost:5173`)

## Prisma 7

Este projeto **não** usa o client clássico em `node_modules/@prisma/client`.

- Generator: `prisma-client` com `output` em `src/generated/prisma`
- URL do banco em `prisma.config.ts` (não no `schema.prisma`)
- Client exige adapter `@prisma/adapter-better-sqlite3`
- Sempre `pnpm prisma generate` depois do install (não é mais implícito)

Não rode `prisma db push`. Use migrations.
