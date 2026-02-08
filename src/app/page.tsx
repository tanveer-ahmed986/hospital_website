/**
 * Homepage
 *
 * Main landing page with hero carousel, featured content, and CTAs
 * Task: T156 [Homepage]
 */

import React from 'react';
import { Metadata } from 'next/head';
import { HeroCarousel } from '@/components/hero/HeroCarousel';
import { Testimonials } from '@/components/sections/Testimonials';
import { Certifications } from '@/components/sections/Certifications';

export const metadata: Metadata = {
  title: 'Home | ABC General Hospital',
  description: 'Quality healthcare services with experienced doctors and modern facilities.',
};

export default function HomePage() {
  const hospitalName = 'ABC General Hospital';

  // Mock data for testimonials (would come from CMS/database in production)
  const testimonials = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      rating: 5,
      comment:
        'Excellent care and very professional staff. Dr. Smith took the time to explain everything clearly. I felt comfortable and well taken care of throughout my treatment.',
      treatment: 'Cardiology Consultation',
      date: 'December 2025',
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      rating: 5,
      comment:
        'The emergency department was very efficient. The doctors were knowledgeable and compassionate. I received immediate attention and the best possible care.',
      treatment: 'Emergency Care',
      date: 'January 2026',
    },
    {
      id: '3',
      patientName: 'Emily Rodriguez',
      rating: 5,
      comment:
        'From booking to treatment, everything was seamless. The facilities are modern and clean. I highly recommend this hospital to anyone seeking quality healthcare.',
      treatment: 'General Surgery',
      date: 'January 2026',
    },
  ];

  // Mock data for certifications
  const certifications = [
    {
      name: 'JCI Accreditation',
      description:
        'Internationally recognized certification for healthcare quality and patient safety standards',
      issuedBy: 'Joint Commission International',
      year: 2020,
    },
    {
      name: 'ISO 9001:2015',
      description:
        'Quality management system certification ensuring consistent delivery of healthcare services',
      issuedBy: 'International Organization for Standardization',
      year: 2019,
    },
    {
      name: 'HIPAA Compliance',
      description:
        'Full compliance with Health Insurance Portability and Accountability Act for patient privacy',
      issuedBy: 'U.S. Department of Health',
      year: 2018,
    },
    {
      name: 'CAP Accreditation',
      description:
        'College of American Pathologists accreditation for laboratory excellence',
      issuedBy: 'College of American Pathologists',
      year: 2021,
    },
    {
      name: 'Green Healthcare Certificate',
      description:
        'Recognition for environmentally sustainable healthcare practices and operations',
      issuedBy: 'Global Green & Healthy Hospitals',
      year: 2022,
    },
    {
      name: 'Magnet Recognition',
      description:
        'Excellence in nursing services and quality patient care delivery',
      issuedBy: 'American Nurses Credentialing Center',
      year: 2020,
    },
  ];

  // Default hero images if none in database
  const defaultHeroImages = [
    {
      id: 'default-1',
      imageUrl: '/images/hero/hospital-exterior.jpg',
      altText: `${hospitalName} - Modern Healthcare Facility`,
      caption: `Welcome to ${hospitalName}`,
      subtitle: 'Providing world-class healthcare with state-of-the-art facilities and compassionate care for all your medical needs.',
      link: '/about',
      imageType: 'facility',
    },
    {
      id: 'default-2',
      imageUrl: '/images/hero/doctors-team.jpg',
      altText: 'Expert Medical Team',
      caption: 'The Best ENT Team',
      subtitle: 'Our board-certified specialists bring years of experience in ear, nose, and throat care with advanced treatment options.',
      link: '/services/ent',
      imageType: 'staff',
    },
    {
      id: 'default-3',
      imageUrl: '/images/hero/patient-care.jpg',
      altText: 'Compassionate Patient Care',
      caption: 'Compassionate Care',
      subtitle: 'Patient-centered approach with personalized treatment plans and dedicated support throughout your healthcare journey.',
      link: '/services',
      imageType: 'care',
    },
    {
      id: 'default-4',
      imageUrl: '/images/hero/modern-facility.jpg',
      altText: 'State-of-the-Art Medical Equipment',
      caption: 'Advanced Technology',
      subtitle: 'Equipped with the latest medical technology and equipment to provide accurate diagnosis and effective treatment.',
      link: '/facilities',
      imageType: 'equipment',
    },
    {
      id: 'default-5',
      imageUrl: '/images/hero/patient-consultation.jpg',
      altText: 'Professional Medical Consultation',
      caption: '24/7 Emergency Care',
      subtitle: 'Round-the-clock emergency services with expert medical staff ready to handle any urgent healthcare situation.',
      link: '/services/emergency',
      imageType: 'consultation',
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel images={defaultHeroImages} autoPlayInterval={5000} />

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-50"></div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm mb-4">
              Why Choose Us
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
              Excellence in Healthcare
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              We are committed to providing exceptional healthcare with compassion,
              innovation, and clinical excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-neutral-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/50">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-2xl text-neutral-900 mb-3 group-hover:text-blue-600 transition-colors">Experienced Team</h3>
              <p className="text-neutral-600 leading-relaxed">
                50+ specialist doctors with years of expertise
              </p>
            </div>

            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-neutral-100">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/50">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-2xl text-neutral-900 mb-3 group-hover:text-red-600 transition-colors">24/7 Emergency</h3>
              <p className="text-neutral-600 leading-relaxed">Round-the-clock emergency care services</p>
            </div>

            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-neutral-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/50">
                <svg
                  className="w-8 h-8 text-white"
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
              <h3 className="font-bold text-2xl text-neutral-900 mb-3 group-hover:text-green-600 transition-colors">Modern Facilities</h3>
              <p className="text-neutral-600 leading-relaxed">State-of-the-art equipment and technology</p>
            </div>

            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-neutral-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/50">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-2xl text-neutral-900 mb-3 group-hover:text-purple-600 transition-colors">
                Compassionate Care
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Patient-centered approach with personal attention
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Patients Treated */}
            <div className="text-center group">
              <div className="flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-blue-200 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">15,000+</div>
              <div className="text-blue-100 text-sm md:text-base">Patients Treated</div>
            </div>

            {/* Expert Doctors */}
            <div className="text-center group">
              <div className="flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-blue-200 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-blue-100 text-sm md:text-base">Expert Doctors</div>
            </div>

            {/* Years of Service */}
            <div className="text-center group">
              <div className="flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-blue-200 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">25+</div>
              <div className="text-blue-100 text-sm md:text-base">Years of Service</div>
            </div>

            {/* Emergency Response */}
            <div className="text-center group">
              <div className="flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-blue-200 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-100 text-sm md:text-base">Emergency Care</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials testimonials={testimonials} />

      {/* Certifications Section */}
      <Certifications certifications={certifications} />
    </main>
  );
}
