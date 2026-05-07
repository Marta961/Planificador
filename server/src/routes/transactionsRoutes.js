import { Router } from 'express'
import { transactionsController } from '../controllers/transactionsController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const transactionsRoutes = Router()

transactionsRoutes.get('/', asyncHandler(transactionsController.list))
transactionsRoutes.get('/:id', asyncHandler(transactionsController.getById))
transactionsRoutes.post('/', asyncHandler(transactionsController.create))
transactionsRoutes.patch('/:id', asyncHandler(transactionsController.update))
transactionsRoutes.delete('/:id', asyncHandler(transactionsController.remove))
