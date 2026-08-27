import { z } from 'zod'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../lib/category-meta'

export const categoryFormSchema = z.object({
  name: z.string().min(1, 'Informe o nome').max(80),
  description: z.string().max(200),
  icon: z.enum(CATEGORY_ICONS),
  color: z.enum(CATEGORY_COLORS),
})

export type CategoryForm = z.infer<typeof categoryFormSchema>
