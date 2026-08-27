# Financy — Plano de execução

Desafio de pós-graduação **Tech Developer 360** (Faculdade de Tecnologia Rocketseat). API GraphQL + app React para organização financeira pessoal.

Este diretório é a fonte da verdade do que precisa ser feito. Código de aplicação **não** vive aqui.

## Índice

| Arquivo | Conteúdo |
|---------|----------|
| [00-checklist.md](00-checklist.md) | Os 24 itens oficiais, rastreáveis, com fase e status |
| [01-arquitetura.md](01-arquitetura.md) | Decisões, versões pinadas, camadas, env, estilo |
| [02-backend.md](02-backend.md) | Prisma 7, modelagem, SDL, mapa 1:1, fases 1–4 |
| [03-frontend.md](03-frontend.md) | Setup, 6 telas, 2 modais, fases 5–9 |
| [04-design-system.md](04-design-system.md) | Tokens, ícones Lucide, componentes e estados do Figma |
| [05-entrega.md](05-entrega.md) | `.env.example`, READMEs, git, critérios de entrega |

Convenções de código: `.agent/skills/project-conventions/`.

## Figma

Arquivo: [Financy (Community)](https://www.figma.com/design/798g4fJWl4yHj69Gntm6EV/Financy--Community-) (`fileKey` `798g4fJWl4yHj69Gntm6EV`).

| Página / grupo | node-id | Link |
|----------------|---------|------|
| Style Guide | `1085:710` | [abrir](https://www.figma.com/design/798g4fJWl4yHj69Gntm6EV/Financy--Community-?node-id=1085-710) |
| Projeto | `3:809` | [abrir](https://www.figma.com/design/798g4fJWl4yHj69Gntm6EV/Financy--Community-?node-id=3-809) |
| Gestão (modais) | `3107:3599` | [abrir](https://www.figma.com/design/798g4fJWl4yHj69Gntm6EV/Financy--Community-?node-id=3107-3599) |
| Páginas | `3107:3491` | [abrir](https://www.figma.com/design/798g4fJWl4yHj69Gntm6EV/Financy--Community-?node-id=3107-3491) |
| Dashboard | `3103:1987` | [abrir](https://www.figma.com/design/798g4fJWl4yHj69Gntm6EV/Financy--Community-?node-id=3103-1987) |
| Transações | `3104:362` | [abrir](https://www.figma.com/design/798g4fJWl4yHj69Gntm6EV/Financy--Community-?node-id=3104-362) |
| Categorias | `3104:2028` | [abrir](https://www.figma.com/design/798g4fJWl4yHj69Gntm6EV/Financy--Community-?node-id=3104-2028) |
| Perfil | `3104:2925` | [abrir](https://www.figma.com/design/798g4fJWl4yHj69Gntm6EV/Financy--Community-?node-id=3104-2925) |
| Acesso | `3107:3489` | [abrir](https://www.figma.com/design/798g4fJWl4yHj69Gntm6EV/Financy--Community-?node-id=3107-3489) |
| Login | `3101:353` | [abrir](https://www.figma.com/design/798g4fJWl4yHj69Gntm6EV/Financy--Community-?node-id=3101-353) |
| Cadastro | `3103:1915` | [abrir](https://www.figma.com/design/798g4fJWl4yHj69Gntm6EV/Financy--Community-?node-id=3103-1915) |

## Fases

| # | Escopo | Status |
|---|--------|--------|
| 0 | Documentação (`docs/` + skill) | feito |
| 1 | Backend — setup (Fastify, Mercurius, Prisma 7, env) | feito |
| 2 | Backend — auth (User, JWT, register/login/me) | feito |
| 3 | Backend — Category | feito |
| 4 | Backend — Transaction + summary | feito |
| 5 | Frontend — setup + design system | feito |
| 6 | Frontend — Login e Cadastro | feito |
| 7 | Frontend — Dashboard | feito |
| 8 | Frontend — Transações (filtros, paginação, modal) | feito |
| 9 | Frontend — Categorias e Perfil | feito |
| 10 | Entrega (READMEs, gitignore, varredura dos 24 itens) | feito |

Extras (avatar, Docker, testes) **não** entram na `main`. Se existirem, vão em branch `extras` depois da entrega.

## Como rodar (alvo, após as fases 1 e 5)

Dois processos, dois pacotes, **somente pnpm**.

```bash
# backend
cd backend
cp .env.example .env   # preencher JWT_SECRET
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm dev               # http://localhost:4000/graphql

# frontend (outro terminal)
cd frontend
cp .env.example .env
pnpm install
pnpm dev               # http://localhost:5173
```

Env obrigatória:

- Backend: `JWT_SECRET`, `DATABASE_URL`
- Frontend: `VITE_BACKEND_URL` (Apollo monta `${VITE_BACKEND_URL}/graphql`)

## Decisões em uma linha

- API = GraphQL via Mercurius. Sem REST CRUD.
- Dono de registro = `sub` do JWT. Nunca `userId` no input.
- Dinheiro = `Int` de centavos. Formatação pt-BR só na UI.
- Category grava `icon` e `color` como string do enum do design (`utensils`, `blue`).
- Transações paginam no servidor (`TransactionPage`).
- Tokens de produto = `Grayscale/*` + brand. Tokens `Gray/*` do Figma são da documentação Rocketseat — ignorar.
- Ícones = Lucide (`lucide-react`). Fonte = Inter.
