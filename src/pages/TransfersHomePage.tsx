import { useState } from 'react'
import { ConfirmModal } from '../components/ConfirmModal'
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
    loadSampleData,
    regenerateSampleData,
  } = useFinance()

  const [selected, setSelected] = useState<Transaction | null>(null)
  const [confirmRegenOpen, setConfirmRegenOpen] = useState(false)
  const [sampleAction, setSampleAction] = useState<null | 'load' | 'regen'>(null)

  const handleLoadSamples = async () => {
    setSampleAction('load')
    try {
      await loadSampleData()
    } catch {
      /* El proveedor ya expone mutationError */
    } finally {
      setSampleAction(null)
    }
  }

  const handleRegenerate = async () => {
    setSampleAction('regen')
    try {
      await regenerateSampleData()
      setConfirmRegenOpen(false)
    } catch {
      /* El proveedor ya expone mutationError */
    } finally {
      setSampleAction(null)
    }
  }

  const sampleBusy = sampleAction !== null || mutationInFlight

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Transferencias bancarias</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Vista principal: los movimientos viven en el backend (API). Usa la navegación para alta o edición.
        </p>
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

      <section className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          loading={sampleAction === 'load'}
          disabled={listLoading || sampleBusy}
          onClick={() => void handleLoadSamples()}
        >
          Importar muestras al servidor
        </Button>
        <Button
          variant="danger"
          disabled={listLoading || sampleBusy}
          onClick={() => {
            setSelected(null)
            setConfirmRegenOpen(true)
          }}
        >
          Regenerar e importar muestras
        </Button>
      </section>

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

      <ConfirmModal
        open={confirmRegenOpen}
        title="Regenerar datos de ejemplo"
        description="Se obtendrá un nuevo lote de ejemplo y se creará en el servidor (POST por cada fila). Puede duplicar movimientos si ya existían."
        confirmLabel="Sí, importar"
        cancelLabel="Cancelar"
        loading={sampleAction === 'regen'}
        onCancel={() => setConfirmRegenOpen(false)}
        onConfirm={handleRegenerate}
      />
    </>
  )
}
