import { prisma } from '../infra/db/prisma'
import { requireUser, type Context } from '../infra/graphql/context'
import type { CategoryCreateInput, CategoryUpdateInput } from '../schemas/category'

export async function listCategories(ctx: Context) {
  const user = requireUser(ctx)
  return prisma.category.findMany({
    where: { userId: user.id },
    orderBy: { name: 'asc' },
  })
}

export async function createCategory(ctx: Context, input: CategoryCreateInput) {
  const user = requireUser(ctx)

  const duplicate = await prisma.category.findFirst({
    where: { userId: user.id, name: input.name },
  })
  if (duplicate) {
    throw new Error('Já existe uma categoria com esse nome')
  }

  return prisma.category.create({
    data: {
      userId: user.id,
      name: input.name,
      description: input.description ?? '',
      icon: input.icon,
      color: input.color,
    },
  })
}

export async function updateCategory(ctx: Context, id: string, input: CategoryUpdateInput) {
  const user = requireUser(ctx)

  const existing = await prisma.category.findFirst({
    where: { id, userId: user.id },
  })
  if (!existing) {
    throw new Error('Registro não encontrado')
  }

  if (input.name && input.name !== existing.name) {
    const duplicate = await prisma.category.findFirst({
      where: { userId: user.id, name: input.name },
    })
    if (duplicate) {
      throw new Error('Já existe uma categoria com esse nome')
    }
  }

  return prisma.category.update({
    where: { id },
    data: input,
  })
}

export async function deleteCategory(ctx: Context, id: string) {
  const user = requireUser(ctx)

  const existing = await prisma.category.findFirst({
    where: { id, userId: user.id },
  })
  if (!existing) {
    throw new Error('Registro não encontrado')
  }

  await prisma.category.delete({ where: { id } })
  return true
}
