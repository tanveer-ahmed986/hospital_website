import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

const doctors = [
  { id: '1', name: 'Dr. Sarah Johnson', specialty: 'ENT Specialist', experience: '15 years', education: 'MBBS, MS (ENT)', bio: 'Expert in ear, nose, and throat care with 15 years of experience.', expertise: ['Hearing Disorders', 'Sinusitis', 'Throat Surgery'], languages: ['English', 'Spanish'], image: '/images/doctors/doctor-1.jpg' },
  { id: '2', name: 'Dr. Michael Chen', specialty: 'Cardiologist', experience: '20 years', education: 'MBBS, MD (Cardiology)', bio: 'Renowned cardiologist specializing in heart disease treatment.', expertise: ['Cardiac Care', 'Heart Failure', 'Preventive Cardiology'], languages: ['English', 'Mandarin'], image: '/images/doctors/doctor-2.jpg' },
  { id: '3', name: 'Dr. Emily Rodriguez', specialty: 'Pediatrician', experience: '12 years', education: 'MBBS, DCH', bio: 'Dedicated pediatrician providing comprehensive child care.', expertise: ['Child Development', 'Vaccination', 'Pediatric Nutrition'], languages: ['English', 'Spanish'], image: '/images/doctors/doctor-3.jpg' },
  { id: '4', name: 'Dr. James Wilson', specialty: 'Orthopedic Surgeon', experience: '18 years', education: 'MBBS, MS (Orthopedics)', bio: 'Specialist in joint replacement and sports medicine.', expertise: ['Joint Replacement', 'Sports Injuries', 'Arthroscopy'], languages: ['English'], image: '/images/doctors/doctor-4.jpg' },
  { id: '5', name: 'Dr. Priya Sharma', specialty: 'Gynecologist', experience: '14 years', education: 'MBBS, MS (OBG)', bio: 'Experienced in womens health and high-risk pregnancies.', expertise: ['Prenatal Care', 'High-Risk Pregnancy', 'Laparoscopy'], languages: ['English', 'Hindi'], image: '/images/doctors/doctor-5.jpg' },
  { id: '6', name: 'Dr. Robert Martinez', specialty: 'General Surgeon', experience: '22 years', education: 'MBBS, MS (Surgery)', bio: 'Highly skilled general surgeon with decades of experience.', expertise: ['Laparoscopy', 'Hernia Repair', 'Appendectomy'], languages: ['English', 'Spanish'], image: '/images/doctors/doctor-6.jpg' },
];

export default function DoctorProfile({ params }: { params: { id: string } }) {
  const doctor = doctors.find(d => d.id === params.id);
  if (!doctor) notFound();

  return (
    <main className="min-h-screen pt-20">
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 max-w-7xl flex items-center gap-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white">
            <Image
              src={doctor.image}
              alt={doctor.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">{doctor.name}</h1>
            <p className="text-xl text-blue-100">{doctor.specialty}</p>
            <p className="text-blue-100">{doctor.experience} Experience</p>
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-neutral-700">{doctor.bio}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Expertise</h2>
              <div className="grid grid-cols-2 gap-3">
                {doctor.expertise.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <h3 className="text-xl font-bold">Quick Info</h3>
              <div><p className="text-sm font-semibold text-neutral-600">Education</p><p>{doctor.education}</p></div>
              <div><p className="text-sm font-semibold text-neutral-600">Languages</p><p>{doctor.languages.join(', ')}</p></div>
            </div>
            <div className="mt-6 bg-orange-50 rounded-xl p-6 border border-orange-200">
              <h3 className="text-xl font-bold mb-3">Book Appointment</h3>
              <Link href="/appointments" className="block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg">Book Now</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
