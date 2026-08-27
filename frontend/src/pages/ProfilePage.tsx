import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@apollo/client/react'
import { LogOut, Mail, UserRound } from 'lucide-react'
import { AppLayout } from '../components/layout/AppLayout'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { UPDATE_PROFILE_MUTATION } from '../graphql/user'
import { initials, useAuth } from '../lib/auth'
import { graphqlErrorMessage } from '../lib/graphql-error'
import { profileSchema, type ProfileForm } from '../schemas/user'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const [update, { loading }] = useMutation(UPDATE_PROFILE_MUTATION)
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? '' },
  })

  async function onSubmit(values: ProfileForm) {
    try {
      await update({
        variables: { input: { name: values.name } },
        refetchQueries: ['Me'],
      })
    } catch (err) {
      form.setError('name', {
        message: graphqlErrorMessage(err, 'Não foi possível salvar'),
      })
    }
  }

  if (!user) return null

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-[448px] rounded-xl border border-gray-200 bg-white p-8">
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-gray-300 text-xl leading-7 font-medium text-gray-800">
            {initials(user.name)}
          </div>
          <h1 className="text-xl leading-7 font-bold text-gray-800">{user.name}</h1>
          <p className="text-base leading-6 text-gray-600">{user.email}</p>
        </div>

        <div className="my-8 h-px bg-gray-200" />

        <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <Input
              label="Nome completo"
              icon={<UserRound size={16} />}
              error={form.formState.errors.name?.message}
              {...form.register('name')}
            />
            <Input
              name="email"
              label="E-mail"
              type="email"
              icon={<Mail size={16} />}
              value={user.email}
              readOnly
              tabIndex={-1}
              hint="O e-mail não pode ser alterado"
            />
          </div>

          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              Salvar alterações
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => void logout()}>
              <LogOut size={18} className="text-danger" />
              Sair da conta
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
