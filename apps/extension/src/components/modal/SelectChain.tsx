import { useApp, useAppDispatch, setSelectedNetwork } from '@/store'
import Text from '@/components/text'

import BottomModal from '@/components/buttom-modal'
import { SearchInput } from '@/components/ui/input/search-input'
import { CheckCircle, Plus } from 'lucide-react'
import { cn } from '@hpulse/ui/lib/utils'
import { useState } from 'react'
import { toast } from 'sonner'

const SelectChain = ({ isVisible, onClose }: { isVisible: boolean; onClose: VoidFunction }) => {
  const dispatch = useAppDispatch()
  const chains = useApp().networks
  const selected_network = useApp().selected_network_slug

  const [searchQuery, setSearchQuery] = useState('')

  // Filter chains based on search query
  const filteredChains = chains.filter((chain) =>
    chain.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectChain = (chainSlug: string) => {
    dispatch(setSelectedNetwork(chainSlug))
    onClose()
    toast.success('Chain switched successfully')
  }

  return (
    <>
      <BottomModal
        isOpen={isVisible}
        onClose={onClose}
        fullScreen
        title="Switch Chain"
        className="h-full"
      >
        <>
          <div className="flex items-center gap-2 mb-6">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by chain name"
              onClear={() => setSearchQuery('')}
            />

            <div
              className="bg-secondary-100 hover:bg-secondary-200 px-4 py-3 text-muted-foreground rounded-xl cursor-pointer transition-colors"
              onClick={() => toast.info('Add custom chain coming soon!')}
            >
              <Plus size={20} />
            </div>
          </div>

          <div className="space-y-3">
            {filteredChains.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No chains found matching your search
              </div>
            ) : (
              filteredChains.map((chain) => {
                const isSelected = selected_network === chain.nameSlug
                return (
                  <div
                    key={chain.nameSlug}
                    className={cn(
                      'bg-secondary-100 hover:bg-secondary-200 rounded-xl w-full transition-colors',
                      isSelected && 'ring-2 ring-primary'
                    )}
                  >
                    <div
                      onClick={() => handleSelectChain(chain.nameSlug)}
                      className="flex flex-1 items-center px-4 py-3.5 cursor-pointer relative"
                    >
                      <div className="flex items-center flex-1 gap-3">
                        <img
                          src={chain.logoURL}
                          alt={chain.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />

                        <Text size="sm" className="font-bold text-foreground">
                          {chain.name}
                        </Text>
                      </div>

                      <div className="ml-auto flex items-center">
                        {isSelected && (
                          <CheckCircle size={24} className="ml-2 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </>
      </BottomModal>
    </>
  )
}

export default SelectChain
