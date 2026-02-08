/**
 * Featured Doctors Section
 *
 * Displays featured/top doctors on homepage
 * Task: T152 [Homepage]
 */

'use client';

import React from 'react';
import Link from 'next/link';
import type { Doctor } from '@prisma/client';
import { SafeImage } from '@/components/common/SafeImage';

export interface FeaturedDoctorsProps {
  doctors: Doctor[];
  className?: string;
}

export function FeaturedDoctors({ doctors, className = '' }: FeaturedDoctorsProps) {
  if (doctors.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 bg-neutral-50 ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16 pb-8">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm mb-4">
            Our Medical Team
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Meet Our Expert Doctors
          </h2>
          <p className="text-base text-neutral-600 max-w-2xl mx-auto">
            Our team of highly qualified medical professionals
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <Link
              key={doctor.id}
              href={`/doctors/${doctor.slug}`}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-neutral-100"
            >
              {/* Doctor Photo */}
              <div className="relative h-64 bg-gradient-to-br from-blue-50 to-neutral-50 overflow-hidden">
                {doctor.photo ? (
                  <SafeImage
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    fallback={
                      <div className="w-full h-full flex items-center justify-center bg-[var(--color-primary-50)]">
                        <svg
                          className="w-24 h-24 text-[var(--color-primary)]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    }
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[var(--color-primary-50)]">
                    <svg
                      className="w-24 h-24 text-[var(--color-primary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Doctor Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-neutral-900 mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                  {doctor.name}
                </h3>
                <p className="text-sm text-[var(--color-primary)] font-medium mb-2">
                  {doctor.designation}
                </p>
                <p className="text-sm text-neutral-600 mb-3">{doctor.qualifications}</p>

                {/* Experience Badge */}
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {doctor.experience} {doctor.experience === 1 ? 'year' : 'years'} experience
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/doctors"
            className="inline-flex items-center justify-center px-8 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors gap-2"
          >
            View All Doctors
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
