import { cn } from '@hpulse/ui/lib/utils'
import React, { type ReactNode } from 'react'

export type PageHeaderProps = {
  className?: string
  children: ReactNode
}

const PageHeader = React.memo(({ children, className }: PageHeaderProps) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-10 w-full panel-width backdrop-blur-lg isolate border-b border-border-bottom/50 panel-width flex items-center justify-between px-3 py-2',
        className
      )}
    >
      {children}
    </header>
  )
})

PageHeader.displayName = 'PageHeader'
export { PageHeader }
