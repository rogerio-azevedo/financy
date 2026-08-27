# Financy — frontend

Aplicação React para gerenciar transações e categorias.

Stack: React 19, Vite, TypeScript, Apollo Client 4, React Router, TailwindCSS v4, GraphQL.

## Pré-requisitos

- Backend rodando em `http://localhost:4000`
- pnpm 11

## Setup

```bash
cp .env.example .env
pnpm install
pnpm dev
```

App: [http://localhost:5173](http://localhost:5173)

## Variáveis

Ver `.env.example`:

- `VITE_BACKEND_URL` — base da API (Apollo usa `${VITE_BACKEND_URL}/graphql`)

## Scripts

- `pnpm dev` — Vite
- `pnpm build` — typecheck + build
- `pnpm preview` — preview da build
