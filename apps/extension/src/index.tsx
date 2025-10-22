import '@hpulse/ui/globals.css'
import './styles.css'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

import App from './App'
import { queryClient } from './query-client'

const root = createRoot(document.querySelector('#root')!)
if (root) {
  root.render(
    <React.StrictMode>
      <MemoryRouter initialEntries={['/']}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </MemoryRouter>
    </React.StrictMode>
  )
}
