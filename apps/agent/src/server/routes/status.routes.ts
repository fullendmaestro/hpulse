import { Router, type Request, type Response } from 'express'
import { getAgentService } from '../services/agent.service'
import { SessionService, MessageService } from '../services/database.service'
import type { AgentStatusResponse } from '../../types/api'

const router: Router = Router()
const sessionService = new SessionService()
const messageService = new MessageService()

const startTime = Date.now()

/**
 * GET /api/status
 * Get agent status and health information
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const agentService = getAgentService()
    const agentStatus = agentService.getStatus()

    const sessionCount = await sessionService.getSessionCount()
    const messageCount = await messageService.getMessageCount()

    const response: AgentStatusResponse = {
      status: agentStatus.initialized ? 'ready' : 'error',
      version: '1.0.0',
      uptime: Math.floor((Date.now() - startTime) / 1000),
      currentSessions: sessionCount,
      totalMessages: messageCount,
      toolsAvailable: agentService.getAvailableTools(),
      supportedNetworks: agentService.getSupportedNetworks(),
    }

    res.json(response)
  } catch (error) {
    console.error('❌ Status error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to fetch status',
      statusCode: 500,
    })
  }
})

/**
 * GET /api/status/health
 * Simple health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

export default router
