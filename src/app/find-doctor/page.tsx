/**
 * Find a Doctor Page
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const allDoctors = [
  { id: 1, name: 'Dr. Sarah Johnson', specialty: 'ENT Specialist', experience: '15 years', education: 'MBBS, MS (ENT)', image: '/images/doctors/doctor-1.jpg' },
  { id: 2, name: 'Dr. Michael Chen', specialty: 'Cardiologist', experience: '20 years', education: 'MBBS, MD (Cardiology)', image: '/images/doctors/doctor-2.jpg' },
  { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Pediatrician', experience: '12 years', education: 'MBBS, DCH', image: '/images/doctors/doctor-3.jpg' },
  { id: 4, name: 'Dr. James Wilson', specialty: 'Orthopedic Surgeon', experience: '18 years', education: 'MBBS, MS (Orthopedics)', image: '/images/doctors/doctor-4.jpg' },
  { id: 5, name: 'Dr. Priya Sharma', specialty: 'Gynecologist', experience: '14 years', education: 'MBBS, MS (OBG)', image: '/images/doctors/doctor-5.jpg' },
  { id: 6, name: 'Dr. Robert Martinez', specialty: 'General Surgeon', experience: '22 years', education: 'MBBS, MS (Surgery)', image: '/images/doctors/doctor-6.jpg' },
];

export default function FindDoctorPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const specialties = [...new Set(allDoctors.map(doc => doc.specialty))];

  const filteredDoctors = allDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find a Doctor</h1>
          <p className="text-xl text-blue-100">Search for doctors by name or specialty</p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-neutral-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search by Name */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Search by Name
              </label>
              <input
                type="text"
                placeholder="Enter doctor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter by Specialty */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Filter by Specialty
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Specialties</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <p className="mt-4 text-neutral-600">
            Found {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Doctors List */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative h-48 bg-neutral-100">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{doctor.name}</h3>
                    <p className="text-blue-600 font-semibold mb-3">{doctor.specialty}</p>
                    <div className="space-y-2 text-sm text-neutral-600 mb-4">
                      <p><span className="font-semibold">Experience:</span> {doctor.experience}</p>
                      <p><span className="font-semibold">Education:</span> {doctor.education}</p>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href={`/doctors/${doctor.id}`}
                        className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
                      >
                        View Profile
                      </Link>
                      <Link
                        href="/appointments"
                        className="block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg transition-colors"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-neutral-600">No doctors found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
