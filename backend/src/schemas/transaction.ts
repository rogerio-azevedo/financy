import { z } from 'zod'

export const transactionTypeSchema = z.enum(['INCOME', 'EXPENSE'])

export const transactionCreateSchema = z.object({
  title: z.string().min(1).max(120),
  amountCents: z.number().int().positive(),
  type: transactionTypeSchema,
  date: z.coerce.date(),
  categoryId: z.string().min(1).nullish(),
})

export const transactionUpdateSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  amountCents: z.number().int().positive().optional(),
  type: transactionTypeSchema.optional(),
  date: z.coerce.date().optional(),
  categoryId: z.string().min(1).nullish(),
})

export const transactionFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().min(1).optional(),
  type: transactionTypeSchema.optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
})

export const transactionPageSchema = z.object({
  filter: transactionFilterSchema.optional(),
  page: z.number().int().min(1).optional().default(1),
  perPage: z.number().int().min(1).max(50).optional().default(10),
})

export type TransactionCreateInput = z.infer<typeof transactionCreateSchema>
export type TransactionUpdateInput = z.infer<typeof transactionUpdateSchema>
export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>
export type TransactionPageInput = z.infer<typeof transactionPageSchema>
