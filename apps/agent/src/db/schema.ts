import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * Sessions table - stores agent conversation sessions
 * Each session represents a unique conversation with the agent
 */
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  title: text('title').notNull().default('New Session'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  metadata: text('metadata', { mode: 'json' }).$type<Record<string, unknown>>(),
})

/**
 * Messages table - stores all messages in conversations
 * Includes user queries, agent responses, and system messages
 */
export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  sessionId: text('session_id')
    .notNull()
    .references(() => sessions.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['user', 'assistant', 'system'] }).notNull(),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  metadata: text('metadata', { mode: 'json' }).$type<Record<string, unknown>>(),
})

/**
 * Agent state table - stores persistent agent state and configuration
 * Used for maintaining agent context across sessions
 */
export const agentState = sqliteTable('agent_state', {
  id: text('id').primaryKey(),
  sessionId: text('session_id')
    .notNull()
    .references(() => sessions.id, { onDelete: 'cascade' }),
  key: text('key').notNull(),
  value: text('value', { mode: 'json' }).$type<unknown>(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

/**
 * Tool usage table - tracks all tool invocations by the agent
 * Useful for analytics, debugging, and usage monitoring
 */
export const toolUsage = sqliteTable('tool_usage', {
  id: text('id').primaryKey(),
  sessionId: text('session_id')
    .notNull()
    .references(() => sessions.id, { onDelete: 'cascade' }),
  messageId: text('message_id')
    .notNull()
    .references(() => messages.id, { onDelete: 'cascade' }),
  toolName: text('tool_name').notNull(),
  toolInput: text('tool_input', { mode: 'json' }).$type<Record<string, unknown>>(),
  toolOutput: text('tool_output', { mode: 'json' }).$type<unknown>(),
  success: integer('success', { mode: 'boolean' }).notNull().default(true),
  error: text('error'),
  executionTimeMs: integer('execution_time_ms'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

/**
 * Transaction history table - stores blockchain transaction records
 * Tracks all transactions initiated by the agent
 */
export const transactionHistory = sqliteTable('transaction_history', {
  id: text('id').primaryKey(),
  sessionId: text('session_id')
    .notNull()
    .references(() => sessions.id, { onDelete: 'cascade' }),
  messageId: text('message_id')
    .notNull()
    .references(() => messages.id, { onDelete: 'cascade' }),
  network: text('network').notNull(),
  txHash: text('tx_hash').notNull(),
  from: text('from').notNull(),
  to: text('to'),
  value: text('value'),
  status: text('status', { enum: ['pending', 'success', 'failed'] }).notNull(),
  gasUsed: text('gas_used'),
  blockNumber: text('block_number'),
  metadata: text('metadata', { mode: 'json' }).$type<Record<string, unknown>>(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

// Type exports for TypeScript
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert
export type AgentState = typeof agentState.$inferSelect
export type NewAgentState = typeof agentState.$inferInsert
export type ToolUsage = typeof toolUsage.$inferSelect
export type NewToolUsage = typeof toolUsage.$inferInsert
export type TransactionHistory = typeof transactionHistory.$inferSelect
export type NewTransactionHistory = typeof transactionHistory.$inferInsert
