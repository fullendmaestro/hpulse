import {
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
  type Chain,
} from 'viem/chains'

export type Network = Chain & {
  nameSlug: string
  logoURL: string
}

// Mapping for viem chain to nameSlug
const viemChainMap: Record<number, { chain: Chain; nameSlug: string; logoURL: string }> = {
  [polygonAmoy.id]: {
    chain: polygonAmoy,
    nameSlug: 'polygon-amoy',
    logoURL: '/logos/Polygon_Logo.png',
  },
  [optimismSepolia.id]: {
    chain: optimismSepolia,
    nameSlug: 'optimism-sepolia',
    logoURL: '/logos/Optimism_Logo.png',
  },
  [arbitrumSepolia.id]: {
    chain: arbitrumSepolia,
    nameSlug: 'arbitrum-sepolia',
    logoURL: '/logos/Arbitrum_Logo.png',
  },
  [celoAlfajores.id]: {
    chain: celoAlfajores,
    nameSlug: 'celo-alfajores',
    logoURL: '/logos/Celo_Logo.png',
  },
  [baseSepolia.id]: {
    chain: baseSepolia,
    nameSlug: 'base-sepolia',
    logoURL: '/logos/Base_Logo.png',
  },
  [blastSepolia.id]: {
    chain: blastSepolia,
    nameSlug: 'blast-sepolia',
    logoURL: '/logos/Blast_Logo.png',
  },
  [bscTestnet.id]: {
    chain: bscTestnet,
    nameSlug: 'bsc-testnet',
    logoURL: '/logos/BNB_Logo.png',
  },
  [avalancheFuji.id]: {
    chain: avalancheFuji,
    nameSlug: 'avalanche-fuji',
    logoURL: '/logos/Avax_Logo.png',
  },
  [zksyncSepoliaTestnet.id]: {
    chain: zksyncSepoliaTestnet,
    nameSlug: 'zksync-sepolia',
    logoURL: '/logos/zkSync_Logo.png',
  },
  [zoraSepolia.id]: {
    chain: zoraSepolia,
    nameSlug: 'zora-sepolia',
    logoURL: '/logos/Zora_Logo.png',
  },
}

export const evmNetworks: Network[] = Object.values(viemChainMap).map(
  ({ chain, nameSlug, logoURL }) => ({
    ...chain,
    nameSlug,
    logoURL,
  })
)

// Get the first four networks for the "All" composite icon
export const allNetworksCompositeLogos = evmNetworks.slice(0, 4).map((n) => n.logoURL)
