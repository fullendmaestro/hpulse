import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn, sliceWord } from '@hpulse/ui/lib/utils'
import { useWalletAddress } from '@/hooks/useWalletBalances'
import { toast } from 'sonner'

export const CopyAddress = () => {
  const [isWalletAddressCopied, setIsWalletAddressCopied] = useState(false)
  const address = useWalletAddress()

  const handleCopyAddress = () => {
    if (!address) return

    navigator.clipboard.writeText(address)
    setIsWalletAddressCopied(true)
    toast.success('Address copied to clipboard')

    setTimeout(() => setIsWalletAddressCopied(false), 2000)
  }

  if (!address) {
    return null
  }

  return (
    <button
      onClick={handleCopyAddress}
      className={cn(
        'text-xs !leading-[16px] font-medium text-muted-foreground flex items-center gap-x-[6px] border border-secondary-200 py-[5px] pl-4 pr-3 rounded-full transition-colors relative font-mono',
        isWalletAddressCopied
          ? 'text-primary outline outline-primary bg-primary/10 justify-center'
          : 'bg-secondary-100 hover:bg-secondary-200'
      )}
    >
      {isWalletAddressCopied ? 'Copied!' : sliceWord(address, 6, 4)}

      {isWalletAddressCopied ? (
        <Check className="size-4" />
      ) : (
        <Copy className="text-secondary-600 size-4" />
      )}
    </button>
  )
}
