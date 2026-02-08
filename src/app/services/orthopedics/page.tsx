import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orthopedics Services | ABC General Hospital',
  description: 'Expert orthopedic care for bone, joint, and muscle conditions with advanced surgical and rehabilitation services.',
};

export default function OrthopedicsPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Orthopedics Services</h1>
          <p className="text-xl text-blue-100">Advanced care for bones, joints, and muscles</p>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-lg text-neutral-700 leading-relaxed mb-6">
            Our Orthopedics department specializes in the diagnosis, treatment, and rehabilitation of musculoskeletal 
            conditions. Whether you're dealing with a sports injury, chronic joint pain, or need joint replacement surgery, 
            our orthopedic surgeons and rehabilitation specialists are here to help you regain mobility and improve your 
            quality of life.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">Services We Offer</h2>
          <ul className="list-disc list-inside space-y-2 text-neutral-700 mb-6">
            <li>Joint replacement surgery (hip, knee, shoulder)</li>
            <li>Sports medicine and injury treatment</li>
            <li>Arthroscopic surgery</li>
            <li>Fracture care and trauma surgery</li>
            <li>Spine surgery and treatment</li>
            <li>Hand and wrist surgery</li>
            <li>Pediatric orthopedics</li>
            <li>Physical therapy and rehabilitation</li>
          </ul>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">Advanced Surgical Techniques</h2>
          <p className="text-lg text-neutral-700 leading-relaxed">
            We utilize the latest minimally invasive surgical techniques and state-of-the-art technology to provide 
            optimal outcomes with faster recovery times. Our comprehensive approach includes pre-operative planning, 
            expert surgical care, and personalized rehabilitation programs to help you return to your active lifestyle.
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
