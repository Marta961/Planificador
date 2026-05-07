export type TransactionType = 'INGRESO' | 'GASTO'

/** Categorías de gasto (obligatorias solo si el usuario elige categoría). */
export const EXPENSE_CATEGORIES = [
  'OCIO',
  'RESTAURANTE',
  'HOGAR',
  'SALUD',
  'EDUCACION',
  'OTROS_GASTO',
] as const
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]

/** Categorías de ingreso. */
export const INCOME_CATEGORIES = ['TRABAJO', 'INVERSION', 'OTROS_INGRESO'] as const
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number]

export type TransactionCategory = ExpenseCategory | IncomeCategory

export interface Transaction {
  id: string
  /** Texto corto para listados (derivado o legado). */
  concept: string
  amount: number
  /** Fecha del movimiento en ISO 8601. */
  date: string
  type: TransactionType
  /** Descripción libre opcional. */
  description?: string
  /** Categoría opcional; debe encajar con `type`. */
  category?: TransactionCategory | null
}

export interface FinanceSummary {
  totalIngresos: number
  totalGastos: number
  balance: number
}

/** Etiqueta idéntica en UI para gasto e ingreso; los códigos internos siguen siendo `OTROS_GASTO` y `OTROS_INGRESO`. */
const LABEL_OTROS = 'Otros'

export const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  OCIO: 'Ocio',
  RESTAURANTE: 'Restaurante',
  HOGAR: 'Hogar',
  SALUD: 'Salud',
  EDUCACION: 'Educación',
  OTROS_GASTO: LABEL_OTROS,
}

export const incomeCategoryLabels: Record<IncomeCategory, string> = {
  TRABAJO: 'Trabajo',
  INVERSION: 'Inversión',
  OTROS_INGRESO: LABEL_OTROS,
}

export const getCategoryLabel = (type: TransactionType, category: TransactionCategory): string =>
  type === 'GASTO'
    ? expenseCategoryLabels[category as ExpenseCategory]
    : incomeCategoryLabels[category as IncomeCategory]

export const isExpenseCategory = (value: string): value is ExpenseCategory =>
  (EXPENSE_CATEGORIES as readonly string[]).includes(value)

export const isIncomeCategory = (value: string): value is IncomeCategory =>
  (INCOME_CATEGORIES as readonly string[]).includes(value)
