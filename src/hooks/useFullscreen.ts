import { useCallback, useEffect, useState } from 'react';
import { isMetaBrowser } from '../lib/browser';

export function useFullscreen() {
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

    // Auto-trigger fullscreen on ANY user interaction
    const handleUserInteraction = () => {
      if (!document.fullscreenElement && !isMeta) {
        toggleFullscreen();
        // Remove listeners after first interaction
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
        document.removeEventListener('mousemove', handleUserInteraction);
        document.removeEventListener('scroll', handleUserInteraction);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Listen for ANY user interaction
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('mousemove', handleUserInteraction);
    document.addEventListener('scroll', handleUserInteraction);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('mousemove', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };
  }, [isMeta, toggleFullscreen]);

  return { isFullscreen, toggleFullscreen };
}