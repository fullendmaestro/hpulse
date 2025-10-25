import { useEffect, useRef, useCallback } from 'react'
import { useAgents } from '@/hooks/use-agent'
import { useSessions } from '@/hooks/use-sessions-new'
import { useApp } from '@/store/hooks'
import { useAppDispatch } from '@/store/hooks'
import { setCurrentSessionId } from '@/store/slices/appSlice'
import Chat from './components/Chat'
import { GeneralHeader } from '@/header'

export default function ChatPage() {
  const dispatch = useAppDispatch()
  const { currentSessionId } = useApp()
  const prevSessionRef = useRef<string | null>(null)

  const { messages, sendMessage, isSendingMessage, refetchMessages } = useAgents(currentSessionId)
  const { sessions, createSession, isCreating } = useSessions()

  // Initialize: Auto-select first session or create new one
  useEffect(() => {
    if (!currentSessionId && sessions.length > 0 && !isCreating) {
      // Select the most recent session
      const mostRecentSession = sessions[0]
      console.log('Auto-selecting most recent session:', mostRecentSession.id)
      dispatch(setCurrentSessionId(mostRecentSession.id))
    } else if (!currentSessionId && sessions.length === 0 && !isCreating) {
      // Create first session
      console.log('Creating first session')
      createSession(undefined, {
        onSuccess: (newSession) => {
          dispatch(setCurrentSessionId(newSession.id))
        },
      })
    }
  }, [currentSessionId, sessions, isCreating, dispatch, createSession])

  // Refetch messages when session changes
  useEffect(() => {
    if (currentSessionId && currentSessionId !== prevSessionRef.current) {
      prevSessionRef.current = currentSessionId
      refetchMessages()
    }
  }, [currentSessionId, refetchMessages])

  const handleNewSession = useCallback(() => {
    createSession(undefined, {
      onSuccess: (newSession) => {
        dispatch(setCurrentSessionId(newSession.id))
      },
    })
  }, [createSession, dispatch])

  const handleSessionSelect = useCallback(
    (sessionId: string) => {
      dispatch(setCurrentSessionId(sessionId))
    },
    [dispatch]
  )

  return (
    <div id="popup-layout" className="flex flex-col h-full w-full bg-secondary">
      <div className="flex-shrink-0">
        <GeneralHeader
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewSession={handleNewSession}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <Chat messages={messages} onSendMessage={sendMessage} isSendingMessage={isSendingMessage} />
      </div>
    </div>
  )
}
