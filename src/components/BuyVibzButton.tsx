import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { redirectToCheckout } from '../lib/api/stripe';

export function BuyVibzButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await redirectToCheckout();
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error instanceof Error ? error.message : 'Failed to start checkout process');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="bg-pink-500 hover:bg-pink-600 text-white py-1.5 px-3 rounded-lg
          transition-colors disabled:opacity-50 disabled:hover:bg-pink-500 flex items-center gap-2 text-sm"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={14} />
            <span>Processing...</span>
          </>
        ) : (
          <span>Buy $VIBZ</span>
        )}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}