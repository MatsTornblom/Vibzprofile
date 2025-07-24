// Use a fixed version that changes with deployments
export const APP_VERSION = '1.0.0';

// Development build number - use a fixed value per server start
export const BUILD_NUMBER = import.meta.env.DEV 
  ? '__DEV__'  // Fixed value for development
  : '0';       // Use '0' in production

// Check if the app needs to reload
export async function checkForNewVersion(force = false) {
  if (import.meta.env.DEV) {
    // In development, only reload on force
    if (force) {
      window.location.reload();
    }
  } else {
    // In production, check version number
    const currentVersion = localStorage.getItem('app_version');
    if (!currentVersion || currentVersion !== APP_VERSION || force) {
      localStorage.setItem('app_version', APP_VERSION);
      try {
        await window.caches?.keys().then(names => {
          names.forEach(name => {
            window.caches?.delete(name);
          });
        });
      } catch (err) {
        console.warn('Failed to clear cache:', err);
      }
      window.location.reload();
    }
  }
}