import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/globals.css'
import './styles/layout.css'
import './styles/buttons.css'
import './styles/hero.css'
import './styles/reveal.css'
import './styles/manifesto.css'
import './styles/catalog.css'
import './styles/engineering.css'
import './styles/human.css'
import './styles/final-cta.css'
import './styles/showcase.css'
import './styles/viewer3d.css'
import './styles/showroom.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)