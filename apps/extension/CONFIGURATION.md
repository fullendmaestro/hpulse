# Environment Configuration

## Agent Server URL

The extension is configured to connect to the local agent server at:

```
http://localhost:3000
```

This is hardcoded in `src/api/agent-api.ts`.

## Changing the Server URL

To connect to a different server, update the default baseUrl in the HpulseAgentAPI constructor:

```typescript
// src/api/agent-api.ts
const agentApi = new HpulseAgentAPI('http://localhost:3000')
```

Or modify the HpulseAgentAPI class to accept the URL from environment variables:

```typescript
const agentApi = new HpulseAgentAPI(import.meta.env.VITE_AGENT_API_URL || 'http://localhost:3000')
```

Then add to your `.env.local`:

```
VITE_AGENT_API_URL=http://localhost:3000
```

## CORS Configuration

Make sure the agent server has CORS enabled for the extension origin. The server is already configured with:

```typescript
// apps/agent/src/server/index.ts
const corsOrigin = env.CORS_ORIGIN || 'chrome-extension://*'
```

For development, you may need to allow `http://localhost:*` as well.
