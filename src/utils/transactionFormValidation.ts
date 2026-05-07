import type { TransactionType } from '../types/finance'
import { isExpenseCategory, isIncomeCategory } from '../types/finance'

/** Errores por campo del formulario de movimiento. */
export interface TransactionFieldErrors {
  date?: string
  amount?: string
  type?: string
  description?: string
  category?: string
}

export interface TransactionFormValues {
  date: string
  amount: string
  type: TransactionType
  description: string
  category: string
}

const MAX_DESCRIPTION = 500

export const validateTransactionForm = (values: TransactionFormValues): TransactionFieldErrors => {
  const errors: TransactionFieldErrors = {}

  if (!values.date?.trim()) {
    errors.date = 'La fecha es obligatoria.'
  } else {
    const parsed = new Date(`${values.date.trim()}T12:00:00`)
    if (Number.isNaN(parsed.getTime())) {
      errors.date = 'La fecha no es válida.'
    }
  }

  const amountNum = Number(values.amount.replace(',', '.'))
  if (!values.amount?.trim()) {
    errors.amount = 'El importe es obligatorio.'
  } else if (Number.isNaN(amountNum) || amountNum <= 0) {
    errors.amount = 'Introduce un importe numérico mayor que cero.'
  }

  if (values.type !== 'INGRESO' && values.type !== 'GASTO') {
    errors.type = 'Selecciona si es ingreso o gasto.'
  }

  if (values.description.length > MAX_DESCRIPTION) {
    errors.description = `La descripción no puede superar ${MAX_DESCRIPTION} caracteres.`
  }

  const cat = values.category.trim()
  if (cat) {
    if (values.type === 'GASTO' && !isExpenseCategory(cat)) {
      errors.category = 'Selecciona una categoría de gasto válida.'
    }
    if (values.type === 'INGRESO' && !isIncomeCategory(cat)) {
      errors.category = 'Selecciona una categoría de ingreso válida.'
    }
  }

  return errors
}

export const hasFieldErrors = (errors: TransactionFieldErrors): boolean =>
  Object.values(errors).some(Boolean)
