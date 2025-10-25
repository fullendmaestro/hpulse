/**
 * API type definitions for the Hpulse agent server
 */

import type { Message, Session, ToolUsage, TransactionHistory } from '../db/schema'

// ===== Request Types =====

export interface ChatRequest {
  sessionId?: string
  message: string
  network?: string
}

export interface CreateSessionRequest {
  title?: string
}

export interface UpdateSessionRequest {
  title?: string
}

// ===== Response Types =====

export interface ChatResponse {
  sessionId: string
  messageId: string
  response: string
  toolsUsed?: {
    name: string
    success: boolean
  }[]
}

export interface SessionResponse {
  session: Session
  messageCount?: number
  lastMessage?: Message
}

export interface SessionListResponse {
  sessions: SessionResponse[]
  total: number
}

export interface MessageListResponse {
  messages: Message[]
  total: number
}

export interface AgentStatusResponse {
  status: 'ready' | 'processing' | 'error'
  version: string
  uptime: number
  currentSessions: number
  totalMessages: number
  toolsAvailable: string[]
  supportedNetworks: string[]
}

export interface ToolUsageResponse {
  toolUsage: ToolUsage[]
  total: number
}

export interface TransactionHistoryResponse {
  transactions: TransactionHistory[]
  total: number
}

// ===== Error Response =====

export interface ErrorResponse {
  error: string
  message: string
  statusCode: number
  details?: unknown
}

// ===== Pagination =====

export interface PaginationParams {
  page?: number
  limit?: number
}

// ===== Agent Event Types =====

export type AgentEvent =
  | { type: 'message'; data: Message }
  | { type: 'tool_start'; data: { toolName: string; input: unknown } }
  | { type: 'tool_end'; data: { toolName: string; output: unknown; success: boolean } }
  | { type: 'error'; data: { error: string; message: string } }
