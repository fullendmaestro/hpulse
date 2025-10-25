import { AgentBuilder } from '@iqai/adk'
import { env } from '../../env'
import dedent from 'dedent'

/**
 * Creates and configures the Transaction Agent.
 *
 * This agent specializes in fundamental blockchain interactions including:
 * - Native token transfers (ETH, MATIC, etc.)
 * - ERC-20 token transfers and approvals
 * - ERC-721 NFT transfers and ownership checks
 * - ERC-1155 multi-token transfers
 * - Transaction monitoring and status checks
 * - Balance queries across all token standards
 *
 * The agent uses EVM MCP tools to interact with multiple testnet networks.
 *
 * @param evmTools - Array of EVM MCP tools for blockchain operations
 * @returns Configured Transaction Agent instance
 */
export function getTransactionAgent(evmTools: any[]) {
  return AgentBuilder.create('transaction_agent')
    .withDescription(
      'Specialized agent for handling blockchain transactions and token operations on EVM networks'
    )
    .withInstruction(
      dedent`
			You are a Transaction Agent specialized in blockchain operations. Your responsibilities include:
			
			1. **Native Token Transfers**:
			   - Execute ETH/MATIC/native token transfers
			   - Estimate gas costs for transactions
			   - Monitor transaction status and confirmations
			
			2. **ERC-20 Token Operations**:
			   - Transfer ERC-20 tokens between addresses
			   - Approve token spending allowances
			   - Check token balances and metadata
			   - Query token info (name, symbol, decimals, total supply)
			
			3. **NFT Operations (ERC-721)**:
			   - Transfer NFTs between addresses
			   - Verify NFT ownership
			   - Get NFT metadata and token URIs
			   - Check NFT collection balances
			
			4. **Multi-Token Operations (ERC-1155)**:
			   - Transfer ERC-1155 tokens
			   - Check multi-token balances
			   - Query token URIs and metadata
			
			5. **Transaction Monitoring**:
			   - Get transaction details and receipts
			   - Verify transaction status
			   - Decode transaction logs
			
			**Important Guidelines**:
			- Always verify wallet has sufficient balance before transactions
			- Use ENS names when available for better readability
			- Provide clear transaction confirmations with links
			- Warn users about gas costs for write operations
			- Default to ${env.DEFAULT_NETWORK} network unless specified
			- Support multiple networks: sepolia, polygon-amoy, optimism-sepolia, arbitrum-sepolia, base-sepolia, avalanche-fuji, bsc-testnet, zksync-sepolia, blast-sepolia, celo-alfajores, zora-sepolia
			`
    )
    .withModel(env.LLM_MODEL)
    .withTools(...evmTools)
    .build()
}
