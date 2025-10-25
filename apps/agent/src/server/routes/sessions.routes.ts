import { Router, type Request, type Response } from 'express'
import { SessionService, MessageService } from '../services/database.service'
import type {
  CreateSessionRequest,
  UpdateSessionRequest,
  SessionResponse,
  SessionListResponse,
} from '../../types/api'

const router: Router = Router()
const sessionService = new SessionService()
const messageService = new MessageService()

/**
 * GET /api/sessions
 * Get all sessions
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 50
    const offset = (page - 1) * limit

    const sessions = await sessionService.getAllSessions(limit, offset)
    const total = await sessionService.getSessionCount()

    // Enrich with message counts and last message
    const enrichedSessions = await Promise.all(
      sessions.map(async (session) => {
        const messages = await messageService.getMessagesBySessionId(session.id, 1)
        const lastMessage = await messageService.getLastMessageForSession(session.id)

        return {
          session,
          messageCount: messages.length,
          lastMessage: lastMessage || undefined,
        }
      })
    )

    const response: SessionListResponse = {
      sessions: enrichedSessions,
      total,
    }

    res.json(response)
  } catch (error) {
    console.error('❌ Get sessions error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to fetch sessions',
      statusCode: 500,
    })
  }
})

/**
 * GET /api/sessions/:id
 * Get a specific session by ID
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const session = await sessionService.getSessionById(id)

    if (!session) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Session not found',
        statusCode: 404,
      })
    }

    const messages = await messageService.getMessagesBySessionId(id)
    const response: SessionResponse = {
      session,
      messageCount: messages.length,
    }

    res.json(response)
  } catch (error) {
    console.error('❌ Get session error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to fetch session',
      statusCode: 500,
    })
  }
})

/**
 * POST /api/sessions
 * Create a new session
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title } = req.body as CreateSessionRequest
    const session = await sessionService.createSession({ title })

    const response: SessionResponse = {
      session: session!,
      messageCount: 0,
    }

    res.status(201).json(response)
  } catch (error) {
    console.error('❌ Create session error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to create session',
      statusCode: 500,
    })
  }
})

/**
 * PATCH /api/sessions/:id
 * Update a session
 */
router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { title } = req.body as UpdateSessionRequest

    const existingSession = await sessionService.getSessionById(id)
    if (!existingSession) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Session not found',
        statusCode: 404,
      })
    }

    const session = await sessionService.updateSession(id, { title })
    const messages = await messageService.getMessagesBySessionId(id)

    const response: SessionResponse = {
      session: session!,
      messageCount: messages.length,
    }

    res.json(response)
  } catch (error) {
    console.error('❌ Update session error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to update session',
      statusCode: 500,
    })
  }
})

/**
 * DELETE /api/sessions/:id
 * Delete a session
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const existingSession = await sessionService.getSessionById(id)
    if (!existingSession) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Session not found',
        statusCode: 404,
      })
    }

    await sessionService.deleteSession(id)
    res.status(204).send()
  } catch (error) {
    console.error('❌ Delete session error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Failed to delete session',
      statusCode: 500,
    })
  }
})

export default router
