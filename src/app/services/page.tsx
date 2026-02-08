/**
 * Services Page
 */

import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services | ABC General Hospital',
  description: 'Comprehensive medical services',
};

const services = [
  { id: 'ent', name: 'ENT', description: 'Ear, Nose & Throat care', icon: '👂', link: '/services/ent' },
  { id: 'cardiology', name: 'Cardiology', description: 'Heart care', icon: '❤️', link: '/services/cardiology' },
  { id: 'pediatrics', name: 'Pediatrics', description: 'Child care', icon: '👶', link: '/services/pediatrics' },
  { id: 'gynecology', name: 'Gynecology', description: 'Women health', icon: '👩‍⚕️', link: '/services/gynecology' },
  { id: 'orthopedics', name: 'Orthopedics', description: 'Bone & Joint care', icon: '🦴', link: '/services/orthopedics' },
  { id: 'emergency', name: 'Emergency', description: '24/7 Emergency care', icon: '🚑', link: '/services/emergency' },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen pt-20">
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Medical Services</h1>
          <p className="text-xl text-blue-100">Comprehensive healthcare services</p>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link key={service.id} href={service.link} className="group bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border hover:-translate-y-2">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600">{service.name}</h3>
                <p className="text-neutral-600 mb-4">{service.description}</p>
                <span className="text-blue-600 font-semibold">Learn More →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
