import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@apollo/client/react'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import { Input } from '../ui/input'
import {
  CATEGORIES_QUERY,
  CREATE_CATEGORY_MUTATION,
  UPDATE_CATEGORY_MUTATION,
} from '../../graphql/category'
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  colorClasses,
  iconMap,
} from '../../lib/category-meta'
import { cn } from '../../lib/utils'
import { categoryFormSchema, type CategoryForm } from '../../schemas/category'

const COLOR_SWATCH_ORDER = [
  'green',
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
] as const satisfies readonly (typeof CATEGORY_COLORS)[number][]

const colorSelectedRing = {
  green: 'ring-green-dark',
  blue: 'ring-blue-dark',
  purple: 'ring-purple-dark',
  pink: 'ring-pink-dark',
  red: 'ring-red-dark',
  orange: 'ring-orange-dark',
  yellow: 'ring-yellow-dark',
} as const

type Category = {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
}) {
  const [create, createState] = useMutation(CREATE_CATEGORY_MUTATION, {
    refetchQueries: [CATEGORIES_QUERY],
  })
  const [update, updateState] = useMutation(UPDATE_CATEGORY_MUTATION, {
    refetchQueries: [CATEGORIES_QUERY],
  })

  const form = useForm<CategoryForm>({
    resolver: zodResolver(categoryFormSchema),
    values: {
      name: category?.name ?? '',
      description: category?.description ?? '',
      icon: (category?.icon as CategoryForm['icon']) ?? 'briefcase-business',
      color: (category?.color as CategoryForm['color']) ?? 'green',
    },
  })

  const icon = form.watch('icon')
  const color = form.watch('color')

  async function onSubmit(values: CategoryForm) {
    try {
      if (category) {
        await update({ variables: { id: category.id, input: values } })
      } else {
        await create({ variables: { input: values } })
      }
      onOpenChange(false)
    } catch (err) {
      form.setError('name', {
        message: err instanceof Error ? err.message : 'Não foi possível salvar',
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={category ? 'Editar categoria' : 'Nova categoria'}
      description="Organize suas transações com categorias"
    >
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Input
          label="Título"
          placeholder="Ex. Alimentação"
          error={form.formState.errors.name?.message}
          {...form.register('name')}
        />
        <Input
          label="Descrição"
          placeholder="Descrição da categoria"
          hint="Opcional"
          error={form.formState.errors.description?.message}
          {...form.register('description')}
        />
        <div>
          <p className="mb-2 text-sm leading-5 font-medium text-gray-700">Ícone</p>
          <div className="grid grid-cols-8 gap-2">
            {CATEGORY_ICONS.map((name) => {
              const Icon = iconMap[name]
              return (
                <button
                  key={name}
                  type="button"
                  aria-label={name}
                  onClick={() => form.setValue('icon', name)}
                  className={cn(
                    'flex size-[42px] items-center justify-center rounded-lg border',
                    icon === name ? 'border-brand text-brand' : 'border-gray-200 text-gray-500',
                  )}
                >
                  <Icon size={20} />
                </button>
              )
            })}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm leading-5 font-medium text-gray-700">Cor</p>
          <div className="flex gap-2">
            {COLOR_SWATCH_ORDER.map((name) => (
              <button
                key={name}
                type="button"
                aria-label={name}
                onClick={() => form.setValue('color', name)}
                className={cn(
                  'h-[30px] w-[50px] rounded-md',
                  colorClasses[name].swatch,
                  color === name && 'ring-2 ring-offset-1',
                  color === name && colorSelectedRing[name],
                )}
              />
            ))}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={createState.loading || updateState.loading}>
          Salvar
        </Button>
      </form>
    </Dialog>
  )
}
