// Common in-app browser patterns
const IN_APP_PATTERNS = [
  'FBAN', 'FBAV', // Facebook
  'Instagram',
  'Line', 
  'WhatsApp',
  'wv', // WebView
  'LinkedIn',
  'Snapchat',
];

// Specifically detect Meta browsers
export function isMetaBrowser(): boolean {
  const ua = navigator.userAgent;
  return ua.includes('FBAN') || ua.includes('FBAV') || ua.includes('Instagram');
}

export function isInAppBrowser(): boolean {
  const ua = navigator.userAgent;
  return IN_APP_PATTERNS.some(pattern => ua.includes(pattern));
}

export function openInDefaultBrowser(url: string = window.location.href): void {
  // Try to force open in default browser
  window.open(url, '_system');

  // Fallback to normal window.open if _system doesn't work
  setTimeout(() => {
    window.open(url, '_blank');
  }, 100);
}

export function isVibzDomain(): boolean {
  return window.location.hostname.endsWith('.vibz.world');
}

export function isDevEnvironment(): boolean {
  const hasDevEnvVar = import.meta.env.VITE_DEV_MODE === 'true';
  const isNotVibzDomain = !isVibzDomain();

  return hasDevEnvVar || isNotVibzDomain;
}

export function getDevUserId(): string | undefined {
  return import.meta.env.VITE_DEV_USER_ID;
}