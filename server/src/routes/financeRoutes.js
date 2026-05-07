import { Router } from 'express'
import { financeController } from '../controllers/financeController.js'

export const financeRoutes = Router()

financeRoutes.get('/sample', financeController.getSample)
financeRoutes.post('/sample/generate', financeController.generateSample)
