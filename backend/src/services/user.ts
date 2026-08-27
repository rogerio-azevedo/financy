import { prisma } from '../lib/prisma'
import { comparePassword, hashPassword, signToken } from '../lib/auth'
import { requireUser, type Context } from '../graphql/context'
import type { ProfileUpdateInput, RegisterInput } from '../schemas/user'
import type { LoginInput } from '../schemas/auth'

const userPublic = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
} as const

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } })
  if (existing) {
    throw new Error('Não foi possível criar a conta')
  }

  const passwordHash = await hashPassword(input.password)
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash },
    select: userPublic,
  })

  return { token: signToken(user.id), user }
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) {
    throw new Error('Credenciais inválidas')
  }

  const ok = await comparePassword(input.password, user.passwordHash)
  if (!ok) {
    throw new Error('Credenciais inválidas')
  }

  return {
    token: signToken(user.id),
    user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
  }
}

export async function getMe(ctx: Context) {
  return ctx.user
}

export async function updateProfile(ctx: Context, input: ProfileUpdateInput) {
  const user = requireUser(ctx)

  if (input.email && input.email !== user.email) {
    const taken = await prisma.user.findUnique({ where: { email: input.email } })
    if (taken) {
      throw new Error('Não foi possível atualizar o perfil')
    }
  }

  return prisma.user.update({
    where: { id: user.id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.email !== undefined ? { email: input.email } : {}),
    },
    select: userPublic,
  })
}
