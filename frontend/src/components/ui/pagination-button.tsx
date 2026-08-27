import { cn } from '../../lib/utils'

type Props = {
  page: number
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}

export function PaginationButton({ page, active, disabled, onClick, children }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={`Página ${page}`}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-lg text-sm font-medium',
        active ? 'bg-brand text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100',
        disabled && 'opacity-40',
      )}
    >
      {children}
    </button>
  )
}
