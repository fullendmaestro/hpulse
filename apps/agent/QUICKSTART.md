# Quick Start Guide - Hpulse Agent Server

## Prerequisites

- Node.js 18+
- pnpm (or npm)
- Google API Key ([Get one here](https://aistudio.google.com/api-keys))

## Setup (5 minutes)

### 1. Install Dependencies

```bash
cd apps/agent
pnpm install
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Google API key
# Required:
GOOGLE_API_KEY=your_api_key_here

# Optional (use defaults):
PORT=3000
HOST=localhost
DATABASE_PATH=./data/hpulse.db
```

### 3. Start the Server

```bash
# Development mode (auto-reload)
pnpm dev

# Or production mode
pnpm build
pnpm start
```

The server will start at `http://localhost:3000` 🚀

## Test It Out

### 1. Health Check

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2024-10-24T..."
}
```

### 2. Send Your First Message

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello! What can you help me with?"
  }'
```

Response:

```json
{
  "sessionId": "uuid-here",
  "messageId": "uuid-here",
  "response": "Hello! I'm Hpulse, an autonomous EVM AI Agent...",
  "toolsUsed": []
}
```

### 3. Ask About Blockchain

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the ETH balance of vitalik.eth on Sepolia?"
  }'
```

### 4. View Your Sessions

```bash
curl http://localhost:3000/api/sessions
```

### 5. Check Agent Status

```bash
curl http://localhost:3000/api/status
```

## Using with Chrome Extension

1. Start the agent server: `pnpm dev`
2. Open the Hpulse Chrome extension
3. Configure API URL: `http://localhost:3000`
4. Start chatting!

## Database Management

### View Database Contents

```bash
pnpm db:studio
```

Opens Drizzle Studio at `https://local.drizzle.studio`

### Reset Database

```bash
rm -rf data/
pnpm dev  # Recreates database automatically
```

## Common Commands

```bash
# Development
pnpm dev              # Start with auto-reload

# Production
pnpm build            # Build TypeScript
pnpm start            # Start server

# Database
pnpm db:push          # Push schema changes
pnpm db:generate      # Generate migrations
pnpm db:studio        # Open database UI

# Maintenance
pnpm clean            # Clean build artifacts
```

## API Endpoints

| Endpoint                        | Method | Description    |
| ------------------------------- | ------ | -------------- |
| `/health`                       | GET    | Health check   |
| `/api/status`                   | GET    | Agent status   |
| `/api/chat`                     | POST   | Send message   |
| `/api/chat/:sessionId/messages` | GET    | Get messages   |
| `/api/sessions`                 | GET    | List sessions  |
| `/api/sessions`                 | POST   | Create session |
| `/api/sessions/:id`             | GET    | Get session    |
| `/api/sessions/:id`             | PATCH  | Update session |
| `/api/sessions/:id`             | DELETE | Delete session |
| `/api/analytics/tools`          | GET    | Tool usage     |
| `/api/analytics/transactions`   | GET    | Transactions   |

## Environment Variables

| Variable             | Default          | Description                   |
| -------------------- | ---------------- | ----------------------------- |
| `GOOGLE_API_KEY`     | -                | **Required** - Google API key |
| `PORT`               | 3000             | Server port                   |
| `HOST`               | localhost        | Server host                   |
| `DATABASE_PATH`      | ./data/hpulse.db | SQLite database path          |
| `CORS_ORIGIN`        | \*               | CORS origin                   |
| `LLM_MODEL`          | gemini-2.5-flash | LLM model                     |
| `DEFAULT_NETWORK`    | sepolia          | Default EVM network           |
| `WALLET_PRIVATE_KEY` | -                | Optional - For transactions   |

## Troubleshooting

### Port Already in Use

```bash
# Change port in .env
PORT=3001
```

### Agent Not Starting

- Check your `GOOGLE_API_KEY` is valid
- Ensure internet connection is active
- Check firewall settings

### Database Issues

```bash
# Reset everything
rm -rf data/
rm -rf node_modules
pnpm install
pnpm dev
```

## Next Steps

- Read the [full README](./README.md) for detailed API documentation
- Check [MIGRATION.md](./MIGRATION.md) for architecture details
- Explore the [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview) to view your data

## Need Help?

- Check existing sessions: `curl http://localhost:3000/api/sessions`
- View logs in the terminal where the server is running
- Inspect database with: `pnpm db:studio`

Enjoy using Hpulse! 🎉
