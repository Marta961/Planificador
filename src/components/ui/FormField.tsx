import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface FormFieldProps {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}

export const FormField = ({
  id,
  label,
  hint,
  error,
  required,
  children,
  className,
}: FormFieldProps) => (
  <div className={cn('flex flex-col gap-1', className)}>
    <label htmlFor={id} className="text-sm font-medium text-slate-700">
      {label}
      {required ? <span className="text-rose-600"> *</span> : null}
    </label>
    {children}
    {hint && !error ? <p className="text-xs text-slate-500">{hint}</p> : null}
    {error ? <p className="text-xs text-rose-600">{error}</p> : null}
  </div>
)
