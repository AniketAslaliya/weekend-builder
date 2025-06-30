import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { initSentry, trackWebVitals } from '@/utils/monitoring';

// Initialize monitoring
initSentry();
trackWebVitals();

function removeSplash() {
  const splash = document.getElementById('splash-root');
  if (splash) splash.remove();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

removeSplash();