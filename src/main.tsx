import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Order matters: fonts and tokens first, then component styles (pulled in by
// App), then the cross-section polish layer last so it can refine both.
import './styles/fonts.css';
import './styles/global.css';
import App from './App';
import './styles/sections.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
