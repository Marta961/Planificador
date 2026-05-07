import { createContext } from 'react'
import type { CreateTransactionRequest, UpdateTransactionRequest } from '../api/types'
import type { FinanceSummary, Transaction } from '../types/finance'

export type CreateTransactionInput = CreateTransactionRequest

/** Misma forma que alta (cuerpo completo vía formulario). */
export type UpdateTransactionInput = UpdateTransactionRequest

export interface FinanceContextValue {
  transactions: Transaction[]
  summary: FinanceSummary
  /** Carga o recarga del listado desde la API. */
  listLoading: boolean
  /** Error al obtener el listado (con posibilidad de reintento). */
  listError: string | null
  refetchTransactions: () => Promise<void>
  /** POST/PATCH en curso hacia la API. */
  mutationInFlight: boolean
  mutationError: string | null
  clearMutationError: () => void
  addTransaction: (payload: CreateTransactionInput) => Promise<void>
  updateTransaction: (id: string, payload: UpdateTransactionInput) => Promise<void>
  loadSampleData: () => Promise<void>
  regenerateSampleData: () => Promise<void>
}

export const FinanceContext = createContext<FinanceContextValue | null>(null)
