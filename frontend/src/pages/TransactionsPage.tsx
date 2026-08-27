import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import { ChevronLeft, ChevronRight, CircleArrowDown, Plus, Search, SquarePen, Trash } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { Button } from '../components/ui/button'
import { IconButton } from '../components/ui/icon-button'
import { Input, Select } from '../components/ui/input'
import { PaginationButton } from '../components/ui/pagination-button'
import { Tag, TypeBadge } from '../components/ui/tag'
import { TransactionDialog } from '../components/transactions/TransactionDialog'
import { CATEGORIES_QUERY } from '../graphql/category'
import {
  DELETE_TRANSACTION_MUTATION,
  SUMMARY_QUERY,
  TRANSACTIONS_QUERY,
} from '../graphql/transaction'
import {
  colorClasses,
  iconMap,
  isCategoryColor,
  isCategoryIcon,
} from '../lib/category-meta'
import { formatDate, formatSignedBRL } from '../lib/money'
import { cn } from '../lib/utils'

type Category = { id: string; name: string }
type Transaction = {
  id: string
  title: string
  amountCents: number
  type: 'INCOME' | 'EXPENSE'
  date: string
  category?: { id: string; name: string; icon: string; color: string } | null
}

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const filterLabel = 'text-xs font-medium tracking-[0.6px] text-gray-500 uppercase'
const tableHead = 'px-6 py-4 text-left text-xs font-medium tracking-[0.6px] text-gray-500 uppercase'

function monthOptions(count = 18) {
  const now = new Date()
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    return {
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: `${MONTHS[d.getMonth()]} / ${d.getFullYear()}`,
    }
  })
}

function monthRange(ym: string) {
  const [year, month] = ym.split('-').map(Number)
  const dateFrom = new Date(year, month - 1, 1).toISOString()
  const dateTo = new Date(year, month, 0, 23, 59, 59, 999).toISOString()
  return { dateFrom, dateTo }
}

function visiblePages(current: number, total: number) {
  if (total <= 3) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 2) return [1, 2, 3]
  if (current >= total - 1) return [total - 2, total - 1, total]
  return [current - 1, current, current + 1]
}

export function TransactionsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [type, setType] = useState('')
  const [period, setPeriod] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)

  const filter = useMemo(
    () => ({
      ...(search ? { search } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(type ? { type } : {}),
      ...(period ? monthRange(period) : {}),
    }),
    [search, categoryId, type, period],
  )

  const categories = useQuery<{ categories: Category[] }>(CATEGORIES_QUERY)
  const { data, loading } = useQuery<{
    transactions: { items: Transaction[]; total: number; page: number; perPage: number }
  }>(TRANSACTIONS_QUERY, { variables: { filter, page, perPage: 10 } })
  const [remove] = useMutation(DELETE_TRANSACTION_MUTATION, {
    refetchQueries: [TRANSACTIONS_QUERY, SUMMARY_QUERY, CATEGORIES_QUERY],
  })

  const pageData = data?.transactions
  const totalPages = Math.max(1, Math.ceil((pageData?.total ?? 0) / 10))
  const from = pageData && pageData.total > 0 ? (page - 1) * 10 + 1 : 0
  const to = Math.min(page * 10, pageData?.total ?? 0)

  return (
    <AppLayout>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-[32px] leading-10 font-bold text-gray-800">Transações</h1>
          <p className="mt-1 text-sm text-gray-500">Gerencie todas as suas transações financeiras</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setOpen(true) }}>
          <Plus size={16} /> Nova transação
        </Button>
      </div>

      <section className="mb-6 grid grid-cols-4 gap-5 rounded-xl border border-gray-200 bg-white p-5">
        <Input
          label="Buscar"
          labelClassName={filterLabel}
          placeholder="Buscar por descrição"
          icon={<Search size={16} />}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
        <Select
          label="Categoria"
          labelClassName={filterLabel}
          value={categoryId}
          onChange={(e) => { setCategoryId(e.target.value); setPage(1) }}
        >
          <option value="">Todas</option>
          {(categories.data?.categories ?? []).map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
        <Select
          label="Tipo"
          labelClassName={filterLabel}
          value={type}
          onChange={(e) => { setType(e.target.value); setPage(1) }}
        >
          <option value="">Todos</option>
          <option value="INCOME">Receita</option>
          <option value="EXPENSE">Despesa</option>
        </Select>
        <Select
          label="Período"
          labelClassName={filterLabel}
          value={period}
          onChange={(e) => { setPeriod(e.target.value); setPage(1) }}
        >
          <option value="">Todos</option>
          {monthOptions().map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </Select>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200">
            <tr>
              <th className={tableHead}>Descrição</th>
              <th className={tableHead}>Data</th>
              <th className={tableHead}>Categoria</th>
              <th className={tableHead}>Tipo</th>
              <th className={cn(tableHead, 'text-right')}>Valor</th>
              <th className={cn(tableHead, 'text-right')}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {(pageData?.items ?? []).map((item) => {
              const iconKey = item.category?.icon
              const Icon = iconKey && isCategoryIcon(iconKey) ? iconMap[iconKey] : CircleArrowDown
              const color = item.category?.color
              return (
                <tr key={item.id} className="border-b border-gray-200 last:border-0">
                  <td className="px-6">
                    <div className="flex h-20 items-center gap-4">
                      <span
                        className={cn(
                          'flex size-10 shrink-0 items-center justify-center rounded-lg',
                          color && isCategoryColor(color) ? colorClasses[color].icon : colorClasses.gray.icon,
                        )}
                      >
                        <Icon size={16} />
                      </span>
                      <span className="text-base leading-6 font-medium text-gray-800">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-6 text-gray-600">{formatDate(item.date)}</td>
                  <td className="px-6">
                    <Tag label={item.category?.name ?? 'Geral'} color={item.category?.color} />
                  </td>
                  <td className="px-6">
                    <TypeBadge type={item.type} />
                  </td>
                  <td className="whitespace-nowrap px-6 text-right font-semibold text-gray-800">
                    {formatSignedBRL(item.amountCents, item.type)}
                  </td>
                  <td className="px-6">
                    <div className="flex justify-end gap-2">
                      <IconButton
                        tone="danger"
                        aria-label="Excluir"
                        onClick={() => {
                          if (window.confirm('Excluir esta transação?')) {
                            void remove({ variables: { id: item.id } })
                          }
                        }}
                      >
                        <Trash size={16} />
                      </IconButton>
                      <IconButton onClick={() => { setEditing(item); setOpen(true) }} aria-label="Editar">
                        <SquarePen size={16} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <footer className="flex items-center justify-between px-6 py-4 text-sm text-gray-500">
          <span>
            {loading ? 'Carregando...' : `${from} a ${to} | ${pageData?.total ?? 0} resultados`}
          </span>
          <div className="flex gap-2">
            <PaginationButton page={page - 1} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft size={16} />
            </PaginationButton>
            {visiblePages(page, totalPages).map((n) => (
              <PaginationButton key={n} page={n} active={n === page} onClick={() => setPage(n)}>
                {n}
              </PaginationButton>
            ))}
            <PaginationButton page={page + 1} disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight size={16} />
            </PaginationButton>
          </div>
        </footer>
      </section>
      <TransactionDialog open={open} onOpenChange={setOpen} transaction={editing} />
    </AppLayout>
  )
}
