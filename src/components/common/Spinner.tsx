/**
 * Spinner Component
 *
 * Loading spinner with different sizes and variants.
 */

import React from 'react';
import { clsx } from 'clsx';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  label?: string;
  fullScreen?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  label = 'Loading...',
  fullScreen = false,
}) => {
  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const colorStyles = {
    primary: 'text-[var(--color-primary)]',
    secondary: 'text-[var(--color-secondary)]',
    white: 'text-white',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg
        className={clsx('animate-spin', sizeStyles[size], colorStyles[variant])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="status"
        aria-label={label}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>

      {label && <span className="text-sm text-neutral-600">{label}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Skeleton Loader Component
export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
}) => {
  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
  };

  return (
    <div
      className={clsx(
        'animate-pulse bg-neutral-200',
        variantStyles[variant],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      aria-label="Loading..."
    />
  );
};

// Loading Dots Component
export interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'white';
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 'md',
  variant = 'primary',
}) => {
  const dotSizeStyles = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
  };

  const colorStyles = {
    primary: 'bg-[var(--color-primary)]',
    secondary: 'bg-[var(--color-secondary)]',
    white: 'bg-white',
  };

  return (
    <div className="flex items-center gap-1" role="status" aria-label="Loading">
      <div
        className={clsx(
          'rounded-full animate-pulse',
          dotSizeStyles[size],
          colorStyles[variant]
        )}
        style={{ animationDelay: '0ms' }}
      />
      <div
        className={clsx(
          'rounded-full animate-pulse',
          dotSizeStyles[size],
          colorStyles[variant]
        )}
        style={{ animationDelay: '150ms' }}
      />
      <div
        className={clsx(
          'rounded-full animate-pulse',
          dotSizeStyles[size],
          colorStyles[variant]
        )}
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
};
