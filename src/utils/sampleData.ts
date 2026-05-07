import type { Transaction } from '../types/finance'

export const buildSampleTransactions = (): Transaction[] => {
  const today = new Date()
  const toISO = (daysAgo: number) => {
    const date = new Date(today)
    date.setDate(today.getDate() - daysAgo)
    return date.toISOString()
  }

  return [
    {
      id: crypto.randomUUID(),
      concept: 'Nómina mensual',
      amount: 1800,
      date: toISO(10),
      type: 'INGRESO',
      description: 'Nómina mensual',
      category: 'TRABAJO',
    },
    {
      id: crypto.randomUUID(),
      concept: 'Compra supermercado',
      amount: 85.4,
      date: toISO(8),
      type: 'GASTO',
      description: 'Compra supermercado',
      category: 'HOGAR',
    },
    {
      id: crypto.randomUUID(),
      concept: 'Suscripción streaming',
      amount: 12.99,
      date: toISO(4),
      type: 'GASTO',
      category: 'OCIO',
    },
    {
      id: crypto.randomUUID(),
      concept: 'Trabajo freelance',
      amount: 320,
      date: toISO(2),
      type: 'INGRESO',
      description: 'Factura freelance',
      category: 'OTROS_INGRESO',
    },
  ]
}
