/**
 * ServiceCard Component
 *
 * Displays service information in a card format
 * Task: T110 [US2]
 */

'use client';

import React from 'react';
import Link from 'next/link';
import type { ServiceWithRelations } from '@/lib/services';

export interface ServiceCardProps {
  service: ServiceWithRelations;
  showCategory?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  showCategory = true,
}) => {
  return (
    <article
      className="service-card bg-white rounded-lg border border-neutral-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
      data-testid="service-card"
    >
      {/* Service Image */}
      {service.image && (
        <div className="aspect-video relative overflow-hidden bg-neutral-100">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Category Badge */}
        {showCategory && service.category && (
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-primary-50,#f0f9ff)] text-[var(--color-primary)]">
              {service.category.name}
            </span>
          </div>
        )}

        {/* Service Name */}
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          {service.name}
        </h3>

        {/* Description */}
        {service.description && (
          <p className="text-neutral-600 text-sm line-clamp-3 mb-4">
            {service.description}
          </p>
        )}

        {/* Benefits */}
        {service.benefits && service.benefits.length > 0 && (
          <ul className="space-y-1 mb-4">
            {service.benefits.slice(0, 3).map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-neutral-700">
                <svg
                  className="w-4 h-4 text-green-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Department Tag */}
        {service.department && (
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4">
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span>{service.department.name}</span>
          </div>
        )}

        {/* Learn More Link */}
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium text-sm transition-colors"
        >
          Learn More
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
