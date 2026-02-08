/**
 * DoctorFilter Component
 *
 * Filter controls for doctor listing page.
 */

'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface DoctorFilterProps {
  specialties: Array<{ id: string; name: string; slug: string }>;
  departments?: Array<{ id: string; name: string; slug: string }>;
  languages?: string[];
}

export const DoctorFilter: React.FC<DoctorFilterProps> = ({
  specialties,
  departments = [],
  languages = [],
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSpecialty = searchParams.get('specialty') || '';
  const currentDepartment = searchParams.get('department') || '';
  const currentLanguage = searchParams.get('language') || '';

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset to page 1 when filter changes
    params.delete('page');

    router.push(`/doctors?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    const search = searchParams.get('search');
    if (search) {
      params.set('search', search);
    }
    router.push(`/doctors?${params.toString()}`);
  };

  const hasActiveFilters = currentSpecialty || currentDepartment || currentLanguage;

  const selectBaseStyles =
    'appearance-none rounded-lg border border-neutral-300 px-4 py-2.5 pr-10 text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] w-full';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Specialty Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Specialty
          </label>
          <div className="relative">
            <select
              value={currentSpecialty}
              onChange={(e) => handleFilterChange('specialty', e.target.value)}
              className={selectBaseStyles}
            >
              <option value="">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.slug}>
                  {specialty.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Department Filter */}
        {departments.length > 0 && (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Department
            </label>
            <div className="relative">
              <select
                value={currentDepartment}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className={selectBaseStyles}
              >
                <option value="">All Departments</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.slug}>
                    {department.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Language Filter */}
        {languages.length > 0 && (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Language
            </label>
            <div className="relative">
              <select
                value={currentLanguage}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                className={selectBaseStyles}
              >
                <option value="">All Languages</option>
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="btn btn-outline text-sm px-4 py-2 h-[42px]"
            aria-label="Clear all filters"
          >
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {currentSpecialty && (
            <FilterTag
              label={`Specialty: ${specialties.find((s) => s.slug === currentSpecialty)?.name || currentSpecialty}`}
              onRemove={() => handleFilterChange('specialty', '')}
            />
          )}
          {currentDepartment && (
            <FilterTag
              label={`Department: ${departments.find((d) => d.slug === currentDepartment)?.name || currentDepartment}`}
              onRemove={() => handleFilterChange('department', '')}
            />
          )}
          {currentLanguage && (
            <FilterTag
              label={`Language: ${currentLanguage}`}
              onRemove={() => handleFilterChange('language', '')}
            />
          )}
        </div>
      )}
    </div>
  );
};

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

const FilterTag: React.FC<FilterTagProps> = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--color-primary-100,#e0f2fe)] text-[var(--color-primary)] rounded-full text-sm">
    {label}
    <button
      onClick={onRemove}
      className="ml-1 hover:bg-[var(--color-primary-200,#bae6fd)] rounded-full p-0.5"
      aria-label={`Remove ${label} filter`}
    >
      <svg
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </span>
);
