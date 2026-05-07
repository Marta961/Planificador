import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { apiClient, ApiError } from '../api/client'
import type { FinanceSummary, Transaction } from '../types/finance'
import {
  FinanceContext,
  type CreateTransactionInput,
  type UpdateTransactionInput,
} from './finance-context'

const mapTransactionToRequest = (row: Transaction): CreateTransactionInput => ({
  amount: row.amount,
  date: row.date,
  type: row.type,
  description: row.description,
  category: row.category ?? undefined,
})

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [mutationInFlight, setMutationInFlight] = useState(false)
  const [mutationError, setMutationError] = useState<string | null>(null)

  const clearMutationError = useCallback(() => {
    setMutationError(null)
  }, [])

  const refetchTransactions = useCallback(async () => {
    setListLoading(true)
    setListError(null)
    try {
      const rows = await apiClient.listTransactions()
      setTransactions(rows)
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'No se pudo conectar con el servidor de transacciones.'
      setListError(message)
      setTransactions([])
    } finally {
      setListLoading(false)
    }
  }, [])

  useEffect(() => {
    // Diferir la primera petición para no disparar setState en el mismo tick que el efecto (react-hooks/set-state-in-effect).
    const id = window.setTimeout(() => {
      void refetchTransactions()
    }, 0)
    return () => window.clearTimeout(id)
  }, [refetchTransactions])

  const addTransaction = useCallback(async (payload: CreateTransactionInput) => {
    setMutationInFlight(true)
    setMutationError(null)
    try {
      const created = await apiClient.createTransaction(payload)
      setTransactions((prev) => [created, ...prev])
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'No se pudo crear el movimiento.'
      setMutationError(message)
      throw error
    } finally {
      setMutationInFlight(false)
    }
  }, [])

  const updateTransaction = useCallback(async (id: string, payload: UpdateTransactionInput) => {
    setMutationInFlight(true)
    setMutationError(null)
    try {
      const updated = await apiClient.updateTransaction(id, payload)
      setTransactions((prev) => prev.map((item) => (item.id === id ? updated : item)))
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'No se pudo actualizar el movimiento.'
      setMutationError(message)
      throw error
    } finally {
      setMutationInFlight(false)
    }
  }, [])

  const loadSampleData = useCallback(async () => {
    setMutationInFlight(true)
    setMutationError(null)
    try {
      const rows = await apiClient.fetchFinanceSample()
      for (const row of rows) {
        await apiClient.createTransaction(mapTransactionToRequest(row))
      }
      await refetchTransactions()
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'No se pudieron importar las muestras al servidor.'
      setMutationError(message)
      throw error
    } finally {
      setMutationInFlight(false)
    }
  }, [refetchTransactions])

  const regenerateSampleData = useCallback(async () => {
    setMutationInFlight(true)
    setMutationError(null)
    try {
      const rows = await apiClient.regenerateFinanceSample()
      for (const row of rows) {
        await apiClient.createTransaction(mapTransactionToRequest(row))
      }
      await refetchTransactions()
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'No se pudieron importar las muestras al servidor.'
      setMutationError(message)
      throw error
    } finally {
      setMutationInFlight(false)
    }
  }, [refetchTransactions])

  const summary = useMemo<FinanceSummary>(() => {
    const { totalIngresos, totalGastos } = transactions.reduce(
      (acc, item) => {
        if (item.type === 'INGRESO') {
          acc.totalIngresos += item.amount
        } else {
          acc.totalGastos += item.amount
        }
        return acc
      },
      { totalIngresos: 0, totalGastos: 0 },
    )

    return {
      totalIngresos,
      totalGastos,
      balance: totalIngresos - totalGastos,
    }
  }, [transactions])

  const value = useMemo(
    () => ({
      transactions,
      summary,
      listLoading,
      listError,
      refetchTransactions,
      mutationInFlight,
      mutationError,
      clearMutationError,
      addTransaction,
      updateTransaction,
      loadSampleData,
      regenerateSampleData,
    }),
    [
      transactions,
      summary,
      listLoading,
      listError,
      refetchTransactions,
      mutationInFlight,
      mutationError,
      clearMutationError,
      addTransaction,
      updateTransaction,
      loadSampleData,
      regenerateSampleData,
    ],
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}
