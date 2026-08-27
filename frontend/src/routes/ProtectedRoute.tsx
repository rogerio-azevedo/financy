import { Navigate } from 'react-router'
import { useAuth } from '../lib/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading, user } = useAuth()
  if (!token) return <Navigate to="/" replace />
  if (loading) return <p className="p-12 text-sm text-gray-500">Carregando...</p>
  if (!user) return <Navigate to="/" replace />
  return children
}
