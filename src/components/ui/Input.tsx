import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, icon, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-light-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-light-400">{icon}</span>
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'block w-full rounded-lg border shadow-sm transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950',
              'placeholder-light-500',
              {
                'pl-10': icon,
                'border-dark-600 bg-dark-800 text-white focus:border-accent-500 focus:ring-accent-500': !error,
                'border-error-500 bg-error-50 text-error-900 focus:border-error-500 focus:ring-error-500': error,
              },
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-error-400" role="alert">
            {error}
          </p>
        )}
        {helper && !error && (
          <p id={`${inputId}-helper`} className="text-sm text-light-400">
            {helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';