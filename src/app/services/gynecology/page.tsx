import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gynecology & Obstetrics Services | ABC General Hospital',
  description: 'Comprehensive women\'s health services including prenatal care, gynecological treatments, and maternity services.',
};

export default function GynecologyPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gynecology & Obstetrics Services</h1>
          <p className="text-xl text-blue-100">Comprehensive women's health care at every stage</p>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-lg text-neutral-700 leading-relaxed mb-6">
            Our Gynecology and Obstetrics department provides complete women's healthcare services throughout all stages 
            of life. From routine check-ups and preventive care to prenatal services and complex gynecological procedures, 
            our experienced team is committed to providing compassionate, personalized care.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">Services We Offer</h2>
          <ul className="list-disc list-inside space-y-2 text-neutral-700 mb-6">
            <li>Prenatal care and delivery services</li>
            <li>High-risk pregnancy management</li>
            <li>Annual well-woman exams</li>
            <li>Family planning and contraception</li>
            <li>Menopause management</li>
            <li>Treatment of gynecological disorders</li>
            <li>Minimally invasive gynecological surgery</li>
            <li>Infertility evaluation and treatment</li>
          </ul>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">Maternity Care</h2>
          <p className="text-lg text-neutral-700 leading-relaxed">
            Our maternity services include comprehensive prenatal care, modern labor and delivery suites, and postpartum 
            support. We provide a comfortable, family-friendly environment with advanced medical technology to ensure 
            the safety and wellbeing of both mother and baby.
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
