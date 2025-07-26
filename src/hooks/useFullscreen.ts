import { useCallback, useEffect, useState } from 'react';
import { isMetaBrowser } from '../lib/browser';

export function useFullscreen(autoTrigger = false) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMeta = isMetaBrowser();

  const toggleFullscreen = useCallback(async () => {
    // Skip fullscreen for Meta browsers
    if (isMeta) {
      return;
    }

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      // Silently handle fullscreen errors - don't disrupt user experience
      console.debug('Fullscreen request failed:', err);
    }
  }, [isMeta]);

  useEffect(() => {
    // Handle fullscreen change events
    const handleFullscreenChange = () => {
      const isInFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isInFullscreen);
    };

    // Auto-trigger fullscreen on user interaction
    const handleUserInteraction = () => {
      if (autoTrigger && !document.fullscreenElement && !isMeta) {
        toggleFullscreen();
        // Remove listeners after first interaction
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    if (autoTrigger) {
      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('touchstart', handleUserInteraction);
      document.addEventListener('keydown', handleUserInteraction);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (autoTrigger) {
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      }
    };
  }, [isMeta, autoTrigger, toggleFullscreen]);

  return { isFullscreen, toggleFullscreen };
}