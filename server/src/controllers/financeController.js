import { sampleDataService } from '../services/sampleDataService.js'

export const financeController = {
  getSample(_req, res) {
    res.status(200).json({ data: sampleDataService.list() })
  },
  generateSample(_req, res) {
    res.status(200).json({ data: sampleDataService.regenerate() })
  },
}
