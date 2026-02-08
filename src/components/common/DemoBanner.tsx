/**
 * Demo Banner Component
 *
 * Optional banner to show on demo site that forms are not yet functional
 * Remove this component when going to production
 */

'use client';

import { useState } from 'react';

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 relative z-[9999]">
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm md:text-base font-medium">
            <span className="font-bold">Demo Site:</span> This is a demonstration website.
            Appointment booking and contact forms will be functional after database integration.
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 text-white hover:text-orange-100 transition-colors"
          aria-label="Close banner"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
