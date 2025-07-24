import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  variant?: 'inline' | 'toast';
}

export function ErrorMessage({ 
  message, 
  onClose, 
  variant = 'inline' 
}: ErrorMessageProps) {
  const baseClasses = 'flex items-center gap-3 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20';
  
  const variantClasses = {
    inline: 'px-4 py-3',
    toast: 'px-4 py-3 fixed bottom-4 right-4 z-50 backdrop-blur-sm'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      <AlertCircle size={20} className="flex-shrink-0" />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:text-red-400 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}