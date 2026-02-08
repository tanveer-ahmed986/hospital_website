/**
 * Appointment Confirmation Page
 *
 * Shows booking confirmation after successful appointment creation.
 */

import Link from 'next/link';
import { Button } from '@/components/common';
import { getCurrentHospitalConfig } from '@/lib/config';

interface ConfirmationPageProps {
  searchParams: {
    id?: string;
  };
}

export const metadata = {
  title: 'Appointment Confirmed',
  description: 'Your appointment has been confirmed',
};

export default function AppointmentConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const config = getCurrentHospitalConfig();

  // In a real implementation, fetch appointment details by ID
  const appointmentId = searchParams.id;

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          {/* Success Card */}
          <div className="card text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              Appointment Confirmed!
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              Your appointment has been successfully booked.
            </p>

            {appointmentId && (
              <div className="bg-neutral-50 rounded-lg p-6 mb-8 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="font-semibold text-neutral-900">Booking Reference</h3>
                </div>
                <p className="text-2xl font-mono font-bold text-primary-600 text-center">
                  {appointmentId.slice(0, 8).toUpperCase()}
                </p>
              </div>
            )}

            {/* What's Next */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What's Next?
              </h3>
              <ul className="space-y-2 text-sm text-blue-900">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>You'll receive confirmation via <strong>email</strong> and <strong>SMS</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Arrive <strong>15 minutes early</strong> for registration</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Bring your <strong>ID</strong> and any relevant <strong>medical records</strong></span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-sm text-neutral-600 mb-8">
              <p className="mb-2">Need to reschedule or have questions?</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={`tel:${config.contact.phone}`} className="font-semibold text-primary-600 hover:underline">
                  Call {config.contact.phone}
                </a>
                <span className="hidden sm:inline text-neutral-400">|</span>
                <a href={`mailto:${config.contact.email}`} className="font-semibold text-primary-600 hover:underline">
                  Email Us
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="outline" size="lg">
                  Back to Home
                </Button>
              </Link>
              <Link href="/doctors">
                <Button size="lg">
                  Book Another Appointment
                </Button>
              </Link>
            </div>
          </div>

          {/* Hospital Info */}
          <div className="mt-6 text-center text-sm text-neutral-600">
            <p>{config.hospital.name}</p>
            <p>{config.contact.address.street}, {config.contact.address.city}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
