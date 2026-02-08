/**
 * Email Service
 *
 * Email notifications using SendGrid.
 */

import type { AppointmentWithDoctor } from './appointments';

// ============================================================================
// Types
// ============================================================================

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
  replyTo?: string;
}

// ============================================================================
// Email Service
// ============================================================================

let sendgridMail: any = null;

/**
 * Get or initialize SendGrid client
 */
async function getSendGridClient() {
  if (sendgridMail) return sendgridMail;

  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey) {
    console.warn('SendGrid API key not configured');
    return null;
  }

  try {
    // Dynamic import for SendGrid
    const sgMail = await import('@sendgrid/mail');
    sgMail.default.setApiKey(apiKey);
    sendgridMail = sgMail.default;
    return sendgridMail;
  } catch (error) {
    console.error('Failed to initialize SendGrid client:', error);
    return null;
  }
}

/**
 * Send email
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const fromEmail = options.from || process.env.SENDGRID_FROM_EMAIL;

  if (!fromEmail) {
    console.warn('SendGrid from email not configured');
    return { success: false, error: 'Email service not configured' };
  }

  // In development, log the email instead of sending
  if (process.env.NODE_ENV === 'development') {
    console.log(`[EMAIL - DEV MODE] To: ${options.to}`);
    console.log(`[EMAIL - DEV MODE] Subject: ${options.subject}`);
    console.log(`[EMAIL - DEV MODE] Text: ${options.text.substring(0, 200)}...`);
    return { success: true, messageId: 'dev-mode-message-id' };
  }

  const client = await getSendGridClient();
  if (!client) {
    return { success: false, error: 'Email service not available' };
  }

  try {
    const msg = {
      to: options.to,
      from: fromEmail,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text.replace(/\n/g, '<br>'),
      replyTo: options.replyTo,
    };

    const [response] = await client.send(msg);

    return {
      success: true,
      messageId: response.headers['x-message-id'],
    };
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error.message || 'Failed to send email',
    };
  }
}

// ============================================================================
// Appointment Email Templates
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
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Send appointment confirmation email
 */
export async function sendAppointmentConfirmationEmail(
  appointment: AppointmentWithDoctor,
  hospitalName: string = 'Our Hospital',
  hospitalPhone?: string,
  hospitalAddress?: string
): Promise<EmailResult> {
  const referenceNumber = appointment.id.slice(-8).toUpperCase();
  const specialties = appointment.doctor.specialties.map((s) => s.name).join(', ');

  const subject = `Appointment Confirmation - ${hospitalName} - Ref: ${referenceNumber}`;

  const text = `
APPOINTMENT CONFIRMED

Dear ${appointment.patientName},

Your appointment has been successfully booked at ${hospitalName}.

APPOINTMENT DETAILS:
-------------------
Reference Number: ${referenceNumber}
Doctor: Dr. ${appointment.doctor.name}
Designation: ${appointment.doctor.designation}
${specialties ? `Specialty: ${specialties}` : ''}
Date: ${formatDate(appointment.appointmentDate)}
Time: ${formatTime(appointment.appointmentTime)}

${appointment.reasonForVisit ? `Reason for Visit: ${appointment.reasonForVisit}` : ''}

IMPORTANT REMINDERS:
-------------------
- Please arrive at least 15 minutes before your appointment time
- Bring any relevant medical records or test reports
- Bring a valid ID for verification
- Wear a mask and follow hospital COVID-19 guidelines

NEED TO MAKE CHANGES?
-------------------
${hospitalPhone ? `Call us at: ${hospitalPhone}` : ''}
Reply to this email with your reference number

${hospitalAddress ? `HOSPITAL ADDRESS:\n${hospitalAddress}` : ''}

Thank you for choosing ${hospitalName}. We look forward to serving you.

Best regards,
${hospitalName} Team
`.trim();

  const html = generateConfirmationEmailHtml(
    appointment,
    hospitalName,
    hospitalPhone,
    hospitalAddress
  );

  return sendEmail({
    to: appointment.patientEmail,
    subject,
    text,
    html,
  });
}

/**
 * Generate HTML email for appointment confirmation
 */
function generateConfirmationEmailHtml(
  appointment: AppointmentWithDoctor,
  hospitalName: string,
  hospitalPhone?: string,
  hospitalAddress?: string
): string {
  const referenceNumber = appointment.id.slice(-8).toUpperCase();
  const specialties = appointment.doctor.specialties.map((s) => s.name).join(', ');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #0066CC; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 24px;">Appointment Confirmed</h1>
              <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Reference: ${referenceNumber}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px; color: #333; font-size: 16px;">
                Dear <strong>${appointment.patientName}</strong>,
              </p>
              <p style="margin: 0 0 30px; color: #666; font-size: 15px;">
                Your appointment has been successfully booked at <strong>${hospitalName}</strong>.
              </p>

              <!-- Appointment Card -->
              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 20px; color: #0066CC; font-size: 18px; border-bottom: 2px solid #0066CC; padding-bottom: 10px;">
                  Appointment Details
                </h2>

                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; width: 120px;">Doctor:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600;">Dr. ${appointment.doctor.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Designation:</td>
                    <td style="padding: 8px 0; color: #333;">${appointment.doctor.designation}</td>
                  </tr>
                  ${specialties ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Specialty:</td>
                    <td style="padding: 8px 0; color: #333;">${specialties}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Date:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600;">${formatDate(appointment.appointmentDate)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Time:</td>
                    <td style="padding: 8px 0; color: #333; font-weight: 600;">${formatTime(appointment.appointmentTime)}</td>
                  </tr>
                  ${appointment.reasonForVisit ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666; vertical-align: top;">Reason:</td>
                    <td style="padding: 8px 0; color: #333;">${appointment.reasonForVisit}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- Reminders -->
              <div style="background-color: #fff8e6; border-left: 4px solid #ffc107; padding: 16px; margin-bottom: 30px; border-radius: 4px;">
                <h3 style="margin: 0 0 10px; color: #856404; font-size: 14px; text-transform: uppercase;">Important Reminders</h3>
                <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px;">
                  <li>Please arrive 15 minutes before your appointment</li>
                  <li>Bring any relevant medical records or test reports</li>
                  <li>Bring a valid ID for verification</li>
                </ul>
              </div>

              <!-- Contact -->
              ${hospitalPhone ? `
              <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee;">
                <p style="margin: 0 0 10px; color: #666; font-size: 14px;">Need to make changes?</p>
                <p style="margin: 0;">
                  <a href="tel:${hospitalPhone}" style="color: #0066CC; text-decoration: none; font-weight: 600; font-size: 16px;">${hospitalPhone}</a>
                </p>
              </div>
              ` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
                Thank you for choosing <strong>${hospitalName}</strong>
              </p>
              ${hospitalAddress ? `
              <p style="margin: 0; color: #999; font-size: 12px;">${hospitalAddress}</p>
              ` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}

/**
 * Send appointment reminder email
 */
export async function sendAppointmentReminderEmail(
  appointment: AppointmentWithDoctor,
  hospitalName: string = 'Our Hospital'
): Promise<EmailResult> {
  const subject = `Appointment Reminder - Tomorrow with Dr. ${appointment.doctor.name}`;

  const text = `
APPOINTMENT REMINDER

Dear ${appointment.patientName},

This is a friendly reminder about your upcoming appointment at ${hospitalName}.

APPOINTMENT DETAILS:
-------------------
Doctor: Dr. ${appointment.doctor.name}
Date: ${formatDate(appointment.appointmentDate)}
Time: ${formatTime(appointment.appointmentTime)}

Please remember to:
- Arrive 15 minutes early
- Bring relevant medical records
- Bring a valid ID

See you tomorrow!

Best regards,
${hospitalName} Team
`.trim();

  return sendEmail({
    to: appointment.patientEmail,
    subject,
    text,
  });
}

/**
 * Send appointment cancellation email
 */
export async function sendAppointmentCancellationEmail(
  appointment: AppointmentWithDoctor,
  hospitalName: string = 'Our Hospital',
  reason?: string
): Promise<EmailResult> {
  const subject = `Appointment Cancelled - ${hospitalName}`;

  const text = `
APPOINTMENT CANCELLED

Dear ${appointment.patientName},

Your appointment with Dr. ${appointment.doctor.name} on ${formatDate(appointment.appointmentDate)} at ${formatTime(appointment.appointmentTime)} has been cancelled.

${reason ? `Reason: ${reason}` : ''}

If you would like to reschedule, please visit our website or contact us.

We apologize for any inconvenience caused.

Best regards,
${hospitalName} Team
`.trim();

  return sendEmail({
    to: appointment.patientEmail,
    subject,
    text,
  });
}
