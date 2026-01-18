import React from 'react';

interface StandardRedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
}

export function StandardRedButton({ children, className, loading = false, disabled, ...props }: StandardRedButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`btn-vibz-red gap-2 ${className || ''}`}
    >
      {children}
    </button>
  );
}
