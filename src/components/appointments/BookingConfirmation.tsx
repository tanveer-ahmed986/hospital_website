/**
 * BookingConfirmation Component
 *
 * Display appointment booking confirmation details.
 */

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/common';
import type { AppointmentWithDoctor } from '@/lib/appointments';

export interface BookingConfirmationProps {
  appointment: AppointmentWithDoctor;
  hospitalName?: string;
  hospitalPhone?: string;
}

/**
 * Format date for display
 */
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time from 24-hour to 12-hour format
 */
function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  appointment,
  hospitalName = 'the hospital',
  hospitalPhone,
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Icon */}
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="h-10 w-10 text-green-600"
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
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Appointment Booked!
        </h1>
        <p className="text-neutral-600">
          Your appointment request has been submitted successfully.
        </p>
      </div>

      {/* Appointment Details Card */}
      <div className="bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden mb-8">
        {/* Header */}
        <div className="bg-[var(--color-primary)] px-6 py-4">
          <h2 className="text-lg font-semibold text-white">
            Appointment Details
          </h2>
          <p className="text-[var(--color-primary-100,#e0f2fe)] text-sm">
            Confirmation #{appointment.id.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          {/* Doctor Info */}
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              {appointment.doctor.photo ? (
                <img
                  src={appointment.doctor.photo}
                  alt={appointment.doctor.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg
                  className="h-8 w-8 text-neutral-400"
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
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Dr. {appointment.doctor.name}
              </h3>
              <p className="text-neutral-600">{appointment.doctor.designation}</p>
              {appointment.doctor.specialties.length > 0 && (
                <p className="text-sm text-[var(--color-primary)]">
                  {appointment.doctor.specialties.map((s) => s.name).join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-neutral-500 mb-1">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">Date</span>
              </div>
              <p className="font-semibold text-neutral-900">
                {formatDate(appointment.appointmentDate)}
              </p>
            </div>
            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-neutral-500 mb-1">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">Time</span>
              </div>
              <p className="font-semibold text-neutral-900">
                {formatTime(appointment.appointmentTime)}
              </p>
            </div>
          </div>

          {/* Patient Info */}
          <div className="border-t border-neutral-200 pt-4">
            <h4 className="text-sm font-medium text-neutral-500 mb-3">
              Patient Information
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-600">Name</span>
                <span className="font-medium text-neutral-900">
                  {appointment.patientName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Phone</span>
                <span className="font-medium text-neutral-900">
                  {appointment.patientPhone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Email</span>
                <span className="font-medium text-neutral-900">
                  {appointment.patientEmail}
                </span>
              </div>
              {appointment.reasonForVisit && (
                <div className="flex justify-between">
                  <span className="text-neutral-600">Reason</span>
                  <span className="font-medium text-neutral-900 text-right max-w-[200px]">
                    {appointment.reasonForVisit}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            <span className="text-neutral-600">Status</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
              Pending Confirmation
            </span>
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          What happens next?
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-sm font-medium">
              1
            </span>
            <span className="text-blue-800">
              You will receive a confirmation SMS and email shortly.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-sm font-medium">
              2
            </span>
            <span className="text-blue-800">
              Our staff will review and confirm your appointment.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-sm font-medium">
              3
            </span>
            <span className="text-blue-800">
              Arrive 15 minutes before your appointment time.
            </span>
          </li>
        </ul>
      </div>

      {/* Contact Info */}
      {hospitalPhone && (
        <div className="text-center mb-8">
          <p className="text-neutral-600">
            Need to make changes? Contact {hospitalName} at{' '}
            <a
              href={`tel:${hospitalPhone}`}
              className="text-[var(--color-primary)] font-medium hover:underline"
            >
              {hospitalPhone}
            </a>
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/">
          <Button variant="outline" size="lg">
            Back to Home
          </Button>
        </Link>
        <Link href="/doctors">
          <Button variant="primary" size="lg">
            Book Another Appointment
          </Button>
        </Link>
      </div>
    </div>
  );
};
