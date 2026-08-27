import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@apollo/client/react'
import { Link, Navigate } from 'react-router'
import { Check, Lock, Mail, UserRoundPlus } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Logo } from '../components/layout/Logo'
import { LOGIN_MUTATION } from '../graphql/user'
import { setToken } from '../lib/auth-storage'
import { useAuth } from '../lib/auth'
import { graphqlErrorMessage } from '../lib/graphql-error'
import { loginSchema, type LoginForm } from '../schemas/auth'

export function LoginPage() {
  const { token, user, loading } = useAuth()
  const [login, { loading: submitting }] = useMutation(LOGIN_MUTATION)
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  if (token && !loading && user) return <Navigate to="/" replace />

  async function onSubmit(values: LoginForm) {
    try {
      const result = await login({
        variables: { input: { email: values.email, password: values.password } },
      })
      const payload = result.data as { login: { token: string } } | undefined
      if (!payload?.login.token) throw new Error('Credenciais inválidas')
      setToken(payload.login.token, values.remember)
      window.location.assign('/')
    } catch (err) {
      form.setError('password', {
        message: graphqlErrorMessage(err, 'Credenciais inválidas'),
      })
    }
  }

  return (
    <AuthShell>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-xl leading-7 font-bold text-gray-800">Fazer login</h1>
          <p className="text-base leading-6 text-gray-600">Entre na sua conta para continuar</p>
        </header>

        <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
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
              error={form.formState.errors.password?.message}
              {...form.register('password')}
            />
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm leading-5 text-gray-700">
                <span className="relative inline-flex size-4 shrink-0">
                  <input
                    type="checkbox"
                    className="peer size-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white checked:border-brand checked:bg-brand"
                    {...form.register('remember')}
                  />
                  <Check
                    className="pointer-events-none absolute inset-0 m-auto hidden size-3 text-white peer-checked:block"
                    strokeWidth={3}
                  />
                </span>
                Lembrar-me
              </label>
              <a
                href="#"
                className="text-sm leading-5 font-medium text-brand hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                Recuperar senha
              </a>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            Entrar
          </Button>

          <div className="flex items-center gap-3 text-sm leading-5 text-gray-500">
            <span className="h-px flex-1 bg-gray-300" />
            ou
            <span className="h-px flex-1 bg-gray-300" />
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-center text-sm leading-5 text-gray-600">Ainda não tem uma conta?</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/cadastro">
                <UserRoundPlus size={18} />
                Criar conta
              </Link>
            </Button>
          </div>
        </form>
      </div>
    </AuthShell>
  )
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center bg-gray-100 p-12">
      <div className="flex w-full flex-col items-center gap-8">
        <Logo className="h-8 w-[134px]" />
        <div className="w-full max-w-[448px] rounded-xl border border-gray-200 bg-white p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
