import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(72),
})

export const profileUpdateSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  email: z.string().email().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
