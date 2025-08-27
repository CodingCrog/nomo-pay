import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './utils/debug' // Import debug utilities
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'
import { DataProvider } from './context/DataProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </DataProvider>
  </StrictMode>,
)
