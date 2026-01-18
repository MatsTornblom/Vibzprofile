import React, { useState } from 'react';
import { Loader2, DollarSign } from 'lucide-react';
import { StandardRedButton } from './ui/StandardRedButton';
import { StandardBeigeButton } from './ui/StandardBeigeButton';

interface BuyVibzButtonProps {
  onPurchaseClick?: () => void;
  isLoading?: boolean;
}

export function BuyVibzButton({ onPurchaseClick, isLoading = false }: BuyVibzButtonProps) {

  const handleClick = () => {
    if (onPurchaseClick) {
      onPurchaseClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="btn-vibz-beige gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" size={14} />
          <span>Processing...</span>
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