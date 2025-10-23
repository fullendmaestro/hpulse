// Redux store types for the metafox sei wallet extension

export type AppTheme = 'dark' | 'light' | 'system'

export interface Network {
  name: string
  nameSlug: string
  logoURL: string
}

export interface AppState {
  authenticated: boolean
  selected_network_slug: string
  authenticating: boolean
  passwordKeyContent: string | null
  onBoarded: boolean
  networks: Network[]
}

export interface SettingsState {
  autoLockTimeOut: number
  hidePortfolioBalances: boolean
  openAsSidePanel: boolean
  baseCurrency: string
  theme: AppTheme
}

// Base token interface
export interface BaseToken {
  id: string
  name: string
  symbol: string
  decimals: number
  balance: string
  current_price?: number
  price_change_24h?: number
  coinGeckoId?: string
  logoUrl: string
}

// ERC20 token (chain-specific)
export interface ERC20Token extends BaseToken {
  tokenAddress: string
  chainSlug: string // which chain this token belongs to
}

// Native EVM token (e.g., ETH, MATIC, BNB)
export interface EVMNativeToken extends BaseToken {
  chainSlug: string // which chain this token belongs to
  isNative: true
}

// NFT asset
export interface ERC721Asset {
  id: string
  name: string
  symbol: string
  tokenId: string
  tokenAddress: string
  chainSlug: string
  owner: string
  logoUrl?: string
}

// Chain balance summary
export interface ChainBalance {
  chainSlug: string
  nativeToken: EVMNativeToken
  erc20Tokens: ERC20Token[]
  erc721Assets: ERC721Asset[]
  totalBalance: string // Total USD value for this chain
}

export interface Wallet {
  id: string
  name: string
  publicKey: string
  privateKey: string
  address: string

  // Chain-specific balances
  chainBalances: Record<string, ChainBalance> // key is chainSlug

  // Aggregated total balance across all chains
  totalBalance: string
}

export interface WalletState {
  selectedWalletSlug: string | 'all'
  wallets: Wallet[]
}

export interface AIState {
  model: 'gemini-1.5-flash' | 'gemini-1.5-pro'
  googleApiKey?: string
  mcps: any[]
}

export interface RootState {
  app: AppState
  settings: SettingsState
  wallet: WalletState
  ai: AIState
}
