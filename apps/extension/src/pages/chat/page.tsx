import { useAgents } from '@/hooks/use-agent'
import Chat from './components/Chat'

export default function ChatPage() {
  const { messages, error, sendMessage, isSendingMessage } = useAgents(currentSessionId)

  return <Chat />
}
