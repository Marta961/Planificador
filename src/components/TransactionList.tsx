import { Link } from 'react-router-dom'
import { getCategoryLabel, type Transaction } from '../types/finance'
import { formatCurrencyEUR, formatDateSafe } from '../utils/format'
import { cn } from '../utils/cn'
import { getTransactionListTitle } from '../utils/transactionListTitle'
import { useFinance } from '../hooks/useFinance'
import { Button, Card, CardBody, CardHeader } from './ui'

export interface TransactionListProps {
  /** Abre modal u otra UI de detalle (p. ej. en la página principal). */
  onSelectDetail?: (transaction: Transaction) => void
  /** Enlace a la pantalla de edición por ID. */
  showEditLink?: boolean
}

/** Lista que lee `transactions` del contexto. */
export const TransactionList = ({ onSelectDetail, showEditLink = true }: TransactionListProps) => {
  const { transactions } = useFinance()

  return (
    <Card>
      <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-slate-900">Transferencias</h2>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
          {transactions.length} registros
        </span>
      </CardHeader>
      <CardBody className="pt-0">
        {transactions.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-center text-sm text-slate-600">
            No tienes transferencias bancarias.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {transactions.map((item) => (
              <li key={item.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-slate-900">{getTransactionListTitle(item)}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                    <p className="text-xs text-slate-500">{formatDateSafe(item.date)}</p>
                    {item.category ? (
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-800">
                        {getCategoryLabel(item.type, item.category)}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span
                    className={cn(
                      'text-sm font-semibold tabular-nums',
                      item.type === 'INGRESO' ? 'text-emerald-700' : 'text-rose-700',
                    )}
                  >
                    {item.type === 'INGRESO' ? '+' : '-'} {formatCurrencyEUR(item.amount)}
                  </span>
                  {onSelectDetail ? (
                    <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => onSelectDetail(item)}>
                      Ver detalle
                    </Button>
                  ) : null}
                  {showEditLink ? (
                    <Link
                      to={`/editar/${item.id}`}
                      className="rounded-lg px-2 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800"
                    >
                      Editar
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  )
}
