import { useWalletCheck } from '@/hooks/useWalletCheck'
import BalanceSection from './BalanceSection'
import TokensSection from './TokensSection'

export default function Home() {
  const hasWallet = useWalletCheck()

  if (!hasWallet) {
    return null // Will redirect to welcome page
  }

  return (
    <div className="flex flex-col h-full p-4">
      <BalanceSection />
      <TokensSection />
    </div>
  )
}
