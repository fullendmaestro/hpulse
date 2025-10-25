# Hpulse Agent Server# Hpulse Multi-Agent System

A Node.js Express server running the Hpulse multi-agent AI system for EVM blockchain interactions with database persistence.An autonomous EVM AI Agent system built using a **multi-agent architecture** with ADK-ts, where specialized sub-agents collaborate to analyze on-chain data, execute transactions, and optimize interactions across the Ethereum Virtual Machine (EVM) ecosystem.

## Features## Architecture

- **Multi-Agent Architecture**: Coordinator agent with specialized sub-agents for:The system follows a coordinator-based multi-agent architecture where a root coordinator agent orchestrates five specialized sub-agents:
  - Transaction operations (ETH, ERC-20, ERC-721, ERC-1155)

  - DeFi protocol interactions```

  - On-chain data analysis┌─────────────────────────────────────────────────────────────┐

  - DAO governance│ Coordinator Agent │

  - Security verification│ (Routes requests & ensures security oversight) │

└─────────────────┬───────────────────────────────────────────┘

- **Database Persistence**: SQLite database with Drizzle ORM for: │
  - Session management ┌─────────────┼─────────────┬─────────────┬──────────────┐

  - Message history │ │ │ │ │

  - Agent state ▼ ▼ ▼ ▼ ▼

  - Tool usage tracking┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐

  - Transaction history│Transaction│ │ DeFi │ │ Data │ │Governance│ │ Security │

│ Agent │ │ Agent │ │Intel │ │ Agent │ │ Agent │

- **RESTful API**: Complete HTTP API for agent interactions:└─────────┘ └─────────┘ └─────────┘ └─────────┘ └──────────┘
  - Chat endpoints for conversations```

  - Session management

  - Status and health checks## Sub-Agents

  - Analytics and insights

### 1. Transaction Agent

- **Local-First**: Designed to run locally by users with full data ownership

**Purpose:** Handles fundamental blockchain interactions.

## Quick Start

**Capabilities:**

### Prerequisites

- Native token transfers (ETH, MATIC, etc.)

- Node.js 18+ - ERC-20 token operations (transfer, approve, balance checks)

- pnpm (recommended) or npm- ERC-721 NFT operations (transfer, ownership verification)

- ERC-1155 multi-token operations

### Installation- Transaction monitoring and status checks

````bash### 2. DeFi Agent

# Install dependencies

pnpm install**Purpose:** Specializes in DeFi protocol interactions.



# Copy environment variables**Capabilities:**

cp .env.example .env

- Yield farming optimization

# Edit .env and add your GOOGLE_API_KEY- Lending and borrowing (Aave, Compound)

```- Liquidity provision (Uniswap, Curve, Balancer)

- Token swaps and route optimization

### Environment Variables- Position management and rebalancing

- Risk assessment for DeFi operations

```bash

# Required### 3. Data Intelligence Agent

GOOGLE_API_KEY=your_api_key_here

**Purpose:** Analyzes on-chain and off-chain data.

# Optional - Server Configuration

PORT=3000                      # HTTP server port**Capabilities:**

HOST=localhost                 # HTTP server host

DATABASE_PATH=./data/hpulse.db # Database location- On-chain data monitoring and analysis

CORS_ORIGIN=*                  # CORS configuration- Token price tracking and market trends

- Liquidity flow analysis

# Optional - Agent Configuration- User behavior pattern recognition

LLM_MODEL=gemini-2.5-flash     # LLM model- Transaction pattern analysis

DEFAULT_NETWORK=sepolia        # Default blockchain network- Strategic insights and recommendations

WALLET_PRIVATE_KEY=            # For blockchain transactions (optional)

ADK_DEBUG=false                # Enable debug logs### 4. Governance Agent

````

**Purpose:** Handles decentralized governance participation.

### Running the Server

**Capabilities:**

#### Development Mode

- Governance proposal analysis

````bash- Voting on DAO proposals

pnpm dev- Delegation management

```- Voting power tracking

- Proposal outcome monitoring

#### Production Mode- Governance strategy recommendations



```bash### 5. Security & Compliance Agent

# Build TypeScript

pnpm build**Purpose:** Ensures safe and compliant execution.



# Start server**Capabilities:**

pnpm start

```- Smart contract verification

- Malicious address detection

#### Using ADK CLI- Transaction risk assessment

- Compliance policy enforcement

```bash- Security monitoring and alerts

# From the agent directory- Authorization management

adk serve

```## Project Structure



The server will start on `http://localhost:3000` by default.```

apps/agent/

## Database Management├── .env                        # Environment configuration

├── .env.example               # Example environment variables

### Generate Migrations├── package.json               # Dependencies and scripts

├── tsconfig.json             # TypeScript configuration

```bash└── src/

pnpm db:generate    ├── index.ts              # Main entry point

```    ├── env.ts                # Environment validation

    ├── agents/

### Apply Migrations    │   ├── coordinator/

    │   │   └── agent.ts      # Coordinator agent

```bash    │   ├── transaction-agent/

pnpm db:migrate    │   │   └── agent.ts      # Transaction agent

```    │   ├── defi-agent/

    │   │   └── agent.ts      # DeFi agent

### Push Schema (Development)    │   ├── data-intelligence-agent/

    │   │   └── agent.ts      # Data intelligence agent

```bash    │   ├── governance-agent/

pnpm db:push    │   │   └── agent.ts      # Governance agent

```    │   └── security-agent/

    │       └── agent.ts      # Security agent

### Database Studio    └── shared/

        └── tools/

```bash            ├── index.ts       # Tool exports

pnpm db:studio            └── evmMcpToolset.ts  # EVM MCP toolset configuration

````

Opens Drizzle Studio to browse and manage your database at `https://local.drizzle.studio`.## Setup

## API Documentation### Prerequisites

### Base URL- Node.js 18+ or Bun

- Google API key for Gemini LLM

````- (Optional) Private key for blockchain write operations

http://localhost:3000

```### Installation



### Endpoints```bash

# From the monorepo root

#### Health Checkpnpm install



```http# Or from the agent directory

GET /healthcd apps/agent

```pnpm install

````

Response:

````json### Configuration

{

  "status": "ok",Copy `.env.example` to `.env` and configure:

  "timestamp": "2024-01-01T00:00:00.000Z"

}```bash

```# LLM Configuration

GOOGLE_API_KEY=your_api_key_here

#### Agent StatusLLM_MODEL=gemini-2.5-flash

ADK_DEBUG=false

```http

GET /api/status# Blockchain Configuration (optional)

```WALLET_PRIVATE_KEY=your_private_key_here

DEFAULT_NETWORK=sepolia

Response:```

```json

{## Usage

  "status": "ready",

  "version": "1.0.0",### Run the Agent System

  "uptime": 3600,

  "currentSessions": 5,```bash

  "totalMessages": 42,# From monorepo root

  "toolsAvailable": ["get_balance", "send_transaction", ...],pnpm run agent:start

  "supportedNetworks": ["sepolia", "polygon-amoy", ...]

}# Or from agent directory

```pnpm run dev       # Development mode with auto-reload

pnpm run start     # Production mode

#### Chat```



Send a message to the agent:### Example Interactions



```httpThe system can handle various blockchain-related queries:

POST /api/chat

Content-Type: application/json**Balance Checks:**



{```

  "message": "What is the ETH balance of vitalik.eth?","What is the ETH balance of vitalik.eth on Sepolia?"

  "sessionId": "optional-session-id",```

  "network": "sepolia"

}**Security Verification:**

````

````

Response:"Is 0x1234...5678 a contract or an EOA?"

```json```

{

  "sessionId": "uuid",**Data Analysis:**

  "messageId": "uuid",

  "response": "The balance is 1.234 ETH",```

  "toolsUsed": ["Analyze recent transaction patterns for USDC on Polygon testnet"

    { "name": "get_balance", "success": true }```

  ]

}**DeFi Operations:**

````

```

#### Sessions"Explain how to provide liquidity on Uniswap V3"

```

**List all sessions:**

```http**Transaction Execution:**

GET /api/sessions?page=1&limit=50

```

"Send 0.1 ETH to 0xABC...DEF on Sepolia"

**Get session by ID:**```

```http

GET /api/sessions/:id## Supported Networks

```

The system supports multiple EVM testnet networks:

**Create session:**

````http- **Sepolia** (Ethereum testnet)

POST /api/sessions- **Polygon Amoy** (Polygon testnet)

Content-Type: application/json- **Optimism Sepolia** (Optimism testnet)

- **Arbitrum Sepolia** (Arbitrum testnet)

{- **Base Sepolia** (Base testnet)

  "title": "My Session"- **Avalanche Fuji** (Avalanche testnet)

}- **BSC Testnet** (Binance Smart Chain testnet)

```- **zkSync Sepolia** (zkSync Era testnet)

- **Blast Sepolia** (Blast testnet)

**Update session:**- **Celo Alfajores** (Celo testnet)

```http- **Zora Sepolia** (Zora testnet)

PATCH /api/sessions/:id

Content-Type: application/json## Technologies



{- **ADK-ts**: Agent development framework

  "title": "Updated Title"- **MCP (Model Context Protocol)**: Tool integration protocol

}- **EVM MCP Server**: Blockchain interaction server

```- **Google Gemini**: LLM for agent reasoning

- **Viem**: Ethereum library for blockchain operations

**Delete session:**- **TypeScript**: Type-safe development

```http

DELETE /api/sessions/:id## Security Considerations

````

- Private keys are only used for transaction signing

#### Messages- All write operations go through security verification

- Risk assessment before executing transactions

**Get messages for a session:**- Support for ENS names to avoid address errors

````http- Testnet-only operations by default

GET /api/chat/:sessionId/messages?page=1&limit=50

```## Development



#### Analytics### Adding New Agents



**Tool usage:**1. Create a new directory in `src/agents/`

```http2. Implement the agent in `agent.ts`

GET /api/analytics/tools?sessionId=uuid3. Import and register in `coordinator/agent.ts`

```4. Add agent-specific tools if needed



**Transaction history:**### Adding Custom Tools

```http

GET /api/analytics/transactions?sessionId=uuid1. Create tool implementation in `src/shared/tools/`

```2. Export from `src/shared/tools/index.ts`

3. Pass tools to relevant agents

## Project Structure

### Testing

````

apps/agent/```bash

├── src/# Run TypeScript compilation check

│ ├── agents/ # Agent definitionspnpm run build

│ │ ├── coordinator/ # Main coordinator agent

│ │ ├── transaction-agent/# Run in development mode

│ │ ├── defi-agent/pnpm run dev

│ │ ├── data-intelligence-agent/```

│ │ ├── governance-agent/

│ │ └── security-agent/## Contributing

│ ├── db/ # Database layer

│ │ ├── schema.ts # Drizzle schemaThis is part of the hpulse monorepo. See the main README for contribution guidelines.

│ │ └── index.ts # DB initialization

│ ├── server/ # Express server## License

│ │ ├── routes/ # API routes

│ │ ├── services/ # Business logicSee the root LICENSE file in the monorepo.

│ │ └── index.ts # Server setup
│ ├── shared/ # Shared utilities
│ │ └── tools/ # EVM MCP tools
│ ├── types/ # TypeScript types
│ ├── env.ts # Environment config
│ └── index.ts # Entry point
├── drizzle.config.ts # Drizzle configuration
├── package.json
└── tsconfig.json

````

## Supported Networks

- Sepolia (Ethereum testnet)
- Polygon Amoy
- Optimism Sepolia
- Arbitrum Sepolia
- Base Sepolia
- Avalanche Fuji
- BSC Testnet
- zkSync Sepolia
- Blast Sepolia
- Celo Alfajores
- Zora Sepolia

## Development

### Watch Mode

```bash
pnpm dev
````

### Building

```bash
pnpm build
```

### Cleaning

```bash
pnpm clean
```

## Integration with Chrome Extension

The agent server is designed to work with the Hpulse Chrome extension. The extension communicates with the server via REST API calls.

To connect the extension:

1. Start the agent server
2. Configure the extension to point to `http://localhost:3000`
3. The extension will use the `/api/chat` endpoint for conversations

## Security Considerations

- **Local Only**: Run the server only on localhost for personal use
- **Private Keys**: Never share your `WALLET_PRIVATE_KEY`
- **API Keys**: Keep your `GOOGLE_API_KEY` secure
- **CORS**: Configure `CORS_ORIGIN` appropriately if exposing to other origins
- **Database**: The SQLite database contains conversation history - secure it appropriately

## Troubleshooting

### Database Issues

If you encounter database errors:

```bash
# Remove the database and start fresh
rm -rf data/
pnpm dev
```

### Port Already in Use

Change the `PORT` in your `.env` file:

```bash
PORT=3001
```

### Agent Initialization Fails

Ensure your `GOOGLE_API_KEY` is valid and you have internet connectivity to access the LLM API.

## Architecture

The system follows a coordinator-based multi-agent architecture where a root coordinator agent orchestrates five specialized sub-agents. For detailed architecture documentation, see [README_OLD.md](./README_OLD.md).

## License

Part of the Hpulse monorepo project.
