import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emergency Services | ABC General Hospital',
  description: '24/7 emergency care with experienced emergency physicians and advanced trauma facilities for urgent medical needs.',
};

export default function EmergencyPage() {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Emergency Services</h1>
          <p className="text-xl text-blue-100">24/7 emergency care when you need it most</p>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8">
            <h3 className="text-xl font-bold text-red-900 mb-2">Emergency? Call 911</h3>
            <p className="text-red-800">
              For life-threatening emergencies, always call 911 or come directly to our Emergency Department.
            </p>
          </div>
          
          <p className="text-lg text-neutral-700 leading-relaxed mb-6">
            Our Emergency Department is open 24 hours a day, 7 days a week, providing immediate care for urgent and 
            life-threatening conditions. Staffed by board-certified emergency physicians and specially trained nurses, 
            we are equipped to handle all types of medical emergencies with state-of-the-art equipment and facilities.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">Services We Provide</h2>
          <ul className="list-disc list-inside space-y-2 text-neutral-700 mb-6">
            <li>24/7 emergency medical care</li>
            <li>Trauma care and stabilization</li>
            <li>Cardiac emergency treatment</li>
            <li>Stroke care and intervention</li>
            <li>Pediatric emergency services</li>
            <li>Advanced imaging and diagnostics</li>
            <li>Emergency surgery capabilities</li>
            <li>Critical care and ICU admission</li>
          </ul>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">What to Expect</h2>
          <p className="text-lg text-neutral-700 leading-relaxed mb-4">
            When you arrive at our Emergency Department, you will be quickly assessed by our triage team to determine 
            the severity of your condition. Patients with life-threatening conditions receive immediate attention. 
            We strive to provide efficient, compassionate care while keeping wait times as short as possible.
          </p>
          
          <p className="text-lg text-neutral-700 leading-relaxed">
            Please bring your insurance information, photo ID, and a list of current medications if possible. If you're 
            experiencing a medical emergency, don't wait - come directly to our Emergency Department or call 911.
          </p>
        </div>
      </section>
      
      {/* CTA */}
      <section className="bg-neutral-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Non-Emergency Care?</h2>
          <Link href="/appointments" className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-md transition-colors uppercase">
            Book an Appointment
          </Link>
        </div>
      </section>
    </main>
  );
}
