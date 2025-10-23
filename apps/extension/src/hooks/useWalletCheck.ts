import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

/**
 * Hook that checks if a wallet exists and redirects to welcome page if not
 * @returns boolean indicating if wallet exists
 */
export function useWalletCheck() {
  const navigate = useNavigate()
  const location = useLocation()
  const wallets = useAppSelector((state) => state.wallet.wallets)

  const hasWallet = wallets.length > 0

  useEffect(() => {
    // Don't redirect if already on welcome page
    if (location.pathname === '/welcome') {
      return
    }

    // Redirect to welcome if no wallet exists
    if (!hasWallet) {
      navigate('/welcome', { replace: true })
    }
  }, [hasWallet, navigate, location.pathname])

  return hasWallet
}
