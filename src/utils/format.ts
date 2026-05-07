export const formatCurrencyEUR = (amount: number): string =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)

export const formatDateSafe = (iso: string): string => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('es-ES', { dateStyle: 'medium' })
}

/** Convierte ISO a `YYYY-MM-DD` para `<input type="date">` (calendario local). */
export const toDateInputValue = (iso: string): string => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Construye ISO a partir del valor de un input `date` (mediodía local para reducir desfases). */
export const dateInputToIso = (yyyyMmDd: string): string => {
  const trimmed = yyyyMmDd.trim()
  if (!trimmed) return ''
  const parsed = new Date(`${trimmed}T12:00:00`)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toISOString()
}

/** Normaliza fechas guardadas (ISO completo o solo `YYYY-MM-DD`). */
export const normalizeStoredTransactionDate = (dateValue: string): string => {
  const trimmed = dateValue.trim()
  if (!trimmed) return new Date().toISOString()
  if (trimmed.includes('T')) return trimmed
  return dateInputToIso(trimmed.slice(0, 10)) || new Date().toISOString()
}
