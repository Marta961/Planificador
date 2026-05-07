import { Link } from 'react-router-dom'

/** Ruta no encontrada (404). */
export const NotFoundPage = () => (
  <div className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Error 404</p>
    <h1 className="mt-2 text-2xl font-semibold text-slate-900">Página no encontrada</h1>
    <p className="mt-2 text-sm text-slate-600">La ruta que has solicitado no existe en esta aplicación.</p>
    <Link
      to="/"
      className="mt-6 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
    >
      Ir a transferencias
    </Link>
  </div>
)
