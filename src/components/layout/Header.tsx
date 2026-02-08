/**
 * Header Component
 *
 * Sticky header with hospital branding and navigation.
 * Shows/hides based on scroll direction for better UX.
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { clsx } from 'clsx';
import { Navigation } from './Navigation';
import type { HospitalConfig } from '@/lib/config';

interface HeaderProps {
  config?: HospitalConfig;
}

export const Header: React.FC<HeaderProps> = ({ config: configProp }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Use provided config or fallback to defaults
  const config = configProp || {
    hospital: {
      name: 'Our Hospital',
      tagline: 'Your Health, Our Priority',
      logo: '/images/hospital_logo.png',
    },
    contact: {
      phone: '+92-300-1234567',
      email: 'info@hospital.com',
      emergency: '+92-300-7654321',
    },
    features: {
      appointmentBooking: true,
    },
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Add shadow after scrolling past 10px
          setIsScrolled(currentScrollY > 10);

          // Hide header on scroll down, show on scroll up
          if (currentScrollY > lastScrollY && currentScrollY > 80) {
            // Scrolling down
            setIsVisible(false);
          } else {
            // Scrolling up
            setIsVisible(true);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-[1100] bg-white transition-all duration-300 border-b border-neutral-200',
        isScrolled && 'shadow-md',
        isVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className="container">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="relative h-14 w-14">
              <Image
                src={config.hospital.logo}
                alt={`${config.hospital.name} logo`}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-neutral-900 uppercase tracking-wide">
                {config.hospital.name}
              </h1>
              <p className="text-xs text-neutral-600">{config.hospital.tagline}</p>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <Navigation config={config} />

          {/* Book Appointment Button - Right */}
          {config.features.appointmentBooking && (
            <Link
              href="/appointments"
              className="hidden lg:block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2.5 rounded-md transition-colors duration-200 uppercase text-sm"
              aria-label="Book an appointment"
            >
              Book an Appointment
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-neutral-700 hover:text-[var(--color-primary)] transition-colors"
            aria-label="Toggle navigation menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
