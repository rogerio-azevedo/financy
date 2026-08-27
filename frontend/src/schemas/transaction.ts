import { z } from 'zod'

export const transactionFormSchema = z.object({
  title: z.string().min(1, 'Informe o título').max(120),
  amount: z.string().min(1, 'Informe o valor'),
  type: z.enum(['INCOME', 'EXPENSE']),
  date: z.string().min(1, 'Informe a data'),
  categoryId: z.string().optional(),
})

export type TransactionForm = z.infer<typeof transactionFormSchema>
