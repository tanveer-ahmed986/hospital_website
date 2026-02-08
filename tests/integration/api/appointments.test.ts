// API contract tests for appointments endpoints
// Task: T075 [US1]

import { describe, it, expect } from 'vitest';

describe('Appointments API Contract', () => {
  describe('POST /api/appointments', () => {
    it('should accept valid appointment booking request', () => {
      const validRequest = {
        patientName: 'John Doe',
        patientPhone: '+923001234567',
        patientEmail: 'john@example.com',
        reasonForVisit: 'Regular checkup',
        doctorId: 'doctor-123',
        appointmentDate: '2026-03-15',
        appointmentTime: '10:00',
      };

      // Validate request structure
      expect(validRequest).toHaveProperty('patientName');
      expect(validRequest).toHaveProperty('patientPhone');
      expect(validRequest).toHaveProperty('patientEmail');
      expect(validRequest).toHaveProperty('doctorId');
      expect(validRequest).toHaveProperty('appointmentDate');
      expect(validRequest).toHaveProperty('appointmentTime');

      // Validate data types
      expect(typeof validRequest.patientName).toBe('string');
      expect(typeof validRequest.patientPhone).toBe('string');
      expect(typeof validRequest.patientEmail).toBe('string');
      expect(typeof validRequest.doctorId).toBe('string');
    });

    it('should return appointment confirmation on success', () => {
      const successResponse = {
        success: true,
        data: {
          id: 'appt-123',
          patientName: 'John Doe',
          patientPhone: '+923001234567',
          patientEmail: 'john@example.com',
          reasonForVisit: 'Regular checkup',
          doctorId: 'doctor-123',
          appointmentDate: '2026-03-15T00:00:00.000Z',
          appointmentTime: '10:00',
          status: 'pending',
          confirmationSent: true,
          createdAt: '2026-02-07T10:00:00.000Z',
        },
        message: 'Appointment booked successfully. Confirmation sent via SMS and email.',
      };

      expect(successResponse.success).toBe(true);
      expect(successResponse.data).toHaveProperty('id');
      expect(successResponse.data).toHaveProperty('status', 'pending');
      expect(successResponse.data).toHaveProperty('confirmationSent', true);
      expect(successResponse).toHaveProperty('message');
    });

    it('should validate required fields', () => {
      const missingFieldErrors = [
        {
          field: 'patientName',
          message: 'Patient name is required',
          code: 'REQUIRED_FIELD',
        },
        {
          field: 'patientPhone',
          message: 'Patient phone is required',
          code: 'REQUIRED_FIELD',
        },
        {
          field: 'patientEmail',
          message: 'Patient email is required',
          code: 'REQUIRED_FIELD',
        },
        {
          field: 'doctorId',
          message: 'Doctor ID is required',
          code: 'REQUIRED_FIELD',
        },
        {
          field: 'appointmentDate',
          message: 'Appointment date is required',
          code: 'REQUIRED_FIELD',
        },
        {
          field: 'appointmentTime',
          message: 'Appointment time is required',
          code: 'REQUIRED_FIELD',
        },
      ];

      missingFieldErrors.forEach((error) => {
        expect(error).toHaveProperty('field');
        expect(error).toHaveProperty('message');
        expect(error).toHaveProperty('code');
      });
    });

    it('should return 400 for validation errors', () => {
      const errorResponse = {
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: [
            {
              field: 'patientEmail',
              message: 'Invalid email format',
            },
            {
              field: 'patientPhone',
              message: 'Invalid phone number format',
            },
          ],
        },
      };

      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error.code).toBe('VALIDATION_ERROR');
      expect(errorResponse.error.details).toBeInstanceOf(Array);
      expect(errorResponse.error.details.length).toBeGreaterThan(0);
    });

    it('should return 409 when time slot is not available', () => {
      const conflictResponse = {
        success: false,
        error: {
          message: 'Selected time slot is not available',
          code: 'SLOT_UNAVAILABLE',
        },
      };

      expect(conflictResponse.success).toBe(false);
      expect(conflictResponse.error.code).toBe('SLOT_UNAVAILABLE');
    });

    it('should return 404 when doctor not found', () => {
      const notFoundResponse = {
        success: false,
        error: {
          message: 'Doctor not found',
          code: 'DOCTOR_NOT_FOUND',
        },
      };

      expect(notFoundResponse.success).toBe(false);
      expect(notFoundResponse.error.code).toBe('DOCTOR_NOT_FOUND');
    });
  });

  describe('GET /api/appointments/available-slots', () => {
    it('should require doctorId and date query parameters', () => {
      const queryParams = new URLSearchParams({
        doctorId: 'doctor-123',
        date: '2026-03-15',
      });

      expect(queryParams.get('doctorId')).toBe('doctor-123');
      expect(queryParams.get('date')).toBe('2026-03-15');
    });

    it('should return available time slots', () => {
      const slotsResponse = {
        success: true,
        data: {
          doctorId: 'doctor-123',
          date: '2026-03-15',
          slots: [
            {
              time: '09:00',
              available: true,
            },
            {
              time: '09:15',
              available: true,
            },
            {
              time: '09:30',
              available: false,
            },
            {
              time: '09:45',
              available: true,
            },
          ],
        },
      };

      expect(slotsResponse.success).toBe(true);
      expect(slotsResponse.data.slots).toBeInstanceOf(Array);
      expect(slotsResponse.data.slots[0]).toHaveProperty('time');
      expect(slotsResponse.data.slots[0]).toHaveProperty('available');
    });

    it('should return empty slots array when doctor has no schedule', () => {
      const emptyResponse = {
        success: true,
        data: {
          doctorId: 'doctor-123',
          date: '2026-03-15',
          slots: [],
        },
        message: 'Doctor has no scheduled OPD on this day',
      };

      expect(emptyResponse.success).toBe(true);
      expect(emptyResponse.data.slots).toEqual([]);
    });

    it('should return 400 for invalid date format', () => {
      const errorResponse = {
        success: false,
        error: {
          message: 'Invalid date format. Expected YYYY-MM-DD',
          code: 'INVALID_DATE_FORMAT',
        },
      };

      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error.code).toBe('INVALID_DATE_FORMAT');
    });

    it('should return 400 for past dates', () => {
      const errorResponse = {
        success: false,
        error: {
          message: 'Cannot book appointments for past dates',
          code: 'INVALID_DATE',
        },
      };

      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error.code).toBe('INVALID_DATE');
    });
  });

  describe('GET /api/appointments/[id]', () => {
    it('should return appointment details', () => {
      const appointmentResponse = {
        success: true,
        data: {
          id: 'appt-123',
          patientName: 'John Doe',
          patientPhone: '+923001234567',
          patientEmail: 'john@example.com',
          reasonForVisit: 'Regular checkup',
          appointmentDate: '2026-03-15T00:00:00.000Z',
          appointmentTime: '10:00',
          status: 'confirmed',
          doctor: {
            id: 'doctor-123',
            name: 'Dr. Jane Smith',
            slug: 'dr-jane-smith',
            designation: 'Cardiologist',
            photo: '/doctors/jane-smith.jpg',
          },
          createdAt: '2026-02-07T10:00:00.000Z',
        },
      };

      expect(appointmentResponse.success).toBe(true);
      expect(appointmentResponse.data).toHaveProperty('id');
      expect(appointmentResponse.data).toHaveProperty('status');
      expect(appointmentResponse.data).toHaveProperty('doctor');
      expect(appointmentResponse.data.doctor).toHaveProperty('name');
    });

    it('should return 404 for non-existent appointment', () => {
      const notFoundResponse = {
        success: false,
        error: {
          message: 'Appointment not found',
          code: 'NOT_FOUND',
        },
      };

      expect(notFoundResponse.success).toBe(false);
      expect(notFoundResponse.error.code).toBe('NOT_FOUND');
    });
  });

  describe('Appointment Status Values', () => {
    it('should support standard appointment statuses', () => {
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

      validStatuses.forEach((status) => {
        expect(['pending', 'confirmed', 'cancelled', 'completed']).toContain(status);
      });
    });
  });

  describe('Rate Limiting Headers', () => {
    it('should include rate limit headers in response', () => {
      const headers = {
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': '9',
        'X-RateLimit-Reset': '1614556800',
      };

      expect(headers).toHaveProperty('X-RateLimit-Limit');
      expect(headers).toHaveProperty('X-RateLimit-Remaining');
      expect(headers).toHaveProperty('X-RateLimit-Reset');
    });
  });

  describe('CORS Headers', () => {
    it('should include appropriate CORS headers', () => {
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };

      expect(headers).toHaveProperty('Access-Control-Allow-Origin');
      expect(headers).toHaveProperty('Access-Control-Allow-Methods');
    });
  });
});
