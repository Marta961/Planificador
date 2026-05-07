import type {
  ApiErrorBody,
  ApiSuccessEnvelope,
  CreateTransactionRequest,
  DeleteTransactionResponse,
  UpdateTransactionRequest,
} from './types'
import type { Transaction } from '../types/finance'
import { buildSampleTransactions } from '../utils/sampleData'
import { parseTransactions } from '../utils/transactionGuards'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.toString().trim() ?? ''
const LOCAL_FALLBACK_API_BASE_URL = 'http://localhost:4000'

const getBaseCandidates = (): string[] => {
  const normalizedPrimary = API_BASE_URL.replace(/\/$/, '')
  if (normalizedPrimary) return [normalizedPrimary]
  // Sin VITE_API_BASE_URL: probar ruta relativa y, si aplica, backend local.
  return ['', LOCAL_FALLBACK_API_BASE_URL]
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: ApiErrorBody['error']['details']

  constructor(status: number, code: string, message: string, details?: ApiErrorBody['error']['details']) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

const buildUrl = (path: string) => {
  const base = API_BASE_URL.replace(/\/$/, '')
  return `${base}${path}`
}

const parseJsonBody = async (res: Response): Promise<unknown> => {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new ApiError(res.status, 'INVALID_JSON', 'La respuesta no es JSON válido.')
  }
}

const requestData = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const bases = getBaseCandidates()
  let lastError: ApiError | null = null

  for (const base of bases) {
    try {
      const res = await fetch(base ? `${base}${path}` : buildUrl(path), {
        ...init,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      })

      const parsed = await parseJsonBody(res)

      if (!res.ok) {
        const body = parsed as Partial<ApiErrorBody> | null
        const err = body?.error
        const apiError = new ApiError(
          res.status,
          err?.code ?? 'HTTP_ERROR',
          err?.message ?? res.statusText,
          err?.details,
        )

        const shouldTryNextBase =
          base === '' &&
          res.status === 404 &&
          /the page could not be found/i.test(apiError.message) &&
          bases.length > 1

        if (shouldTryNextBase) {
          lastError = apiError
          continue
        }

        throw apiError
      }

      if (!parsed || typeof parsed !== 'object' || !('data' in parsed)) {
        throw new ApiError(res.status, 'INVALID_RESPONSE', 'La respuesta no incluye la propiedad data.')
      }

      return (parsed as ApiSuccessEnvelope<T>).data
    } catch (error) {
      if (error instanceof ApiError) {
        lastError = error
      } else {
        lastError = new ApiError(0, 'NETWORK_ERROR', 'No se pudo conectar con el servidor.')
      }
    }
  }

  throw lastError ?? new ApiError(0, 'NETWORK_ERROR', 'No se pudo conectar con el servidor.')
}

const parseTransactionArray = (raw: unknown): Transaction[] => {
  if (!Array.isArray(raw)) {
    throw new ApiError(500, 'INVALID_SHAPE', 'Se esperaba un array de transacciones.')
  }
  const rows = parseTransactions(raw)
  if (raw.length > 0 && rows.length === 0) {
    throw new ApiError(500, 'INVALID_ITEMS', 'Las transacciones recibidas no pasan la validación.')
  }
  return rows
}

const parseSingleTransaction = (raw: unknown): Transaction => {
  const rows = parseTransactions([raw])
  const first = rows[0]
  if (!first) {
    throw new ApiError(500, 'INVALID_ITEM', 'La transacción recibida no es válida.')
  }
  return first
}

export const apiClient = {
  async listTransactions(): Promise<Transaction[]> {
    const data = await requestData<unknown>('/api/v1/transactions', { method: 'GET' })
    return parseTransactionArray(data)
  },

  async getTransaction(id: string): Promise<Transaction> {
    const data = await requestData<unknown>(`/api/v1/transactions/${encodeURIComponent(id)}`, { method: 'GET' })
    return parseSingleTransaction(data)
  },

  async createTransaction(body: CreateTransactionRequest): Promise<Transaction> {
    const data = await requestData<unknown>('/api/v1/transactions', {
      method: 'POST',
      body: JSON.stringify(body),
    })
    return parseSingleTransaction(data)
  },

  async updateTransaction(id: string, body: UpdateTransactionRequest): Promise<Transaction> {
    const data = await requestData<unknown>(`/api/v1/transactions/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
    return parseSingleTransaction(data)
  },

  async deleteTransaction(id: string): Promise<DeleteTransactionResponse> {
    return requestData<DeleteTransactionResponse>(`/api/v1/transactions/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
  },

  /** Datos de ejemplo del endpoint legacy (solo lectura). */
  async fetchFinanceSample(): Promise<Transaction[]> {
    try {
      const data = await requestData<unknown>('/api/v1/finance/sample', { method: 'GET' })
      return parseTransactionArray(data)
    } catch {
      return buildSampleTransactions()
    }
  },

  async regenerateFinanceSample(): Promise<Transaction[]> {
    try {
      const data = await requestData<unknown>('/api/v1/finance/sample/generate', { method: 'POST' })
      return parseTransactionArray(data)
    } catch {
      return buildSampleTransactions()
    }
  },
}
