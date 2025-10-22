import type { ReactNode } from 'react'
import { SparkleIcon, FileQuestionIcon } from 'lucide-react'
import { cn } from '@hpulse/ui/lib/utils'
import { Button } from './components/ui/button'
import { useAuth } from './hooks/useAuth'
import { isSidePanel } from './utils/ui'
import BottomNav from './components/bottom-nav'

type GlobalLayoutProps = {
  children?: ReactNode
  location?: Location
}

const dAppPages = new Set(['/sign'])

const nestedPages = ['/']

const showBottomNav = (path?: string) => {
  if (!path) {
    return false
  }

  if (path.includes('onboarding') || path === '/' || path.includes('forgotPassword')) {
    return false
  }

  return true
}

export const GlobalLayout = (props: GlobalLayoutProps) => {
  const auth = useAuth()

  const isFullScreen =
    window.innerWidth >= 450 && !isSidePanel && !dAppPages.has(props.location?.pathname ?? '')

  const isOnboarding = props.location?.pathname.includes('onboarding')

  const isBottomNavVisible =
    auth?.locked && props.location?.pathname && showBottomNav(props.location.pathname)

  return (
    <>
      {isFullScreen && <LayoutHeader />}

      <div
        className={cn(
          'max-w-full relative m-auto flex flex-col overflow-hidden',
          isOnboarding
            ? 'h-[38.875rem] w-[28rem] bg-secondary border border-secondary-200 rounded-3xl'
            : 'bg-secondary min-h-[37.5rem] h-full'
        )}
      >
        <div
          key={props.location?.pathname}
          id="popup-layout"
          className="flex-1 h-[37.5rem] overflow-auto flex flex-col"
        >
          {props.children}
        </div>

        {isBottomNavVisible && <BottomNav />}
      </div>
    </>
  )
}

export const LayoutHeader = () => {
  return (
    <div className="fixed top-6 left-8 right-8 flex flex-row justify-between items-center">
      <SparkleIcon size={24} />

      <Button variant={'ghost'} asChild className="gap-1.5 h-auto">
        <a target="_blank" rel="noreferrer" href="">
          <FileQuestionIcon size={24} />
          Help
        </a>
      </Button>
    </div>
  )
}
