/**
 * Doctors Listing Page
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Doctors | ABC General Hospital',
  description: 'Meet our team of expert doctors and specialists',
};

const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'ENT Specialist',
    experience: '15 years',
    education: 'MBBS, MS (ENT)',
    image: '/images/doctors/doctor-1.jpg',
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Cardiologist',
    experience: '20 years',
    education: 'MBBS, MD (Cardiology)',
    image: '/images/doctors/doctor-2.jpg',
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrician',
    experience: '12 years',
    education: 'MBBS, DCH',
    image: '/images/doctors/doctor-3.jpg',
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    specialty: 'Orthopedic Surgeon',
    experience: '18 years',
    education: 'MBBS, MS (Orthopedics)',
    image: '/images/doctors/doctor-4.jpg',
  },
  {
    id: 5,
    name: 'Dr. Priya Sharma',
    specialty: 'Gynecologist',
    experience: '14 years',
    education: 'MBBS, MS (OBG)',
    image: '/images/doctors/doctor-5.jpg',
  },
  {
    id: 6,
    name: 'Dr. Robert Martinez',
    specialty: 'General Surgeon',
    experience: '22 years',
    education: 'MBBS, MS (Surgery)',
    image: '/images/doctors/doctor-6.jpg',
  },
];

export default function DoctorsPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Expert Doctors</h1>
          <p className="text-xl text-blue-100">
            Meet our team of highly qualified and experienced medical professionals
          </p>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-64 bg-neutral-100">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">{doctor.name}</h3>
                  <p className="text-blue-600 font-semibold mb-3">{doctor.specialty}</p>
                  <div className="space-y-2 text-sm text-neutral-600">
                    <p>
                      <span className="font-semibold">Experience:</span> {doctor.experience}
                    </p>
                    <p>
                      <span className="font-semibold">Education:</span> {doctor.education}
                    </p>
                  </div>
                  <Link
                    href="/appointments"
                    className="mt-6 block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-xl text-neutral-600 mb-8">
            Contact us and we'll help you find the right doctor for your needs
          </p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-md transition-colors uppercase"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
