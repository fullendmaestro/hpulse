import { Route, Routes, useLocation } from 'react-router-dom'
import { GlobalLayout } from './layout'
import Home from './pages/home/page'
import Welcome from './pages/welcome/page'
import ChatPage from './pages/chat/page'

export default function AppRoutes() {
  const location = useLocation()
  const isChatPage = location.pathname === '/chat'

  // Chat page renders its own header with session management
  if (isChatPage) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-[28rem] h-[37.5rem] rounded-3xl shadow-xl bg-secondary overflow-hidden">
          <Routes>
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <GlobalLayout location={location}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </GlobalLayout>
    </div>
  )
}
