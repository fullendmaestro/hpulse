import { Route, Routes, useLocation } from 'react-router-dom'
import { GlobalLayout } from './layout'
import Home from './pages/home/page'
import Welcome from './pages/welcome/page'
import ChatPage from './pages/chat/page'

export default function AppRoutes() {
  const location = useLocation()

  return (
    <div className="h-full w-full">
      <GlobalLayout location={location}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </GlobalLayout>
    </div>
  )
}
