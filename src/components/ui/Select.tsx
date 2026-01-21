import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, options, placeholder, className = '', id, ...props },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-dark-300 mb-2"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full px-4 py-3 rounded-xl text-white transition-all duration-300
            bg-white/5 border border-white/10 backdrop-blur-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none cursor-pointer
            ${error ? 'border-rose-500/50 focus:ring-rose-500/50' : ''}
            ${className}
          `}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="bg-dark-800 text-dark-400">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-dark-800 text-white">
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
