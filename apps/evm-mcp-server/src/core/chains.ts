import { type Chain } from 'viem'
import {
  // Testnets - only those with corresponding mainnet networks in extension
  optimismSepolia,
  arbitrumSepolia,
  baseSepolia,
  polygonAmoy,
  avalancheFuji,
  bscTestnet,
  zksyncSepoliaTestnet,
  blastSepolia,
  zoraSepolia,
  celoAlfajores,
} from 'viem/chains'

// Default configuration values - using Optimism Sepolia as default testnet
export const DEFAULT_RPC_URL = 'https://sepolia.optimism.io'
export const DEFAULT_CHAIN_ID = 11155420

// Map chain IDs to chains
export const chainMap: Record<number, Chain> = {
  // Testnets - only those with corresponding mainnet networks
  11155420: optimismSepolia,
  421614: arbitrumSepolia,
  84532: baseSepolia,
  80002: polygonAmoy,
  43113: avalancheFuji,
  97: bscTestnet,
  300: zksyncSepoliaTestnet,
  168587773: blastSepolia,
  999999999: zoraSepolia,
  44787: celoAlfajores,
}

// Map network names to chain IDs for easier reference
export const networkNameMap: Record<string, number> = {
  // Testnets - only those with corresponding mainnet networks
  'optimism-sepolia': 11155420,
  optimismsepolia: 11155420,
  'arbitrum-sepolia': 421614,
  arbitrumsepolia: 421614,
  'base-sepolia': 84532,
  basesepolia: 84532,
  'polygon-amoy': 80002,
  polygonamoy: 80002,
  'avalanche-fuji': 43113,
  avalanchefuji: 43113,
  fuji: 43113,
  'bsc-testnet': 97,
  bsctestnet: 97,
  'zksync-sepolia': 300,
  zksyncsepolia: 300,
  'blast-sepolia': 168587773,
  blastsepolia: 168587773,
  'zora-sepolia': 999999999,
  zorasepolia: 999999999,
  'celo-alfajores': 44787,
  celoalfajores: 44787,
  alfajores: 44787,
}

// Map chain IDs to RPC URLs
export const rpcUrlMap: Record<number, string> = {
  // Testnets - only those with corresponding mainnet networks
  11155420: 'https://sepolia.optimism.io',
  421614: 'https://sepolia-rpc.arbitrum.io/rpc',
  84532: 'https://sepolia.base.org',
  80002: 'https://rpc-amoy.polygon.technology',
  43113: 'https://api.avax-test.network/ext/bc/C/rpc',
  97: 'https://data-seed-prebsc-1-s1.binance.org:8545',
  300: 'https://sepolia.era.zksync.dev',
  168587773: 'https://sepolia.blast.io',
  999999999: 'https://sepolia.rpc.zora.energy',
  44787: 'https://alfajores-forno.celo-testnet.org',
}

/**
 * Resolves a chain identifier (number or string) to a chain ID
 * @param chainIdentifier Chain ID (number) or network name (string)
 * @returns The resolved chain ID
 */
export function resolveChainId(chainIdentifier: number | string): number {
  if (typeof chainIdentifier === 'number') {
    return chainIdentifier
  }

  // Convert to lowercase for case-insensitive matching
  const networkName = chainIdentifier.toLowerCase()

  // Check if the network name is in our map
  if (networkName in networkNameMap) {
    return networkNameMap[networkName]
  }

  // Try parsing as a number
  const parsedId = parseInt(networkName)
  if (!isNaN(parsedId)) {
    return parsedId
  }

  // Default to mainnet if not found
  return DEFAULT_CHAIN_ID
}

/**
 * Returns the chain configuration for the specified chain ID or network name
 * @param chainIdentifier Chain ID (number) or network name (string)
 * @returns The chain configuration
 * @throws Error if the network is not supported (when string is provided)
 */
export function getChain(chainIdentifier: number | string = DEFAULT_CHAIN_ID): Chain {
  if (typeof chainIdentifier === 'string') {
    const networkName = chainIdentifier.toLowerCase()
    // Try to get from direct network name mapping first
    if (networkNameMap[networkName]) {
      const chainId = networkNameMap[networkName]
      const chain = chainMap[chainId]
      if (!chain) {
        throw new Error(`Chain configuration not found for network: ${chainIdentifier}`)
      }
      return chain
    }

    // If not found, throw an error
    throw new Error(`Unsupported network: ${chainIdentifier}`)
  }

  // If it's a number, return the chain from chainMap
  const chain = chainMap[chainIdentifier]
  if (!chain) {
    throw new Error(`Chain configuration not found for chain ID: ${chainIdentifier}`)
  }
  return chain
}

/**
 * Gets the appropriate RPC URL for the specified chain ID or network name
 * @param chainIdentifier Chain ID (number) or network name (string)
 * @returns The RPC URL for the specified chain
 */
export function getRpcUrl(chainIdentifier: number | string = DEFAULT_CHAIN_ID): string {
  const chainId =
    typeof chainIdentifier === 'string' ? resolveChainId(chainIdentifier) : chainIdentifier

  return rpcUrlMap[chainId] || DEFAULT_RPC_URL
}

/**
 * Get a list of supported networks
 * @returns Array of supported network names (excluding short aliases)
 */
export function getSupportedNetworks(): string[] {
  return Object.keys(networkNameMap)
    .filter((name) => name.length > 2) // Filter out short aliases
    .sort()
}
