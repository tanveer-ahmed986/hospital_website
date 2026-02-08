/**
 * Departments Section (Homepage)
 *
 * Displays department grid on homepage
 * Task: T153 [Homepage]
 */

'use client';

import React from 'react';
import Link from 'next/link';
import type { Department } from '@prisma/client';
import { SafeImage } from '@/components/common/SafeImage';

export interface DepartmentsWithCount extends Department {
  _count?: {
    doctors: number;
    services: number;
  };
}

export interface DepartmentsSectionProps {
  departments: DepartmentsWithCount[];
  className?: string;
  showAll?: boolean;
}

export function DepartmentsSection({
  departments,
  className = '',
  showAll = false,
}: DepartmentsSectionProps) {
  // Show only first 6 departments on homepage unless showAll is true
  const displayDepartments = showAll ? departments : departments.slice(0, 6);

  if (displayDepartments.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 bg-neutral-50 ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Our Departments
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Comprehensive healthcare services across specialized departments equipped with
            modern facilities and expert medical teams.
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayDepartments.map((department) => (
            <Link
              key={department.id}
              href={`/departments/${department.slug}`}
              className="group bg-white rounded-lg overflow-hidden border border-neutral-200 hover:shadow-xl hover:border-[var(--color-primary)] transition-all duration-300"
            >
              {/* Department Image */}
              {department.image && (
                <div className="relative h-48 overflow-hidden bg-neutral-100">
                  <SafeImage
                    src={department.image}
                    alt={`${department.name} department`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Department Icon Overlay */}
                  {department.icon && (
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center">
                      <SafeImage
                        src={department.icon}
                        alt=""
                        className="w-7 h-7"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Department Info */}
              <div className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  {!department.image && department.icon && (
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-50)] flex items-center justify-center flex-shrink-0">
                      <SafeImage
                        src={department.icon}
                        alt=""
                        className="w-6 h-6"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 group-hover:text-[var(--color-primary)] transition-colors">
                      {department.name}
                    </h3>
                  </div>
                </div>

                {department.description && (
                  <p className="text-neutral-600 mb-4 line-clamp-2">
                    {department.description}
                  </p>
                )}

                {/* Stats */}
                {department._count && (
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    {department._count.doctors > 0 && (
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>{department._count.doctors} Doctors</span>
                      </div>
                    )}
                    {department._count.services > 0 && (
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <span>{department._count.services} Services</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        {!showAll && departments.length > 6 && (
          <div className="text-center mt-12">
            <Link
              href="/departments"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-[var(--color-primary)] font-semibold rounded-lg border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary-50)] transition-colors gap-2"
            >
              View All Departments
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
        )}
      </div>
    </section>
  );
}
