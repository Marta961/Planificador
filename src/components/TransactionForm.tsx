import { useEffect, useState, type FormEvent } from 'react'
import type { TransactionCategory, TransactionType } from '../types/finance'
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  expenseCategoryLabels,
  incomeCategoryLabels,
  isExpenseCategory,
  isIncomeCategory,
} from '../types/finance'
import { ApiError } from '../api/client'
import { useFinance } from '../hooks/useFinance'
import { dateInputToIso, toDateInputValue } from '../utils/format'
import {
  hasFieldErrors,
  validateTransactionForm,
  type TransactionFieldErrors,
} from '../utils/transactionFormValidation'
import { Button, Card, CardBody, CardFooter, CardHeader, FormField } from './ui'

const inputClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'

export type TransactionFormMode = 'create' | 'edit'

export interface TransactionFormDefaults {
  amount: number
  date: string
  type: TransactionType
  description?: string
  category?: string | null
}

export interface TransactionFormProps {
  mode?: TransactionFormMode
  transactionId?: string
  defaultValues?: TransactionFormDefaults
  onSuccess?: () => void
}

/** Formulario controlado con validación, errores por campo y mensaje de confirmación. */
export const TransactionForm = ({
  mode = 'create',
  transactionId,
  defaultValues,
  onSuccess,
}: TransactionFormProps) => {
  const { addTransaction, updateTransaction, mutationInFlight, mutationError, clearMutationError } = useFinance()

  const [date, setDate] = useState(() =>
    defaultValues?.date ? toDateInputValue(defaultValues.date) : toDateInputValue(new Date().toISOString()),
  )
  const [amount, setAmount] = useState(
    defaultValues !== undefined ? String(defaultValues.amount) : '',
  )
  const [type, setType] = useState<TransactionType>(defaultValues?.type ?? 'GASTO')
  const [description, setDescription] = useState(defaultValues?.description ?? '')
  const [category, setCategory] = useState(defaultValues?.category ?? '')

  const [fieldErrors, setFieldErrors] = useState<TransactionFieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const idPrefix = mode === 'edit' && transactionId ? `edit-${transactionId}` : 'new'

  useEffect(() => {
    if (!successMessage) return
    const id = window.setTimeout(() => setSuccessMessage(null), 4500)
    return () => window.clearTimeout(id)
  }, [successMessage])

  const handleTypeChange = (next: TransactionType) => {
    setType(next)
    setCategory((current) => {
      const trimmed = current.trim()
      if (!trimmed) return ''
      if (next === 'GASTO' && !isExpenseCategory(trimmed)) return ''
      if (next === 'INGRESO' && !isIncomeCategory(trimmed)) return ''
      return current
    })
    setFieldErrors((prev) => ({ ...prev, type: undefined, category: undefined }))
  }

  const clearErrorsOnEdit = () => {
    clearMutationError()
    setSubmitError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearErrorsOnEdit()

    const values = {
      date: date.trim(),
      amount: amount.trim(),
      type,
      description: description.trim(),
      category: category.trim(),
    }

    const errors = validateTransactionForm(values)
    if (hasFieldErrors(errors)) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})

    const amountNum = Number(values.amount.replace(',', '.'))
    const dateIso = dateInputToIso(values.date)
    if (!dateIso) {
      setFieldErrors((prev) => ({ ...prev, date: 'La fecha no es válida.' }))
      return
    }

    const categoryPayload: TransactionCategory | undefined =
      values.category === ''
        ? undefined
        : type === 'GASTO' && isExpenseCategory(values.category)
          ? values.category
          : type === 'INGRESO' && isIncomeCategory(values.category)
            ? values.category
            : undefined

    const payload = {
      amount: amountNum,
      date: dateIso,
      type,
      description: values.description || undefined,
      category: categoryPayload,
    }

    try {
      if (mode === 'edit') {
        if (!transactionId) {
          setSubmitError('Falta el identificador de la transacción.')
          return
        }
        await updateTransaction(transactionId, payload)
        setSuccessMessage('Cambios guardados correctamente.')
      } else {
        await addTransaction(payload)
        setSuccessMessage('Movimiento guardado correctamente.')
        setAmount('')
        setDescription('')
        setCategory('')
        setDate(toDateInputValue(new Date().toISOString()))
        setType('GASTO')
      }

      window.setTimeout(() => {
        onSuccess?.()
      }, 750)
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'No se pudo guardar. Comprueba la conexión e inténtalo de nuevo.'
      setSubmitError(message)
    }
  }

  const isEdit = mode === 'edit'

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-slate-900">
          {isEdit ? 'Modificar ingreso o gasto' : 'Nueva transacción'}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Obligatorios: <strong>importe</strong> y <strong>fecha</strong>. Opcionales: descripción y categoría. Tipo
          ingreso/gasto determina las categorías disponibles.
        </p>
      </CardHeader>
      <form onSubmit={(event) => void handleSubmit(event)} noValidate>
        <CardBody className="grid gap-3">
          {submitError || mutationError ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800" role="alert">
              {submitError ?? mutationError}
            </p>
          ) : null}
          {successMessage ? (
            <p
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
              role="status"
            >
              {successMessage}
            </p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <FormField id={`${idPrefix}-date`} label="Fecha" required error={fieldErrors.date}>
              <input
                id={`${idPrefix}-date`}
                type="date"
                className={inputClass}
                value={date}
                onChange={(event) => {
                  setDate(event.target.value)
                  setFieldErrors((prev) => ({ ...prev, date: undefined }))
                  clearErrorsOnEdit()
                }}
              />
            </FormField>

            <FormField
              id={`${idPrefix}-amount`}
              label="Importe en euros"
              required
              error={fieldErrors.amount}
              hint="Importe obligatorio (número mayor que cero)."
            >
              <input
                id={`${idPrefix}-amount`}
                className={inputClass}
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value)
                  setFieldErrors((prev) => ({ ...prev, amount: undefined }))
                  clearErrorsOnEdit()
                }}
                type="text"
                inputMode="decimal"
                placeholder="0,00"
              />
            </FormField>
          </div>

          <FormField id={`${idPrefix}-type`} label="Tipo de movimiento" required error={fieldErrors.type}>
            <select
              id={`${idPrefix}-type`}
              className={inputClass}
              value={type}
              onChange={(event) => {
                handleTypeChange(event.target.value as TransactionType)
                clearErrorsOnEdit()
              }}
            >
              <option value="GASTO">Gasto</option>
              <option value="INGRESO">Ingreso</option>
            </select>
          </FormField>

          <FormField
            id={`${idPrefix}-description`}
            label="Descripción (opcional)"
            error={fieldErrors.description}
            hint="Texto libre; si está vacío se usará la categoría o «Sin descripción» en el listado."
          >
            <textarea
              id={`${idPrefix}-description`}
              className={`${inputClass} min-h-[88px] resize-y`}
              value={description}
              onChange={(event) => {
                setDescription(event.target.value)
                setFieldErrors((prev) => ({ ...prev, description: undefined }))
                clearErrorsOnEdit()
              }}
              rows={3}
              placeholder="Ej: Cena con clientes"
            />
          </FormField>

          <FormField id={`${idPrefix}-category`} label="Categoría (opcional)" error={fieldErrors.category}>
            <select
              id={`${idPrefix}-category`}
              className={inputClass}
              value={category}
              onChange={(event) => {
                setCategory(event.target.value)
                setFieldErrors((prev) => ({ ...prev, category: undefined }))
                clearErrorsOnEdit()
              }}
            >
              <option value="">Sin categoría</option>
              {type === 'GASTO'
                ? EXPENSE_CATEGORIES.map((value) => (
                    <option key={value} value={value}>
                      {expenseCategoryLabels[value]}
                    </option>
                  ))
                : INCOME_CATEGORIES.map((value) => (
                    <option key={value} value={value}>
                      {incomeCategoryLabels[value]}
                    </option>
                  ))}
            </select>
          </FormField>
        </CardBody>
        <CardFooter className="flex justify-end">
          <Button type="submit" variant="primary" loading={mutationInFlight}>
            {isEdit ? 'Guardar cambios' : 'Guardar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
