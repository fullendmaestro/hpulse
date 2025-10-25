# Hpulse Multi-Agent System

An autonomous EVM AI Agent system built using a **multi-agent architecture** with ADK-ts, where specialized sub-agents collaborate to analyze on-chain data, execute transactions, and optimize interactions across the Ethereum Virtual Machine (EVM) ecosystem.

## Architecture

The system follows a coordinator-based multi-agent architecture where a root coordinator agent orchestrates five specialized sub-agents:

```
┌─────────────────────────────────────────────────────────────┐
│                    Coordinator Agent                        │
│     (Routes requests & ensures security oversight)          │
└─────────────────┬───────────────────────────────────────────┘
                  │
    ┌─────────────┼─────────────┬─────────────┬──────────────┐
    │             │             │             │              │
    ▼             ▼             ▼             ▼              ▼
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐
│Transaction│ │  DeFi   │  │  Data   │  │Governance│ │ Security │
│  Agent   │  │  Agent  │  │Intel    │  │  Agent  │  │  Agent   │
└─────────┘  └─────────┘  └─────────┘  └─────────┘  └──────────┘
```

## Sub-Agents

### 1. Transaction Agent

**Purpose:** Handles fundamental blockchain interactions.

**Capabilities:**

- Native token transfers (ETH, MATIC, etc.)
- ERC-20 token operations (transfer, approve, balance checks)
- ERC-721 NFT operations (transfer, ownership verification)
- ERC-1155 multi-token operations
- Transaction monitoring and status checks

### 2. DeFi Agent

**Purpose:** Specializes in DeFi protocol interactions.

**Capabilities:**

- Yield farming optimization
- Lending and borrowing (Aave, Compound)
- Liquidity provision (Uniswap, Curve, Balancer)
- Token swaps and route optimization
- Position management and rebalancing
- Risk assessment for DeFi operations

### 3. Data Intelligence Agent

**Purpose:** Analyzes on-chain and off-chain data.

**Capabilities:**

- On-chain data monitoring and analysis
- Token price tracking and market trends
- Liquidity flow analysis
- User behavior pattern recognition
- Transaction pattern analysis
- Strategic insights and recommendations

### 4. Governance Agent

**Purpose:** Handles decentralized governance participation.

**Capabilities:**

- Governance proposal analysis
- Voting on DAO proposals
- Delegation management
- Voting power tracking
- Proposal outcome monitoring
- Governance strategy recommendations

### 5. Security & Compliance Agent

**Purpose:** Ensures safe and compliant execution.

**Capabilities:**

- Smart contract verification
- Malicious address detection
- Transaction risk assessment
- Compliance policy enforcement
- Security monitoring and alerts
- Authorization management

## Project Structure

```
apps/agent/
├── .env                        # Environment configuration
├── .env.example               # Example environment variables
├── package.json               # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── src/
    ├── index.ts              # Main entry point
    ├── env.ts                # Environment validation
    ├── agents/
    │   ├── coordinator/
    │   │   └── agent.ts      # Coordinator agent
    │   ├── transaction-agent/
    │   │   └── agent.ts      # Transaction agent
    │   ├── defi-agent/
    │   │   └── agent.ts      # DeFi agent
    │   ├── data-intelligence-agent/
    │   │   └── agent.ts      # Data intelligence agent
    │   ├── governance-agent/
    │   │   └── agent.ts      # Governance agent
    │   └── security-agent/
    │       └── agent.ts      # Security agent
    └── shared/
        └── tools/
            ├── index.ts       # Tool exports
            └── evmMcpToolset.ts  # EVM MCP toolset configuration
```

## Setup

### Prerequisites

- Node.js 18+ or Bun
- Google API key for Gemini LLM
- (Optional) Private key for blockchain write operations

### Installation

```bash
# From the monorepo root
pnpm install

# Or from the agent directory
cd apps/agent
pnpm install
```

### Configuration

Copy `.env.example` to `.env` and configure:

```bash
# LLM Configuration
GOOGLE_API_KEY=your_api_key_here
LLM_MODEL=gemini-2.5-flash
ADK_DEBUG=false

# Blockchain Configuration (optional)
WALLET_PRIVATE_KEY=your_private_key_here
DEFAULT_NETWORK=sepolia
```

## Usage

### Run the Agent System

```bash
# From monorepo root
pnpm run agent:start

# Or from agent directory
pnpm run dev       # Development mode with auto-reload
pnpm run start     # Production mode
```

### Example Interactions

The system can handle various blockchain-related queries:

**Balance Checks:**

```
"What is the ETH balance of vitalik.eth on Sepolia?"
```

**Security Verification:**

```
"Is 0x1234...5678 a contract or an EOA?"
```

**Data Analysis:**

```
"Analyze recent transaction patterns for USDC on Polygon testnet"
```

**DeFi Operations:**

```
"Explain how to provide liquidity on Uniswap V3"
```

**Transaction Execution:**

```
"Send 0.1 ETH to 0xABC...DEF on Sepolia"
```

## Supported Networks

The system supports multiple EVM testnet networks:

- **Sepolia** (Ethereum testnet)
- **Polygon Amoy** (Polygon testnet)
- **Optimism Sepolia** (Optimism testnet)
- **Arbitrum Sepolia** (Arbitrum testnet)
- **Base Sepolia** (Base testnet)
- **Avalanche Fuji** (Avalanche testnet)
- **BSC Testnet** (Binance Smart Chain testnet)
- **zkSync Sepolia** (zkSync Era testnet)
- **Blast Sepolia** (Blast testnet)
- **Celo Alfajores** (Celo testnet)
- **Zora Sepolia** (Zora testnet)

## Technologies

- **ADK-ts**: Agent development framework
- **MCP (Model Context Protocol)**: Tool integration protocol
- **EVM MCP Server**: Blockchain interaction server
- **Google Gemini**: LLM for agent reasoning
- **Viem**: Ethereum library for blockchain operations
- **TypeScript**: Type-safe development

## Security Considerations

- Private keys are only used for transaction signing
- All write operations go through security verification
- Risk assessment before executing transactions
- Support for ENS names to avoid address errors
- Testnet-only operations by default

## Development

### Adding New Agents

1. Create a new directory in `src/agents/`
2. Implement the agent in `agent.ts`
3. Import and register in `coordinator/agent.ts`
4. Add agent-specific tools if needed

### Adding Custom Tools

1. Create tool implementation in `src/shared/tools/`
2. Export from `src/shared/tools/index.ts`
3. Pass tools to relevant agents

### Testing

```bash
# Run TypeScript compilation check
pnpm run build

# Run in development mode
pnpm run dev
```

## Contributing

This is part of the hpulse monorepo. See the main README for contribution guidelines.

## License

See the root LICENSE file in the monorepo.
