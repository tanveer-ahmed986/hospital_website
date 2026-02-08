import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pediatrics Services | ABC General Hospital',
  description: 'Compassionate pediatric care for infants, children, and adolescents with experienced pediatricians and child-friendly facilities.',
};

export default function PediatricsPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pediatrics Services</h1>
          <p className="text-xl text-blue-100">Caring for your child's health and wellbeing</p>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-lg text-neutral-700 leading-relaxed mb-6">
            Our Pediatrics department provides comprehensive healthcare services for children from birth through adolescence. 
            Our pediatricians are dedicated to ensuring your child receives the best possible care in a warm, child-friendly 
            environment that puts both children and parents at ease.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">Services We Offer</h2>
          <ul className="list-disc list-inside space-y-2 text-neutral-700 mb-6">
            <li>Well-child checkups and immunizations</li>
            <li>Treatment of acute and chronic illnesses</li>
            <li>Growth and development monitoring</li>
            <li>Newborn and infant care</li>
            <li>Adolescent health services</li>
            <li>Nutritional counseling</li>
            <li>Behavioral and developmental assessments</li>
            <li>Minor surgical procedures</li>
          </ul>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">Child-Centered Care</h2>
          <p className="text-lg text-neutral-700 leading-relaxed">
            We believe in providing family-centered care that addresses not just the physical health of your child, 
            but also their emotional and developmental needs. Our pediatricians work closely with families to ensure 
            every child reaches their full potential in a supportive and nurturing environment.
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
