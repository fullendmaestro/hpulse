import axios from 'axios'
import { useRef, useState } from 'react'
import ChatInput, { type ChatFormData } from './MultiModalInput'
import type { Message } from './Messages'
import ChatMessages from './Messages'
import TypingIndicator from './TypingIndicator'

type ChatResponse = {
  message: string
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isBotTyping, setIsBotTyping] = useState(false)
  const [error, setError] = useState('')
  const conversationId = useRef(crypto.randomUUID())

  const onSubmit = async ({ prompt }: ChatFormData) => {
    try {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }])
      setIsBotTyping(true)
      setError('')

      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt,
        conversationId: conversationId.current,
      })
      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }])
    } catch (error) {
      console.error(error)
      setError('Something went wrong, try again!')
    } finally {
      setIsBotTyping(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col gap-3 px-4 py-2 overflow-y-auto">
        <ChatMessages messages={messages} />
        {isBotTyping && <TypingIndicator />}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-border">
        <ChatInput onSubmit={onSubmit} />
      </div>
    </div>
  )
}

export default Chat
