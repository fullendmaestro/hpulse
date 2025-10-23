import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, KeyRound } from 'lucide-react'
import { privateKeyToAccount } from 'viem/accounts'
import { isAddress } from 'viem'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '@/store/hooks'
import { addWallet } from '@/store/slices/walletSlice'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from '@/components/ui/empty'
import BottomModal from '@/components/buttom-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import type { Wallet as WalletType } from '@/store/types'

export default function Welcome() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [privateKey, setPrivateKey] = useState('')
  const [walletName, setWalletName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleAddWallet = async () => {
    if (!privateKey.trim()) {
      toast.error('Please enter a private key')
      return
    }

    setIsLoading(true)

    try {
      // Ensure private key has 0x prefix
      const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`

      // Validate private key format (should be 64 hex characters + 0x prefix)
      if (!/^0x[a-fA-F0-9]{64}$/.test(formattedPrivateKey)) {
        throw new Error('Invalid private key format. Must be 64 hex characters.')
      }

      // Derive account from private key using viem
      const account = privateKeyToAccount(formattedPrivateKey as `0x${string}`)

      // Create wallet object
      const newWallet: WalletType = {
        id: uuidv4(),
        name: walletName.trim() || `Wallet ${Date.now()}`,
        totalbalance: '0',
        publicKey: account.publicKey,
        privateKey: formattedPrivateKey,
        address: account.address,
        erc20Assets: [],
        erc721Assets: [],
        evmTokenAssets: [],
      }

      // Validate the derived address
      if (!isAddress(newWallet.address)) {
        throw new Error('Invalid address derived from private key')
      }

      // Dispatch to store
      dispatch(addWallet(newWallet))

      // Show success message
      toast.success('Wallet added successfully!')

      // Close modal and navigate to home
      setIsModalOpen(false)
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Error adding wallet:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to add wallet. Please check your private key.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full p-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Wallet className="size-6" />
          </EmptyMedia>
          <EmptyTitle>No Wallet Found</EmptyTitle>
          <EmptyDescription>
            Get started by adding your first wallet to the extension. You'll need your private key
            to import an existing wallet.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => setIsModalOpen(true)} className="w-full max-w-xs">
            <KeyRound className="size-4 mr-2" />
            Add Wallet
          </Button>
        </EmptyContent>
      </Empty>

      <BottomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Wallet"
        footerComponent={
          <>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleAddWallet} className="flex-1" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Wallet'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wallet-name">Wallet Name (Optional)</Label>
            <Input
              id="wallet-name"
              placeholder="My Wallet"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="private-key">Private Key</Label>
            <Input
              id="private-key"
              type="password"
              placeholder="0x... or paste without 0x prefix"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Your private key is stored locally and never shared. Make sure you trust this device.
            </p>
          </div>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              <strong>Security Warning:</strong> Never share your private key with anyone. Anyone
              with your private key can access your funds.
            </p>
          </div>
        </div>
      </BottomModal>
    </div>
  )
}
