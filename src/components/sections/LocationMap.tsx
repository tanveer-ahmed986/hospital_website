/**
 * Location Map Component
 *
 * Displays Google Maps embed with hospital location and contact info
 * Task: T125 [US3]
 */

'use client';

import React, { useState } from 'react';
import {
  getGoogleMapsEmbedUrl,
  getGoogleMapsDirectionsUrl,
  formatAddress,
  type HospitalLocation,
} from '@/lib/maps';

export interface LocationMapProps {
  location: HospitalLocation;
  className?: string;
  showDirections?: boolean;
  showContactInfo?: boolean;
}

export function LocationMap({
  location,
  className = '',
  showDirections = true,
  showContactInfo = true,
}: LocationMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const embedUrl = getGoogleMapsEmbedUrl(location);

  const handleGetDirections = () => {
    const directionsUrl = getGoogleMapsDirectionsUrl(location);
    window.open(directionsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-lg ${className}`}>
      {/* Map Container */}
      <div className="relative w-full" style={{ height: '400px' }}>
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading map...</p>
            </div>
          </div>
        )}

        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map showing location of ${location.name}`}
          onLoad={() => setMapLoaded(true)}
          className={mapLoaded ? 'opacity-100' : 'opacity-0'}
        />
      </div>

      {/* Location Info */}
      {showContactInfo && (
        <div className="p-6 space-y-4">
          {/* Address */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-50)] flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-[var(--color-primary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-1">Address</h3>
              <p className="text-neutral-600">{formatAddress(location)}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-50)] flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-[var(--color-primary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-1">Phone</h3>
              <a
                href={`tel:${location.phone.replace(/\s/g, '')}`}
                className="text-[var(--color-primary)] hover:underline"
              >
                {location.phone}
              </a>
            </div>
          </div>

          {/* Emergency */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-600"
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
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 mb-1">Emergency</h3>
              <a
                href={`tel:${location.emergency.replace(/\s/g, '')}`}
                className="text-red-600 hover:underline font-semibold"
              >
                {location.emergency}
              </a>
              <p className="text-xs text-neutral-500 mt-1">24/7 Emergency Services</p>
            </div>
          </div>

          {/* Get Directions Button */}
          {showDirections && (
            <div className="pt-4">
              <button
                onClick={handleGetDirections}
                className="w-full px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Get Directions
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
