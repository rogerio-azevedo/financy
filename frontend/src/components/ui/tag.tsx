import { CircleArrowDown, CircleArrowUp } from 'lucide-react'
import { cn } from '../../lib/utils'
import {
  colorClasses,
  isCategoryColor,
  type CategoryColor,
} from '../../lib/category-meta'

type Props = {
  label: string
  color?: string | null
  className?: string
}

export function Tag({ label, color, className }: Props) {
  const key: CategoryColor | 'gray' = color && isCategoryColor(color) ? color : 'gray'
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-sm leading-5 font-medium',
        colorClasses[key].tag,
        className,
      )}
    >
      {label}
    </span>
  )
}

export function TypeBadge({ type }: { type: 'INCOME' | 'EXPENSE' }) {
  const income = type === 'INCOME'
  const Icon = income ? CircleArrowUp : CircleArrowDown
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm font-medium', income ? 'text-success' : 'text-danger')}>
      <Icon size={16} />
                  {income ? 'Receita' : 'Despesa'}
    </span>
  )
}
