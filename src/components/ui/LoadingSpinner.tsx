import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 24, 
  className = '', 
  text 
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <Loader2 size={size} className="animate-spin text-pink-500" />
      {text && (
        <p className="text-white/60 text-sm">{text}</p>
      )}
    </div>
  );
}