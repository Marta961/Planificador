import { useState } from 'react'
import { SummaryCards } from '../components/SummaryCards'
import { TransactionDetailModal } from '../components/TransactionDetailModal'
import { TransactionList } from '../components/TransactionList'
import { Button } from '../components/ui'
import type { Transaction } from '../types/finance'
import { useFinance } from '../hooks/useFinance'

/** Página principal: listado de transferencias y resumen (datos desde API). */
export const TransfersHomePage = () => {
  const {
    listLoading,
    listError,
    refetchTransactions,
    mutationInFlight,
    mutationError,
    clearMutationError,
  } = useFinance()

  const [selected, setSelected] = useState<Transaction | null>(null)

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Transferencias bancarias</h1>
      </header>

      {listError && !listLoading ? (
        <div
          className="mb-4 flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <span>{listError}</span>
          <Button type="button" variant="secondary" onClick={() => void refetchTransactions()}>
            Reintentar
          </Button>
        </div>
      ) : null}

      {mutationError && !mutationInFlight ? (
        <div
          className="mb-4 flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:flex-row sm:items-center sm:justify-between"
          role="status"
        >
          <span>{mutationError}</span>
          <Button type="button" variant="secondary" onClick={clearMutationError}>
            Cerrar
          </Button>
        </div>
      ) : null}

      <SummaryCards />

      <section className="mt-6">
        {listLoading ? (
          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
            Cargando movimientos desde el servidor…
          </div>
        ) : (
          <TransactionList onSelectDetail={setSelected} showEditLink />
        )}
      </section>

      <TransactionDetailModal transaction={selected} onClose={() => setSelected(null)} />
    </>
  )
}
