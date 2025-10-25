import { getCoordinatorAgent } from '../../agents/coordinator/agent'
import { getEvmMcpTools } from '../../shared/tools'
import {
  MessageService,
  SessionService,
  ToolUsageService,
  TransactionService,
} from './database.service'

/**
 * Agent service for managing the Hpulse AI agent
 * Handles agent initialization, message processing, and tool execution
 */
export class AgentService {
  private runner: any | null = null
  private tools: any[] = []
  private toolset: any = null
  private isInitialized = false
  private messageService = new MessageService()
  private sessionService = new SessionService()
  private toolUsageService = new ToolUsageService()
  private transactionService = new TransactionService()

  /**
   * Initialize the agent with EVM tools
   */
  async initialize() {
    if (this.isInitialized) {
      console.log('⚠️  Agent already initialized')
      return
    }

    try {
      console.log('🔧 Initializing EVM MCP tools...')
      const { tools: evmTools, toolset } = await getEvmMcpTools()
      this.tools = evmTools
      this.toolset = toolset
      console.log(`✅ Loaded ${evmTools.length} EVM tools`)

      console.log('🤖 Creating Hpulse Coordinator Agent...')
      const { runner } = await getCoordinatorAgent(evmTools)
      this.runner = runner
      console.log('✅ Coordinator agent ready')

      this.isInitialized = true
    } catch (error) {
      console.error('❌ Failed to initialize agent:', error)
      throw error
    }
  }

  /**
   * Process a user message and get agent response
   */
  async processMessage(sessionId: string, userMessage: string) {
    if (!this.isInitialized || !this.runner) {
      throw new Error('Agent not initialized. Call initialize() first.')
    }

    // Store user message
    const userMsg = await this.messageService.createMessage({
      sessionId,
      role: 'user',
      content: userMessage,
    })

    // Update session timestamp
    await this.sessionService.updateSession(sessionId, {
      updatedAt: new Date(),
    })

    try {
      // Track tool usage
      const toolsUsed: { name: string; success: boolean }[] = []

      // TODO: Add proper tool tracking by wrapping tools or intercepting calls
      // For now, we'll process the message directly

      // Process with agent
      const startTime = Date.now()
      const response = await this.runner.ask(userMessage)
      const executionTime = Date.now() - startTime

      // Store assistant response
      const assistantMsg = await this.messageService.createMessage({
        sessionId,
        role: 'assistant',
        content: response,
        metadata: {
          executionTime,
        },
      })

      return {
        messageId: assistantMsg!.id,
        response,
        toolsUsed,
      }
    } catch (error) {
      console.error('❌ Error processing message:', error)

      // Store error message
      const errorMsg = await this.messageService.createMessage({
        sessionId,
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : String(error)}`,
        metadata: {
          error: true,
        },
      })

      throw error
    }
  }

  /**
   * Get available tools
   */
  getAvailableTools() {
    return this.tools.map((tool) => tool.name || tool.id || 'unknown')
  }

  /**
   * Get agent status
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      toolsCount: this.tools.length,
      hasRunner: this.runner !== null,
    }
  }

  /**
   * Cleanup agent resources
   */
  async cleanup() {
    if (this.toolset) {
      await this.toolset.close()
    }
    this.isInitialized = false
    this.runner = null
    this.tools = []
    this.toolset = null
  }

  /**
   * Get supported networks
   */
  getSupportedNetworks() {
    return [
      'sepolia',
      'polygon-amoy',
      'optimism-sepolia',
      'arbitrum-sepolia',
      'base-sepolia',
      'avalanche-fuji',
      'bsc-testnet',
      'zksync-sepolia',
      'blast-sepolia',
      'celo-alfajores',
      'zora-sepolia',
    ]
  }
}

// Singleton instance
let agentServiceInstance: AgentService | null = null

export function getAgentService() {
  if (!agentServiceInstance) {
    agentServiceInstance = new AgentService()
  }
  return agentServiceInstance
}
