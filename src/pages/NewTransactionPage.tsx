import { useNavigate } from 'react-router-dom'
import { TransactionForm } from '../components/TransactionForm'

/** Alta de ingresos y gastos (ruta dedicada). */
export const NewTransactionPage = () => {
  const navigate = useNavigate()

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Introducir ingreso o gasto</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Completa el formulario. Al guardar volverás al listado de transferencias.
        </p>
      </header>
      <div className="max-w-xl">
        <TransactionForm onSuccess={() => navigate('/')} />
      </div>
    </>
  )
}
