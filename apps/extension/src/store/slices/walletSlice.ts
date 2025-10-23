import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { WalletState, Wallet } from '../types'

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
      state.wallets.push(action.payload)
      // If this is the first wallet, select it
      if (state.wallets.length === 1) {
        state.selectedWalletSlug = action.payload.id
      }
    },
    removeWallet: (state, action: PayloadAction<string>) => {
      state.wallets = state.wallets.filter((wallet) => wallet.id !== action.payload)
      // If we removed the selected wallet, reset to 'all'
      if (state.selectedWalletSlug === action.payload) {
        state.selectedWalletSlug = 'all'
      }
    },
    setSelectedWallet: (state, action: PayloadAction<string>) => {
      state.selectedWalletSlug = action.payload
    },
  },
})

export const { addWallet, removeWallet, setSelectedWallet } = walletSlice.actions

export default walletSlice.reducer
