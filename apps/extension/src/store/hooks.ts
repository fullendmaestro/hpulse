import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '.'

// Typed hooks for React components
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// Convenience hooks for specific slices
export const useApp = () => useAppSelector((state) => state.app)
export const useSettings = () => useAppSelector((state) => state.settings)
export const useWallet = () => useAppSelector((state) => state.wallet)
export const useAI = () => useAppSelector((state) => state.ai)

export const useSelectedChain = () =>
  useAppSelector((state) =>
    state.app.networks.find((network) => network.nameSlug == state.app.selected_network_slug)
  )
