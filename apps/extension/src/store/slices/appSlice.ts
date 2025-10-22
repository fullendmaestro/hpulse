import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AppState, AuthenticatePayload } from '../types'

const initialState: AppState = {
  authenticated: false,
  passwordKeyContent: null,
  authenticating: false,
  onBoarded: false,
  selected_network_name: 'all',
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
      state.selected_network_name = action.payload
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
  resetMetaFox,
  resetApp,
} = appSlice.actions

export default appSlice.reducer
