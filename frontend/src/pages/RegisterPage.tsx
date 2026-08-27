import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@apollo/client/react'
import { Link, Navigate } from 'react-router'
import { Lock, LogIn, Mail, UserRound } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { AuthShell } from './LoginPage'
import { REGISTER_MUTATION } from '../graphql/user'
import { setToken } from '../lib/auth-storage'
import { useAuth } from '../lib/auth'
import { graphqlErrorMessage } from '../lib/graphql-error'
import { registerSchema, type RegisterForm } from '../schemas/user'

export function RegisterPage() {
  const { token, user, loading } = useAuth()
  const [registerUser, { loading: submitting }] = useMutation(REGISTER_MUTATION)
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  if (token && !loading && user) return <Navigate to="/" replace />

  async function onSubmit(values: RegisterForm) {
    try {
      const result = await registerUser({ variables: { input: values } })
      const payload = result.data as { register: { token: string } } | undefined
      if (!payload?.register.token) throw new Error('Não foi possível criar a conta')
      setToken(payload.register.token, true)
      window.location.assign('/')
    } catch (err) {
      form.setError('email', {
        message: graphqlErrorMessage(err, 'Não foi possível criar a conta'),
      })
    }
  }

  return (
    <AuthShell>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-xl leading-7 font-bold text-gray-800">Criar conta</h1>
          <p className="text-base leading-6 text-gray-600">
            Comece a controlar suas finanças ainda hoje
          </p>
        </header>

        <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <Input
              label="Nome completo"
              placeholder="Seu nome completo"
              icon={<UserRound size={16} />}
              error={form.formState.errors.name?.message}
              {...form.register('name')}
            />
            <Input
              label="E-mail"
              type="email"
              placeholder="mail@exemplo.com"
              icon={<Mail size={16} />}
              error={form.formState.errors.email?.message}
              {...form.register('email')}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              icon={<Lock size={16} />}
              hint="A senha deve ter no mínimo 8 caracteres"
              error={form.formState.errors.password?.message}
              {...form.register('password')}
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            Cadastrar
          </Button>

          <div className="flex items-center gap-3 text-sm leading-5 text-gray-500">
            <span className="h-px flex-1 bg-gray-300" />
            ou
            <span className="h-px flex-1 bg-gray-300" />
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-center text-sm leading-5 text-gray-600">Já tem uma conta?</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">
                <LogIn size={18} />
                Fazer login
              </Link>
            </Button>
          </div>
        </form>
      </div>
    </AuthShell>
  )
}
