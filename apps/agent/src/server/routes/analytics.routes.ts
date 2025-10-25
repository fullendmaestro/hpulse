import { Router } from 'express'
import { ToolUsageService, TransactionService } from '../services/database.service'
import type { ToolUsageResponse, TransactionHistoryResponse } from '../../types/api'
import type { ToolUsage, TransactionHistory } from '../../db/schema'

const router: Router = Router()
const toolUsageService = new ToolUsageService()
const transactionService = new TransactionService()

/**
 * GET /api/analytics/tools
 * Get tool usage analytics
 */
router.get('/tools', async (req, res) => {
  try {
    const sessionId = req.query.sessionId as string | undefined
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 50
    const offset = (page - 1) * limit

    let toolUsage: ToolUsage[] = []
    if (sessionId) {
      toolUsage = await toolUsageService.getToolUsageBySessionId(sessionId, limit, offset)
    } else {
      // TODO: Implement global tool usage query
      toolUsage = []
    }

    const response: ToolUsageResponse = {
      toolUsage,
      total: toolUsage.length,
    }

    res.json(response)
  } catch (error) {
    console.error('❌ Tool analytics error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to fetch tool analytics',
      statusCode: 500,
    })
  }
})

/**
 * GET /api/analytics/transactions
 * Get transaction history
 */
router.get('/transactions', async (req, res) => {
  try {
    const sessionId = req.query.sessionId as string | undefined
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 50
    const offset = (page - 1) * limit

    let transactions: TransactionHistory[] = []
    if (sessionId) {
      transactions = await transactionService.getTransactionsBySessionId(sessionId, limit, offset)
    } else {
      transactions = []
    }

    const response: TransactionHistoryResponse = {
      transactions,
      total: transactions.length,
    }

    res.json(response)
  } catch (error) {
    console.error('❌ Transaction analytics error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to fetch transaction history',
      statusCode: 500,
    })
  }
})

export default router
