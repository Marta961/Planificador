import { HttpError } from '../utils/httpError.js'
import { transactionsService } from '../services/transactionsService.js'
import { assertValidCreateBody, assertValidPatchBody } from '../validators/transactionValidator.js'

export const transactionsController = {
  async list(_req, res) {
    const data = transactionsService.list()
    res.status(200).json({ data })
  },

  async getById(req, res) {
    const row = transactionsService.getById(req.params.id)
    if (!row) {
      throw new HttpError(404, 'Transacción no encontrada.', 'NOT_FOUND')
    }
    res.status(200).json({ data: row })
  },

  async create(req, res) {
    const payload = assertValidCreateBody(req.body)
    const created = transactionsService.create(payload)
    res.status(201).json({ data: created })
  },

  async update(req, res) {
    const existing = transactionsService.getById(req.params.id)
    if (!existing) {
      throw new HttpError(404, 'Transacción no encontrada.', 'NOT_FOUND')
    }
    const patch = assertValidPatchBody(req.body, existing)
    const updated = transactionsService.update(req.params.id, patch)
    if (!updated) {
      throw new HttpError(404, 'Transacción no encontrada.', 'NOT_FOUND')
    }
    res.status(200).json({ data: updated })
  },

  async remove(req, res) {
    const ok = transactionsService.delete(req.params.id)
    if (!ok) {
      throw new HttpError(404, 'Transacción no encontrada.', 'NOT_FOUND')
    }
    res.status(200).json({
      data: {
        deleted: true,
        id: req.params.id,
      },
    })
  },
}
