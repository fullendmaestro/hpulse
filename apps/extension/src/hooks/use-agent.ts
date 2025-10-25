'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { HpulseAgentAPI } from '@/api/agent-api'
import type { Message } from '@/types'

const agentApi = new HpulseAgentAPI('http://localhost:3000')

export function useAgents(currentSessionId?: string | null) {
  const queryClient = useQueryClient()
  const [messages, setMessages] = useState<Message[]>([])

  // Fetch agent status (no need for agent list, single agent)
  const {
    data: agentStatus,
    isLoading: loading,
    error,
    refetch: refreshAgents,
  } = useQuery({
    queryKey: ['agent-status'],
    queryFn: async () => {
      return await agentApi.getStatus()
    },
    staleTime: 30000,
    retry: 2,
  })

  // Fetch messages for current session
  const { data: sessionMessages, refetch: refetchMessages } = useQuery({
    queryKey: ['agent-messages', currentSessionId],
    queryFn: async (): Promise<Message[]> => {
      if (!currentSessionId) {
        return []
      }
      const response = await agentApi.getMessages(currentSessionId, 1, 100)

      // Transform messages to match UI format
      const messages: Message[] = response.messages.map((msg, index) => ({
        id: index + 1, // Convert string ID to sequential number for UI
        type: msg.role,
        content: msg.content,
        timestamp: new Date(msg.createdAt),
        author: msg.role,
      }))

      return messages
    },
    enabled: !!currentSessionId,
    staleTime: 2000,
    refetchInterval: 2000, // Poll every 2 seconds
  })

  // Update local messages state when session messages change
  useMemo(() => {
    if (sessionMessages) {
      setMessages(sessionMessages)
    }
  }, [sessionMessages])

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({
      message,
      attachments,
      network,
    }: {
      message: string
      attachments?: File[]
      network?: string
    }) => {
      const userMessage: Message = {
        id: Date.now(),
        type: 'user',
        content: message,
        timestamp: new Date(),
        author: 'user',
      }
      setMessages((prev) => [...prev, userMessage])

      // TODO: Handle attachments when agent server supports them
      if (attachments && attachments.length > 0) {
        toast.error('File attachments are not yet supported')
      }

      try {
        const response = await agentApi.sendMessage({
          sessionId: currentSessionId || undefined,
          message,
          network,
        })
        return response
      } catch (e: any) {
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id))
        const msg = e?.message || 'Failed to send message'
        toast.error(msg)
        throw new Error(msg)
      }
    },
    onSuccess: (response) => {
      // Refetch messages
      if (response.sessionId) {
        queryClient.invalidateQueries({
          queryKey: ['agent-messages', response.sessionId],
        })
        // Also invalidate sessions list
        queryClient.invalidateQueries({
          queryKey: ['sessions'],
        })
      }
    },
    onError: (error) => {
      console.error(error)
      toast.error('Failed to send message. Please try again.')
    },
  })

  const sendMessage = useCallback(
    (message: string, attachments?: File[]) => {
      sendMessageMutation.mutate({ message, attachments })
    },
    [sendMessageMutation]
  )

  return {
    agentStatus,
    messages,
    connected: true, // Always connected to local server
    loading,
    error,
    sendMessage,
    refreshAgents,
    refetchMessages,
    isSendingMessage: sendMessageMutation.isPending,
  }
}
