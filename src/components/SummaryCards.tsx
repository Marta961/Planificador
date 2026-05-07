import { formatCurrencyEUR } from '../utils/format'
import { useFinance } from '../hooks/useFinance'
import { StatCard } from './StatCard'

/** Resumen leído directamente del contexto global (sin props desde la página). */
export const SummaryCards = () => {
  const { summary } = useFinance()

  return (
    <section className="grid gap-3 sm:grid-cols-3" aria-label="Resumen financiero">
      <StatCard title="Ingresos" value={formatCurrencyEUR(summary.totalIngresos)} />
      <StatCard title="Gastos" value={formatCurrencyEUR(summary.totalGastos)} />
      <StatCard title="Balance" value={formatCurrencyEUR(summary.balance)} />
    </section>
  )
}
