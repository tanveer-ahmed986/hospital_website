// Unit tests for notification services (SMS and Email)
// Task: T084 [US1]

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendSMS, sendAppointmentConfirmationSMS } from '@/lib/sms';
import { sendEmail, sendAppointmentConfirmationEmail } from '@/lib/email';

// Mock Twilio
vi.mock('twilio', () => ({
  default: vi.fn(() => ({
    messages: {
      create: vi.fn(),
    },
  })),
}));

// Mock SendGrid
vi.mock('@sendgrid/mail', () => ({
  default: {
    setApiKey: vi.fn(),
    send: vi.fn(),
  },
}));

describe('SMS Notification Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendSMS', () => {
    it('should send SMS successfully', async () => {
      const mockCreate = vi.fn().mockResolvedValue({
        sid: 'SM123456',
        status: 'sent',
      });

      const twilio = require('twilio').default();
      twilio.messages.create = mockCreate;

      const result = await sendSMS('+923001234567', 'Test message');

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('SM123456');
      expect(mockCreate).toHaveBeenCalledWith({
        to: '+923001234567',
        from: expect.any(String),
        body: 'Test message',
      });
    });

    it('should validate phone number format', async () => {
      const result = await sendSMS('invalid-phone', 'Test message');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid phone number');
    });

    it('should handle SMS sending failures', async () => {
      const mockCreate = vi.fn().mockRejectedValue(new Error('Twilio API error'));

      const twilio = require('twilio').default();
      twilio.messages.create = mockCreate;

      const result = await sendSMS('+923001234567', 'Test message');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should truncate long messages', async () => {
      const mockCreate = vi.fn().mockResolvedValue({ sid: 'SM123', status: 'sent' });

      const twilio = require('twilio').default();
      twilio.messages.create = mockCreate;

      const longMessage = 'A'.repeat(1000);
      await sendSMS('+923001234567', longMessage);

      const calledWith = mockCreate.mock.calls[0][0];
      expect(calledWith.body.length).toBeLessThanOrEqual(160);
    });

    it('should support international phone numbers', async () => {
      const mockCreate = vi.fn().mockResolvedValue({ sid: 'SM123', status: 'sent' });

      const twilio = require('twilio').default();
      twilio.messages.create = mockCreate;

      const result = await sendSMS('+14155551234', 'Test message');

      expect(result.success).toBe(true);
      expect(mockCreate).toHaveBeenCalledWith({
        to: '+14155551234',
        from: expect.any(String),
        body: 'Test message',
      });
    });
  });

  describe('sendAppointmentConfirmationSMS', () => {
    it('should send appointment confirmation SMS with correct details', async () => {
      const mockCreate = vi.fn().mockResolvedValue({
        sid: 'SM789',
        status: 'sent',
      });

      const twilio = require('twilio').default();
      twilio.messages.create = mockCreate;

      const appointmentData = {
        patientName: 'John Doe',
        patientPhone: '+923001234567',
        doctorName: 'Dr. Jane Smith',
        appointmentDate: new Date('2026-03-15'),
        appointmentTime: '10:00',
        hospitalName: 'ABC General Hospital',
      };

      const result = await sendAppointmentConfirmationSMS(appointmentData);

      expect(result.success).toBe(true);
      expect(mockCreate).toHaveBeenCalled();

      const message = mockCreate.mock.calls[0][0].body;
      expect(message).toContain('John Doe');
      expect(message).toContain('Dr. Jane Smith');
      expect(message).toContain('10:00');
    });

    it('should include appointment ID in message', async () => {
      const mockCreate = vi.fn().mockResolvedValue({ sid: 'SM789', status: 'sent' });

      const twilio = require('twilio').default();
      twilio.messages.create = mockCreate;

      const appointmentData = {
        appointmentId: 'APPT-123',
        patientName: 'John Doe',
        patientPhone: '+923001234567',
        doctorName: 'Dr. Jane Smith',
        appointmentDate: new Date('2026-03-15'),
        appointmentTime: '10:00',
        hospitalName: 'ABC General Hospital',
      };

      await sendAppointmentConfirmationSMS(appointmentData);

      const message = mockCreate.mock.calls[0][0].body;
      expect(message).toContain('APPT-123');
    });

    it('should format date in readable format', async () => {
      const mockCreate = vi.fn().mockResolvedValue({ sid: 'SM789', status: 'sent' });

      const twilio = require('twilio').default();
      twilio.messages.create = mockCreate;

      const appointmentData = {
        patientName: 'John Doe',
        patientPhone: '+923001234567',
        doctorName: 'Dr. Jane Smith',
        appointmentDate: new Date('2026-03-15'),
        appointmentTime: '10:00',
        hospitalName: 'ABC General Hospital',
      };

      await sendAppointmentConfirmationSMS(appointmentData);

      const message = mockCreate.mock.calls[0][0].body;
      // Should contain readable date like "March 15, 2026" or "15-03-2026"
      expect(message).toMatch(/march|15/i);
    });
  });
});

describe('Email Notification Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const sgMail = require('@sendgrid/mail').default;
      sgMail.send.mockResolvedValue([{ statusCode: 202 }]);

      const result = await sendEmail({
        to: 'john@example.com',
        subject: 'Test Email',
        text: 'Test content',
        html: '<p>Test content</p>',
      });

      expect(result.success).toBe(true);
      expect(sgMail.send).toHaveBeenCalledWith({
        to: 'john@example.com',
        from: expect.any(String),
        subject: 'Test Email',
        text: 'Test content',
        html: '<p>Test content</p>',
      });
    });

    it('should validate email address format', async () => {
      const result = await sendEmail({
        to: 'invalid-email',
        subject: 'Test',
        text: 'Test',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid email address');
    });

    it('should handle email sending failures', async () => {
      const sgMail = require('@sendgrid/mail').default;
      sgMail.send.mockRejectedValue(new Error('SendGrid API error'));

      const result = await sendEmail({
        to: 'john@example.com',
        subject: 'Test',
        text: 'Test',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should support multiple recipients', async () => {
      const sgMail = require('@sendgrid/mail').default;
      sgMail.send.mockResolvedValue([{ statusCode: 202 }]);

      await sendEmail({
        to: ['john@example.com', 'jane@example.com'],
        subject: 'Test',
        text: 'Test',
      });

      expect(sgMail.send).toHaveBeenCalledWith({
        to: ['john@example.com', 'jane@example.com'],
        from: expect.any(String),
        subject: 'Test',
        text: 'Test',
      });
    });

    it('should support attachments', async () => {
      const sgMail = require('@sendgrid/mail').default;
      sgMail.send.mockResolvedValue([{ statusCode: 202 }]);

      await sendEmail({
        to: 'john@example.com',
        subject: 'Test',
        text: 'Test',
        attachments: [
          {
            filename: 'appointment.pdf',
            content: 'base64content',
            type: 'application/pdf',
          },
        ],
      });

      expect(sgMail.send).toHaveBeenCalledWith(
        expect.objectContaining({
          attachments: expect.arrayContaining([
            expect.objectContaining({
              filename: 'appointment.pdf',
            }),
          ]),
        })
      );
    });
  });

  describe('sendAppointmentConfirmationEmail', () => {
    it('should send appointment confirmation email with HTML template', async () => {
      const sgMail = require('@sendgrid/mail').default;
      sgMail.send.mockResolvedValue([{ statusCode: 202 }]);

      const appointmentData = {
        patientName: 'John Doe',
        patientEmail: 'john@example.com',
        doctorName: 'Dr. Jane Smith',
        doctorDesignation: 'Cardiologist',
        appointmentDate: new Date('2026-03-15'),
        appointmentTime: '10:00',
        hospitalName: 'ABC General Hospital',
        hospitalAddress: '123 Medical Center Blvd',
        hospitalPhone: '+1-555-HOSPITAL',
      };

      const result = await sendAppointmentConfirmationEmail(appointmentData);

      expect(result.success).toBe(true);
      expect(sgMail.send).toHaveBeenCalled();

      const emailData = sgMail.send.mock.calls[0][0];
      expect(emailData.subject).toContain('Appointment Confirmation');
      expect(emailData.html).toContain('John Doe');
      expect(emailData.html).toContain('Dr. Jane Smith');
      expect(emailData.html).toContain('10:00');
    });

    it('should include hospital branding in email', async () => {
      const sgMail = require('@sendgrid/mail').default;
      sgMail.send.mockResolvedValue([{ statusCode: 202 }]);

      const appointmentData = {
        patientName: 'John Doe',
        patientEmail: 'john@example.com',
        doctorName: 'Dr. Jane Smith',
        doctorDesignation: 'Cardiologist',
        appointmentDate: new Date('2026-03-15'),
        appointmentTime: '10:00',
        hospitalName: 'ABC General Hospital',
        hospitalLogo: 'https://hospital.com/logo.png',
        hospitalAddress: '123 Medical Center Blvd',
        hospitalPhone: '+1-555-HOSPITAL',
      };

      await sendAppointmentConfirmationEmail(appointmentData);

      const emailData = sgMail.send.mock.calls[0][0];
      expect(emailData.html).toContain('ABC General Hospital');
      expect(emailData.html).toContain('logo.png');
    });

    it('should provide both HTML and plain text versions', async () => {
      const sgMail = require('@sendgrid/mail').default;
      sgMail.send.mockResolvedValue([{ statusCode: 202 }]);

      const appointmentData = {
        patientName: 'John Doe',
        patientEmail: 'john@example.com',
        doctorName: 'Dr. Jane Smith',
        doctorDesignation: 'Cardiologist',
        appointmentDate: new Date('2026-03-15'),
        appointmentTime: '10:00',
        hospitalName: 'ABC General Hospital',
        hospitalAddress: '123 Medical Center Blvd',
        hospitalPhone: '+1-555-HOSPITAL',
      };

      await sendAppointmentConfirmationEmail(appointmentData);

      const emailData = sgMail.send.mock.calls[0][0];
      expect(emailData.text).toBeDefined();
      expect(emailData.html).toBeDefined();
    });

    it('should include calendar invite attachment', async () => {
      const sgMail = require('@sendgrid/mail').default;
      sgMail.send.mockResolvedValue([{ statusCode: 202 }]);

      const appointmentData = {
        patientName: 'John Doe',
        patientEmail: 'john@example.com',
        doctorName: 'Dr. Jane Smith',
        doctorDesignation: 'Cardiologist',
        appointmentDate: new Date('2026-03-15'),
        appointmentTime: '10:00',
        hospitalName: 'ABC General Hospital',
        hospitalAddress: '123 Medical Center Blvd',
        hospitalPhone: '+1-555-HOSPITAL',
        includeCalendarInvite: true,
      };

      await sendAppointmentConfirmationEmail(appointmentData);

      const emailData = sgMail.send.mock.calls[0][0];
      expect(emailData.attachments).toBeDefined();
      expect(emailData.attachments.some((a: any) => a.filename?.includes('.ics'))).toBe(true);
    });

    it('should handle email template rendering errors gracefully', async () => {
      const sgMail = require('@sendgrid/mail').default;
      sgMail.send.mockRejectedValue(new Error('Template rendering failed'));

      const appointmentData = {
        patientName: 'John Doe',
        patientEmail: 'john@example.com',
        doctorName: 'Dr. Jane Smith',
        appointmentDate: new Date('2026-03-15'),
        appointmentTime: '10:00',
        hospitalName: 'ABC General Hospital',
      };

      const result = await sendAppointmentConfirmationEmail(appointmentData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Email Template Formatting', () => {
    it('should format date in readable format', async () => {
      const sgMail = require('@sendgrid/mail').default;
      sgMail.send.mockResolvedValue([{ statusCode: 202 }]);

      const appointmentData = {
        patientName: 'John Doe',
        patientEmail: 'john@example.com',
        doctorName: 'Dr. Jane Smith',
        appointmentDate: new Date('2026-03-15'),
        appointmentTime: '10:00',
        hospitalName: 'ABC General Hospital',
      };

      await sendAppointmentConfirmationEmail(appointmentData);

      const emailData = sgMail.send.mock.calls[0][0];
      // Should contain readable date like "Saturday, March 15, 2026"
      expect(emailData.html).toMatch(/march.*15.*2026/i);
    });

    it('should include appointment cancellation instructions', async () => {
      const sgMail = require('@sendgrid/mail').default;
      sgMail.send.mockResolvedValue([{ statusCode: 202 }]);

      const appointmentData = {
        appointmentId: 'APPT-123',
        patientName: 'John Doe',
        patientEmail: 'john@example.com',
        doctorName: 'Dr. Jane Smith',
        appointmentDate: new Date('2026-03-15'),
        appointmentTime: '10:00',
        hospitalName: 'ABC General Hospital',
        hospitalPhone: '+1-555-HOSPITAL',
      };

      await sendAppointmentConfirmationEmail(appointmentData);

      const emailData = sgMail.send.mock.calls[0][0];
      expect(emailData.html).toContain('cancel');
      expect(emailData.html).toContain('+1-555-HOSPITAL');
    });
  });
});

describe('Notification Integration', () => {
  it('should send both SMS and email for appointment confirmation', async () => {
    const twilio = require('twilio').default();
    twilio.messages.create = vi.fn().mockResolvedValue({ sid: 'SM123', status: 'sent' });

    const sgMail = require('@sendgrid/mail').default;
    sgMail.send.mockResolvedValue([{ statusCode: 202 }]);

    const appointmentData = {
      patientName: 'John Doe',
      patientPhone: '+923001234567',
      patientEmail: 'john@example.com',
      doctorName: 'Dr. Jane Smith',
      appointmentDate: new Date('2026-03-15'),
      appointmentTime: '10:00',
      hospitalName: 'ABC General Hospital',
    };

    const smsResult = await sendAppointmentConfirmationSMS(appointmentData);
    const emailResult = await sendAppointmentConfirmationEmail(appointmentData);

    expect(smsResult.success).toBe(true);
    expect(emailResult.success).toBe(true);
  });
});
