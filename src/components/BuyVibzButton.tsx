import React, { useState } from 'react';
import { Loader2, DollarSign } from 'lucide-react';
import { StandardRedButton } from './ui/StandardRedButton';
import { StandardBeigeButton } from './ui/StandardBeigeButton';

interface BuyVibzButtonProps {
  onPurchaseClick?: () => void;
}

export function BuyVibzButton({ onPurchaseClick }: BuyVibzButtonProps) {
  const [isLoading] = useState(false);

  const handleClick = () => {
    if (onPurchaseClick) {
      onPurchaseClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="btn-vibz-beige gap-2 font-poppins"
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" size={14} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          <DollarSign size={14} />
          <span>Buy $VIBZ</span>
        </>
      )}
    </button>
  );
}