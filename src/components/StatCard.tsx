import type { ReactNode } from 'react'
import { Card, CardBody, CardHeader } from './ui'
import { cn } from '../utils/cn'

export interface StatCardProps {
  title: string
  value: string
  hint?: ReactNode
  className?: string
}

export const StatCard = ({ title, value, hint, className }: StatCardProps) => (
  <Card className={cn('overflow-hidden', className)}>
    <CardHeader className="pb-2">
      <h3 className="text-sm font-medium text-slate-600">{title}</h3>
    </CardHeader>
    <CardBody className="pt-0">
      <p className="text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
      {hint ? <div className="mt-2 text-xs text-slate-500">{hint}</div> : null}
    </CardBody>
  </Card>
)
