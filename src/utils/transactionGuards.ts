import type { Transaction, TransactionCategory, TransactionType } from '../types/finance'
import {
  getCategoryLabel,
  isExpenseCategory,
  isIncomeCategory,
} from '../types/finance'

const parseCategory = (type: TransactionType, raw: unknown): TransactionCategory | undefined => {
  if (typeof raw !== 'string' || !raw.trim()) return undefined
  if (type === 'GASTO' && isExpenseCategory(raw)) return raw
  if (type === 'INGRESO' && isIncomeCategory(raw)) return raw
  return undefined
}

const normalizeTransaction = (row: unknown): Transaction | null => {
  if (!row || typeof row !== 'object') return null
  const r = row as Record<string, unknown>

  const id = typeof r.id === 'string' ? r.id : null
  const amount = typeof r.amount === 'number' && Number.isFinite(r.amount) ? r.amount : Number.NaN
  const date = typeof r.date === 'string' ? r.date : ''
  const type: TransactionType | null = r.type === 'INGRESO' || r.type === 'GASTO' ? r.type : null

  if (!id || !type || !date.trim() || Number.isNaN(amount)) return null

  const description = typeof r.description === 'string' ? r.description.trim() || undefined : undefined
  const category = parseCategory(type, r.category)
  const legacyConcept = typeof r.concept === 'string' ? r.concept.trim() : ''

  const concept =
    legacyConcept ||
    description ||
    (category ? getCategoryLabel(type, category) : '') ||
    'Sin descripción'

  return {
    id,
    amount,
    date,
    type,
    concept,
    description,
    category: category ?? undefined,
  }
}

/** Compatibilidad con datos antiguos y respuestas API. */
export const isTransaction = (value: unknown): value is Transaction => normalizeTransaction(value) !== null

export const parseTransactions = (value: unknown): Transaction[] => {
  if (!Array.isArray(value)) return []
  return value.map(normalizeTransaction).filter((x): x is Transaction => x !== null)
}
