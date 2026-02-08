import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Departments | ABC General Hospital',
  description: 'Explore our comprehensive range of medical departments and specialized healthcare services.',
};

export default function DepartmentsPage() {
  // All doctors with their information
  const allDoctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'ENT Specialist', image: '/images/doctors/doctor-1.jpg', department: 'ENT (Ear, Nose & Throat)' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Cardiologist', image: '/images/doctors/doctor-2.jpg', department: 'Cardiology' },
    { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Pediatrician', image: '/images/doctors/doctor-3.jpg', department: 'Pediatrics' },
    { id: 4, name: 'Dr. James Wilson', specialty: 'Orthopedic Surgeon', image: '/images/doctors/doctor-4.jpg', department: 'Orthopedics' },
    { id: 5, name: 'Dr. Priya Sharma', specialty: 'Gynecologist', image: '/images/doctors/doctor-5.jpg', department: 'Gynecology & Obstetrics' },
    { id: 6, name: 'Dr. Robert Martinez', specialty: 'General Surgeon', image: '/images/doctors/doctor-6.jpg', department: 'Emergency Services' },
  ];

  const departments = [
    {
      name: 'Cardiology',
      description: 'Expert heart care with advanced diagnostic and treatment facilities.',
      link: '/services/cardiology',
    },
    {
      name: 'Orthopedics',
      description: 'Specialized care for bones, joints, and musculoskeletal conditions.',
      link: '/services/orthopedics',
    },
    {
      name: 'Pediatrics',
      description: 'Compassionate healthcare for infants, children, and adolescents.',
      link: '/services/pediatrics',
    },
    {
      name: 'Gynecology & Obstetrics',
      description: 'Comprehensive women\'s health and maternity services.',
      link: '/services/gynecology',
    },
    {
      name: 'ENT (Ear, Nose & Throat)',
      description: 'Complete care for ear, nose, and throat conditions.',
      link: '/services/ent',
    },
    {
      name: 'Emergency Services',
      description: '24/7 emergency care for urgent medical needs.',
      link: '/services/emergency',
    },
  ];

  // Get doctors for a specific department
  const getDoctorsForDepartment = (deptName: string) => {
    return allDoctors.filter(doctor => doctor.department === deptName);
  };

  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Departments</h1>
          <p className="text-xl text-blue-100">Comprehensive healthcare services across specialized departments</p>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <p className="text-lg text-neutral-700 leading-relaxed mb-12 max-w-3xl">
            ABC General Hospital offers a wide range of specialized departments staffed by experienced medical 
            professionals and equipped with state-of-the-art technology. Each department is dedicated to providing 
            the highest quality care in their respective fields.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept) => {
              const deptDoctors = getDoctorsForDepartment(dept.name);
              return (
                <div key={dept.name} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                  <h3 className="text-2xl font-bold mb-3 text-blue-900">{dept.name}</h3>
                  <p className="text-neutral-700 mb-4">{dept.description}</p>

                  {/* Doctors in this department */}
                  {deptDoctors.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-neutral-200">
                      <h4 className="text-sm font-semibold text-neutral-600 mb-3">Our Specialists</h4>
                      <div className="space-y-3">
                        {deptDoctors.map((doctor) => (
                          <Link
                            key={doctor.id}
                            href={`/doctors/${doctor.id}`}
                            className="flex items-center gap-3 group hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          >
                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-100 flex-shrink-0">
                              <Image
                                src={doctor.image}
                                alt={doctor.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors truncate">
                                {doctor.name}
                              </p>
                              <p className="text-xs text-neutral-600 truncate">{doctor.specialty}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    href={dept.link}
                    className="text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center"
                  >
                    Learn More
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-neutral-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <Link href="/appointments" className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-md transition-colors uppercase">
            Book an Appointment
          </Link>
        </div>
      </section>
    </main>
  );
}
