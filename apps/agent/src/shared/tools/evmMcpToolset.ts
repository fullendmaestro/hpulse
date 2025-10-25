import { McpToolset, type McpConfig } from '@iqai/adk'
import { env } from '../../env'

/**
 * Creates and configures the EVM MCP toolset for blockchain interactions.
 *
 * This toolset connects to the local EVM MCP server which provides access to
 * multiple EVM testnet networks including Polygon, Optimism, Arbitrum, Base,
 * Avalanche, BSC, zkSync, Blast, Celo, and Zora.
 *
 * Available tools include:
 * - Token operations (ERC20, ERC721, ERC1155)
 * - Blockchain queries (balances, transactions, blocks)
 * - Smart contract interactions
 * - ENS name resolution
 *
 * @returns Configured McpToolset instance
 */
export function createEvmMcpToolset(): McpToolset {
  const mcpConfig: McpConfig = {
    name: 'EVM MCP Client',
    description: 'Client for EVM blockchain operations across multiple testnet networks',
    debug: env.ADK_DEBUG,
    retryOptions: {
      maxRetries: 3,
      initialDelay: 200,
    },
    cacheConfig: {
      enabled: true,
    },
    transport: {
      mode: 'stdio',
      command: 'npx',
      args: ['-y', '@mcpdotdirect/evm-mcp-server'],
      env: {
        PATH: process.env.PATH || '',
        WALLET_PRIVATE_KEY: env.WALLET_PRIVATE_KEY || '',
        DEFAULT_NETWORK: env.DEFAULT_NETWORK,
      },
    },
  }

  return new McpToolset(mcpConfig)
}

/**
 * Initializes and returns all available EVM MCP tools.
 *
 * @returns Promise<Array> Array of MCP tools ready to be used by agents
 */
export async function getEvmMcpTools() {
  const toolset = createEvmMcpToolset()
  const tools = await toolset.getTools()

  console.log(`✅ Loaded ${tools.length} EVM MCP tools`)

  return { tools, toolset }
}
