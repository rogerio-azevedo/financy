export function formatBRL(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}

export function formatSignedBRL(cents: number, type: 'INCOME' | 'EXPENSE') {
  const value = formatBRL(cents)
  return type === 'INCOME' ? `+\u00A0${value}` : `-\u00A0${value}`
}

export function reaisToCents(value: string) {
  const normalized = value.replace(/\s/g, '').replace('R$', '').replace(/\./g, '').replace(',', '.')
  const n = Number(normalized)
  if (Number.isNaN(n)) return 0
  return Math.round(n * 100)
}

export function centsToReaisInput(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',')
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

export function toDateInput(iso: string) {
  return iso.slice(0, 10)
}
