/**
 * DoctorSearch Component
 *
 * Search input for finding doctors by name, qualifications, or specialty.
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/common';

export interface DoctorSearchProps {
  placeholder?: string;
  debounceMs?: number;
}

export const DoctorSearch: React.FC<DoctorSearchProps> = ({
  placeholder = 'Search doctors by name, specialty, or qualification...',
  debounceMs = 300,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

  // Debounce function
  const debounce = useCallback(
    (func: (value: string) => void, wait: number) => {
      let timeout: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(value), wait);
      };
    },
    []
  );

  // Update URL when search changes
  const updateSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set('search', value.trim());
      } else {
        params.delete('search');
      }

      // Reset to page 1 when search changes
      params.delete('page');

      router.push(`/doctors?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce(updateSearch, debounceMs),
    [debounce, updateSearch, debounceMs]
  );

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  // Handle form submit (immediate search)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearch(searchValue);
  };

  // Handle clear
  const handleClear = () => {
    setSearchValue('');
    updateSearch('');
  };

  // Sync with URL changes
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    if (urlSearch !== searchValue) {
      setSearchValue(urlSearch);
    }
  }, [searchParams]);

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input */}
        <Input
          type="search"
          value={searchValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-10 pr-10"
          aria-label="Search doctors"
        />

        {/* Clear Button */}
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
            aria-label="Clear search"
          >
            <svg
              className="h-5 w-5"
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
        )}
      </div>

      {/* Search Tips */}
      <p className="mt-1 text-xs text-neutral-500">
        Search by doctor name, qualification, or specialty
      </p>
    </form>
  );
};
