import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './game/game.css'
import GameApp from './game/GameApp'

createRoot(document.getElementById('game-root')!).render(
  <StrictMode>
    <GameApp />
  </StrictMode>,
)
