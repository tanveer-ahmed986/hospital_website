/**
 * Select Component
 *
 * Accessible dropdown select component with label and error handling.
 */

import React from 'react';
import { clsx } from 'clsx';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      fullWidth = false,
      className,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || `select-${generatedId}`;

    const baseStyles =
      'appearance-none rounded-lg border px-4 py-3 pr-10 text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-20 disabled:bg-neutral-100 disabled:cursor-not-allowed bg-white cursor-pointer';

    const normalStyles =
      'border-neutral-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]';
    const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-red-500';

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <div className={clsx(widthStyles, className)}>
        {label && (
          <label
            htmlFor={selectId}
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            className={clsx(
              baseStyles,
              error ? errorStyles : normalStyles,
              widthStyles
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${selectId}-error`
                : helperText
                  ? `${selectId}-helper`
                  : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown Arrow Icon */}
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {error && (
          <p id={`${selectId}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${selectId}-helper`} className="mt-1 text-sm text-neutral-600">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
