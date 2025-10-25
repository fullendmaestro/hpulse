import { formatDistanceToNow } from 'date-fns'
import { History, Plus, Trash2, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSessions, type SessionData } from '@/hooks/use-sessions-new'
import BottomModal from '@/components/buttom-modal'

interface ChatHistoryModalProps {
  isVisible: boolean
  onClose: () => void
  currentSessionId?: string | null
  onSessionSelect: (sessionId: string) => void
  onNewSession: () => void
}

export function ChatHistoryModal({
  isVisible,
  onClose,
  currentSessionId,
  onSessionSelect,
  onNewSession,
}: ChatHistoryModalProps) {
  const { sessions, isLoading, deleteSession, isDeleting } = useSessions()

  const handleSelectSession = (sessionId: string) => {
    onSessionSelect(sessionId)
    onClose()
  }

  const handleNewSession = () => {
    onNewSession()
    onClose()
  }

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this chat?')) {
      deleteSession(sessionId)
    }
  }

  return (
    <BottomModal
      isOpen={isVisible}
      onClose={onClose}
      fullScreen
      title="Chat History"
      className="h-full"
    >
      <>
        {/* New Chat Button */}
        <Button
          onClick={handleNewSession}
          className="w-full flex items-center gap-2 justify-center mb-4"
          variant="default"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>

        {/* Sessions List */}
        <ScrollArea className="h-[calc(100vh-200px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <History className="w-12 h-12 mb-3 opacity-50" />
              <p>No chat history yet</p>
              <p className="text-sm">Start a new conversation to begin</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session: SessionData) => (
                <div
                  key={session.id}
                  className={`
                    group relative p-4 rounded-xl cursor-pointer
                    transition-all duration-200
                    ${
                      currentSessionId === session.id
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-secondary-100 hover:bg-secondary-200'
                    }
                  `}
                  onClick={() => handleSelectSession(session.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">{session.title}</h3>
                      {session.lastMessage && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {session.lastMessage.content}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>
                          {formatDistanceToNow(new Date(session.updatedAt), {
                            addSuffix: true,
                          })}
                        </span>
                        {session.messageCount !== undefined && (
                          <>
                            <span>•</span>
                            <span>{session.messageCount} messages</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-secondary-200 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={(e) => handleDeleteSession(e as any, session.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {currentSessionId === session.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </>
    </BottomModal>
  )
}
