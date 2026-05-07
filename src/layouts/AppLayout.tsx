import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '../utils/cn'

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-lg px-3 py-2 text-sm font-medium transition',
    isActive ? 'bg-indigo-100 text-indigo-900' : 'text-slate-700 hover:bg-slate-100',
  )

export const AppLayout = () => (
  <div className="min-h-screen bg-slate-50">
    <nav className="border-b border-slate-200 bg-white" aria-label="Principal">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-3">
        <NavLink to="/" end className={navClass}>
          Transferencias
        </NavLink>
        <NavLink to="/nuevo" className={navClass}>
          Nuevo ingreso o gasto
        </NavLink>
      </div>
    </nav>
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Outlet />
    </div>
  </div>
)
