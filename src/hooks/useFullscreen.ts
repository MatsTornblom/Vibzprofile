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
    const handleFullscreenChange = () => {
      const isInFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isInFullscreen);
      
      // Only try to re-enter fullscreen if not in Meta browser and user hasn't explicitly exited
      if (!isInFullscreen && !isMeta) {
        document.documentElement.requestFullscreen().catch(err => {
          // Silently handle fullscreen errors
          console.debug('Failed to re-enter fullscreen:', err);
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isMeta]);

  return { isFullscreen, toggleFullscreen };
}