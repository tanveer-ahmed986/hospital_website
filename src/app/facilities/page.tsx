import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Facilities | ABC General Hospital',
  description: 'State-of-the-art medical facilities and equipment providing advanced healthcare services.',
};

export default function FacilitiesPage() {
  const facilities = [
    {
      name: 'Advanced Imaging Center',
      description: 'Equipped with MRI, CT scan, X-ray, and ultrasound technology for accurate diagnosis.',
    },
    {
      name: 'Intensive Care Units',
      description: 'State-of-the-art ICUs with 24/7 monitoring and critical care capabilities.',
    },
    {
      name: 'Operating Theaters',
      description: 'Modern surgical suites with advanced equipment for complex procedures.',
    },
    {
      name: 'Clinical Laboratory',
      description: 'Comprehensive lab services with rapid testing and accurate results.',
    },
    {
      name: 'Emergency Department',
      description: '24/7 emergency care with trauma facilities and rapid response teams.',
    },
    {
      name: 'Maternity Ward',
      description: 'Comfortable, family-friendly birthing suites with advanced monitoring.',
    },
    {
      name: 'Pharmacy',
      description: 'Full-service pharmacy providing medications and pharmaceutical care.',
    },
    {
      name: 'Physical Therapy',
      description: 'Rehabilitation services with modern equipment and expert therapists.',
    },
  ];

  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Facilities</h1>
          <p className="text-xl text-blue-100">State-of-the-art infrastructure for superior patient care</p>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <p className="text-lg text-neutral-700 leading-relaxed mb-12 max-w-3xl">
            ABC General Hospital is equipped with modern facilities and cutting-edge medical technology to provide 
            the highest standard of care. Our infrastructure is designed to ensure patient comfort, safety, and access 
            to advanced medical services.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {facilities.map((facility) => (
              <div key={facility.name} className="bg-white rounded-lg shadow-md p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-900">{facility.name}</h3>
                <p className="text-neutral-700">{facility.description}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-blue-50 rounded-lg p-8 max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Patient Amenities</h2>
            <ul className="space-y-2 text-neutral-700">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Private and semi-private patient rooms
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Cafeteria and visitor lounges
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free WiFi throughout the hospital
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Ample parking facilities
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Wheelchair accessible throughout
              </li>
            </ul>
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
