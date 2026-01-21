import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-dark-300 mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            glass-input
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-rose-500/50 focus:ring-rose-500/50 focus:border-rose-500/50' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
        {helperText && !error && (
          <p className="mt-2 text-sm text-dark-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
