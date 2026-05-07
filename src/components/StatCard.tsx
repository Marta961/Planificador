import type { ReactNode } from 'react'
import { Card, CardBody, CardHeader } from './ui'
import { cn } from '../utils/cn'

export type StatCardVariant = 'income' | 'expense' | 'balance'

const accent: Record<StatCardVariant, string> = {
  income: 'border-l-emerald-500',
  expense: 'border-l-rose-500',
  balance: 'border-l-indigo-500',
}

export interface StatCardProps {
  title: string
  value: string
  variant: StatCardVariant
  hint?: ReactNode
  className?: string
}

export const StatCard = ({ title, value, variant, hint, className }: StatCardProps) => (
  <Card className={cn('overflow-hidden border-l-4', accent[variant], className)}>
    <CardHeader className="pb-2">
      <h3 className="text-sm font-medium text-slate-600">{title}</h3>
    </CardHeader>
    <CardBody className="pt-0">
      <p className="text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
      {hint ? <div className="mt-2 text-xs text-slate-500">{hint}</div> : null}
    </CardBody>
  </Card>
)
