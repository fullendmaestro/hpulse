import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HpulseAgentAPI } from '@/api/agent-api'

const agentApi = new HpulseAgentAPI('http://localhost:3000')

export interface SessionData {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messageCount?: number
  lastMessage?: {
    content: string
    createdAt: Date
  }
}

export function useSessions() {
  const queryClient = useQueryClient()

  // Fetch all sessions
  const {
    data: sessions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['sessions'],
    queryFn: async (): Promise<SessionData[]> => {
      const response = await agentApi.listSessions(1, 100)
      return response.sessions.map((s) => ({
        id: s.session.id,
        title: s.session.title,
        createdAt: new Date(s.session.createdAt),
        updatedAt: new Date(s.session.updatedAt),
        messageCount: s.messageCount,
        lastMessage: s.lastMessage
          ? {
              content: s.lastMessage.content,
              createdAt: new Date(s.lastMessage.createdAt),
            }
          : undefined,
      }))
    },
    staleTime: 10000,
  })

  // Create a new session
  const createSessionMutation = useMutation({
    mutationFn: async (title?: string) => {
      const response = await agentApi.createSession({ title })
      return {
        id: response.session.id,
        title: response.session.title,
        createdAt: new Date(response.session.createdAt),
        updatedAt: new Date(response.session.updatedAt),
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })

  // Update a session
  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const response = await agentApi.updateSession(id, { title })
      return {
        id: response.session.id,
        title: response.session.title,
        createdAt: new Date(response.session.createdAt),
        updatedAt: new Date(response.session.updatedAt),
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })

  // Delete a session
  const deleteSessionMutation = useMutation({
    mutationFn: async (id: string) => {
      await agentApi.deleteSession(id)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
  })

  return {
    sessions,
    isLoading,
    error,
    refetch,
    createSession: createSessionMutation.mutate,
    updateSession: updateSessionMutation.mutate,
    deleteSession: deleteSessionMutation.mutate,
    isCreating: createSessionMutation.isPending,
    isUpdating: updateSessionMutation.isPending,
    isDeleting: deleteSessionMutation.isPending,
  }
}
