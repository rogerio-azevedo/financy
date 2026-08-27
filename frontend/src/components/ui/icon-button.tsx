import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: 'outline' | 'danger'
}

export function IconButton({ className, tone = 'outline', ...props }: Props) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-50',
        tone === 'danger'
          ? 'border-red-light text-danger hover:bg-red-light'
          : 'border-gray-300 text-gray-600 hover:bg-gray-100',
        className,
      )}
      {...props}
    />
  )
}
