import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nProvider } from './lib/i18n'
import './index.css'
import App from './App.tsx'
import { StorageBoundary } from './components/StorageBoundary'
import { registerPwa } from './lib/pwaUpdate'

registerPwa()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <StorageBoundary>
        <App />
      </StorageBoundary>
    </I18nProvider>
  </StrictMode>,
)
