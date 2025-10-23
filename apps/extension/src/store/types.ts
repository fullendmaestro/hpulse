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

export interface ERC20Asset {
  id: string
  name: string
  symbol: string
  decimals: number
  balance: string
  tokenAddress: string
  current_price?: number
  price_change_24h?: number
  coinGeckoId?: string
  logoUrl: string
}

export interface ERC721Asset {
  id: string
  name: string
  symbol: string
  tokenId: string
  owner: string
}

export interface EVMTokenAsset {
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

export interface Wallet {
  id: string
  name: string
  totalbalance: string

  publicKey: string
  privateKey: string
  address: string

  erc20Assets: ERC20Asset[]
  erc721Assets: ERC721Asset[]
  evmTokenAssets: EVMTokenAsset[]
}

export interface WalletState {
  selectedWalletSlug: 'all'
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
