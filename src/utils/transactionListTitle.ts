import type { Transaction, TransactionCategory, TransactionType } from '../types/finance'
import { getCategoryLabel } from '../types/finance'

export const buildConceptFromPayload = (input: {
  type: TransactionType
  description?: string | null
  category?: TransactionCategory | null
}): string => {
  const desc = input.description?.trim()
  if (desc) return desc.length > 120 ? `${desc.slice(0, 120)}…` : desc
  if (input.category) {
    return getCategoryLabel(input.type, input.category)
  }
  return 'Sin descripción'
}

export const getTransactionListTitle = (item: Transaction): string =>
  item.description?.trim() || item.concept?.trim() || 'Sin descripción'
