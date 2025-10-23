import { X } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer'
import React, { useCallback } from 'react'
import { cn } from '@hpulse/ui/lib/utils'
import { Button } from './ui/button'
import { isSidePanel } from '@/utils/ui'

export const BottomModalClose = () => {
  return (
    <DrawerClose asChild>
      <Button variant={'ghost'} size={'icon'} className="size-12">
        <X size={18} />
      </Button>
    </DrawerClose>
  )
}

type BottomModalProps = React.PropsWithChildren<{
  /*
   * is the modal open
   */
  isOpen: boolean
  /*
   * title of the modal
   */
  title?: string | React.ReactNode
  /*
   * callback when the modal is closed
   */
  onClose?: () => void
  /*
   * should the modal be prevented from closing
   */
  disableClose?: boolean
  /*
   * custom class names for the modal
   */
  className?: string
  /*
   * custom class names for the container
   */
  containerClassName?: string
  /*
   * custom class names for the content
   */
  contentClassName?: string
  /*
   * custom class names for the header
   */
  headerClassName?: string
  /*
   * callback when the action button is clicked
   */
  onActionButtonClick?: () => void
  /*
   * should the action button be hidden
   */
  hideActionButton?: boolean
  /*
   * custom action button
   */
  actionButton?: React.ReactNode
  /*
   * custom secondary action button
   */
  secondaryActionButton?: React.ReactNode
  /*
   * custom footer component
   */
  footerComponent?: React.ReactNode
  /*
   * should the modal be full screen
   */
  fullScreen?: boolean
  /*
   * direction of the modal
   */
  direction?: 'top' | 'bottom' | 'left' | 'right'
}>

const BottomModal: React.FC<BottomModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  className,
  disableClose,
  actionButton,
  onActionButtonClick,
  containerClassName,
  headerClassName,
  contentClassName,
  hideActionButton,
  secondaryActionButton,
  footerComponent,
  fullScreen,
  direction = 'bottom',
}) => {
  const container = document.getElementById('popup-layout')?.parentNode as HTMLElement

  const handleCloseAction = useCallback(() => {
    if (!disableClose) {
      onClose?.()
    }
  }, [disableClose, onClose])

  if (!container) {
    return null
  }

  return (
    <Drawer
      container={container}
      open={isOpen}
      direction={direction}
      dismissible={!disableClose}
      onOpenChange={(open) => {
        if (!open) {
          onActionButtonClick?.()
          handleCloseAction()
        }
      }}
    >
      {/**
       * This is added to avoid the console errors from vaul 1.1.2:
       * https://github.com/emilkowalski/vaul/issues/523
       */}
      <VisuallyHidden>
        <DrawerTitle></DrawerTitle>
      </VisuallyHidden>

      <DrawerContent
        showHandle={!fullScreen}
        className={cn(
          'bg-secondary-50',
          !isSidePanel && 'max-panel-height',
          fullScreen && 'h-screen rounded-none',
          containerClassName,
          contentClassName
        )}
      >
        <DrawerHeader
          className={cn(
            'flex items-center justify-between border-b border-border-bottom/50',
            !title && !secondaryActionButton && 'border-none',
            headerClassName
          )}
        >
          <div className="flex items-center justify-center size-12">
            {secondaryActionButton ? secondaryActionButton : null}
          </div>

          <h3 className="text-mdl font-bold">{title}</h3>

          {hideActionButton ? <div className="flex items-center size-12" /> : <BottomModalClose />}
        </DrawerHeader>

        <div
          className={cn(
            'p-4 overflow-auto',
            fullScreen ? 'max-h-full' : 'max-h-[calc(100%-112px)]',
            className
          )}
        >
          {children}
        </div>
        {footerComponent ? (
          <div className="flex gap-x-2 p-4 border-t border-border-bottom/50 mt-auto bg-secondary">
            {footerComponent}
          </div>
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}

export default BottomModal
