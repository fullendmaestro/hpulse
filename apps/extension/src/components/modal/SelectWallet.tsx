import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet, useAppDispatch } from '@/store'
import { setSelectedWallet } from '@/store/slices/walletSlice'
import { privateKeyToAccount } from 'viem/accounts'
import { isAddress } from 'viem'
import { v4 as uuidv4 } from 'uuid'
import { addWallet } from '@/store/slices/walletSlice'
import { cn, sliceWord } from '@hpulse/ui/lib/utils'

import BottomModal from '@/components/buttom-modal'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/input/search-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, CheckCircle, Wallet as WalletIcon, Copy, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Wallet as WalletType } from '@/store/types'

type SelectWalletProps = {
  readonly isVisible: boolean
  readonly onClose: VoidFunction
  readonly title?: string
}

const SelectWallet = ({ isVisible, onClose, title = 'Your Wallets' }: SelectWalletProps) => {
  const dispatch = useAppDispatch()
  const { wallets, selectedWalletSlug } = useWallet()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false)
  const [privateKey, setPrivateKey] = useState('')
  const [walletName, setWalletName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Filter wallets based on search query
  const filteredWallets = wallets.filter(
    (wallet) =>
      wallet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wallet.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectWallet = (walletId: string) => {
    dispatch(setSelectedWallet(walletId))
    onClose()
    toast.success('Wallet selected')
  }

  const handleCopyAddress = (address: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(address)
    toast.success('Address copied to clipboard')
  }

  const handleAddWallet = async () => {
    if (!privateKey.trim()) {
      toast.error('Please enter a private key')
      return
    }

    setIsLoading(true)

    try {
      const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`

      if (!/^0x[a-fA-F0-9]{64}$/.test(formattedPrivateKey)) {
        throw new Error('Invalid private key format. Must be 64 hex characters.')
      }

      const account = privateKeyToAccount(formattedPrivateKey as `0x${string}`)

      const newWallet: WalletType = {
        id: uuidv4(),
        name: walletName.trim() || `Wallet ${wallets.length + 1}`,
        publicKey: account.publicKey,
        privateKey: formattedPrivateKey,
        address: account.address,
        chainBalances: {},
        totalBalance: '0',
      }

      if (!isAddress(newWallet.address)) {
        throw new Error('Invalid address derived from private key')
      }

      dispatch(addWallet(newWallet))
      toast.success('Wallet added successfully!')

      // Reset form and close modal
      setPrivateKey('')
      setWalletName('')
      setIsAddWalletOpen(false)
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
    <>
      <BottomModal
        isOpen={isVisible}
        onClose={onClose}
        title={title}
        className="h-full mb-4"
        fullScreen
        footerComponent={
          <Button
            className="w-full"
            size={'md'}
            onClick={() => {
              setIsAddWalletOpen(true)
              onClose()
            }}
          >
            <Plus size={16} /> Add Wallet
          </Button>
        }
      >
        <div className="h-full">
          <SearchInput
            value={searchQuery}
            autoFocus={false}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by wallet name or address"
            onClear={() => setSearchQuery('')}
            className="mb-6"
          />

          <div className="flex flex-col rounded-2xl overflow-y-auto mb-4 py-1 gap-3.5">
            {filteredWallets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No wallets found' : 'No wallets available'}
              </div>
            ) : (
              filteredWallets.map((wallet) => {
                const isSelected = selectedWalletSlug === wallet.id
                return (
                  <div
                    key={wallet.id}
                    onClick={() => handleSelectWallet(wallet.id)}
                    className={cn(
                      'bg-secondary-100 hover:bg-secondary-200 rounded-xl w-full cursor-pointer transition-colors'
                      // isSelected && 'ring-2 ring-primary'
                    )}
                  >
                    <div className="flex items-center px-4 py-3.5 gap-3">
                      <div className="size-10 rounded-full bg-secondary-300 flex items-center justify-center">
                        <WalletIcon size={20} className="text-foreground/70" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-foreground text-sm">{wallet.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {sliceWord(wallet.address, 6, 4)}
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleCopyAddress(wallet.address, e)}
                        className="p-2 hover:bg-secondary-300 rounded-lg transition-colors"
                      >
                        <Copy size={16} className="text-muted-foreground" />
                      </button>

                      {isSelected && (
                        <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </BottomModal>

      <BottomModal
        isOpen={isAddWalletOpen}
        onClose={() => setIsAddWalletOpen(false)}
        title="Add Wallet"
        footerComponent={
          <>
            <Button
              variant="outline"
              onClick={() => setIsAddWalletOpen(false)}
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
            <Label htmlFor="wallet-name-add">Wallet Name (Optional)</Label>
            <Input
              id="wallet-name-add"
              placeholder="My Wallet"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="private-key-add">Private Key</Label>
            <Input
              id="private-key-add"
              type="password"
              placeholder="0x... or paste without 0x prefix"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Your private key is stored locally and never shared.
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
    </>
  )
}

export default SelectWallet
