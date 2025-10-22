import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import type { Storage } from 'redux-persist'

// import { localStorage } from 'redux-persist-webextension-storage'

import type { RootState } from './types'

// Import slices
import appReducer from './slices/appSlice'

export const chromeStorageAdapter: Storage = {
  setItem: (key, value) => {
    return localStorage.setItem(key, value)
  },
  getItem: (key) => {
    return localStorage.getItem(key)
  },
  removeItem: (key) => {
    return localStorage.removeItem(key)
  },
}

// Root persist config
const rootPersistConfig = {
  key: 'appStore',
  storage: chromeStorageAdapter,
}

// Combine reducers (no per-slice persistReducer)
const rootReducer = combineReducers({
  app: appReducer,
})

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: true,
})

// Create persistor
export const persistor = persistStore(store)

// Export types
export type AppDispatch = typeof store.dispatch
export type { RootState }

// Export hooks for React components
export const selectAppState = (state: RootState) => state.app
export const selectSettingsState = (state: RootState) => state.settings
export const selectWalletState = (state: RootState) => state.wallet
export const selectAIState = (state: RootState) => state.ai
