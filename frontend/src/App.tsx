import { BrowserRouter, Route, Routes } from 'react-router'
import { useAuth } from './lib/auth'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { TransactionsPage } from './pages/transactions/TransactionsPage'
import { CategoriesPage } from './pages/categories/CategoriesPage'
import { ProfilePage } from './pages/ProfilePage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { Toaster } from './components/ui/toaster'

function Home() {
  const { token, user, loading } = useAuth()
  if (token && loading) return <p className="p-12 text-sm text-gray-500">Carregando...</p>
  if (token && user) return <DashboardPage />
  return <LoginPage />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route
          path="/transacoes"
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categorias"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
