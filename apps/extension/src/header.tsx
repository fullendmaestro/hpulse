import { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { cn, sliceWord } from '@hpulse/ui/lib/utils'
import { ChevronDown, Menu, Sparkle, ArrowLeft, History } from 'lucide-react'
import { PageHeader } from '@/components/header'
import { useSelectedChain, useWallet } from '@/store'
import SelectWallet from './components/modal/SelectWallet'
import SelectChain from './components/modal/SelectChain'
import { ChatHistoryModal } from './components/ChatHistoryModal'
import { allNetworksCompositeLogos } from '@/contants/networks'

export const GeneralHeader = (props: {
  disableWalletButton?: boolean
  currentSessionId?: string | null
  onSessionSelect?: (sessionId: string) => void
  onNewSession?: () => void
}) => {
  const selectedChain = useSelectedChain()
  const { wallets, selectedWalletSlug } = useWallet()
  const location = useLocation()
  const navigate = useNavigate()

  const [showSelectWallet, setShowSelectWallet] = useState(false)
  const [showSelectChain, setShowSelectChain] = useState(false)
  const [showChatHistory, setShowChatHistory] = useState(false)

  // Determine if we're on the chat page
  const isChatPage = location.pathname === '/chat'

  // Find the selected wallet
  const selectedWallet = useMemo(() => {
    if (selectedWalletSlug === 'all') {
      return { name: 'All Wallets', address: '' }
    }
    return wallets.find((w) => w.id === selectedWalletSlug) || wallets[0]
  }, [wallets, selectedWalletSlug])

  const walletName = selectedWallet?.name || 'Wallet'

  const handleLeftIconClick = () => {
    if (isChatPage) {
      navigate('/')
    }
  }

  const handleRightIconClick = () => {
    if (!isChatPage) {
      // Navigate to chat
      navigate('/chat')
    }
    // For chat page, the history modal is handled by ChatHistoryModal component
  }

  // Render composite icon for "All" networks
  const renderNetworkIcon = () => {
    if (!selectedChain) {
      // "All Networks" case
      return (
        <div className="relative size-5">
          <div className="grid grid-cols-2 gap-[0.5px] h-full w-full">
            {allNetworksCompositeLogos.map((logo, index) => (
              <img
                key={index}
                src={logo}
                alt=""
                className="h-full w-full object-cover rounded-full"
              />
            ))}
          </div>
        </div>
      )
    }

    return (
      <img
        src={selectedChain.logoURL}
        alt={selectedChain.name}
        className="size-5 rounded-full overflow-hidden object-cover"
      />
    )
  }

  return (
    <>
      <PageHeader>
        <div className="flex items-center bg-secondary-200 rounded-full overflow-hidden">
          <button
            className="py-2 pr-1.5 pl-2.5 text-foreground/75 hover:text-foreground transition-colors"
            onClick={isChatPage ? handleLeftIconClick : undefined}
          >
            {isChatPage ? <ArrowLeft size={20} /> : <Menu size={20} />}
          </button>
          <div className="h-5 w-px bg-secondary-300" />

          {isChatPage ? (
            <button
              className="py-2 pl-1.5 pr-2.5 text-foreground/75 hover:text-foreground transition-colors"
              onClick={() => setShowChatHistory(true)}
            >
              <History size={20} />
            </button>
          ) : (
            <button
              className="py-2 pl-1.5 pr-2.5 text-foreground/75 hover:text-foreground transition-colors"
              onClick={handleRightIconClick}
            >
              <Sparkle size={20} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowSelectWallet(true)}
          disabled={props.disableWalletButton}
          className={cn(
            'flex items-center justify-center relative cursor-pointer bg-secondary-200 hover:bg-secondary-300 border-solid rounded-full px-3.5 py-1.5 transition-colors',
            props.disableWalletButton && 'opacity-50 cursor-not-allowed'
          )}
        >
          <img
            className="size-6 mr-1 rounded-full"
            src="/hpulse/hpulseLogo.png"
            alt="wallet avatar"
          />

          <span className="truncate text-sm font-bold max-w-[96px]" title={walletName}>
            {sliceWord(walletName, 8, 0)}
          </span>

          <ChevronDown className="size-4 ml-1 text-muted-foreground" />
        </button>

        <button
          onClick={() => setShowSelectChain(true)}
          className="bg-secondary-200 hover:bg-secondary-300 rounded-full px-3 py-2 transition-colors flex items-center gap-1"
        >
          {renderNetworkIcon()}
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </PageHeader>

      <SelectWallet isVisible={showSelectWallet} onClose={() => setShowSelectWallet(false)} />

      <SelectChain isVisible={showSelectChain} onClose={() => setShowSelectChain(false)} />

      {isChatPage && (
        <ChatHistoryModal
          isVisible={showChatHistory}
          onClose={() => setShowChatHistory(false)}
          currentSessionId={props.currentSessionId}
          onSessionSelect={props.onSessionSelect || (() => {})}
          onNewSession={props.onNewSession || (() => {})}
        />
      )}
    </>
  )
}
