import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { checkForNewVersion } from '../lib/version';

export function VersionChecker() {
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const handleCheck = async () => {
    setChecking(true);
    await checkForNewVersion(true);
    setLastChecked(new Date());
    setChecking(false);
  };

  useEffect(() => {
    setLastChecked(new Date());
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={handleCheck}
        disabled={checking}
        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg 
          transition-all duration-200 disabled:opacity-50"
        title={lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : ''}
      >
        <RefreshCw 
          size={16} 
          className={`${checking ? 'animate-spin' : ''}`}
        />
      </button>
    </div>
  );
}