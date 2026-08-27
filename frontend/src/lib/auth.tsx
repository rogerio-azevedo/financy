import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useQuery } from '@apollo/client/react'
import { ME_QUERY } from '../graphql/user'
import { clearToken, getToken } from '../lib/auth-storage'
import { apolloClient } from '../lib/apollo'

type User = { id: string; name: string; email: string }

type AuthContextValue = {
  user: User | null
  loading: boolean
  token: string | null
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = getToken()
  const { data, loading } = useQuery<{ me: User | null }>(ME_QUERY, {
    skip: !token,
  })

  const value = useMemo<AuthContextValue>(
    () => ({
      user: data?.me ?? null,
      loading: Boolean(token) && loading,
      token,
      logout: async () => {
        clearToken()
        await apolloClient.clearStore()
        window.location.assign('/')
      },
    }),
    [data?.me, loading, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth fora do AuthProvider')
  return ctx
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
