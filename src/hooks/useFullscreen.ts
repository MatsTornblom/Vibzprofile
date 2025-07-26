import { useCallback, useEffect, useState } from 'react';
import { isMetaBrowser } from '../lib/browser';

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMeta = isMetaBrowser();

  const toggleFullscreen = useCallback(async () => {
    // Skip fullscreen for Meta browsers
    if (isMeta) {
      console.log('Skipping fullscreen for Meta browser');
      return;
    }

    try {
      if (!document.fullscreenElement) {
        console.log('Requesting fullscreen...');
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
        console.log('Fullscreen requested successfully');
      }
    } catch (err) {
      // Silently handle fullscreen errors - don't disrupt user experience
      console.log('Fullscreen request failed:', err);
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
      console.log('User interaction detected, attempting fullscreen...');
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
    console.log('Setting up fullscreen event listeners...');
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