import { z } from 'zod'

export const CATEGORY_ICONS = [
  'briefcase-business',
  'car-front',
  'heart-pulse',
  'piggy-bank',
  'shopping-cart',
  'ticket',
  'tool-case',
  'utensils',
  'paw-print',
  'house',
  'gift',
  'dumbbell',
  'book-open',
  'baggage-claim',
  'mailbox',
  'receipt-text',
] as const

export const CATEGORY_COLORS = [
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'green',
] as const

export const categoryCreateSchema = z.object({
  name: z.string().min(1).max(80),
  description: z.string().max(200).optional().default(''),
  icon: z.enum(CATEGORY_ICONS),
  color: z.enum(CATEGORY_COLORS),
})

export const categoryUpdateSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  description: z.string().max(200).optional(),
  icon: z.enum(CATEGORY_ICONS).optional(),
  color: z.enum(CATEGORY_COLORS).optional(),
})

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>
