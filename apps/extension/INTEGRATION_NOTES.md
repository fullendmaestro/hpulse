# Chrome Extension Integration with New Agent Server

## Overview

Updated the Hpulse Chrome extension to work with the new Express-based agent server with database persistence.

## Key Changes

### 1. New API Client (`src/api/agent-api.ts`)

- Created `HpulseAgentAPI` class to interact with the Express server
- Endpoints:
  - `/health` - Health check
  - `/api/status` - Agent status
  - `/api/chat` - Send messages
  - `/api/chat/:sessionId/messages` - Get messages
  - `/api/sessions` - List/create/update/delete sessions
- TypeScript interfaces for all request/response types

### 2. Updated Hooks

#### `use-agent.ts`

- Removed multi-agent support (single agent now)
- Removed ADK CLI API dependency
- Uses `HpulseAgentAPI` for messages and chat
- Queries `/api/chat` endpoint instead of events endpoint
- Auto-polls messages every 2 seconds
- Maintains backward compatibility with Chat component signature

#### `use-sessions-new.ts` (new file)

- Complete session management using REST API
- CRUD operations: create, list, update, delete
- Returns `SessionData` with message count and last message
- Replaces old ADK sessions API

### 3. Chat History Modal (`components/ChatHistoryModal.tsx`)

- Bottom sheet modal showing all chat sessions
- Session list with:
  - Title and last message preview
  - Relative time display (e.g., "2 hours ago")
  - Message count
  - Current session indicator (blue bar)
  - Delete action
- "New Chat" button to create sessions
- Uses shadcn/ui Sheet component
- Integrates with header via History icon

### 4. Updated Header (`header.tsx`)

- Replaced Plus icon with ChatHistoryModal component on chat page
- Accepts props for session management:
  - `currentSessionId` - Active session ID
  - `onSessionSelect` - Callback when user selects a session
  - `onNewSession` - Callback to create new session
- Conditional rendering based on page location

### 5. Updated Chat Page (`pages/chat/page.tsx`)

- Now renders its own header with session management
- Auto-creates first session if none exist
- Auto-selects most recent session on load
- Handles session switching with refetch
- Passes session handlers to header

### 6. Updated Routes (`Routes.tsx`)

- Chat page renders outside GlobalLayout
- Chat page has its own header with session controls
- Other pages continue using GlobalLayout with standard header

## Breaking Changes

- Removed multi-agent support
- Removed file attachment support (marked as TODO)
- Changed from ADK CLI events API to REST chat API
- Sessions are now managed server-side with database

## Backward Compatibility

- Chat component interface unchanged
- Message type format preserved
- Redux store structure for `currentSessionId` maintained
- UI components use existing design system

## Dependencies

- All required UI components already installed:
  - `@radix-ui/react-dialog` (Sheet)
  - `@radix-ui/react-scroll-area` (ScrollArea)
  - `@radix-ui/react-dropdown-menu` (DropdownMenu)
  - `lucide-react` (Icons)
  - `date-fns` (Time formatting)

## Testing Checklist

- [ ] Extension builds successfully
- [ ] Agent server is running on http://localhost:3000
- [ ] Chat page loads and creates first session
- [ ] Can send messages and receive responses
- [ ] Messages persist and load on refresh
- [ ] Chat history modal opens from header
- [ ] Can switch between sessions
- [ ] Can create new sessions
- [ ] Can delete sessions
- [ ] Session titles and timestamps display correctly
- [ ] Current session is highlighted in history

## Future Enhancements

- [ ] Add file attachment support to agent server
- [ ] Add session title editing
- [ ] Add session search/filter
- [ ] Add export chat functionality
- [ ] Add keyboard shortcuts
- [ ] Add loading states for all operations
- [ ] Add error boundaries
- [ ] Add analytics integration
