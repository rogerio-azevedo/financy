import { categoryCreateSchema, categoryUpdateSchema } from '../schemas/category'
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from '../services/category'
import { countByCategory, totalCentsByCategory } from '../services/transaction'
import { requireUser, type Context } from './context'

function toIso(value: Date) {
  return value.toISOString()
}

export const typeDefs = /* GraphQL */ `
  type Category {
    id: ID!
    name: String!
    description: String!
    icon: String!
    color: String!
    createdAt: String!
    transactionCount: Int!
    totalCents: Int!
  }

  input CategoryCreateInput {
    name: String!
    description: String
    icon: String!
    color: String!
  }

  input CategoryUpdateInput {
    name: String
    description: String
    icon: String
    color: String
  }

  extend type Query {
    categories: [Category!]!
  }

  extend type Mutation {
    createCategory(input: CategoryCreateInput!): Category!
    updateCategory(id: ID!, input: CategoryUpdateInput!): Category!
    deleteCategory(id: ID!): Boolean!
  }
`

export const resolvers = {
  Category: {
    createdAt: (parent: { createdAt: Date | string }) =>
      parent.createdAt instanceof Date ? toIso(parent.createdAt) : parent.createdAt,
    transactionCount: (
      parent: { id: string; transactionCount?: number },
      _args: unknown,
      ctx: Context,
    ) => {
      if (typeof parent.transactionCount === 'number') return parent.transactionCount
      return countByCategory(ctx, parent.id)
    },
    totalCents: (
      parent: { id: string; totalCents?: number },
      _args: unknown,
      ctx: Context,
    ) => {
      if (typeof parent.totalCents === 'number') return parent.totalCents
      return totalCentsByCategory(ctx, parent.id)
    },
  },
  Query: {
    categories: (_root: unknown, _args: unknown, ctx: Context) => listCategories(ctx),
  },
  Mutation: {
    createCategory: async (_root: unknown, args: { input: unknown }, ctx: Context) => {
      requireUser(ctx)
      const parsed = categoryCreateSchema.safeParse(args.input)
      if (!parsed.success) throw new Error('Dados inválidos')
      return createCategory(ctx, parsed.data)
    },
    updateCategory: async (
      _root: unknown,
      args: { id: string; input: unknown },
      ctx: Context,
    ) => {
      requireUser(ctx)
      const parsed = categoryUpdateSchema.safeParse(args.input)
      if (!parsed.success) throw new Error('Dados inválidos')
      return updateCategory(ctx, args.id, parsed.data)
    },
    deleteCategory: async (_root: unknown, args: { id: string }, ctx: Context) => {
      requireUser(ctx)
      return deleteCategory(ctx, args.id)
    },
  },
}
