/**
 * AppointmentForm Component
 *
 * Complete appointment booking form with date, time, and patient details.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@/components/common';
import { DatePicker } from './DatePicker';
import { TimeSlotSelector, TimeSlot } from './TimeSlotSelector';
import { appointmentSchema, type AppointmentFormData } from '@/lib/utils/validation';
import type { DoctorWithRelations } from '@/lib/doctors';
import { useRecaptcha } from '@/hooks/useRecaptcha';

export interface AppointmentFormProps {
  doctor: DoctorWithRelations;
  onSuccess?: (appointmentId: string) => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  doctor,
  onSuccess,
}) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // reCAPTCHA integration (T088)
  const { executeRecaptcha, isReady: recaptchaReady, error: recaptchaError } = useRecaptcha();

  // Get available days from doctor's OPD schedule
  const availableDays = doctor.opdSchedule?.map((schedule) => schedule.dayOfWeek) || [];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctorId: doctor.id,
    },
  });

  // Fetch available slots when date changes
  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSelectedTime(null);

      try {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const response = await fetch(
          `/api/appointments/available-slots?doctorId=${doctor.id}&date=${dateStr}`
        );

        if (response.ok) {
          const data = await response.json();
          setAvailableSlots(data.slots || []);
        } else {
          setAvailableSlots([]);
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, doctor.id]);

  // Update form values when date/time changes
  useEffect(() => {
    if (selectedDate) {
      setValue('appointmentDate', selectedDate.toISOString().split('T')[0]);
    }
  }, [selectedDate, setValue]);

  useEffect(() => {
    if (selectedTime) {
      setValue('appointmentTime', selectedTime);
    }
  }, [selectedTime, setValue]);

  const onSubmit = async (data: AppointmentFormData) => {
    setSubmitError(null);

    // Execute reCAPTCHA before submission (T088)
    let recaptchaToken: string | null = null;
    if (recaptchaReady) {
      recaptchaToken = await executeRecaptcha('appointment_booking');
      if (!recaptchaToken) {
        setSubmitError(recaptchaError || 'reCAPTCHA verification failed. Please try again.');
        return;
      }
    }

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          recaptchaToken,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (onSuccess) {
          onSuccess(result.data.id);
        } else {
          router.push(`/appointments/confirmation?id=${result.data.id}`);
        }
      } else {
        setSubmitError(result.message || 'Failed to book appointment. Please try again.');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Doctor Info Summary */}
      <div className="bg-[var(--color-primary-50,#f0f9ff)] rounded-lg p-4 border border-[var(--color-primary-100,#e0f2fe)]">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
            {doctor.photo ? (
              <img
                src={doctor.photo}
                alt={doctor.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <svg
                className="h-8 w-8 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Dr. {doctor.name}</h3>
            <p className="text-sm text-neutral-600">{doctor.designation}</p>
            {doctor.specialties && doctor.specialties.length > 0 && (
              <p className="text-sm text-[var(--color-primary)]">
                {doctor.specialties.map((s) => s.name).join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Step 1: Select Date */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-primary)] text-white text-sm">
            1
          </span>
          Select Date
        </h2>
        <DatePicker
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          availableDays={availableDays}
        />
        {errors.appointmentDate && (
          <p className="mt-2 text-sm text-red-600">{errors.appointmentDate.message}</p>
        )}
      </div>

      {/* Step 2: Select Time */}
      {selectedDate && (
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-primary)] text-white text-sm">
              2
            </span>
            Select Time
          </h2>
          <TimeSlotSelector
            slots={availableSlots}
            selectedSlot={selectedTime}
            onSlotSelect={setSelectedTime}
            loading={loadingSlots}
          />
          {errors.appointmentTime && (
            <p className="mt-2 text-sm text-red-600">{errors.appointmentTime.message}</p>
          )}
        </div>
      )}

      {/* Step 3: Patient Details */}
      {selectedDate && selectedTime && (
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-primary)] text-white text-sm">
              3
            </span>
            Your Details
          </h2>

          <div className="space-y-4">
            <Input
              label="Full Name"
              {...register('patientName')}
              error={errors.patientName?.message}
              placeholder="Enter your full name"
              required
            />

            <Input
              label="Phone Number"
              {...register('patientPhone')}
              error={errors.patientPhone?.message}
              placeholder="+1-555-0000"
              type="tel"
              required
            />

            <Input
              label="Email Address"
              {...register('patientEmail')}
              error={errors.patientEmail?.message}
              placeholder="you@example.com"
              type="email"
              required
            />

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Reason for Visit
                <span className="text-neutral-400 font-normal ml-1">(Optional)</span>
              </label>
              <textarea
                {...register('reasonForVisit')}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors resize-none"
                rows={3}
                placeholder="Brief description of your symptoms or reason for consultation..."
                maxLength={500}
              />
              {errors.reasonForVisit && (
                <p className="mt-1 text-sm text-red-600">{errors.reasonForVisit.message}</p>
              )}
            </div>

            {/* Hidden fields */}
            <input type="hidden" {...register('doctorId')} />

            {/* reCAPTCHA status indicator */}
            {recaptchaError && (
              <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                ⚠️ reCAPTCHA verification unavailable. Form submission may be limited.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {selectedDate && selectedTime && (
        <div className="pt-4 border-t border-neutral-200">
          <div className="bg-neutral-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-neutral-900 mb-2">Appointment Summary</h4>
            <div className="text-sm text-neutral-600 space-y-1">
              <p>
                <strong>Doctor:</strong> Dr. {doctor.name}
              </p>
              <p>
                <strong>Date:</strong> {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p>
                <strong>Time:</strong> {formatTime(selectedTime)}
              </p>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Booking Appointment...
              </span>
            ) : (
              'Confirm Booking'
            )}
          </Button>

          <p className="text-xs text-neutral-500 text-center mt-3">
            By booking, you agree to our privacy policy and consent to receive appointment-related communications.
          </p>
        </div>
      )}
    </form>
  );
};

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}
