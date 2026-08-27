import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ChevronRight, CircleArrowDown, CircleArrowUp, Plus, Wallet } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { Tag } from '../components/ui/tag'
import { TextLink } from '../components/ui/text-link'
import { TransactionDialog } from '../components/transactions/TransactionDialog'
import { CATEGORIES_QUERY } from '../graphql/category'
import { SUMMARY_QUERY, TRANSACTIONS_QUERY } from '../graphql/transaction'
import {
  colorClasses,
  iconMap,
  isCategoryColor,
  isCategoryIcon,
} from '../lib/category-meta'
import { formatBRL, formatDate, formatSignedBRL } from '../lib/money'
import { cn } from '../lib/utils'

type Summary = { balanceCents: number; monthIncomeCents: number; monthExpenseCents: number }
type Category = {
  id: string
  name: string
  icon: string
  color: string
  transactionCount: number
  totalCents: number
}
type Transaction = {
  id: string
  title: string
  amountCents: number
  type: 'INCOME' | 'EXPENSE'
  date: string
  category?: { id: string; name: string; icon: string; color: string } | null
}

const sectionTitle = 'text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase'

export function DashboardPage() {
  const [open, setOpen] = useState(false)
  const summary = useQuery<{ summary: Summary }>(SUMMARY_QUERY)
  const transactions = useQuery<{ transactions: { items: Transaction[] } }>(TRANSACTIONS_QUERY, {
    variables: { page: 1, perPage: 5 },
  })
  const categories = useQuery<{ categories: Category[] }>(CATEGORIES_QUERY)

  const cards = [
    {
      label: 'Saldo total',
      value: formatBRL(summary.data?.summary.balanceCents ?? 0),
      icon: Wallet,
      tone: 'text-purple',
    },
    {
      label: 'Receitas do mês',
      value: formatBRL(summary.data?.summary.monthIncomeCents ?? 0),
      icon: CircleArrowUp,
      tone: 'text-green',
    },
    {
      label: 'Despesas do mês',
      value: formatBRL(summary.data?.summary.monthExpenseCents ?? 0),
      icon: CircleArrowDown,
      tone: 'text-red',
    },
  ]

  return (
    <AppLayout>
      <div className="grid grid-cols-3 items-start gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6"
          >
            <div className="flex items-center gap-3">
              <card.icon size={20} className={card.tone} />
              <span className={sectionTitle}>{card.label}</span>
            </div>
            <p className="text-[28px] leading-8 font-bold text-gray-800">{card.value}</p>
          </div>
        ))}

        <section className="col-span-2 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <header className="flex items-center justify-between border-b border-gray-200 py-5 pr-3 pl-6">
            <h2 className={sectionTitle}>Transações recentes</h2>
            <TextLink to="/transacoes" className="group flex items-center gap-1 hover:no-underline">
              <span className="group-hover:underline">Ver todas</span>
              <ChevronRight size={20} />
            </TextLink>
          </header>
          <ul>
            {(transactions.data?.transactions.items ?? []).map((item) => {
              const iconKey = item.category?.icon
              const Icon = iconKey && isCategoryIcon(iconKey) ? iconMap[iconKey] : CircleArrowDown
              const color = item.category?.color
              const income = item.type === 'INCOME'
              return (
                <li key={item.id} className="flex items-center border-b border-gray-200">
                  <div className="flex h-20 min-w-0 flex-1 items-center gap-4 px-6">
                    <span
                      className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-lg',
                        color && isCategoryColor(color)
                          ? colorClasses[color].icon
                          : colorClasses.gray.icon,
                      )}
                    >
                      <Icon size={16} />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <p className="truncate text-base leading-6 font-medium text-gray-800">{item.title}</p>
                      <p className="text-sm leading-5 text-gray-600">{formatDate(item.date)}</p>
                    </div>
                  </div>
                  <div className="flex h-20 w-40 shrink-0 items-center justify-center px-6">
                    <Tag label={item.category?.name ?? 'Geral'} color={item.category?.color} />
                  </div>
                  <div className="flex h-20 w-44 shrink-0 items-center justify-end gap-2 px-6">
                    <span className="whitespace-nowrap text-sm leading-5 font-semibold text-gray-800">
                      {formatSignedBRL(item.amountCents, item.type)}
                    </span>
                    {income ? (
                      <CircleArrowUp size={16} className="text-green" />
                    ) : (
                      <CircleArrowDown size={16} className="text-red" />
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="flex items-center justify-center px-6 py-5">
            <button
              type="button"
              className="group flex items-center gap-1 text-sm font-medium text-brand"
              onClick={() => setOpen(true)}
            >
              <Plus size={20} />
              <span className="group-hover:underline">Nova transação</span>
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white">
          <header className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
            <h2 className={sectionTitle}>Categorias</h2>
            <TextLink to="/categorias" className="group flex items-center gap-1 hover:no-underline">
              <span className="group-hover:underline">Gerenciar</span>
              <ChevronRight size={20} />
            </TextLink>
          </header>
          <ul className="flex flex-col gap-5 p-6">
            {(categories.data?.categories ?? []).slice(0, 5).map((category) => (
              <li key={category.id} className="flex items-center gap-1">
                <Tag label={category.name} color={category.color} />
                <span className="flex-1 text-right text-sm leading-5 text-gray-600">
                  {category.transactionCount} {category.transactionCount === 1 ? 'item' : 'itens'}
                </span>
                <span className="w-22 text-right text-sm font-semibold text-gray-800">
                  {formatBRL(category.totalCents)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <TransactionDialog open={open} onOpenChange={setOpen} />
    </AppLayout>
  )
}
