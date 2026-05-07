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

  return (
    <Modal
      open={open}
      title="Detalle del movimiento"
      description="Datos tipados del dominio (Transaction) desde el estado global."
      onClose={onClose}
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      }
    >
      {transaction ? (
        <dl className="grid grid-cols-1 gap-3 text-sm text-slate-800">
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
              <dd className="mt-1">{transaction.type}</dd>
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
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">ID</dt>
            <dd className="mt-1 break-all font-mono text-xs text-slate-600">{transaction.id}</dd>
          </div>
        </dl>
      ) : null}
    </Modal>
  )
}
