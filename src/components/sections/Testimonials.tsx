/**
 * Testimonials Section
 *
 * Displays patient testimonials and reviews on homepage
 * Task: T154 [Homepage]
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Testimonial {
  id: string;
  patientName: string;
  patientInitials?: string;
  rating: number;
  comment: string;
  date?: string;
  treatment?: string;
}

export interface TestimonialsProps {
  testimonials: Testimonial[];
  className?: string;
}

export function Testimonials({ testimonials, className = '' }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (testimonials.length === 0) {
    return null;
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className={`py-16 bg-[var(--color-primary-50)] ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            What Our Patients Say
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Real experiences from patients who have trusted us with their healthcare needs.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
            >
              {/* Quote Icon */}
              <div className="flex justify-center mb-6">
                <svg
                  className="w-12 h-12 text-[var(--color-primary)]"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>

              {/* Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${
                      i < currentTestimonial.rating
                        ? 'text-yellow-400'
                        : 'text-neutral-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Comment */}
              <p className="text-lg md:text-xl text-neutral-700 text-center mb-8 leading-relaxed">
                &ldquo;{currentTestimonial.comment}&rdquo;
              </p>

              {/* Patient Info */}
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xl font-bold mb-3">
                  {currentTestimonial.patientInitials ||
                    currentTestimonial.patientName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                </div>

                <h4 className="text-lg font-semibold text-neutral-900">
                  {currentTestimonial.patientName}
                </h4>

                {currentTestimonial.treatment && (
                  <p className="text-sm text-neutral-600">{currentTestimonial.treatment}</p>
                )}

                {currentTestimonial.date && (
                  <p className="text-xs text-neutral-500 mt-1">
                    {currentTestimonial.date}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
                aria-label="Previous testimonial"
              >
                <svg
                  className="w-6 h-6 text-neutral-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
                aria-label="Next testimonial"
              >
                <svg
                  className="w-6 h-6 text-neutral-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-[var(--color-primary)] w-8'
                        : 'bg-neutral-300 hover:bg-neutral-400'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
