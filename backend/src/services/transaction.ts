import { prisma } from '../lib/prisma'
import { requireUser, type Context } from '../graphql/context'
import type {
  TransactionCreateInput,
  TransactionFilterInput,
  TransactionUpdateInput,
} from '../schemas/transaction'

const includeCategory = { category: true } as const

async function assertOwnedCategory(ctx: Context, categoryId: string) {
  const user = requireUser(ctx)
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId: user.id },
  })
  if (!category) {
    throw new Error('Registro não encontrado')
  }
}

export async function listTransactionsPage(
  ctx: Context,
  params: { filter?: TransactionFilterInput; page: number; perPage: number },
) {
  const user = requireUser(ctx)
  const { filter, page, perPage } = params

  const where = {
    userId: user.id,
    ...(filter?.type ? { type: filter.type } : {}),
    ...(filter?.categoryId ? { categoryId: filter.categoryId } : {}),
    ...(filter?.search ? { title: { contains: filter.search } } : {}),
    ...(filter?.dateFrom || filter?.dateTo
      ? {
          date: {
            ...(filter.dateFrom ? { gte: filter.dateFrom } : {}),
            ...(filter.dateTo ? { lte: filter.dateTo } : {}),
          },
        }
      : {}),
  }

  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: includeCategory,
      orderBy: { date: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.transaction.count({ where }),
  ])

  return { items, total, page, perPage }
}

export async function createTransaction(ctx: Context, input: TransactionCreateInput) {
  const user = requireUser(ctx)

  if (input.categoryId) {
    await assertOwnedCategory(ctx, input.categoryId)
  }

  return prisma.transaction.create({
    data: {
      userId: user.id,
      title: input.title,
      amountCents: input.amountCents,
      type: input.type,
      date: input.date,
      categoryId: input.categoryId ?? null,
    },
    include: includeCategory,
  })
}

export async function updateTransaction(ctx: Context, id: string, input: TransactionUpdateInput) {
  const user = requireUser(ctx)

  const existing = await prisma.transaction.findFirst({
    where: { id, userId: user.id },
  })
  if (!existing) {
    throw new Error('Registro não encontrado')
  }

  if (input.categoryId) {
    await assertOwnedCategory(ctx, input.categoryId)
  }

  return prisma.transaction.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.amountCents !== undefined ? { amountCents: input.amountCents } : {}),
      ...(input.type !== undefined ? { type: input.type } : {}),
      ...(input.date !== undefined ? { date: input.date } : {}),
      ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
    },
    include: includeCategory,
  })
}

export async function deleteTransaction(ctx: Context, id: string) {
  const user = requireUser(ctx)

  const existing = await prisma.transaction.findFirst({
    where: { id, userId: user.id },
  })
  if (!existing) {
    throw new Error('Registro não encontrado')
  }

  await prisma.transaction.delete({ where: { id } })
  return true
}

export async function getSummary(ctx: Context) {
  const user = requireUser(ctx)

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const [all, month] = await Promise.all([
    prisma.transaction.groupBy({
      by: ['type'],
      where: { userId: user.id },
      _sum: { amountCents: true },
    }),
    prisma.transaction.groupBy({
      by: ['type'],
      where: { userId: user.id, date: { gte: monthStart, lt: monthEnd } },
      _sum: { amountCents: true },
    }),
  ])

  const sumBy = (rows: typeof all, type: string) =>
    rows.find((row) => row.type === type)?._sum.amountCents ?? 0

  const income = sumBy(all, 'INCOME')
  const expense = sumBy(all, 'EXPENSE')

  return {
    balanceCents: income - expense,
    monthIncomeCents: sumBy(month, 'INCOME'),
    monthExpenseCents: sumBy(month, 'EXPENSE'),
  }
}

export async function countByCategory(ctx: Context, categoryId: string) {
  const user = requireUser(ctx)
  return prisma.transaction.count({
    where: { userId: user.id, categoryId },
  })
}

export async function totalCentsByCategory(ctx: Context, categoryId: string) {
  const user = requireUser(ctx)
  const result = await prisma.transaction.aggregate({
    where: { userId: user.id, categoryId },
    _sum: { amountCents: true },
  })
  return result._sum.amountCents ?? 0
}
