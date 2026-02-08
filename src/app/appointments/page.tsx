/**
 * Appointments Booking Page
 */

'use client';

import React, { useState } from 'react';
import { Metadata } from 'next';

export default function AppointmentsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    doctor: '',
    date: '',
    message: '',
  });

  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'ENT Specialist' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Cardiologist' },
    { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Pediatrician' },
    { id: 4, name: 'Dr. James Wilson', specialty: 'Orthopedic Surgeon' },
    { id: 5, name: 'Dr. Priya Sharma', specialty: 'Gynecologist' },
    { id: 6, name: 'Dr. Robert Martinez', specialty: 'General Surgeon' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Appointment request submitted! We will contact you shortly.');
    console.log('Appointment data:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Book an Appointment</h1>
          <p className="text-xl text-orange-100">Schedule your visit with our expert medical team</p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+1 234 567 8900"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Department *
                </label>
                <select
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  <option value="ent">ENT</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="gynecology">Gynecology</option>
                  <option value="orthopedics">Orthopedics</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              {/* Select Doctor */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Select Doctor *
                </label>
                <select
                  name="doctor"
                  required
                  value={formData.doctor}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Choose a Doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} - {doc.specialty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Message */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Please provide any additional information..."
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 uppercase"
              >
                Book Appointment
              </button>
            </div>
          </form>

          {/* Contact Info */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Need Help?</h3>
            <p className="text-neutral-700 mb-4">
              You can also call us directly to book an appointment:
            </p>
            <p className="text-2xl font-bold text-blue-600">+1-555-ABC-HOSP</p>
            <p className="text-sm text-neutral-600 mt-2">Available 24/7</p>
          </div>
        </div>
      </section>
    </main>
  );
}
