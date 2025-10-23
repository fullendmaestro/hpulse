import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'
import { useState } from 'react'
import { TokenCard } from './TokenCard'
import { useWalletTokens } from '@/hooks/useWalletBalances'
import { useApp } from '@/store'

const TokensSection = () => {
  const tokens = useWalletTokens()
  const { networks } = useApp()
  const [searchQuery, setSearchQuery] = useState('')

  // Filter tokens based on search
  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get chain info for a token
  const getChainInfo = (chainSlug: string) => {
    return networks.find((n) => n.nameSlug === chainSlug)
  }

  return (
    <section className="flex flex-col w-full px-5 pb-20">
      <header className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold">Your tokens</span>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => {}}
            className="p-1.5 h-auto bg-secondary-100 hover:bg-secondary-200"
          >
            <SearchIcon className="size-4" />
          </Button>
        </div>
      </header>

      {filteredTokens.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          {searchQuery ? 'No tokens found matching your search' : 'No tokens available'}
        </div>
      ) : (
        <div className={'w-full flex flex-col items-center justify-center gap-3'}>
          {filteredTokens.map((token) => {
            const chainInfo = getChainInfo(token.chainSlug)
            const balance = parseFloat(token.balance || '0')
            const usdValue = token.current_price
              ? (balance * token.current_price).toFixed(2)
              : undefined

            return (
              <TokenCard
                key={token.id}
                title={token.name}
                symbol={token.symbol}
                amount={token.balance}
                usdValue={usdValue}
                assetImg={token.logoUrl || chainInfo?.logoURL}
                balance={balance}
                percentChange24={token.price_change_24h}
                onClick={() => {
                  // Handle token click
                  console.log('Token clicked:', token)
                }}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}

export default TokensSection
