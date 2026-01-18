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
      className={`bg-vibz-button-red hover:bg-vibz-button-red-hover text-vibz-bg shadow-lg hover:shadow-xl
        rounded-full px-6 py-2 font-deaugusta font-thin transition-all
        focus:outline-none focus:ring-2 focus:ring-vibz-button-red/50 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className || ''}`}
    >
      {children}
    </button>
  );
}
