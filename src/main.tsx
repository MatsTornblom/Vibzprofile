import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { checkForNewVersion } from './lib/version';

// Only check version in production
if (!import.meta.env.DEV) {
  // Check for new version on app load
  checkForNewVersion();

  // Also check periodically
  setInterval(checkForNewVersion, 5 * 60 * 1000); // Check every 5 minutes
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);