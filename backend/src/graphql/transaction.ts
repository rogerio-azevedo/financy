import {
  transactionCreateSchema,
  transactionPageSchema,
  transactionUpdateSchema,
} from '../schemas/transaction'
import {
  createTransaction,
  deleteTransaction,
  getSummary,
  listTransactionsPage,
  updateTransaction,
} from '../services/transaction'
import { requireUser, type Context } from './context'

function toIso(value: Date) {
  return value.toISOString()
}

export const typeDefs = /* GraphQL */ `
  enum TransactionType {
    INCOME
    EXPENSE
  }

  type Transaction {
    id: ID!
    title: String!
    amountCents: Int!
    type: TransactionType!
    date: String!
    createdAt: String!
    category: Category
  }

  type TransactionPage {
    items: [Transaction!]!
    total: Int!
    page: Int!
    perPage: Int!
  }

  type Summary {
    balanceCents: Int!
    monthIncomeCents: Int!
    monthExpenseCents: Int!
  }

  input TransactionFilterInput {
    search: String
    categoryId: ID
    type: TransactionType
    dateFrom: String
    dateTo: String
  }

  input TransactionCreateInput {
    title: String!
    amountCents: Int!
    type: TransactionType!
    date: String!
    categoryId: ID
  }

  input TransactionUpdateInput {
    title: String
    amountCents: Int
    type: TransactionType
    date: String
    categoryId: ID
  }

  extend type Query {
    transactions(filter: TransactionFilterInput, page: Int, perPage: Int): TransactionPage!
    summary: Summary!
  }

  extend type Mutation {
    createTransaction(input: TransactionCreateInput!): Transaction!
    updateTransaction(id: ID!, input: TransactionUpdateInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`

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
