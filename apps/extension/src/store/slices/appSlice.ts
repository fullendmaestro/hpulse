import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AppState, AuthenticatePayload } from '../types'
import { evmNetworks } from '../../contants/networks'

const initialState: AppState = {
  authenticated: false,
  passwordKeyContent: null,
  authenticating: false,
  onBoarded: false,
  selected_network_slug: 'all',
  networks: evmNetworks,
  currentSessionId: null,
  selectedAgentPath: null,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<AuthenticatePayload>) => {
      state.authenticated = action.payload.authenticated
      state.authenticating = false
    },
    setPasswordKeyContent: (state, action: PayloadAction<string | null>) => {
      state.passwordKeyContent = action.payload
    },
    setAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.authenticating = action.payload
    },
    setOnBoarded: (state, action: PayloadAction<boolean>) => {
      state.onBoarded = action.payload
    },
    setSelectedNetwork: (state, action: PayloadAction<string>) => {
      state.selected_network_slug = action.payload
    },
    setCurrentSessionId: (state, action: PayloadAction<string | null>) => {
      state.currentSessionId = action.payload
    },
    setSelectedAgentPath: (state, action: PayloadAction<string | null>) => {
      state.selectedAgentPath = action.payload
    },
    resetMetaFox: () => initialState,
    resetApp: () => initialState,
  },
})

export const {
  setAuthenticated,
  setPasswordKeyContent,
  setAuthenticating,
  setOnBoarded,
  setSelectedNetwork,
  setCurrentSessionId,
  setSelectedAgentPath,
  resetMetaFox,
  resetApp,
} = appSlice.actions

export default appSlice.reducer
