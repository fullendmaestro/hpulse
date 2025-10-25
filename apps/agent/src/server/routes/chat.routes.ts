import { Router, type Request, type Response } from 'express'
import { SessionService, MessageService } from '../services/database.service'
import { getAgentService } from '../services/agent.service'
import type { ChatRequest, ChatResponse } from '../../types/api'

const router: Router = Router()
const sessionService = new SessionService()
const messageService = new MessageService()

/**
 * POST /api/chat
 * Send a message to the agent and get a response
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId, message, network } = req.body as ChatRequest

    if (!message || typeof message !== 'string') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Message is required and must be a string',
        statusCode: 400,
      })
    }

    // Get or create session
    let session
    if (sessionId) {
      session = await sessionService.getSessionById(sessionId)
      if (!session) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Session not found',
          statusCode: 404,
        })
      }
    } else {
      session = await sessionService.createSession({
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
      })
    }

    // Process message with agent
    const agentService = getAgentService()
    const result = await agentService.processMessage(session!.id, message)

    const response: ChatResponse = {
      sessionId: session!.id,
      messageId: result.messageId,
      response: result.response,
      toolsUsed: result.toolsUsed,
    }

    res.json(response)
  } catch (error) {
    console.error('❌ Chat error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to process message',
      statusCode: 500,
    })
  }
})

/**
 * GET /api/chat/:sessionId/messages
 * Get all messages for a session
 */
router.get('/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 50
    const offset = (page - 1) * limit

    const messages = await messageService.getMessagesBySessionId(sessionId, limit, offset)

    res.json({
      messages,
      total: messages.length,
      page,
      limit,
    })
  } catch (error) {
    console.error('❌ Get messages error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to fetch messages',
      statusCode: 500,
    })
  }
})

export default router
