import type { ReactNode } from 'react'
import { SparkleIcon, FileQuestionIcon } from 'lucide-react'
import type { Location } from 'react-router-dom'
import { cn } from '@hpulse/ui/lib/utils'
import { Button } from './components/ui/button'
import { useAuth } from './hooks/useAuth'
import { isSidePanel } from './utils/ui'
import BottomNav from './components/bottom-nav'
import { GeneralHeader } from './header'

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

  if (
    path.includes('onboarding') ||
    path === '/' ||
    path === '/welcome' ||
    path === '/chat' ||
    path.includes('forgotPassword')
  ) {
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
          'w-full h-full flex flex-col',
          isOnboarding
            ? 'max-w-[28rem] max-h-[38.875rem] m-auto bg-secondary border border-secondary-200 rounded-3xl'
            : 'bg-secondary'
        )}
      >
        <div
          key={props.location?.pathname}
          id="popup-layout"
          className="flex flex-col h-full w-full overflow-hidden"
        >
          <div className="flex-shrink-0">
            <GeneralHeader />
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">{props.children}</div>
          {isBottomNavVisible && (
            <div className="flex-shrink-0">
              <BottomNav />
            </div>
          )}
        </div>
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
