/**
 * Book Appointment with Specific Doctor Page
 *
 * Appointment booking form for a specific doctor.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDoctorById } from '@/lib/doctors';
import { AppointmentForm } from '@/components/appointments';

interface BookAppointmentPageProps {
  params: {
    doctorId: string;
  };
}

export async function generateMetadata({ params }: BookAppointmentPageProps) {
  const doctor = await getDoctorById(params.doctorId);

  if (!doctor) {
    return {
      title: 'Book Appointment',
    };
  }

  return {
    title: `Book Appointment with Dr. ${doctor.name}`,
    description: `Schedule your appointment with Dr. ${doctor.name}, ${doctor.designation}`,
  };
}

export default async function BookAppointmentPage({ params }: BookAppointmentPageProps) {
  const doctor = await getDoctorById(params.doctorId);

  if (!doctor) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-[130px]">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container py-8">
          <nav className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
            <Link href="/" className="hover:text-[var(--color-primary)]">
              Home
            </Link>
            <span>/</span>
            <Link href="/doctors" className="hover:text-[var(--color-primary)]">
              Doctors
            </Link>
            <span>/</span>
            <Link
              href={`/doctors/${doctor.slug}`}
              className="hover:text-[var(--color-primary)]"
            >
              Dr. {doctor.name}
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">Book Appointment</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">Book Appointment</h1>
          <p className="text-lg text-neutral-600">
            Schedule your visit with Dr. {doctor.name}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 md:p-8">
            <AppointmentForm doctor={doctor} />
          </div>

          {/* Help Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Need help?{' '}
              <Link
                href="/contact"
                className="text-[var(--color-primary)] hover:underline"
              >
                Contact us
              </Link>{' '}
              for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
