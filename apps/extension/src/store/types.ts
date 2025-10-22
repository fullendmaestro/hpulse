// Redux store types for the metafox sei wallet extension

export type AppTheme = 'dark' | 'light' | 'system'

export interface AppState {
  authenticated: boolean
  selected_network_name: string
  authenticating: boolean
  passwordKeyContent: string | null
  onBoarded: boolean
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

export interface ERC2981Asset {
  id: string
  name: string
  symbol: string
  tokenId: string
  owner: string
  royaltyPercentage: number
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

export interface WalletAccount {
  derivationIndex?: number
  name: string
  id: string
  publicKey: string
  evmAddress: string
  seiAddress: string
  erc20Assets: ERC20Asset[]
  erc721Assets: ERC721Asset[]
  erc2981Assets: ERC2981Asset[]
  evmTokenAssets: EVMTokenAsset[]
}

export interface Wallet {
  balance: string
  id: string
  name: string
  type: 'mnemonic' | 'private key'
  cypherStoreId: string
}

export interface WalletState {
  selectedWalletId: string
  selectedAccountId: string
  lastRefresh: number
  refreshing: boolean
  switching: boolean
  wallets: { [key: string]: Wallet }
  walletsAccounts: { [walletId: string]: { [accountId: string]: WalletAccount } }
}

// AI Configuration and State (imported from aiSlice)
export interface CustomMCPs {
  [key: string]: any
}

export interface AIState {
  model: 'gemini-1.5-flash' | 'gemini-1.5-pro'
  googleApiKey?: string
  mcps: CustomMCPs
}

// Action Payload Types
export interface AuthenticatePayload {
  authenticated: boolean
}

export interface AddWalletPayload {
  wallet: Wallet
}

export interface UpdateWalletPayload {
  walletId: string
  wallet: Partial<Wallet>
}

export interface RemoveWalletPayload {
  walletId: string
}

export interface SelectWalletPayload {
  walletId: string
}

export interface AddAccountPayload {
  walletId: string
  account: WalletAccount
}

export interface UpdateAccountPayload {
  walletId: string
  accountId: string
  account: Partial<WalletAccount>
}

export interface SelectAccountPayload {
  accountId: string
}

export interface UpdateBalancePayload {
  walletId: string
  accountId: string
  coinId: string
  balance: string
}

export interface RootState {
  app: AppState
  settings: SettingsState
  wallet: WalletState
  ai: AIState
}
