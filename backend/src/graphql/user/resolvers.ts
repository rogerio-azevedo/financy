import { loginSchema } from '../../schemas/auth'
import { profileUpdateSchema, registerSchema } from '../../schemas/user'
import { getMe, loginUser, registerUser, updateProfile } from '../../services/user'
import { requireUser, type Context } from '../../infra/graphql/context'

function toIso(value: Date) {
  return value.toISOString()
}

export const resolvers = {
  User: {
    createdAt: (parent: { createdAt: Date | string }) =>
      parent.createdAt instanceof Date ? toIso(parent.createdAt) : parent.createdAt,
  },
  Query: {
    me: (_root: unknown, _args: unknown, ctx: Context) => getMe(ctx),
  },
  Mutation: {
    register: async (_root: unknown, args: { input: unknown }) => {
      const parsed = registerSchema.safeParse(args.input)
      if (!parsed.success) throw new Error('Dados inválidos')
      return registerUser(parsed.data)
    },
    login: async (_root: unknown, args: { input: unknown }) => {
      const parsed = loginSchema.safeParse(args.input)
      if (!parsed.success) throw new Error('Dados inválidos')
      return loginUser(parsed.data)
    },
    updateProfile: async (_root: unknown, args: { input: unknown }, ctx: Context) => {
      requireUser(ctx)
      const parsed = profileUpdateSchema.safeParse(args.input)
      if (!parsed.success) throw new Error('Dados inválidos')
      return updateProfile(ctx, parsed.data)
    },
  },
}
