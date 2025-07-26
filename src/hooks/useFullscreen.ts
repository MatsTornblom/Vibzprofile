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

    // Auto-trigger fullscreen on valid user interactions (not mousemove)
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
      // Remove mousemove and scroll as they don't count as user gestures
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