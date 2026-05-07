import { randomUUID } from 'node:crypto'

const buildConcept = ({ description, category, type }) => {
  const desc = typeof description === 'string' ? description.trim() : ''
  if (desc) return desc.length > 120 ? `${desc.slice(0, 120)}…` : desc
  if (typeof category === 'string' && category) return category
  return 'Sin descripción'
}

/** @type {object[]} */
let transactions = []

const recomputeConcept = (row) =>
  buildConcept({
    description: row.description,
    category: row.category,
    type: row.type,
  })

export const transactionsService = {
  list() {
    return [...transactions]
  },

  getById(id) {
    return transactions.find((t) => t.id === id) ?? null
  },

  create(payload) {
    const row = {
      id: randomUUID(),
      concept: payload.concept,
      amount: payload.amount,
      date: payload.date,
      type: payload.type,
    }
    if (payload.description !== undefined && payload.description !== null) {
      row.description = payload.description
    }
    if (payload.category != null && payload.category !== '') {
      row.category = payload.category
    }
    transactions.unshift(row)
    return row
  },

  update(id, patch) {
    const index = transactions.findIndex((t) => t.id === id)
    if (index === -1) return null
    const prev = { ...transactions[index] }
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined || value === null) {
        delete prev[key]
      } else {
        prev[key] = value
      }
    }
    prev.concept = recomputeConcept(prev)
    transactions[index] = prev
    return prev
  },

  delete(id) {
    const index = transactions.findIndex((t) => t.id === id)
    if (index === -1) return false
    transactions.splice(index, 1)
    return true
  },

  /** Solo tests / reinicio manual si se necesita */
  _clear() {
    transactions = []
  },
}
