import express, { type Request, type Response, type NextFunction, type Application } from 'express'
import cors from 'cors'
import { initializeDatabase } from '../db'
import { getAgentService } from './services/agent.service'
import { env } from '../env'

// Import routes
import chatRoutes from './routes/chat.routes'
import sessionRoutes from './routes/sessions.routes'
import statusRoutes from './routes/status.routes'
import analyticsRoutes from './routes/analytics.routes'

/**
 * Create and configure Express application
 */
export function createApp(): Application {
  const app = express()

  // Middleware
  app.use(
    cors({
      origin: env.CORS_ORIGIN || '*',
      credentials: true,
    })
  )
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Request logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now()
    res.on('finish', () => {
      const duration = Date.now() - start
      console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`)
    })
    next()
  })

  // Health check endpoint (before other routes)
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
  })

  // API routes
  app.use('/api/chat', chatRoutes)
  app.use('/api/sessions', sessionRoutes)
  app.use('/api/status', statusRoutes)
  app.use('/api/analytics', analyticsRoutes)

  // Root endpoint
  app.get('/', (req: Request, res: Response) => {
    res.json({
      name: 'Hpulse Agent API',
      version: '1.0.0',
      description: 'Multi-agent AI system for EVM blockchain interactions',
      endpoints: {
        health: '/health',
        status: '/api/status',
        chat: '/api/chat',
        sessions: '/api/sessions',
        analytics: '/api/analytics',
      },
    })
  })

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.path} not found`,
      statusCode: 404,
    })
  })

  // Error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('❌ Unhandled error:', err)
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message || 'An unexpected error occurred',
      statusCode: 500,
    })
  })

  return app
}

/**
 * Start the Express server
 */
export async function startServer() {
  try {
    console.log('🚀 Starting Hpulse Agent Server...\n')

    // Initialize database
    console.log('💾 Initializing database...')
    initializeDatabase()
    console.log('✅ Database initialized\n')

    // Initialize agent
    console.log('🤖 Initializing AI agent...')
    const agentService = getAgentService()
    await agentService.initialize()
    console.log('✅ Agent initialized\n')

    // Create and start Express app
    const app = createApp()
    const port = env.PORT || 3000
    const host = env.HOST || 'localhost'

    const server = app.listen(port, host, () => {
      console.log('─'.repeat(60))
      console.log(`✅ Hpulse Agent Server is running!`)
      console.log(`📍 URL: http://${host}:${port}`)
      console.log(`📊 Health: http://${host}:${port}/health`)
      console.log(`📚 API Docs: http://${host}:${port}/`)
      console.log('─'.repeat(60))
      console.log('\nPress Ctrl+C to stop the server\n')
    })

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n\n🛑 Received ${signal}. Shutting down gracefully...`)

      server.close(async () => {
        console.log('✅ HTTP server closed')

        try {
          await agentService.cleanup()
          console.log('✅ Agent cleanup complete')
          process.exit(0)
        } catch (error) {
          console.error('❌ Error during cleanup:', error)
          process.exit(1)
        }
      })

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('❌ Forced shutdown after timeout')
        process.exit(1)
      }, 10000)
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))

    return server
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}
