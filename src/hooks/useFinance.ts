import { useContext } from 'react'
import { FinanceContext } from '../context/finance-context'

export const useFinance = () => {
  const ctx = useContext(FinanceContext)
  if (!ctx) {
    throw new Error('useFinance debe usarse dentro de FinanceProvider')
  }
  return ctx
}
