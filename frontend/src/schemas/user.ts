import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'Informe o nome').max(80),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres').max(72),
})

export const profileSchema = z.object({
  name: z.string().min(1, 'Informe o nome').max(80),
})

export type RegisterForm = z.infer<typeof registerSchema>
export type ProfileForm = z.infer<typeof profileSchema>
