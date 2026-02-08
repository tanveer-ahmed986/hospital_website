/**
 * Navigation Component
 *
 * Main navigation menu with mobile responsive design.
 * Includes dropdown menus and mobile hamburger menu.
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import type { HospitalConfig } from '@/lib/config';

interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

interface NavigationProps {
  config?: HospitalConfig;
}

export const Navigation: React.FC<NavigationProps> = ({ config: configProp }) => {
  const [_isMobileMenuOpen, _setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  // Use provided config or fallback to defaults
  const _config = configProp || {
    features: {
      blog: false,
      careers: false,
      appointmentBooking: true,
    },
    serviceCategories: {
      laboratory: { enabled: true },
      pharmacy: { enabled: true },
      radiology: { enabled: true },
      emergency: { enabled: true },
      icu: { enabled: true },
    },
    contact: {
      phone: '+92-300-1234567',
      email: 'info@hospital.com',
    },
  };

  // Build navigation links based on hospital features
  const navLinks: NavLink[] = [
    { label: 'HOME', href: '/' },
    { label: 'FIND DOCTOR', href: '/find-doctor' },
    {
      label: 'SERVICES',
      href: '/services',
      children: [
        { label: 'All Services', href: '/services' },
        { label: 'ENT', href: '/services/ent' },
        { label: 'Cardiology', href: '/services/cardiology' },
        { label: 'Pediatrics', href: '/services/pediatrics' },
        { label: 'Gynecology', href: '/services/gynecology' },
        { label: 'Orthopedics', href: '/services/orthopedics' },
        { label: 'Emergency', href: '/services/emergency' },
      ],
    },
    {
      label: 'DEPARTMENTS',
      href: '/departments',
      children: [
        { label: 'All Departments', href: '/departments' },
        { label: 'Cardiology', href: '/services/cardiology' },
        { label: 'Orthopedics', href: '/services/orthopedics' },
        { label: 'Pediatrics', href: '/services/pediatrics' },
        { label: 'Gynecology & Obstetrics', href: '/services/gynecology' },
        { label: 'ENT', href: '/services/ent' },
        { label: 'Emergency Services', href: '/services/emergency' },
      ],
    },
    { label: 'FACILITIES', href: '/facilities' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Removed unused functions - will be needed for mobile menu implementation
  // const toggleDropdown = (label: string) => {
  //   setOpenDropdown(openDropdown === label ? null : label);
  // };

  // const closeMobileMenu = () => {
  //   _setIsMobileMenuOpen(false);
  //   setOpenDropdown(null);
  // };

  return (
    <nav className="hidden lg:block" role="navigation" aria-label="Main navigation">
      {/* Desktop Navigation */}
      <ul className="flex items-center gap-1">
        {navLinks.map((link) => (
          <li key={link.href} className="relative">
            {link.children ? (
              // Dropdown Menu
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={clsx(
                    'flex items-center gap-1 px-4 py-2 text-sm font-semibold transition-colors uppercase whitespace-nowrap',
                    isActiveLink(link.href)
                      ? 'text-orange-600'
                      : 'text-neutral-700 hover:text-orange-600'
                  )}
                  aria-expanded={openDropdown === link.label}
                  aria-haspopup="true"
                >
                  {link.label}
                  <svg
                    className={clsx(
                      'h-4 w-4 transition-transform',
                      openDropdown === link.label && 'rotate-180'
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Panel */}
                {openDropdown === link.label && (
                  <div className="absolute left-0 top-full min-w-[200px] bg-white shadow-lg rounded-lg border border-neutral-200 py-2 z-50">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={clsx(
                          'block px-4 py-2 text-sm transition-colors',
                          isActiveLink(child.href)
                            ? 'bg-orange-50 text-orange-600 font-medium'
                            : 'text-neutral-700 hover:bg-neutral-50 hover:text-orange-600'
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Regular Link
              <Link
                href={link.href}
                className={clsx(
                  'block px-4 py-2 text-sm font-semibold transition-colors uppercase whitespace-nowrap',
                  isActiveLink(link.href)
                    ? 'text-orange-600'
                    : 'text-neutral-700 hover:text-orange-600'
                )}
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};
