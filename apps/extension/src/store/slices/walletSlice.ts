import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { WalletState, Wallet, ChainBalance } from '../types'
import { evmNetworks } from '@/contants/networks'

const initialState: WalletState = {
  selectedWalletSlug: 'all',
  wallets: [],
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    // Wallet management
    addWallet: (state, action: PayloadAction<Wallet>) => {
      const wallet = action.payload

      // Initialize chainBalances with all networks and their native currencies
      if (!wallet.chainBalances) {
        wallet.chainBalances = {}
      }

      // Add all networks with zero balance native tokens
      evmNetworks.forEach((network) => {
        if (!wallet.chainBalances[network.nameSlug]) {
          wallet.chainBalances[network.nameSlug] = {
            chainSlug: network.nameSlug,
            nativeToken: {
              id: `${network.nameSlug}-${network.nativeCurrency.symbol.toLowerCase()}`,
              name: network.nativeCurrency.name,
              symbol: network.nativeCurrency.symbol,
              decimals: network.nativeCurrency.decimals,
              balance: '0',
              chainSlug: network.nameSlug,
              isNative: true,
              logoUrl: network.logoURL,
              current_price: 0,
              price_change_24h: 0,
            },
            erc20Tokens: [],
            erc721Assets: [],
            totalBalance: '0',
          }
        }
      })

      // Initialize totalBalance if not provided
      if (!wallet.totalBalance) {
        wallet.totalBalance = '0'
      }

      state.wallets.push(wallet)

      // If this is the first wallet, select it
      if (state.wallets.length === 1) {
        state.selectedWalletSlug = wallet.id
      }
    },

    removeWallet: (state, action: PayloadAction<string>) => {
      state.wallets = state.wallets.filter((wallet) => wallet.id !== action.payload)
      // If we removed the selected wallet, reset to 'all'
      if (state.selectedWalletSlug === action.payload) {
        state.selectedWalletSlug = state.wallets.length > 0 ? state.wallets[0].id : 'all'
      }
    },

    setSelectedWallet: (state, action: PayloadAction<string>) => {
      state.selectedWalletSlug = action.payload
    },

    // Update chain balance for a specific wallet and chain
    updateChainBalance: (
      state,
      action: PayloadAction<{ walletId: string; chainSlug: string; chainBalance: ChainBalance }>
    ) => {
      const { walletId, chainSlug, chainBalance } = action.payload
      const wallet = state.wallets.find((w) => w.id === walletId)

      if (wallet) {
        wallet.chainBalances[chainSlug] = chainBalance

        // Recalculate total balance across all chains
        wallet.totalBalance = Object.values(wallet.chainBalances)
          .reduce((total, chain) => {
            const chainTotal = parseFloat(chain.totalBalance || '0')
            return total + chainTotal
          }, 0)
          .toFixed(2)
      }
    },

    // Update multiple chain balances at once
    updateWalletBalances: (
      state,
      action: PayloadAction<{ walletId: string; chainBalances: Record<string, ChainBalance> }>
    ) => {
      const { walletId, chainBalances } = action.payload
      const wallet = state.wallets.find((w) => w.id === walletId)

      if (wallet) {
        wallet.chainBalances = chainBalances

        // Recalculate total balance
        wallet.totalBalance = Object.values(chainBalances)
          .reduce((total, chain) => {
            const chainTotal = parseFloat(chain.totalBalance || '0')
            return total + chainTotal
          }, 0)
          .toFixed(2)
      }
    },
  },
})

export const {
  addWallet,
  removeWallet,
  setSelectedWallet,
  updateChainBalance,
  updateWalletBalances,
} = walletSlice.actions

export default walletSlice.reducer
