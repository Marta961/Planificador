import type { Transaction, TransactionCategory, TransactionType } from '../types/finance'

/** Respuesta correcta alineada con el backend Express (`{ data: T }`). */
export interface ApiSuccessEnvelope<T> {
  data: T
}

export interface ApiValidationDetail {
  field: string
  message: string
}

/** Cuerpo de error del backend (`{ error: { ... } }`). */
export interface ApiErrorBody {
  error: {
    code: string
    message: string
    details?: ApiValidationDetail[]
  }
}

/** Payload de creación (POST `/api/v1/transactions`). */
export interface CreateTransactionRequest {
  amount: number
  date: string
  type: TransactionType
  description?: string
  category?: TransactionCategory | null
}

/** Payload de actualización enviado por el formulario (PATCH con cuerpo completo). */
export type UpdateTransactionRequest = CreateTransactionRequest

export interface DeleteTransactionResponse {
  deleted: true
  id: string
}

export type { Transaction }
