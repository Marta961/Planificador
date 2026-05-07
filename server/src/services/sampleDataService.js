import { randomUUID } from 'node:crypto'

const buildDateISO = (daysAgo) => {
  const now = new Date()
  now.setDate(now.getDate() - daysAgo)
  return now.toISOString()
}

const createDefaultTransactions = () => [
  {
    id: randomUUID(),
    concept: 'Salario',
    amount: 2100,
    type: 'INGRESO',
    date: buildDateISO(15),
    description: 'Salario',
    category: 'TRABAJO',
  },
  {
    id: randomUUID(),
    concept: 'Alquiler',
    amount: 750,
    type: 'GASTO',
    date: buildDateISO(13),
    category: 'HOGAR',
  },
  {
    id: randomUUID(),
    concept: 'Comida',
    amount: 120.5,
    type: 'GASTO',
    date: buildDateISO(5),
    category: 'RESTAURANTE',
  },
  {
    id: randomUUID(),
    concept: 'Venta online',
    amount: 85,
    type: 'INGRESO',
    date: buildDateISO(2),
    category: 'OTROS_INGRESO',
  },
]

let sampleTransactions = createDefaultTransactions()

export const sampleDataService = {
  list() {
    return sampleTransactions
  },
  regenerate() {
    sampleTransactions = createDefaultTransactions()
    return sampleTransactions
  },
}
