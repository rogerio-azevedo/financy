# Financy

## Projeto da Pós-graduação Tech Developer 360 da Faculdade de Tecnologia Rocketseat

Projeto FullStack de gerenciamento de finanças. O objetivo é permitir a organização financeira com gestão de transações e categorias.
Figma: https://www.figma.com/community/file/1580994817007013257

**Requisitos do desafio**

- O usuário pode criar uma conta e fazer login
- O usuário pode ver e gerenciar apenas as transações e categorias criadas por ele
- Deve ser possível criar uma transação
- Deve ser possível deletar uma transação
- Deve ser possível editar uma transação
- Deve ser possível listar todas as transações
- Deve ser possível criar uma categoria
- Deve ser possível deletar uma categoria
- Deve ser possível editar uma categoria
- Deve ser possível listar todas as categorias

**Back-end**

- Banco de dados esperado: SQLite (Postgres opcional)
- Ferramentas obrigatórias: TypeScript e GraphQL
- API para gerenciar finanças

**Front-end**

- Obrigatório: React + GraphQL + Vite (bundler)
- Seguir o layout do Figma o mais fielmente possível
- A aplicação possui 6 páginas e 2 modais (formulários via Dialog)

**Entrega**

- Repositório público no GitHub
- Envio do link do repositório na plataforma do desafio

**Stack do projeto (implementação atual)**

- Front-end: React, Vite, Tailwind CSS, Apollo Client, React Router
- Back-end: Node.js, TypeScript, Fastify, Mercurius, Prisma 7, SQLite

**Como rodar**

Pré-requisitos: Node.js 22+ e [pnpm](https://pnpm.io) 11.

1. Back-end

```bash
cd backend
cp .env.example .env
# preencha JWT_SECRET (mínimo 16 caracteres)
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm dev
```

API GraphQL: http://localhost:4000/graphql

2. Front-end (outro terminal)

```bash
cd frontend
cp .env.example .env
pnpm install
pnpm dev
```

App: http://localhost:5173

**Variáveis de ambiente**

Back-end (`backend/.env`):

```
JWT_SECRET=
DATABASE_URL=file:./dev.db
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Front-end (`frontend/.env`):

```
VITE_BACKEND_URL=http://127.0.0.1:4000
```

**Observações**

- Use **pnpm** (não npm/yarn).
- O front-end chama `${VITE_BACKEND_URL}/graphql`. O backend precisa estar rodando.
- GraphiQL fica em http://localhost:4000/graphql (apenas em `development`).
- Detalhes por pacote: [backend/README.md](backend/README.md) e [frontend/README.md](frontend/README.md).
