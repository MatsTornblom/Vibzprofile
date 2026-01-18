import React from 'react';

interface StandardBeigeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function StandardBeigeButton({ children, className, ...props }: StandardBeigeButtonProps) {
  return (
    <button
      {...props}
      className={`bg-vibz-button-beige hover:bg-vibz-button-beige-hover text-vibz-red border-2 border-vibz-red
        rounded-full px-6 py-2 font-poppins font-thin transition-colors
        focus:outline-none focus:ring-2 focus:ring-vibz-red/50 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className || ''}`}
    >
      {children}
    </button>
  );
}
