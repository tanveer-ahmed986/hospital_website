import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | ABC General Hospital',
  description: 'Get in touch with ABC General Hospital. Find our location, phone numbers, and hours of operation.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100">We're here to help and answer any questions you may have</p>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Address</h3>
                    <p className="text-neutral-700">
                      123 Medical Center Drive<br />
                      Healthcare City, HC 12345<br />
                      United States
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone</h3>
                    <p className="text-neutral-700">
                      Main: (555) 123-4567<br />
                      Emergency: 911<br />
                      Appointments: (555) 123-4568
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <p className="text-neutral-700">
                      General: info@abchospital.com<br />
                      Appointments: appointments@abchospital.com<br />
                      Billing: billing@abchospital.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Hours</h3>
                    <p className="text-neutral-700">
                      Emergency: 24/7<br />
                      Outpatient Services: Mon-Fri 8am-6pm<br />
                      Visitor Hours: Daily 10am-8pm
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Quick Links</h2>
              
              <div className="bg-neutral-50 rounded-lg p-6 space-y-4">
                <Link href="/appointments" className="block p-4 bg-white rounded-md hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg text-blue-900 mb-1">Book an Appointment</h3>
                  <p className="text-neutral-600 text-sm">Schedule your visit online</p>
                </Link>
                
                <Link href="/services/emergency" className="block p-4 bg-white rounded-md hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg text-blue-900 mb-1">Emergency Services</h3>
                  <p className="text-neutral-600 text-sm">24/7 emergency care</p>
                </Link>
                
                <Link href="/departments" className="block p-4 bg-white rounded-md hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg text-blue-900 mb-1">Our Departments</h3>
                  <p className="text-neutral-600 text-sm">Explore our medical services</p>
                </Link>
                
                <Link href="/doctors" className="block p-4 bg-white rounded-md hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg text-blue-900 mb-1">Find a Doctor</h3>
                  <p className="text-neutral-600 text-sm">Meet our medical team</p>
                </Link>
              </div>
              
              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">Need Directions?</h3>
                <p className="text-neutral-700 mb-4">
                  We're conveniently located in the heart of Healthcare City with easy access from major highways.
                </p>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Get Directions →
                </a>
              </div>
            </div>
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
