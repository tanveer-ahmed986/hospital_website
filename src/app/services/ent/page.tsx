import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ENT (Ear, Nose & Throat) Services | ABC General Hospital',
  description: 'Expert ENT care for all ear, nose, and throat conditions with state-of-the-art diagnostic and treatment facilities.',
};

export default function ENTPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">ENT (Ear, Nose & Throat) Services</h1>
          <p className="text-xl text-blue-100">Comprehensive care for all ENT conditions</p>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-lg text-neutral-700 leading-relaxed mb-6">
            Our ENT department provides comprehensive diagnosis and treatment for conditions affecting the ear, nose, and throat. 
            With advanced diagnostic equipment and experienced specialists, we offer care for everything from common infections 
            to complex surgical procedures.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">Services We Offer</h2>
          <ul className="list-disc list-inside space-y-2 text-neutral-700 mb-6">
            <li>Hearing tests and hearing aid fittings</li>
            <li>Treatment of sinusitis and nasal disorders</li>
            <li>Throat and voice disorder management</li>
            <li>Tonsillectomy and adenoidectomy</li>
            <li>Endoscopic sinus surgery</li>
            <li>Treatment of sleep apnea and snoring</li>
            <li>Allergy testing and immunotherapy</li>
          </ul>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">Why Choose Us</h2>
          <p className="text-lg text-neutral-700 leading-relaxed">
            Our ENT specialists are board-certified and have extensive experience in both medical and surgical management 
            of ear, nose, and throat conditions. We utilize the latest technology including endoscopic equipment and 
            advanced imaging to provide accurate diagnoses and effective treatments.
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
