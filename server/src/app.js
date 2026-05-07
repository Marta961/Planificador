import cors from 'cors'
import express from 'express'
import { financeRoutes } from './routes/financeRoutes.js'
import { transactionsRoutes } from './routes/transactionsRoutes.js'
import { notFoundHandler, errorHandler } from './middleware/apiErrorHandlers.js'

export const app = express()

app.use(cors({ origin: true }))
app.use(express.json())

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({ data: { status: 'ok' } })
})

app.use('/api/v1/finance', financeRoutes)
app.use('/api/v1/transactions', transactionsRoutes)

app.use(notFoundHandler)
app.use(errorHandler)
