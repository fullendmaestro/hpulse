import '@hpulse/ui/globals.css'
import './styles.css'
import './styles/styles_font.css'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

import App from './App'
import { queryClient } from './query-client'
import { ThemeProvider } from './components/theme-provider'
import StoreProvider from './store/StoreProvider'

const root = createRoot(document.querySelector('#root')!)
if (root) {
  root.render(
    <React.StrictMode>
      <StoreProvider>
        <MemoryRouter initialEntries={['/']}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </QueryClientProvider>
        </MemoryRouter>
      </StoreProvider>
    </React.StrictMode>
  )
}
