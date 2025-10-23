export interface Message {
  id: number
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  author?: string // originating agent or 'user'
}
