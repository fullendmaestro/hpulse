import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '.'
import type { WalletAccount, Wallet } from './types'

// Typed hooks for React components
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// Convenience hooks for specific slices
export const useApp = () => useAppSelector((state) => state.app)
export const useSettings = () => useAppSelector((state) => state.settings)
export const useWallet = () => useAppSelector((state) => state.wallet)
export const useAI = () => useAppSelector((state) => state.ai)

// Specific selector hooks for common use cases
export const useIsAuthenticated = () => useAppSelector((state) => state.app.authenticated)
export const useIsOnBoarded = () => useAppSelector((state) => state.app.onBoarded)
export const useSelectedNetworkName = () =>
  useAppSelector((state) => state.app.selected_network_name)
export const useIsRefreshing = () => useAppSelector((state) => state.wallet.refreshing)
export const useIsSwitching = () => useAppSelector((state) => state.wallet.switching)

// Wallet-specific hooks
export const useSelectedWalletId = () => useAppSelector((state) => state.wallet.selectedWalletId)
export const useSelectedAccountId = () => useAppSelector((state) => state.wallet.selectedAccountId)
export const useWallets = () => useAppSelector((state) => state.wallet.wallets)
export const useWalletsArray = () => {
  const wallets = useAppSelector((state) => state.wallet.wallets)
  return Object.keys(wallets)
    .map((key) => wallets[key])
    .filter((wallet): wallet is Wallet => wallet !== undefined)
}

export const useSelectedWallet = () => {
  const { wallets, selectedWalletId } = useAppSelector((state) => state.wallet)
  return selectedWalletId ? wallets[selectedWalletId] : undefined
}

export const useSelectedAccount = () => {
  const { walletsAccounts, selectedWalletId, selectedAccountId } = useAppSelector(
    (state) => state.wallet
  )
  return selectedWalletId && selectedAccountId
    ? walletsAccounts[selectedWalletId]?.[selectedAccountId]
    : undefined
}

export const useAccountsForWallet = (walletId?: string) => {
  const { walletsAccounts, selectedWalletId } = useAppSelector((state) => state.wallet)
  const targetWalletId = walletId || selectedWalletId
  return targetWalletId ? walletsAccounts[targetWalletId] || {} : {}
}

export const useAccountsArrayForWallet = (walletId?: string) => {
  const accounts = useAccountsForWallet(walletId)
  return Object.keys(accounts)
    .map((key) => {
      const account = accounts[key]
      if (!account) return undefined

      // Transform the account to match the WalletAccount interface
      return {
        ...account,
        accountId: account.id, // Add accountId as alias for id
        keyType: 'ecdsa' as const, // Default to ecdsa for now
        isActive: true, // Default to active for now
      } as WalletAccount
    })
    .filter((account): account is WalletAccount => account !== undefined)
}

// Alias for useAccountsArrayForWallet using selected wallet
export const useAccountList = () => useAccountsArrayForWallet()

// Get all wallets with their accounts
export const useWalletsWithAccounts = () => {
  const wallets = useWalletsArray()
  const { walletsAccounts } = useAppSelector((state) => state.wallet)

  return wallets.map((wallet) => ({
    ...wallet,
    accounts: Object.keys(walletsAccounts[wallet.id] || {})
      .map((accountId) => {
        const account = walletsAccounts[wallet.id]?.[accountId]
        if (!account) return undefined

        // Transform the account to match the WalletAccount interface
        return {
          ...account,
          accountId: account.id, // Add accountId as alias for id
          keyType: 'ecdsa' as const, // Default to ecdsa for now
          isActive: true, // Default to active for now
        } as WalletAccount
      })
      .filter((account): account is WalletAccount => account !== undefined),
  }))
}

// AI-specific hooks
export const useAIModel = () => useAppSelector((state) => state.ai.model)
export const useAIGoogleApiKey = () => useAppSelector((state) => state.ai.googleApiKey)
export const useAIMCPs = () => useAppSelector((state) => state.ai.mcps)

// Settings hooks
export const useBaseCurrency = () => useAppSelector((state) => state.settings.baseCurrency)
