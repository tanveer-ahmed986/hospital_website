/**
 * Appointment CTA Section
 *
 * Call-to-action section for booking appointments on homepage
 * Task: T155 [Homepage]
 */

import React from 'react';
import Link from 'next/link';

export interface AppointmentCTAProps {
  hospitalName?: string;
  className?: string;
  variant?: 'default' | 'gradient';
}

export function AppointmentCTA({
  hospitalName = 'Our Hospital',
  className = '',
  variant = 'gradient',
}: AppointmentCTAProps) {
  const backgroundClass =
    variant === 'gradient'
      ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]'
      : 'bg-[var(--color-primary)]';

  return (
    <section className={`py-20 ${backgroundClass} ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Book an Appointment?
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Take the first step towards better health. Our specialists are ready to provide
            you with expert medical care and personalized treatment.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/appointments"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[var(--color-primary)] font-bold rounded-lg hover:bg-neutral-100 transition-colors shadow-lg text-lg"
            >
              Book Appointment Now
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            <Link
              href="/doctors"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border-2 border-white hover:bg-white/20 transition-colors text-lg"
            >
              Browse Our Doctors
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Quick Booking</h3>
              <p className="text-white/80 text-sm">Book in less than 2 minutes</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Instant Confirmation</h3>
              <p className="text-white/80 text-sm">Get SMS & email confirmation</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Expert Doctors</h3>
              <p className="text-white/80 text-sm">50+ specialists available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
