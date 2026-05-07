import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

type DivProps = Omit<HTMLAttributes<HTMLDivElement>, 'className'> & {
  children: ReactNode
  className?: string
}

export const Card = ({ children, className, ...rest }: DivProps) => (
  <div
    className={cn('rounded-xl border border-slate-200 bg-white shadow-sm', className)}
    {...rest}
  >
    {children}
  </div>
)

export const CardHeader = ({ children, className, ...rest }: DivProps) => (
  <div className={cn('border-b border-slate-100 px-4 py-3', className)} {...rest}>
    {children}
  </div>
)

export const CardBody = ({ children, className, ...rest }: DivProps) => (
  <div className={cn('px-4 py-3', className)} {...rest}>
    {children}
  </div>
)

export const CardFooter = ({ children, className, ...rest }: DivProps) => (
  <div className={cn('border-t border-slate-100 px-4 py-3', className)} {...rest}>
    {children}
  </div>
)
