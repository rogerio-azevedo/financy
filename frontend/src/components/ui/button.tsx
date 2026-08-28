import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        solid: 'bg-brand text-white hover:bg-brand-dark',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100',
        danger: 'bg-danger text-white hover:bg-red-dark',
      },
      size: {
        md: 'h-12 px-4 py-3 text-base leading-6',
        sm: 'h-9 px-3 text-sm leading-5',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
