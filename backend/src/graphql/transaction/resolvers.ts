import {
  transactionCreateSchema,
  transactionPageSchema,
  transactionUpdateSchema,
} from '../../schemas/transaction'
import {
  createTransaction,
  deleteTransaction,
  getSummary,
  listTransactionsPage,
  updateTransaction,
} from '../../services/transaction'
import { requireUser, type Context } from '../../infra/graphql/context'

function toIso(value: Date) {
  return value.toISOString()
}

export const resolvers = {
  Transaction: {
    date: (parent: { date: Date | string }) =>
      parent.date instanceof Date ? toIso(parent.date) : parent.date,
    createdAt: (parent: { createdAt: Date | string }) =>
      parent.createdAt instanceof Date ? toIso(parent.createdAt) : parent.createdAt,
  },
  Query: {
    transactions: async (
      _root: unknown,
      args: { filter?: unknown; page?: number; perPage?: number },
      ctx: Context,
    ) => {
      requireUser(ctx)
      const parsed = transactionPageSchema.safeParse(args)
      if (!parsed.success) throw new Error('Dados inválidos')
      return listTransactionsPage(ctx, parsed.data)
    },
    summary: (_root: unknown, _args: unknown, ctx: Context) => getSummary(ctx),
  },
  Mutation: {
    createTransaction: async (_root: unknown, args: { input: unknown }, ctx: Context) => {
      requireUser(ctx)
      const parsed = transactionCreateSchema.safeParse(args.input)
      if (!parsed.success) throw new Error('Dados inválidos')
      return createTransaction(ctx, parsed.data)
    },
    updateTransaction: async (
      _root: unknown,
      args: { id: string; input: unknown },
      ctx: Context,
    ) => {
      requireUser(ctx)
      const parsed = transactionUpdateSchema.safeParse(args.input)
      if (!parsed.success) throw new Error('Dados inválidos')
      return updateTransaction(ctx, args.id, parsed.data)
    },
    deleteTransaction: async (_root: unknown, args: { id: string }, ctx: Context) => {
      requireUser(ctx)
      return deleteTransaction(ctx, args.id)
    },
  },
}
