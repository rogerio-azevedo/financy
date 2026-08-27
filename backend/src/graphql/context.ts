import type { FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'
import { verifyToken } from '../lib/auth'

export type AuthUser = {
  id: string
  name: string
  email: string
  createdAt: Date
}

export type Context = {
  prisma: typeof prisma
  user: AuthUser | null
}

export async function buildContext(request: FastifyRequest): Promise<Context> {
  const header = request.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  const userId = token ? verifyToken(token) : null

  if (!userId) {
    return { prisma, user: null }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, createdAt: true },
  })

  return { prisma, user }
}

export function requireUser(ctx: Context) {
  if (!ctx.user) {
    throw new Error('Não autenticado')
  }
  return ctx.user
}
