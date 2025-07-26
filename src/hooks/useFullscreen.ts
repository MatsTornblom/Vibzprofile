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

    if (hasTriggered) {
      console.log('Fullscreen already triggered once');
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
  }, [isMeta, hasTriggered]);

  useEffect(() => {
    console.log('Setting up fullscreen hook...');
    
    // Handle fullscreen change events
    const handleFullscreenChange = () => {
      const isInFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isInFullscreen);
      console.log('Fullscreen state changed:', isInFullscreen);
    };

    // Auto-trigger fullscreen on ANY user interaction
    const handleUserInteraction = (event: Event) => {
      console.log('User interaction detected:', event.type);
      enterFullscreen();
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Only add interaction listeners if not already triggered and not Meta browser
    if (!hasTriggered && !isMeta) {
      console.log('Adding interaction listeners...');
      document.addEventListener('click', handleUserInteraction, { once: true });
      document.addEventListener('touchstart', handleUserInteraction, { once: true });
      document.addEventListener('keydown', handleUserInteraction, { once: true });
      document.addEventListener('mousemove', handleUserInteraction, { once: true });
      document.addEventListener('scroll', handleUserInteraction, { once: true });
    }

    return () => {
      console.log('Cleaning up fullscreen listeners...');
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('mousemove', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
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