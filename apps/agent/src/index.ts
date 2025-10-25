import * as dotenv from 'dotenv'
import { startServer } from './server'

dotenv.config()

/**
 * Main entry point for the Hpulse multi-agent system.
 *
 * Starts an Express HTTP server with:
 * - Database persistence using Drizzle ORM and SQLite
 * - RESTful API for chat, sessions, and analytics
 * - Multi-agent coordinator with specialized sub-agents:
 *   - Transaction Agent: Basic blockchain transactions and token operations
 *   - DeFi Agent: DeFi protocol interactions and yield optimization
 *   - Data Intelligence Agent: On-chain data analysis and market insights
 *   - Governance Agent: DAO participation and voting
 *   - Security Agent: Security verification and risk assessment
 *
 * The coordinator intelligently routes requests to appropriate sub-agents
 * and ensures security oversight for all operations.
 *
 * To run the server:
 * - Development: `pnpm dev`
 * - Production: `pnpm build && pnpm start`
 * - With ADK CLI: `adk serve` (from agent directory)
 */
async function main() {
  try {
    await startServer()
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

main()
