import { formatCurrencyEUR } from '../utils/format'
import { useFinance } from '../hooks/useFinance'
import { Button } from './ui'

/**
 * Barra global: resume estado de red del listado (carga / error / datos).
 */
export const FinanceStatusBar = () => {
  const { listLoading, listError, refetchTransactions, transactions, summary } = useFinance()

  return (
    <div
      className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/75"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 text-sm text-slate-700">
        <span className="font-medium text-slate-900">Estado de red</span>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {listError ? (
            <>
              <span className="text-xs font-medium text-rose-700">Error al cargar listado</span>
              <Button type="button" variant="secondary" className="px-2 py-1 text-xs" onClick={() => void refetchTransactions()}>
                Reintentar
              </Button>
            </>
          ) : null}
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
            {listLoading ? 'Cargando…' : `${transactions.length} movimientos`}
          </span>
          <span className="text-xs text-slate-600">
            Balance:{' '}
            <strong className="tabular-nums text-slate-900">{formatCurrencyEUR(summary.balance)}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
