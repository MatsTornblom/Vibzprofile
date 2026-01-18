import React from 'react';

interface StandardBeigeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function StandardBeigeButton({ children, className, ...props }: StandardBeigeButtonProps) {
  return (
    <button
      {...props}
      className={`btn-vibz-beige gap-2 ${className || ''}`}
    >
      {children}
    </button>
  );
}
