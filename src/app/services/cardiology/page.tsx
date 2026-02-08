import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cardiology Services | ABC General Hospital',
  description: 'Advanced cardiac care with expert cardiologists and state-of-the-art facilities for heart disease diagnosis and treatment.',
};

export default function CardiologyPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cardiology Services</h1>
          <p className="text-xl text-blue-100">Expert heart care for a healthier tomorrow</p>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-lg text-neutral-700 leading-relaxed mb-6">
            Our Cardiology department is dedicated to providing comprehensive cardiovascular care. From prevention and 
            diagnosis to advanced interventional procedures, our team of experienced cardiologists uses cutting-edge 
            technology to deliver the best outcomes for our patients.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">Services We Offer</h2>
          <ul className="list-disc list-inside space-y-2 text-neutral-700 mb-6">
            <li>Cardiac catheterization and angiography</li>
            <li>Echocardiography and stress testing</li>
            <li>Pacemaker and defibrillator implantation</li>
            <li>Heart failure management</li>
            <li>Coronary artery disease treatment</li>
            <li>Arrhythmia diagnosis and treatment</li>
            <li>Preventive cardiology and risk assessment</li>
            <li>24-hour Holter monitoring</li>
          </ul>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">Advanced Technology</h2>
          <p className="text-lg text-neutral-700 leading-relaxed">
            We are equipped with the latest diagnostic and treatment technologies including advanced cardiac imaging, 
            catheterization labs, and cardiac care units. Our multidisciplinary approach ensures comprehensive care 
            for all cardiac conditions from routine check-ups to complex interventions.
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
