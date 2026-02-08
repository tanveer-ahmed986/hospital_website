/**
 * Appointments API Route
 *
 * POST /api/appointments - Create new appointment
 */

import { NextRequest } from 'next/server';
import { createAppointment, markSmsSent, markEmailSent } from '@/lib/appointments';
import { appointmentSchema } from '@/lib/utils/validation';
import { createdResponse, parseJsonBody, badRequestResponse } from '@/lib/utils/api-helpers';
import { asyncHandler } from '@/lib/utils/error-handler';
import { verifyRecaptcha, isRecaptchaConfigured, getRecaptchaErrorMessage } from '@/lib/recaptcha';
import { sendAppointmentConfirmationSMS } from '@/lib/sms';
import { sendAppointmentConfirmationEmail } from '@/lib/email';
import { getCurrentHospitalConfig } from '@/lib/config';
import { rateLimiters } from '@/lib/utils/rate-limit';

export const POST = asyncHandler(async (request: NextRequest) => {
  // Apply rate limiting (T089)
  const rateLimitResult = await rateLimiters.appointmentBooking(request);
  if (rateLimitResult) return rateLimitResult;

  // Parse request body
  const body = await parseJsonBody(request);

  // Validate appointment data
  const validatedData = appointmentSchema.parse(body);

  // Verify reCAPTCHA token (if configured)
  if (isRecaptchaConfigured()) {
    const recaptchaResult = await verifyRecaptcha(validatedData.recaptchaToken, 'appointment_booking');
    if (!recaptchaResult.success) {
      const errorMessage = getRecaptchaErrorMessage(recaptchaResult.error_codes || []);
      return badRequestResponse(errorMessage);
    }
  }

  // Create appointment
  const { recaptchaToken, ...appointmentData } = validatedData;
  const appointment = await createAppointment(appointmentData);

  // Get hospital config for notifications
  let hospitalName = 'Our Hospital';
  let hospitalPhone: string | undefined;
  let hospitalAddress: string | undefined;

  try {
    const config = getCurrentHospitalConfig();
    hospitalName = config.hospital.name;
    hospitalPhone = config.contact?.phone;
    if (config.contact?.address) {
      const addr = config.contact.address;
      hospitalAddress = `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`;
    }
  } catch (e) {
    // Use defaults if config not available
  }

  // Send notifications asynchronously (don't block response)
  Promise.all([
    // Send SMS notification
    sendAppointmentConfirmationSMS(appointment, hospitalName)
      .then((result) => {
        if (result.success) {
          markSmsSent(appointment.id).catch(console.error);
        }
      })
      .catch(console.error),

    // Send email notification
    sendAppointmentConfirmationEmail(appointment, hospitalName, hospitalPhone, hospitalAddress)
      .then((result) => {
        if (result.success) {
          markEmailSent(appointment.id).catch(console.error);
        }
      })
      .catch(console.error),
  ]).catch(console.error);

  return createdResponse(appointment, 'Appointment booked successfully');
});

export const dynamic = 'force-dynamic';
