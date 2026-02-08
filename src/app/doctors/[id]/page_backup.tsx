/**
 * Doctor Profile Page
 *
 * Detailed view of individual doctor with schedule and booking.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getDoctorBySlug } from '@/lib/doctors';
import { Button } from '@/components/common';

interface DoctorProfilePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: DoctorProfilePageProps) {
  const doctor = await getDoctorBySlug(params.slug);

  if (!doctor) {
    return {
      title: 'Doctor Not Found',
    };
  }

  return {
    title: `Dr. ${doctor.name} - ${doctor.specialties[0]?.name || 'Doctor'}`,
    description: `${doctor.designation} with ${doctor.experience} years of experience. ${doctor.qualifications}`,
  };
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default async function DoctorProfilePage({ params }: DoctorProfilePageProps) {
  const doctor = await getDoctorBySlug(params.slug);

  if (!doctor) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-[130px]">
      {/* Header Section */}
      <div className="bg-white border-b border-neutral-200">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Doctor Photo */}
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-neutral-200">
                {doctor.photo ? (
                  <Image
                    src={doctor.photo}
                    alt={`Dr. ${doctor.name}`}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg className="h-24 w-24 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Doctor Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Dr. {doctor.name}</h1>
              <p className="text-lg text-neutral-600 mb-4">{doctor.designation}</p>

              {/* Specialties */}
              {doctor.specialties && doctor.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {doctor.specialties.map((specialty) => (
                    <Link key={specialty.id} href={`/specialties/${specialty.slug}`}>
                      <span className="badge badge-primary">{specialty.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Quick Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-neutral-700">
                  <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{doctor.qualifications}</span>
                </div>

                <div className="flex items-center gap-2 text-neutral-700">
                  <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{doctor.experience} years of experience</span>
                </div>

                {doctor.languages && doctor.languages.length > 0 && (
                  <div className="flex items-center gap-2 text-neutral-700">
                    <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span>Speaks: {doctor.languages.join(', ')}</span>
                  </div>
                )}

                {doctor.consultationFee && (
                  <div className="flex items-center gap-2 text-primary-600 font-semibold">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Consultation Fee: ${doctor.consultationFee}</span>
                  </div>
                )}
              </div>

              {/* Book Appointment Button */}
              <Link href={`/appointments/book/${doctor.id}`}>
                <Button size="lg">Book Appointment</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {doctor.bio && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">About Dr. {doctor.name}</h2>
                <p className="text-neutral-700 leading-relaxed whitespace-pre-line">{doctor.bio}</p>
              </div>
            )}

            {/* Specialties Details */}
            {doctor.specialties && doctor.specialties.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Specializations</h2>
                <div className="space-y-4">
                  {doctor.specialties.map((specialty) => (
                    <div key={specialty.id} className="border-l-4 border-primary-500 pl-4">
                      <h3 className="font-semibold text-lg mb-1">{specialty.name}</h3>
                      {specialty.isPrimary && (
                        <span className="text-xs text-primary-600 font-medium">Primary Specialty</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* OPD Schedule */}
            {doctor.opdSchedule && doctor.opdSchedule.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-bold mb-4">OPD Schedule</h3>
                <div className="space-y-3">
                  {doctor.opdSchedule.map((schedule) => (
                    <div key={schedule.id} className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0">
                      <span className="font-medium text-neutral-900">{DAY_NAMES[schedule.dayOfWeek]}</span>
                      <span className="text-sm text-neutral-600">
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <Link href={`/appointments/book/${doctor.id}`}>
                    <Button fullWidth>Book Appointment</Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Departments */}
            {doctor.departments && doctor.departments.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-bold mb-4">Departments</h3>
                <div className="space-y-2">
                  {doctor.departments.map((dept) => (
                    <Link key={dept.id} href={`/departments/${dept.slug}`} className="block">
                      <div className="p-3 rounded-lg bg-neutral-50 hover:bg-primary-50 transition-colors">
                        <span className="text-sm font-medium text-neutral-900">{dept.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
