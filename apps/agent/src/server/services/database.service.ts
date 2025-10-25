import { eq, desc, and } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { getDatabase } from '../../db'
import { sessions, messages, agentState, toolUsage, transactionHistory } from '../../db/schema'
import type {
  NewSession,
  NewMessage,
  NewAgentState,
  NewToolUsage,
  NewTransactionHistory,
} from '../../db/schema'

/**
 * Database service for managing sessions
 */
export class SessionService {
  private db = getDatabase()

  async createSession(data: Partial<NewSession> = {}) {
    const id = uuidv4()
    const newSession: NewSession = {
      id,
      title: data.title || 'New Session',
      metadata: data.metadata || {},
    }

    await this.db.insert(sessions).values(newSession)
    return this.getSessionById(id)
  }

  async getSessionById(id: string) {
    const result = await this.db.select().from(sessions).where(eq(sessions.id, id)).limit(1)
    return result[0] || null
  }

  async getAllSessions(limit = 50, offset = 0) {
    return this.db
      .select()
      .from(sessions)
      .orderBy(desc(sessions.updatedAt))
      .limit(limit)
      .offset(offset)
  }

  async updateSession(id: string, data: Partial<NewSession>) {
    await this.db
      .update(sessions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(sessions.id, id))
    return this.getSessionById(id)
  }

  async deleteSession(id: string) {
    await this.db.delete(sessions).where(eq(sessions.id, id))
  }

  async getSessionCount() {
    const result = await this.db.select().from(sessions)
    return result.length
  }
}

/**
 * Database service for managing messages
 */
export class MessageService {
  private db = getDatabase()

  async createMessage(data: Omit<NewMessage, 'id'>) {
    const id = uuidv4()
    const newMessage: NewMessage = {
      ...data,
      id,
    }

    await this.db.insert(messages).values(newMessage)
    return this.getMessageById(id)
  }

  async getMessageById(id: string) {
    const result = await this.db.select().from(messages).where(eq(messages.id, id)).limit(1)
    return result[0] || null
  }

  async getMessagesBySessionId(sessionId: string, limit = 100, offset = 0) {
    return this.db
      .select()
      .from(messages)
      .where(eq(messages.sessionId, sessionId))
      .orderBy(messages.createdAt)
      .limit(limit)
      .offset(offset)
  }

  async getMessageCount() {
    const result = await this.db.select().from(messages)
    return result.length
  }

  async getLastMessageForSession(sessionId: string) {
    const result = await this.db
      .select()
      .from(messages)
      .where(eq(messages.sessionId, sessionId))
      .orderBy(desc(messages.createdAt))
      .limit(1)
    return result[0] || null
  }
}

/**
 * Database service for managing agent state
 */
export class AgentStateService {
  private db = getDatabase()

  async setState(sessionId: string, key: string, value: unknown) {
    const id = uuidv4()
    const state: NewAgentState = {
      id,
      sessionId,
      key,
      value,
    }

    // Upsert: delete existing and insert new
    await this.db
      .delete(agentState)
      .where(and(eq(agentState.sessionId, sessionId), eq(agentState.key, key)))
    await this.db.insert(agentState).values(state)
    return this.getState(sessionId, key)
  }

  async getState(sessionId: string, key: string) {
    const result = await this.db
      .select()
      .from(agentState)
      .where(and(eq(agentState.sessionId, sessionId), eq(agentState.key, key)))
      .limit(1)
    return result[0] || null
  }

  async getAllStateForSession(sessionId: string) {
    return this.db.select().from(agentState).where(eq(agentState.sessionId, sessionId))
  }

  async deleteState(sessionId: string, key: string) {
    await this.db
      .delete(agentState)
      .where(and(eq(agentState.sessionId, sessionId), eq(agentState.key, key)))
  }
}

/**
 * Database service for managing tool usage tracking
 */
export class ToolUsageService {
  private db = getDatabase()

  async recordToolUsage(data: Omit<NewToolUsage, 'id'>) {
    const id = uuidv4()
    const toolUsageRecord: NewToolUsage = {
      id,
      ...data,
    }

    await this.db.insert(toolUsage).values(toolUsageRecord)
    return this.getToolUsageById(id)
  }

  async getToolUsageById(id: string) {
    const result = await this.db.select().from(toolUsage).where(eq(toolUsage.id, id)).limit(1)
    return result[0] || null
  }

  async getToolUsageBySessionId(sessionId: string, limit = 100, offset = 0) {
    return this.db
      .select()
      .from(toolUsage)
      .where(eq(toolUsage.sessionId, sessionId))
      .orderBy(desc(toolUsage.createdAt))
      .limit(limit)
      .offset(offset)
  }

  async getToolUsageByMessageId(messageId: string) {
    return this.db.select().from(toolUsage).where(eq(toolUsage.messageId, messageId))
  }
}

/**
 * Database service for managing transaction history
 */
export class TransactionService {
  private db = getDatabase()

  async recordTransaction(data: Omit<NewTransactionHistory, 'id'>) {
    const id = uuidv4()
    const transaction: NewTransactionHistory = {
      id,
      ...data,
    }

    await this.db.insert(transactionHistory).values(transaction)
    return this.getTransactionById(id)
  }

  async getTransactionById(id: string) {
    const result = await this.db
      .select()
      .from(transactionHistory)
      .where(eq(transactionHistory.id, id))
      .limit(1)
    return result[0] || null
  }

  async getTransactionsBySessionId(sessionId: string, limit = 100, offset = 0) {
    return this.db
      .select()
      .from(transactionHistory)
      .where(eq(transactionHistory.sessionId, sessionId))
      .orderBy(desc(transactionHistory.createdAt))
      .limit(limit)
      .offset(offset)
  }

  async updateTransactionStatus(
    txHash: string,
    status: 'pending' | 'success' | 'failed',
    updates: Partial<NewTransactionHistory> = {}
  ) {
    await this.db
      .update(transactionHistory)
      .set({ status, ...updates })
      .where(eq(transactionHistory.txHash, txHash))
  }
}
