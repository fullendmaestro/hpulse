import { config } from 'dotenv'
import { z } from 'zod'

config()

/**
 * Environment variable schema definition for the hpulse multi-agent system.
 *
 * Defines and validates required environment variables including:
 * - ADK_DEBUG: Optional debug mode flag (defaults to "false")
 * - GOOGLE_API_KEY: Required API key for Google/Gemini model access
 * - LLM_MODEL: LLM model to use (defaults to "gemini-2.5-flash")
 * - WALLET_PRIVATE_KEY: Private key for blockchain transactions
 * - DEFAULT_NETWORK: Default EVM network to use (defaults to "sepolia")
 * - PORT: HTTP server port (defaults to 3000)
 * - HOST: HTTP server host (defaults to "localhost")
 * - DATABASE_PATH: Path to SQLite database file (defaults to "./data/hpulse.db")
 * - CORS_ORIGIN: CORS origin for API requests (defaults to "*")
 */
export const envSchema = z.object({
  ADK_DEBUG: z.coerce.boolean().default(false),
  GOOGLE_API_KEY: z.string(),
  LLM_MODEL: z.string().default('gemini-2.5-flash'),
  WALLET_PRIVATE_KEY: z.string().optional(),
  DEFAULT_NETWORK: z.string().default('sepolia'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('localhost'),
  DATABASE_PATH: z.string().default('./data/hpulse.db'),
  CORS_ORIGIN: z.string().default('*'),
})

/**
 * Validated environment variables parsed from process.env.
 * Throws an error if required environment variables are missing or invalid.
 */
export const env = envSchema.parse(process.env)
