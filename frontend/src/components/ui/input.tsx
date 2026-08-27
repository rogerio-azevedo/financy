import { ChevronDown, Eye, EyeClosed } from 'lucide-react'
import { useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
  icon?: ReactNode
  prefix?: ReactNode
  labelClassName?: string
  emptyPlaceholder?: boolean
}

export function Input({
  label,
  error,
  hint,
  icon,
  prefix,
  className,
  type,
  id,
  labelClassName,
  emptyPlaceholder,
  placeholder,
  ...props
}: FieldProps) {
  const [show, setShow] = useState(false)
  const inputId = id ?? props.name
  const isPassword = type === 'password'
  const isDate = type === 'date'
  const resolvedType = isPassword && show ? 'text' : type
  const locked = Boolean(props.disabled || props.readOnly)
  const showDatePlaceholder = isDate && emptyPlaceholder && Boolean(placeholder)

  return (
    <label className="flex w-full flex-col gap-2 text-left" htmlFor={inputId}>
      <span className={cn('text-sm leading-5 font-medium text-gray-700', labelClassName)}>
        {label}
      </span>
      <div
        className={cn(
          'relative flex h-12 items-center gap-3 overflow-hidden rounded-lg border bg-white px-3',
          error
            ? 'border-danger focus-within:border-danger'
            : locked
              ? 'border-gray-300'
              : 'border-gray-300 focus-within:border-brand',
          props.disabled && 'bg-gray-100',
        )}
      >
        {icon ? <span className="shrink-0 text-gray-400">{icon}</span> : null}
        {prefix ? <span className="shrink-0 text-base text-gray-800">{prefix}</span> : null}
        {showDatePlaceholder ? (
          <span className="pointer-events-none absolute left-3 text-base leading-[18px] text-gray-400">
            {placeholder}
          </span>
        ) : null}
        <input
          id={inputId}
          type={resolvedType}
          placeholder={isDate ? undefined : placeholder}
          className={cn(
            'h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-base leading-[18px] text-gray-800 outline-none placeholder:text-gray-400',
            props.disabled && 'text-gray-400',
            props.readOnly && 'cursor-default text-gray-400',
            isDate &&
              '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0',
            showDatePlaceholder && 'text-transparent',
            className,
          )}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
            className="shrink-0 text-gray-800"
            onClick={() => setShow((v) => !v)}
            tabIndex={-1}
          >
            {show ? <Eye size={16} /> : <EyeClosed size={16} />}
          </button>
        ) : null}
      </div>
      {error ? <span className="text-xs leading-4 text-danger">{error}</span> : null}
      {!error && hint ? <span className="text-xs leading-4 text-gray-500">{hint}</span> : null}
    </label>
  )
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  error?: string
  children: ReactNode
  icon?: ReactNode
  labelClassName?: string
}

export function Select({
  label,
  error,
  className,
  id,
  children,
  icon,
  labelClassName,
  ...props
}: SelectProps) {
  const inputId = id ?? props.name
  return (
    <label className="flex w-full flex-col gap-2 text-left" htmlFor={inputId}>
      <span className={cn('text-sm leading-5 font-medium text-gray-700', labelClassName)}>
        {label}
      </span>
      <div
        className={cn(
          'relative flex h-12 items-center gap-3 overflow-hidden rounded-lg border bg-white px-3',
          error
            ? 'border-danger focus-within:border-danger'
            : 'border-gray-300 focus-within:border-brand',
        )}
      >
        {icon ? <span className="shrink-0 text-gray-400">{icon}</span> : null}
        <select
          id={inputId}
          className={cn(
            'h-full min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 pr-6 text-base leading-[18px] text-gray-800 outline-none',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
        />
      </div>
      {error ? <span className="text-xs leading-4 text-danger">{error}</span> : null}
    </label>
  )
}
