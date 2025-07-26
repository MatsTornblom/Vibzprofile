# Adding Fullscreen Functionality to Existing Vibz Apps

This guide shows you how to add the automatic fullscreen behavior to your existing Vibz applications.

## Files to Add

### 1. Create `src/lib/browser.ts`

```typescript
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
```

### 2. Create `src/hooks/useFullscreen.ts`

```typescript
import { useCallback, useEffect, useState } from 'react';
import { isMetaBrowser } from '../lib/browser';

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const isMeta = isMetaBrowser();

  const enterFullscreen = useCallback(async () => {
    if (isMeta) {
      console.log('Skipping fullscreen for Meta browser');
      return;
    }

    try {
      if (!document.fullscreenElement) {
        console.log('Requesting fullscreen...');
        await document.documentElement.requestFullscreen();
        setHasTriggered(true);
        console.log('Fullscreen requested successfully');
      }
    } catch (err) {
      console.log('Fullscreen request failed:', err);
    }
  }, [isMeta]);

  useEffect(() => {
    console.log('Setting up fullscreen hook...');
    
    // Handle fullscreen change events
    const handleFullscreenChange = () => {
      const isInFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isInFullscreen);
      console.log('Fullscreen state changed:', isInFullscreen);
      
      // Reset hasTriggered when user exits fullscreen so we can re-trigger
      if (!isInFullscreen) {
        console.log('Resetting hasTriggered - user exited fullscreen');
        setHasTriggered(false);
      }
    };

    // Auto-trigger fullscreen on valid user interactions
    const handleUserInteraction = (event: Event) => {
      console.log('User interaction detected:', event.type);
      enterFullscreen();
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Only add interaction listeners if not already triggered and not Meta browser
    if (!hasTriggered && !isMeta) {
      console.log('Adding interaction listeners...');
      // Only use interactions that count as "user gestures" for fullscreen API
      document.addEventListener('click', handleUserInteraction, { once: true });
      document.addEventListener('touchstart', handleUserInteraction, { once: true });
      document.addEventListener('keydown', handleUserInteraction, { once: true });
    }

    return () => {
      console.log('Cleaning up fullscreen listeners...');
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [enterFullscreen, hasTriggered, isMeta]);

  const toggleFullscreen = useCallback(async () => {
    if (isMeta) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.log('Fullscreen toggle failed:', err);
    }
  }, [isMeta]);

  return { isFullscreen, toggleFullscreen, enterFullscreen };
}
```

## Integration Steps

### Step 1: Add the hook to your main App component

```typescript
// In your App.tsx or main component file
import { useFullscreen } from './hooks/useFullscreen';

export default function App() {
  const { isFullscreen } = useFullscreen(); // This line activates the fullscreen behavior
  
  console.log('App rendered, fullscreen state:', isFullscreen);

  // Rest of your app code...
  return (
    <div className="min-h-screen">
      {/* Your existing app content */}
    </div>
  );
}
```

### Step 2: Install dependencies (if needed)

If your project doesn't already have React hooks support, make sure you have:

```bash
npm install react@^18.0.0 react-dom@^18.0.0
```

## Bolt.new Prompt

If you want to use Bolt.new to implement this, use this prompt:

```
Add automatic fullscreen functionality to this React app. The app should automatically enter fullscreen mode on any user interaction (click, touch, keypress) and re-enter fullscreen if the user exits with Escape key. Skip fullscreen for Meta browsers (Facebook, Instagram). 

Create:
1. A browser detection utility in src/lib/browser.ts that detects Meta browsers
2. A useFullscreen hook in src/hooks/useFullscreen.ts that handles the fullscreen logic
3. Integrate the hook in the main App component

The fullscreen should trigger automatically - users shouldn't need to click a button. It should work on mobile and desktop, and handle browser compatibility issues.
```

## Bolt.new Prompt

If you want to use Bolt.new to implement this, use this prompt:

```
Add automatic fullscreen functionality to this React app. The app should automatically enter fullscreen mode on any user interaction (click, touch, keypress) and re-enter fullscreen if the user exits with Escape key. Skip fullscreen for Meta browsers (Facebook, Instagram). 

Create:
1. A browser detection utility in src/lib/browser.ts that detects Meta browsers
2. A useFullscreen hook in src/hooks/useFullscreen.ts that handles the fullscreen logic
3. Integrate the hook in the main App component

The fullscreen should trigger automatically - users shouldn't need to click a button. It should work on mobile and desktop, and handle browser compatibility issues.
```

## Testing

After implementation:

1. **Load your app** - you should see console logs about setting up fullscreen
2. **Click anywhere** - app should enter fullscreen mode
3. **Press Escape** - app should exit fullscreen
4. **Click again** - app should re-enter fullscreen
5. **Test on mobile** - touch interactions should work
6. **Test in Facebook/Instagram** - should skip fullscreen gracefully

## Customization Options

### Remove console logs for production:
Remove or comment out the `console.log` statements in the hook.

### Add visual feedback:
```typescript
// In your component
const { isFullscreen } = useFullscreen();

return (
  <div className={`min-h-screen ${isFullscreen ? 'fullscreen-active' : ''}`}>
    {/* Your content */}
  </div>
);
```

### Manual fullscreen toggle:
```typescript
const { isFullscreen, toggleFullscreen } = useFullscreen();

// Add a button for manual control
<button onClick={toggleFullscreen}>
  {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
</button>
```

## Troubleshooting

**Fullscreen not working?**
- Check browser console for errors
- Ensure you're testing with actual user interactions (not programmatic triggers)
- Verify the hook is being called in your main component

**Not re-entering after Escape?**
- Make sure the `hasTriggered` state is being reset properly
- Check that event listeners are being re-added

**Issues on mobile?**
- Test with actual touch events, not mouse simulation
- Some mobile browsers have restrictions on fullscreen API

This implementation provides the same immersive, app-like experience across all your Vibz applications!