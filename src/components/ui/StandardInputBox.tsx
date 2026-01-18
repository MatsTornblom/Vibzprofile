import React from 'react';

interface StandardInputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function StandardInputBox({ label, className, ...props }: StandardInputBoxProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm text-vibz-textbox-text font-poppins mb-2">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full bg-vibz-bg-textbox rounded-lg px-4 py-3 text-vibz-textbox-text font-poppins
          placeholder:text-vibz-textbox-text/40 border-2 border-vibz-frame
          focus:outline-none focus:border-vibz-frame focus:shadow-lg focus:shadow-vibz-frame/30
          transition-all disabled:opacity-50 disabled:cursor-not-allowed
          ${className || ''}`}
      />
    </div>
  );
}
