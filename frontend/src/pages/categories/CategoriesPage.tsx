import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import type { LucideIcon } from 'lucide-react'
import { ArrowUpDown, Plus, SquarePen, Tag as TagIcon, Trash } from 'lucide-react'
import { AppLayout } from '../../components/layout/AppLayout'
import { Button } from '../../components/ui/button'
import { IconButton } from '../../components/ui/icon-button'
import { Tag } from '../../components/ui/tag'
import { ConfirmDialog } from '../../components/ui/confirm-dialog'
import { CategoryDialog } from './CategoryDialog'
import {
  CATEGORIES_QUERY,
  DELETE_CATEGORY_MUTATION,
} from '../../graphql/category'
import {
  colorClasses,
  iconMap,
  isCategoryColor,
  isCategoryIcon,
} from '../../lib/category-meta'
import { toastSuccess } from '../../lib/toast'
import { cn } from '../../lib/utils'

type Category = {
  id: string
  name: string
  description: string
  icon: string
  color: string
  transactionCount: number
  totalCents: number
}

const sectionTitle = 'text-xs leading-4 font-medium tracking-[0.6px] text-gray-500 uppercase'

export function CategoriesPage() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null)
  const { data } = useQuery<{ categories: Category[] }>(CATEGORIES_QUERY)
  const [remove, removeState] = useMutation(DELETE_CATEGORY_MUTATION, { refetchQueries: [CATEGORIES_QUERY] })
  const categories = data?.categories ?? []

  const stats = useMemo(() => {
    const totalTransactions = categories.reduce((acc, c) => acc + c.transactionCount, 0)
    const mostUsed = [...categories].sort((a, b) => b.transactionCount - a.transactionCount)[0]
    return { totalTransactions, mostUsed }
  }, [categories])

  const mostUsedIcon =
    stats.mostUsed && isCategoryIcon(stats.mostUsed.icon)
      ? iconMap[stats.mostUsed.icon]
      : TagIcon
  const mostUsedColor =
    stats.mostUsed && isCategoryColor(stats.mostUsed.color) ? stats.mostUsed.color : null

  return (
    <AppLayout>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-[32px] leading-10 font-bold text-gray-800">Categorias</h1>
          <p className="mt-1 text-sm text-gray-500">Organize suas transações por categorias</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setOpen(true) }}>
          <Plus size={16} /> Nova categoria
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-6">
        <StatCard icon={TagIcon} iconClassName="text-gray-800" value={String(categories.length)} label="total de categorias" />
        <StatCard
          icon={ArrowUpDown}
          iconClassName="text-purple"
          value={String(stats.totalTransactions)}
          label="total de transações"
        />
        <StatCard
          icon={mostUsedIcon}
          iconClassName={mostUsedColor ? colorClasses[mostUsedColor].icon.replace(/bg-\S+\s*/, '') : 'text-gray-800'}
          value={stats.mostUsed?.name ?? '—'}
          label="categoria mais utilizada"
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = isCategoryIcon(category.icon) ? iconMap[category.icon] : TagIcon
          const color = isCategoryColor(category.color) ? category.color : 'gray'
          const countLabel = category.transactionCount === 1 ? 'item' : 'itens'
          return (
            <article
              key={category.id}
              className="flex min-h-[226px] flex-col rounded-xl border border-gray-200 bg-white p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <span className={cn('flex size-10 items-center justify-center rounded-lg', colorClasses[color].icon)}>
                  <Icon size={16} />
                </span>
                <div className="flex gap-2">
                  <IconButton
                    tone="danger"
                    aria-label="Excluir"
                    onClick={() => setPendingDelete(category)}
                  >
                    <Trash size={16} />
                  </IconButton>
                  <IconButton aria-label="Editar" onClick={() => { setEditing(category); setOpen(true) }}>
                    <SquarePen size={16} />
                  </IconButton>
                </div>
              </div>
              <h2 className="font-semibold text-gray-800">{category.name}</h2>
              <p className="mt-1 line-clamp-2 min-h-10 text-sm text-gray-500">
                {category.description || '—'}
              </p>
              <div className="mt-auto flex items-center justify-between pt-4">
                <Tag label={category.name} color={category.color} />
                <span className="text-sm text-gray-500">
                  {category.transactionCount} {countLabel}
                </span>
              </div>
            </article>
          )
        })}
      </div>
      <CategoryDialog open={open} onOpenChange={setOpen} category={editing} />
      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => { if (!next) setPendingDelete(null) }}
        title="Excluir categoria?"
        description="Esta ação não pode ser desfeita."
        loading={removeState.loading}
        onConfirm={() => {
          if (!pendingDelete) return
          void remove({ variables: { id: pendingDelete.id } }).then(() => {
            setPendingDelete(null)
            toastSuccess('Categoria excluída com sucesso')
          })
        }}
      />
    </AppLayout>
  )
}

function StatCard({
  icon: Icon,
  value,
  label,
  iconClassName,
}: {
  icon: LucideIcon
  value: string
  label: string
  iconClassName?: string
}) {
  return (
    <div className="flex min-h-[118px] items-center gap-4 rounded-xl border border-gray-200 bg-white p-6">
      <Icon size={24} className={cn('shrink-0', iconClassName)} />
      <div className="min-w-0">
        <p className="truncate text-[28px] leading-8 font-bold text-gray-800">{value}</p>
        <p className={sectionTitle}>{label}</p>
      </div>
    </div>
  )
}
