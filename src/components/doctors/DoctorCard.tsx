/**
 * DoctorCard Component
 *
 * Display doctor information in a card format.
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/common';
import type { DoctorWithRelations } from '@/lib/doctors';

export interface DoctorCardProps {
  doctor: DoctorWithRelations;
  showBookButton?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  showBookButton = true,
}) => {
  return (
    <Card hoverable className="h-full flex flex-col">
      <div className="flex flex-col h-full">
        {/* Doctor Photo */}
        <div className="relative h-48 w-full mb-4 bg-neutral-100 rounded-lg overflow-hidden">
          {doctor.photo ? (
            <Image
              src={doctor.photo}
              alt={`Dr. ${doctor.name}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-neutral-200">
              <svg
                className="h-20 w-20 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
        <div className="flex-1 flex flex-col">
          <Link
            href={`/doctors/${doctor.slug}`}
            className="group"
          >
            <h3 className="text-xl font-bold text-neutral-900 mb-1 group-hover:text-[var(--color-primary)] transition-colors">
              Dr. {doctor.name}
            </h3>
          </Link>

          <p className="text-sm text-neutral-600 mb-2">{doctor.designation}</p>

          {/* Specialties */}
          {doctor.specialties && doctor.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {doctor.specialties.slice(0, 2).map((specialty) => (
                <Link
                  key={specialty.id}
                  href={`/specialties/${specialty.slug}`}
                  className="badge badge-primary text-xs hover:bg-primary-200 transition-colors"
                >
                  {specialty.name}
                </Link>
              ))}
              {doctor.specialties.length > 2 && (
                <span className="badge bg-neutral-100 text-neutral-600 text-xs">
                  +{doctor.specialties.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Qualifications */}
          <p className="text-sm text-neutral-700 mb-3">
            {doctor.qualifications}
          </p>

          {/* Experience */}
          <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>{doctor.experience} years experience</span>
          </div>

          {/* Languages */}
          {doctor.languages && doctor.languages.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
              <span>{doctor.languages.slice(0, 3).join(', ')}</span>
            </div>
          )}

          {/* Consultation Fee */}
          {doctor.consultationFee && (
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] mb-4">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Consultation: ${doctor.consultationFee}</span>
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto flex gap-2">
            <Link href={`/doctors/${doctor.slug}`} className="flex-1">
              <button className="btn btn-outline w-full">View Profile</button>
            </Link>
            {showBookButton && (
              <Link
                href={`/appointments/book/${doctor.id}`}
                className="flex-1"
              >
                <button className="btn btn-primary w-full">Book Appointment</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
