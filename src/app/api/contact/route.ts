/**
 * Contact API Route
 *
 * Handles contact form submissions
 * POST /api/contact - Submit contact inquiry
 * Task: T122 [US3]
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateContactData, createContactInquiry } from '@/lib/contact';
import { asyncHandler, ValidationError } from '@/lib/utils/error-handler';
import { successResponse } from '@/lib/utils/api-helpers';
import { sendEmail } from '@/lib/email';
import { rateLimit } from '@/lib/utils/rate-limit';

// Rate limiter for contact form (5 submissions per 15 minutes)
const rateLimiters = {
  contactForm: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many contact form submissions. Please try again later.',
  }),
};

/**
 * POST /api/contact
 * Submit a contact inquiry
 */
export const POST = asyncHandler(async (request: NextRequest) => {
  // Apply rate limiting
  const rateLimitResult = await rateLimiters.contactForm(request);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  const body = await request.json();

  // Validate input data
  const validationResult = validateContactData(body);

  if (!validationResult.success) {
    throw new ValidationError('Invalid contact form data', validationResult.error.errors);
  }

  const contactData = validationResult.data;

  // Create contact inquiry in database
  const inquiry = await createContactInquiry(contactData);

  // Send confirmation email to user (non-blocking)
  try {
    await sendEmail({
      to: contactData.email,
      subject: 'Contact Inquiry Received',
      html: `
        <h2>Thank you for contacting us</h2>
        <p>Dear ${contactData.name},</p>
        <p>We have received your inquiry and will respond within 24-48 hours.</p>
        <h3>Your Message:</h3>
        <p>${contactData.message}</p>
        <p>Best regards,<br/>Hospital Team</p>
      `,
      text: `Thank you for contacting us. We have received your inquiry and will respond within 24-48 hours.\n\nYour Message:\n${contactData.message}\n\nBest regards,\nHospital Team`,
    });
  } catch (emailError) {
    // Log error but don't fail the request
    console.error('Failed to send confirmation email:', emailError);
  }

  // Notify hospital staff (non-blocking)
  try {
    const adminEmail = process.env.CONTACT_NOTIFICATION_EMAIL;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `New Contact Inquiry: ${contactData.subject || 'General'}`,
        html: `
          <h2>New Contact Inquiry</h2>
          <p><strong>From:</strong> ${contactData.name} (${contactData.email})</p>
          ${contactData.phone ? `<p><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
          ${contactData.subject ? `<p><strong>Subject:</strong> ${contactData.subject}</p>` : ''}
          <h3>Message:</h3>
          <p>${contactData.message}</p>
          <p><em>Inquiry ID: ${inquiry.id}</em></p>
        `,
        text: `New Contact Inquiry\n\nFrom: ${contactData.name} (${contactData.email})\n${contactData.phone ? `Phone: ${contactData.phone}\n` : ''}${contactData.subject ? `Subject: ${contactData.subject}\n` : ''}\nMessage:\n${contactData.message}\n\nInquiry ID: ${inquiry.id}`,
      });
    }
  } catch (emailError) {
    console.error('Failed to send admin notification:', emailError);
  }

  return successResponse(
    {
      inquiry: {
        id: inquiry.id,
        status: inquiry.status,
        createdAt: inquiry.createdAt,
      },
      message: 'Contact inquiry submitted successfully. We will respond within 24-48 hours.',
    },
    { status: 201 }
  );
});

export const dynamic = 'force-dynamic';
