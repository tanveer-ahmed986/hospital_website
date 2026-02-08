/**
 * Card Component
 *
 * Reusable card container component for content sections.
 */

import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverable = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-lg bg-white transition-shadow duration-300';

    const variantStyles = {
      default: 'shadow-md',
      bordered: 'border border-neutral-200',
      elevated: 'shadow-lg',
    };

    const paddingStyles = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const hoverStyles = hoverable ? 'hover:shadow-xl cursor-pointer' : '';

    return (
      <div
        ref={ref}
        className={clsx(
          baseStyles,
          variantStyles[variant],
          paddingStyles[padding],
          hoverStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Sub-components

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => {
  return (
    <div className={clsx('mb-4', className)} {...props}>
      {children}
    </div>
  );
};

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  as: Component = 'h3',
  className,
  children,
  ...props
}) => {
  return (
    <Component className={clsx('text-xl font-bold text-neutral-900', className)} {...props}>
      {children}
    </Component>
  );
};

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <p className={clsx('text-sm text-neutral-600', className)} {...props}>
      {children}
    </p>
  );
};

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ className, children, ...props }) => {
  return (
    <div className={clsx('', className)} {...props}>
      {children}
    </div>
  );
};

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ className, children, ...props }) => {
  return (
    <div className={clsx('mt-4 flex items-center gap-2', className)} {...props}>
      {children}
    </div>
  );
};
