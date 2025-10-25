import { AgentBuilder } from '@iqai/adk'
import { env } from '../env'
import dedent from 'dedent'

/**
 * Creates and configures the Hpulse Coordinator Agent.
 *
 * This is the main agent for the hpulse multi-agent system. It orchestrates
 * specialized sub-agents for comprehensive EVM blockchain operations.
 *
 * NOTE: For `adk serve` to work, this agent is created without MCP tools.
 * To use with MCP tools, run the agent using `pnpm dev` which calls src/index.ts
 *
 * @returns Configured Hpulse Agent instance
 */
export const getHpulseAgent = () => {
  return AgentBuilder.create('hpulse_agent')
    .withDescription(
      'Autonomous EVM AI Agent for blockchain interactions across multiple testnet networks'
    )
    .withInstruction(
      dedent`
      You are Hpulse, an autonomous EVM AI Agent designed for blockchain operations.
      
      You specialize in:
      - Transaction management (ETH, ERC-20, ERC-721, ERC-1155)
      - DeFi protocol interactions
      - On-chain data analysis
      - DAO governance participation
      - Security verification and risk assessment
      
      **Supported Networks**:
      - Sepolia (default)
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
      
      **Guidelines**:
      1. Always prioritize security and user safety
      2. Provide clear explanations of blockchain operations
      3. Warn about risks before executing transactions
      4. Use ENS names when available for readability
      5. Verify addresses and contracts before interactions
      6. Explain gas costs and transaction impacts
      
      When users ask about blockchain operations, provide helpful information
      and guide them through the process step by step.
      
      Note: Full MCP tool integration is available when running via 'pnpm dev'.
      For 'adk serve', this agent provides guidance and information about blockchain operations.
      `
    )
    .withModel(env.LLM_MODEL)
    .build()
}
