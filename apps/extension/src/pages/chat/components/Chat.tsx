import ChatInput, { type ChatFormData } from './MultiModalInput'
import ChatMessages from './Messages'
import TypingIndicator from './TypingIndicator'
import type { Message } from '@/types'

interface ChatProps {
  messages: Message[]
  onSendMessage: (message: string, attachments?: File[]) => void
  isSendingMessage?: boolean
}

const Chat = ({ messages, onSendMessage, isSendingMessage = false }: ChatProps) => {
  const onSubmit = ({ prompt, attachments }: ChatFormData) => {
    onSendMessage(prompt, attachments)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col gap-3 px-4 py-2 overflow-y-auto">
        <ChatMessages messages={messages} />
        {isSendingMessage && <TypingIndicator />}
      </div>
      <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-border">
        <ChatInput onSubmit={onSubmit} disabled={isSendingMessage} />
      </div>
    </div>
  )
}

export default Chat
