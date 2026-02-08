import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | ABC General Hospital',
  description: 'Learn about ABC General Hospital\'s mission, values, and commitment to providing exceptional healthcare services.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About ABC General Hospital</h1>
          <p className="text-xl text-blue-100">Committed to excellence in healthcare since 1950</p>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-lg text-neutral-700 leading-relaxed mb-6">
            ABC General Hospital has been a cornerstone of healthcare in our community for over 70 years. Founded in 1950 
            with a vision to provide accessible, high-quality medical care, we have grown from a small community hospital 
            to a leading healthcare institution serving thousands of patients annually.
          </p>
          
          <p className="text-lg text-neutral-700 leading-relaxed mb-12">
            Today, we continue to honor our founding principles while embracing innovation and advanced medical technology. 
            Our commitment to patient-centered care, clinical excellence, and community service remains unwavering.
          </p>
          
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-neutral-700 leading-relaxed mb-12">
            To provide compassionate, high-quality healthcare services that improve the health and wellbeing of our community. 
            We strive to deliver exceptional patient experiences through clinical excellence, innovation, and a commitment to 
            treating every patient with dignity and respect.
          </p>
          
          <h2 className="text-3xl font-bold mb-6">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Compassion</h3>
              <p className="text-neutral-700">
                We treat every patient with empathy, kindness, and respect, recognizing their individual needs and concerns.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Excellence</h3>
              <p className="text-neutral-700">
                We pursue the highest standards in medical care, continuously improving our services and outcomes.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Integrity</h3>
              <p className="text-neutral-700">
                We conduct ourselves with honesty, transparency, and ethical behavior in all our interactions.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Innovation</h3>
              <p className="text-neutral-700">
                We embrace new technologies and approaches to improve patient care and advance medical practice.
              </p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-6">Our Team</h2>
          <p className="text-lg text-neutral-700 leading-relaxed">
            Our hospital is staffed by over 200 highly qualified physicians, nurses, and healthcare professionals who are 
            dedicated to providing exceptional care. Our team includes board-certified specialists, experienced surgeons, 
            compassionate nurses, and support staff who work together to ensure the best possible outcomes for our patients. 
            We invest in ongoing education and training to ensure our team stays at the forefront of medical knowledge and practice.
          </p>
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
