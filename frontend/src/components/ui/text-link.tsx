import { NavLink, type NavLinkProps } from 'react-router'
import { cn } from '../../lib/utils'

export function TextLink({ className, ...props }: NavLinkProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          'text-sm font-medium hover:underline',
          isActive ? 'text-brand' : 'text-brand hover:text-brand-dark',
          className,
        )
      }
      {...props}
    />
  )
}
