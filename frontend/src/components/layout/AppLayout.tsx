import { NavLink } from 'react-router'
import { Logo } from './Logo'
import { initials, useAuth } from '../../lib/auth'
import { cn } from '../../lib/utils'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/transacoes', label: 'Transações' },
  { to: '/categorias', label: 'Categorias' },
]

export function AppNavbar() {
  const { user } = useAuth()

  return (
    <header className="h-[69px] border-b border-gray-200 bg-white">
      <div className="relative mx-auto flex h-full w-full items-center justify-between px-12">
        <NavLink to="/" className="relative z-10 shrink-0">
          <Logo className="h-6 w-[100px]" />
        </NavLink>
        <nav className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'text-sm leading-5 no-underline',
                  isActive
                    ? 'font-semibold text-brand'
                    : 'font-normal text-gray-600 hover:text-gray-800',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <NavLink
          to="/perfil"
          className="relative z-10 flex size-9 items-center justify-center rounded-full bg-gray-300 text-sm leading-5 font-medium text-gray-800 no-underline"
        >
          {user ? initials(user.name) : '—'}
        </NavLink>
      </div>
    </header>
  )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-gray-100">
      <AppNavbar />
      <main className="w-full px-12 py-12">{children}</main>
    </div>
  )
}
