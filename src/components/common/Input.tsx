/**
 * Input Component
 *
 * Accessible form input component with label, error handling, and various types.
 */

import React from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
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
    const inputId = id || `input-${generatedId}`;

    const baseStyles =
      'rounded-lg border px-4 py-3 text-base transition-colors duration-200 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-opacity-20 disabled:bg-neutral-100 disabled:cursor-not-allowed';

    const normalStyles =
      'border-neutral-300 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]';
    const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-red-500';

    const widthStyles = fullWidth ? 'w-full' : '';

    const paddingWithIconStyles = leftIcon
      ? 'pl-12'
      : rightIcon
        ? 'pr-12'
        : '';

    return (
      <div className={clsx(widthStyles, className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            className={clsx(
              baseStyles,
              error ? errorStyles : normalStyles,
              paddingWithIconStyles,
              widthStyles
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />

          {rightIcon && (
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-neutral-600">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
