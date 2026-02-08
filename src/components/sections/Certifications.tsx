/**
 * Certifications Component
 *
 * Displays hospital accreditations and certifications
 * Task: T115 [US2]
 */

'use client';

import React from 'react';

export interface Certification {
  name: string;
  description: string;
  logo?: string;
  issuedBy: string;
  year?: number;
}

export interface CertificationsProps {
  certifications: Certification[];
  className?: string;
}

export function Certifications({ certifications, className = '' }: CertificationsProps) {
  if (certifications.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Accreditations & Certifications
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Our commitment to quality healthcare is recognized by leading medical organizations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="bg-neutral-50 rounded-lg p-6 border border-neutral-200 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Logo */}
              {cert.logo && (
                <div className="mb-4 flex items-center justify-center h-20">
                  <img
                    src={cert.logo}
                    alt={`${cert.name} logo`}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Certification Name */}
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                {cert.name}
              </h3>

              {/* Description */}
              <p className="text-neutral-600 text-sm mb-3 leading-relaxed">
                {cert.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
                <div className="flex items-center gap-1">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{cert.issuedBy}</span>
                </div>
                {cert.year && (
                  <div className="flex items-center gap-1">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Since {cert.year}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
