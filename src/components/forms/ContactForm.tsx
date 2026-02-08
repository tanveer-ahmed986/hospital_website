/**
 * Contact Form Component
 *
 * Form for submitting contact inquiries with validation
 * Task: T123 [US3]
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '@/lib/contact';
import { useRecaptcha } from '@/hooks/useRecaptcha';

interface ContactFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function ContactForm({ onSuccess, className = '' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { executeRecaptcha, isReady: recaptchaReady } = useRecaptcha();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Execute reCAPTCHA if available
      let recaptchaToken: string | null = null;
      if (recaptchaReady) {
        recaptchaToken = await executeRecaptcha('contact_form');
      }

      // Submit form data
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          recaptchaToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit contact form');
      }

      // Success
      setSubmitStatus({
        type: 'success',
        message: result.message || 'Your message has been sent successfully!',
      });
      reset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to send message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${className}`}>
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
            errors.name ? 'border-red-500' : 'border-neutral-300'
          }`}
          placeholder="Enter your full name"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
            errors.email ? 'border-red-500' : 'border-neutral-300'
          }`}
          placeholder="your.email@example.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Phone (Optional) */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
          Phone Number <span className="text-neutral-400">(Optional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          {...register('phone')}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
            errors.phone ? 'border-red-500' : 'border-neutral-300'
          }`}
          placeholder="+92-300-1234567"
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      {/* Subject (Optional) */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
          Subject <span className="text-neutral-400">(Optional)</span>
        </label>
        <input
          type="text"
          id="subject"
          {...register('subject')}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
            errors.subject ? 'border-red-500' : 'border-neutral-300'
          }`}
          placeholder="General Inquiry"
          disabled={isSubmitting}
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          {...register('message')}
          rows={6}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors resize-y ${
            errors.message ? 'border-red-500' : 'border-neutral-300'
          }`}
          placeholder="How can we help you? (minimum 10 characters)"
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
        <p className="mt-1 text-xs text-neutral-500">Minimum 10 characters, maximum 2000</p>
      </div>

      {/* Status Messages */}
      {submitStatus && (
        <div
          className={`p-4 rounded-lg ${
            submitStatus.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
          role="alert"
        >
          <div className="flex items-start gap-2">
            {submitStatus.type === 'success' ? (
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <p className="text-sm">{submitStatus.message}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </button>

      {/* reCAPTCHA Notice */}
      <p className="text-xs text-neutral-500 text-center">
        This site is protected by reCAPTCHA and the Google{' '}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-neutral-700"
        >
          Privacy Policy
        </a>{' '}
        and{' '}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-neutral-700"
        >
          Terms of Service
        </a>{' '}
        apply.
      </p>
    </form>
  );
}
