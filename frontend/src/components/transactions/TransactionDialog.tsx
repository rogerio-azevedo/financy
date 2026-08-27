import { CircleArrowDown, CircleArrowUp } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@apollo/client/react'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import { Input, Select } from '../ui/input'
import { CATEGORIES_QUERY } from '../../graphql/category'
import {
  CREATE_TRANSACTION_MUTATION,
  TRANSACTIONS_QUERY,
  SUMMARY_QUERY,
  UPDATE_TRANSACTION_MUTATION,
} from '../../graphql/transaction'
import { reaisToCents, centsToReaisInput, toDateInput } from '../../lib/money'
import { cn } from '../../lib/utils'
import { transactionFormSchema, type TransactionForm } from '../../schemas/transaction'

type Category = { id: string; name: string }
type Transaction = {
  id: string
  title: string
  amountCents: number
  type: 'INCOME' | 'EXPENSE'
  date: string
  category?: { id: string } | null
}

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction | null
}) {
  const { data } = useQuery<{ categories: Category[] }>(CATEGORIES_QUERY, { skip: !open })
  const [create, createState] = useMutation(CREATE_TRANSACTION_MUTATION, {
    refetchQueries: [TRANSACTIONS_QUERY, SUMMARY_QUERY, CATEGORIES_QUERY],
  })
  const [update, updateState] = useMutation(UPDATE_TRANSACTION_MUTATION, {
    refetchQueries: [TRANSACTIONS_QUERY, SUMMARY_QUERY, CATEGORIES_QUERY],
  })

  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionFormSchema),
    values: transaction
      ? {
        title: transaction.title,
        amount: centsToReaisInput(transaction.amountCents),
        type: transaction.type,
        date: toDateInput(transaction.date),
        categoryId: transaction.category?.id ?? '',
      }
      : {
        title: '',
        amount: '',
        type: 'EXPENSE',
        date: '',
        categoryId: '',
      },
  })

  const type = form.watch('type')
  const date = form.watch('date')
  const categoryId = form.watch('categoryId')

  async function onSubmit(values: TransactionForm) {
    const input = {
      title: values.title,
      amountCents: reaisToCents(values.amount),
      type: values.type,
      date: new Date(values.date).toISOString(),
      categoryId: values.categoryId || null,
    }
    if (input.amountCents <= 0) {
      form.setError('amount', { message: 'Valor inválido' })
      return
    }
    try {
      if (transaction) {
        await update({ variables: { id: transaction.id, input } })
      } else {
        await create({ variables: { input } })
      }
      onOpenChange(false)
    } catch (err) {
      form.setError('title', {
        message: err instanceof Error ? err.message : 'Não foi possível salvar',
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={transaction ? 'Editar transação' : 'Nova transação'}
      description="Registre sua despesa ou receita"
      className="w-120"
    >
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex h-16 rounded-lg border border-gray-300 bg-gray-100 p-1">
          {(['EXPENSE', 'INCOME'] as const).map((option) => {
            const selected = type === option
            const expense = option === 'EXPENSE'
            return (
              <button
                key={option}
                type="button"
                onClick={() => form.setValue('type', option)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-md border text-base font-medium',
                  selected
                    ? expense
                      ? 'border-danger bg-danger/5 text-gray-800'
                      : 'border-success bg-success/5 text-gray-800'
                    : 'border-transparent text-gray-500',
                )}
              >
                {expense ? (
                  <CircleArrowDown size={20} className={selected ? 'text-danger' : 'text-gray-400'} />
                ) : (
                  <CircleArrowUp size={20} className={selected ? 'text-success' : 'text-gray-400'} />
                )}
                {expense ? 'Despesa' : 'Receita'}
              </button>
            )
          })}
        </div>
        <Input
          label="Descrição"
          placeholder="Ex. Almoço no restaurante"
          error={form.formState.errors.title?.message}
          {...form.register('title')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Data"
            type="date"
            placeholder="Selecione"
            emptyPlaceholder={!date}
            error={form.formState.errors.date?.message}
            {...form.register('date')}
          />
          <Input
            label="Valor"
            prefix="R$"
            placeholder="0,00"
            error={form.formState.errors.amount?.message}
            {...form.register('amount')}
          />
        </div>
        <Select
          label="Categoria"
          className={!categoryId ? 'text-gray-400' : undefined}
          {...form.register('categoryId')}
        >
          <option value="">Selecione</option>
          {(data?.categories ?? []).map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Button type="submit" className="w-full" disabled={createState.loading || updateState.loading}>
          Salvar
        </Button>
      </form>
    </Dialog>
  )
}
