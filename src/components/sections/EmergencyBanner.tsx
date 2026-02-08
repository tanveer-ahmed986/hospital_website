/**
 * Emergency Banner Component
 *
 * Displays emergency contact information prominently
 * Task: T129 [US3]
 */

import React from 'react';

export interface EmergencyBannerProps {
  phone: string;
  showText?: boolean;
  className?: string;
  variant?: 'compact' | 'full';
}

export function EmergencyBanner({
  phone,
  showText = true,
  className = '',
  variant = 'compact',
}: EmergencyBannerProps) {
  const formattedPhone = phone.replace(/\s/g, '');

  if (variant === 'compact') {
    return (
      <a
        href={`tel:${formattedPhone}`}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors ${className}`}
        aria-label="Emergency Contact Number"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
        {showText && <span className="font-semibold text-sm">Emergency: {phone}</span>}
      </a>
    );
  }

  return (
    <div
      className={`bg-red-600 text-white py-3 px-4 ${className}`}
      role="banner"
      aria-label="Emergency Contact Information"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-center gap-3">
          <svg
            className="w-6 h-6 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="font-semibold">24/7 Emergency Services Available</span>
          <span className="hidden sm:inline">•</span>
          <a
            href={`tel:${formattedPhone}`}
            className="font-bold text-lg hover:underline"
          >
            {phone}
          </a>
        </div>
      </div>
    </div>
  );
}
