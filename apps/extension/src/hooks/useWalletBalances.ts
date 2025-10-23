import { useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import type { EVMNativeToken, ERC20Token } from '@/store/types'

/**
 * Hook to get the total balance for selected wallet(s)
 */
export function useWalletTotalBalance() {
  const { wallets, selectedWalletSlug } = useAppSelector((state) => state.wallet)

  return useMemo(() => {
    if (selectedWalletSlug === 'all') {
      // Sum all wallets' balances
      return wallets
        .reduce((total, wallet) => {
          return total + parseFloat(wallet.totalBalance || '0')
        }, 0)
        .toFixed(2)
    } else {
      // Get specific wallet balance
      const wallet = wallets.find((w) => w.id === selectedWalletSlug)
      return wallet?.totalBalance || '0'
    }
  }, [wallets, selectedWalletSlug])
}

/**
 * Hook to get tokens for the selected wallet and network
 */
export function useWalletTokens() {
  const { wallets, selectedWalletSlug } = useAppSelector((state) => state.wallet)
  const selectedNetworkSlug = useAppSelector((state) => state.app.selected_network_slug)

  return useMemo(() => {
    const tokens: Array<EVMNativeToken | ERC20Token> = []

    // Get wallets to process
    const walletsToProcess =
      selectedWalletSlug === 'all' ? wallets : wallets.filter((w) => w.id === selectedWalletSlug)

    walletsToProcess.forEach((wallet) => {
      if (selectedNetworkSlug === 'all') {
        // Show all chains' tokens
        Object.values(wallet.chainBalances).forEach((chainBalance) => {
          // Add native token
          if (chainBalance.nativeToken) {
            tokens.push(chainBalance.nativeToken)
          }
          // Add ERC20 tokens
          tokens.push(...chainBalance.erc20Tokens)
        })
      } else {
        // Show only selected network's tokens
        const chainBalance = wallet.chainBalances[selectedNetworkSlug]
        if (chainBalance) {
          // Add native token
          if (chainBalance.nativeToken) {
            tokens.push(chainBalance.nativeToken)
          }
          // Add ERC20 tokens
          tokens.push(...chainBalance.erc20Tokens)
        }
      }
    })

    // Remove duplicates by token id (in case of "all wallets")
    const uniqueTokens = tokens.reduce(
      (acc, token) => {
        const existing = acc.find((t) => t.id === token.id)
        if (existing) {
          // Aggregate balances for the same token across wallets
          const existingBalance = parseFloat(existing.balance || '0')
          const newBalance = parseFloat(token.balance || '0')
          existing.balance = (existingBalance + newBalance).toString()
        } else {
          acc.push({ ...token })
        }
        return acc
      },
      [] as Array<EVMNativeToken | ERC20Token>
    )

    return uniqueTokens
  }, [wallets, selectedWalletSlug, selectedNetworkSlug])
}

/**
 * Hook to get the selected wallet address
 */
export function useWalletAddress() {
  const { wallets, selectedWalletSlug } = useAppSelector((state) => state.wallet)

  return useMemo(() => {
    if (selectedWalletSlug === 'all') {
      // Return first wallet's address for "all"
      return wallets[0]?.address || ''
    } else {
      const wallet = wallets.find((w) => w.id === selectedWalletSlug)
      return wallet?.address || ''
    }
  }, [wallets, selectedWalletSlug])
}
