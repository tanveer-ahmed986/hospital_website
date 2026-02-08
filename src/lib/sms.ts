/**
 * SMS Service
 *
 * SMS notifications using Twilio.
 */

import type { AppointmentWithDoctor } from './appointments';

// ============================================================================
// Types
// ============================================================================

export interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface SMSConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

// ============================================================================
// SMS Service
// ============================================================================

let twilioClient: any = null;

/**
 * Get or create Twilio client
 */
async function getTwilioClient() {
  if (twilioClient) return twilioClient;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    console.warn('Twilio credentials not configured');
    return null;
  }

  try {
    // Dynamic import for Twilio
    const twilio = await import('twilio');
    twilioClient = twilio.default(accountSid, authToken);
    return twilioClient;
  } catch (error) {
    console.error('Failed to initialize Twilio client:', error);
    return null;
  }
}

/**
 * Send SMS message
 */
export async function sendSMS(to: string, message: string): Promise<SMSResult> {
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!fromNumber) {
    console.warn('Twilio phone number not configured');
    return { success: false, error: 'SMS service not configured' };
  }

  // In development, log the message instead of sending
  if (process.env.NODE_ENV === 'development') {
    console.log(`[SMS - DEV MODE] To: ${to}`);
    console.log(`[SMS - DEV MODE] Message: ${message}`);
    return { success: true, messageId: 'dev-mode-message-id' };
  }

  const client = await getTwilioClient();
  if (!client) {
    return { success: false, error: 'SMS service not available' };
  }

  try {
    const result = await client.messages.create({
      to,
      from: fromNumber,
      body: message,
    });

    return { success: true, messageId: result.sid };
  } catch (error: any) {
    console.error('Failed to send SMS:', error);
    return {
      success: false,
      error: error.message || 'Failed to send SMS',
    };
  }
}

// ============================================================================
// Appointment SMS Templates
// ============================================================================

/**
 * Format time from 24-hour to 12-hour format
 */
function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Format date for display
 */
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Send appointment confirmation SMS
 */
export async function sendAppointmentConfirmationSMS(
  appointment: AppointmentWithDoctor,
  hospitalName: string = 'Our Hospital'
): Promise<SMSResult> {
  const message = `
${hospitalName} - Appointment Confirmed

Hi ${appointment.patientName},

Your appointment has been booked:
- Doctor: Dr. ${appointment.doctor.name}
- Date: ${formatDate(appointment.appointmentDate)}
- Time: ${formatTime(appointment.appointmentTime)}

Ref: ${appointment.id.slice(-8).toUpperCase()}

Please arrive 15 mins early. For changes, contact us.
`.trim();

  return sendSMS(appointment.patientPhone, message);
}

/**
 * Send appointment reminder SMS
 */
export async function sendAppointmentReminderSMS(
  appointment: AppointmentWithDoctor,
  hospitalName: string = 'Our Hospital'
): Promise<SMSResult> {
  const message = `
${hospitalName} - Appointment Reminder

Hi ${appointment.patientName},

Reminder: Your appointment with Dr. ${appointment.doctor.name} is tomorrow at ${formatTime(appointment.appointmentTime)}.

Please arrive 15 mins early. To reschedule, contact us.
`.trim();

  return sendSMS(appointment.patientPhone, message);
}

/**
 * Send appointment cancellation SMS
 */
export async function sendAppointmentCancellationSMS(
  appointment: AppointmentWithDoctor,
  hospitalName: string = 'Our Hospital',
  reason?: string
): Promise<SMSResult> {
  const reasonText = reason ? `\nReason: ${reason}` : '';

  const message = `
${hospitalName} - Appointment Cancelled

Hi ${appointment.patientName},

Your appointment with Dr. ${appointment.doctor.name} on ${formatDate(appointment.appointmentDate)} has been cancelled.${reasonText}

Please book a new appointment or contact us if you have questions.
`.trim();

  return sendSMS(appointment.patientPhone, message);
}

/**
 * Send appointment status update SMS
 */
export async function sendAppointmentStatusSMS(
  appointment: AppointmentWithDoctor,
  status: string,
  hospitalName: string = 'Our Hospital'
): Promise<SMSResult> {
  const statusMessages: Record<string, string> = {
    confirmed: `Your appointment with Dr. ${appointment.doctor.name} on ${formatDate(appointment.appointmentDate)} at ${formatTime(appointment.appointmentTime)} has been confirmed.`,
    completed: `Thank you for visiting ${hospitalName}. We hope your appointment with Dr. ${appointment.doctor.name} was helpful.`,
    rescheduled: `Your appointment has been rescheduled. Please check your email for details.`,
  };

  const statusMessage = statusMessages[status] || `Your appointment status has been updated to: ${status}`;

  const message = `
${hospitalName}

Hi ${appointment.patientName},

${statusMessage}

Ref: ${appointment.id.slice(-8).toUpperCase()}
`.trim();

  return sendSMS(appointment.patientPhone, message);
}
