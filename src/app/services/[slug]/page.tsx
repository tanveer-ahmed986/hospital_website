/**
 * Individual Service Page
 *
 * Displays detailed information about a specific service
 * Task: T112 [US2]
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceBySlug } from '@/lib/services';
import { getCurrentHospitalConfig } from '@/lib/config';

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  let hospitalName = 'Our Hospital';

  try {
    const config = getCurrentHospitalConfig();
    hospitalName = config.hospital.name;
  } catch (e) {
    // Use default
  }

  return {
    title: `${service.name} | ${hospitalName}`,
    description: service.description || `Learn about ${service.name} services at ${hospitalName}`,
    openGraph: {
      title: `${service.name} | ${hospitalName}`,
      description: service.description || undefined,
      images: service.image ? [service.image] : undefined,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Service Hero */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {service.category && (
            <div className="mb-4">
              <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
                {service.category.name}
              </span>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {service.name}
          </h1>

          {service.description && (
            <p className="text-lg md:text-xl text-white/90 max-w-3xl">
              {service.description}
            </p>
          )}
        </div>
      </section>

      {/* Service Image */}
      {service.image && (
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 max-w-7xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Benefits
                </h2>
                <ul className="space-y-4">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-neutral-700 text-lg">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Procedure Overview */}
            {service.procedureOverview && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Procedure Overview
                </h2>
                <div className="prose prose-neutral max-w-none">
                  <p className="text-neutral-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {service.procedureOverview}
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Department Card */}
              {service.department && (
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                  <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                    Department
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-50)] flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-[var(--color-primary)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">
                        {service.department.name}
                      </p>
                      <a
                        href={`/departments/${service.department.slug}`}
                        className="text-sm text-[var(--color-primary)] hover:underline"
                      >
                        View Department
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">
                  Need This Service?
                </h3>
                <p className="text-white/90 mb-6">
                  Book an appointment with our specialists to get started.
                </p>
                <a
                  href="/appointments"
                  className="block w-full text-center px-6 py-3 bg-white text-[var(--color-primary)] font-semibold rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  Book Appointment
                </a>
              </div>

              {/* Contact Card */}
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                  Have Questions?
                </h3>
                <p className="text-neutral-700 mb-4">
                  Our team is here to help answer any questions about this service.
                </p>
                <a
                  href="/contact"
                  className="block w-full text-center px-6 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold rounded-lg hover:bg-[var(--color-primary-50)] transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export const dynamic = 'force-dynamic';
