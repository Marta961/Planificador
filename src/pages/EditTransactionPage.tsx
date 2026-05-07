import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TransactionForm } from '../components/TransactionForm'
import { useFinance } from '../hooks/useFinance'

/** Edición de un movimiento existente por ID en la URL. */
export const EditTransactionPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { transactions, listLoading } = useFinance()

  const transaction = useMemo(() => transactions.find((item) => item.id === id), [transactions, id])

  const defaultValues = useMemo(
    () =>
      transaction
        ? {
            amount: transaction.amount,
            date: transaction.date,
            type: transaction.type,
            description: transaction.description ?? '',
            category: transaction.category ?? '',
          }
        : undefined,
    [transaction],
  )

  if (listLoading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
        Cargando movimiento…
      </div>
    )
  }

  if (!id || !transaction || !defaultValues) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-8 text-center shadow-sm">
        <p className="text-sm font-medium text-amber-900">No se encontró la transferencia indicada.</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-800">
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Modificar ingreso o gasto</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Actualiza los datos del movimiento. Los cambios se envían al servidor (API) y el listado se actualiza con la respuesta.
        </p>
      </header>
      <div className="max-w-xl">
        <TransactionForm
          key={transaction.id}
          mode="edit"
          transactionId={transaction.id}
          defaultValues={defaultValues}
          onSuccess={() => navigate('/')}
        />
      </div>
    </>
  )
}
