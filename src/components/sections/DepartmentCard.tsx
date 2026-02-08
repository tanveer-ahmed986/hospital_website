/**
 * DepartmentCard Component
 *
 * Displays department information in a card format
 * Task: T103 [US2]
 */

'use client';

import React from 'react';
import Link from 'next/link';
import type { DepartmentWithRelations } from '@/lib/departments';

export interface DepartmentCardProps {
  department: DepartmentWithRelations;
  showStats?: boolean;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  showStats = true,
}) => {
  return (
    <article
      className="department-card bg-white rounded-lg border border-neutral-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
      data-testid="department-card"
    >
      {/* Department Image */}
      {department.image && (
        <div className="aspect-video relative overflow-hidden bg-neutral-100">
          <img
            src={department.image}
            alt={department.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {/* Department Icon and Name */}
        <div className="flex items-start gap-3 mb-3">
          {department.icon && (
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[var(--color-primary-50,#f0f9ff)] flex items-center justify-center">
              <img
                src={department.icon}
                alt=""
                className="w-7 h-7"
                aria-hidden="true"
              />
            </div>
          )}

          <div className="flex-1">
            <h3 className="text-xl font-semibold text-neutral-900 mb-1">
              {department.name}
            </h3>
          </div>
        </div>

        {/* Description */}
        {department.description && (
          <p className="text-neutral-600 text-sm line-clamp-3 mb-4">
            {department.description}
          </p>
        )}

        {/* Stats */}
        {showStats && department._count && (
          <div className="flex items-center gap-4 mb-4 text-sm">
            {department._count.doctors > 0 && (
              <div className="flex items-center gap-1 text-neutral-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{department._count.doctors} Doctor{department._count.doctors !== 1 ? 's' : ''}</span>
              </div>
            )}

            {department._count.services > 0 && (
              <div className="flex items-center gap-1 text-neutral-600">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span>{department._count.services} Service{department._count.services !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        )}

        {/* View Details Link */}
        <Link
          href={`/departments/${department.slug}`}
          className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium text-sm transition-colors"
        >
          View Details
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
};
