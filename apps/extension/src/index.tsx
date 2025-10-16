import '@hpulse/ui/globals.css'

import React from 'react'
import { createRoot } from 'react-dom/client'

const root = createRoot(document.querySelector('#root')!)
if (root) {
  root.render(<React.StrictMode></React.StrictMode>)
}
