// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
// src/main.tsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RagnarokAscension from './RagnarokAscension.jsx'
// IMPORTATION CRUCIALE DU PROVIDER
import { GameProvider } from './hooks/useGameState.jsx'; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* LE JEU DOIT ÊTRE À L'INTÉRIEUR DU PROVIDER */}
    <GameProvider>
      <RagnarokAscension />
    </GameProvider>
  </StrictMode>,
)