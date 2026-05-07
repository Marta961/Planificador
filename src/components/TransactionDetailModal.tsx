import { useState } from 'react'
import { ApiError } from '../api/client'
import { useFinance } from '../hooks/useFinance'
import { getCategoryLabel, type Transaction } from '../types/finance'
import { formatCurrencyEUR, formatDateSafe } from '../utils/format'
import { getTransactionListTitle } from '../utils/transactionListTitle'
import { Button, Modal } from './ui'

export interface TransactionDetailModalProps {
  transaction: Transaction | null
  onClose: () => void
}

export const TransactionDetailModal = ({ transaction, onClose }: TransactionDetailModalProps) => {
  const open = Boolean(transaction)
  const { deleteTransaction, mutationInFlight } = useFinance()
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const formatTypeLabel = (value: Transaction['type']) =>
    value.charAt(0) + value.slice(1).toLowerCase()

  const handleDelete = async () => {
    if (!transaction) return
    setDeleteError(null)
    try {
      await deleteTransaction(transaction.id)
      onClose()
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'No se pudo eliminar el movimiento. Inténtalo de nuevo.'
      setDeleteError(message)
    }
  }

  return (
    <Modal
      open={open}
      title="Detalle del movimiento"
      description="Datos tipados del dominio (Transaction) desde el estado global."
      onClose={onClose}
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="danger" loading={mutationInFlight} onClick={() => void handleDelete()}>
            Eliminar movimiento
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      }
    >
      {transaction ? (
        <dl className="grid grid-cols-1 gap-3 text-sm text-slate-800">
          {deleteError ? (
            <div>
              <dd className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                {deleteError}
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Título en listado</dt>
            <dd className="mt-1 text-base font-medium">{getTransactionListTitle(transaction)}</dd>
          </div>
          {transaction.description ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Descripción</dt>
              <dd className="mt-1 whitespace-pre-wrap">{transaction.description}</dd>
            </div>
          ) : null}
          {transaction.category ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Categoría</dt>
              <dd className="mt-1">{getCategoryLabel(transaction.type, transaction.category)}</dd>
            </div>
          ) : null}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tipo</dt>
              <dd className="mt-1">{formatTypeLabel(transaction.type)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Importe</dt>
              <dd className="mt-1 font-semibold">
                {transaction.type === 'INGRESO' ? '+' : '-'} {formatCurrencyEUR(transaction.amount)}
              </dd>
            </div>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fecha</dt>
            <dd className="mt-1">{formatDateSafe(transaction.date)}</dd>
          </div>
        </dl>
      ) : null}
    </Modal>
  )
}
