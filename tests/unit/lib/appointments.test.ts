// Unit tests for appointment validation and business logic
// Task: T071 [US1]

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';

vi.mock('@/lib/prisma', () => ({
  prisma: mockDeep<PrismaClient>(),
}));

import { prisma } from '@/lib/prisma';
import {
  validateAppointmentData,
  checkSlotAvailability,
  getAvailableSlots,
  createAppointment,
} from '@/lib/appointments';

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('Appointment Validation and Logic', () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  describe('validateAppointmentData', () => {
    it('should validate correct appointment data', () => {
      const validData = {
        patientName: 'John Doe',
        patientPhone: '+923001234567',
        patientEmail: 'john@example.com',
        reasonForVisit: 'Regular checkup',
        doctorId: 'doctor-1',
        appointmentDate: new Date('2026-03-15'),
        appointmentTime: '10:00',
      };

      const result = validateAppointmentData(validData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should reject invalid name (too short)', () => {
      const invalidData = {
        patientName: 'J',
        patientPhone: '+923001234567',
        patientEmail: 'john@example.com',
        reasonForVisit: null,
        doctorId: 'doctor-1',
        appointmentDate: new Date('2026-03-15'),
        appointmentTime: '10:00',
      };

      const result = validateAppointmentData(invalidData);

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toContain('patientName');
    });

    it('should reject invalid email', () => {
      const invalidData = {
        patientName: 'John Doe',
        patientPhone: '+923001234567',
        patientEmail: 'invalid-email',
        reasonForVisit: null,
        doctorId: 'doctor-1',
        appointmentDate: new Date('2026-03-15'),
        appointmentTime: '10:00',
      };

      const result = validateAppointmentData(invalidData);

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toContain('patientEmail');
    });

    it('should reject invalid phone number', () => {
      const invalidData = {
        patientName: 'John Doe',
        patientPhone: '123',
        patientEmail: 'john@example.com',
        reasonForVisit: null,
        doctorId: 'doctor-1',
        appointmentDate: new Date('2026-03-15'),
        appointmentTime: '10:00',
      };

      const result = validateAppointmentData(invalidData);

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toContain('patientPhone');
    });

    it('should reject past appointment date', () => {
      const invalidData = {
        patientName: 'John Doe',
        patientPhone: '+923001234567',
        patientEmail: 'john@example.com',
        reasonForVisit: null,
        doctorId: 'doctor-1',
        appointmentDate: new Date('2020-01-01'),
        appointmentTime: '10:00',
      };

      const result = validateAppointmentData(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject invalid time format', () => {
      const invalidData = {
        patientName: 'John Doe',
        patientPhone: '+923001234567',
        patientEmail: 'john@example.com',
        reasonForVisit: null,
        doctorId: 'doctor-1',
        appointmentDate: new Date('2026-03-15'),
        appointmentTime: '25:00', // Invalid hour
      };

      const result = validateAppointmentData(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe('checkSlotAvailability', () => {
    it('should return true when slot is available', async () => {
      // Mock: No existing appointments at this time
      prismaMock.appointment.findFirst.mockResolvedValue(null);

      const isAvailable = await checkSlotAvailability(
        'doctor-1',
        new Date('2026-03-15'),
        '10:00'
      );

      expect(isAvailable).toBe(true);
      expect(prismaMock.appointment.findFirst).toHaveBeenCalledWith({
        where: {
          doctorId: 'doctor-1',
          appointmentDate: new Date('2026-03-15'),
          appointmentTime: '10:00',
          status: {
            in: ['pending', 'confirmed'],
          },
        },
      });
    });

    it('should return false when slot is already booked', async () => {
      const existingAppointment = {
        id: 'appt-1',
        doctorId: 'doctor-1',
        appointmentDate: new Date('2026-03-15'),
        appointmentTime: '10:00',
        status: 'confirmed',
        patientName: 'Jane Doe',
        patientPhone: '+923001234567',
        patientEmail: 'jane@example.com',
        reasonForVisit: null,
        smsSent: true,
        emailSent: true,
        hmsAppointmentId: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.appointment.findFirst.mockResolvedValue(existingAppointment as any);

      const isAvailable = await checkSlotAvailability(
        'doctor-1',
        new Date('2026-03-15'),
        '10:00'
      );

      expect(isAvailable).toBe(false);
    });
  });

  describe('getAvailableSlots', () => {
    it('should return available slots from OPD schedule', async () => {
      const mockSchedule = [
        {
          id: 'schedule-1',
          doctorId: 'doctor-1',
          dayOfWeek: 1, // Monday
          startTime: '09:00',
          endTime: '12:00',
          slotDuration: 15,
          active: true,
        },
      ];

      const mockAppointments = [
        {
          id: 'appt-1',
          appointmentTime: '09:00',
          status: 'confirmed',
        },
      ];

      prismaMock.oPDSchedule.findMany.mockResolvedValue(mockSchedule as any);
      prismaMock.appointment.findMany.mockResolvedValue(mockAppointments as any);

      // Monday, March 17, 2026
      const targetDate = new Date('2026-03-16');
      const slots = await getAvailableSlots('doctor-1', targetDate);

      expect(slots.length).toBeGreaterThan(0);
      expect(slots.some((slot) => slot.time === '09:00' && !slot.available)).toBe(true);
      expect(slots.some((slot) => slot.time === '09:15' && slot.available)).toBe(true);
    });

    it('should return empty array when doctor has no schedule for the day', async () => {
      prismaMock.oPDSchedule.findMany.mockResolvedValue([]);

      const slots = await getAvailableSlots('doctor-1', new Date('2026-03-15'));

      expect(slots).toEqual([]);
    });
  });

  describe('createAppointment', () => {
    it('should create appointment successfully', async () => {
      const appointmentData = {
        patientName: 'John Doe',
        patientPhone: '+923001234567',
        patientEmail: 'john@example.com',
        reasonForVisit: 'Regular checkup',
        doctorId: 'doctor-1',
        appointmentDate: new Date('2026-03-15'),
        appointmentTime: '10:00',
      };

      const mockCreatedAppointment = {
        id: 'new-appt-1',
        ...appointmentData,
        status: 'pending',
        smsSent: false,
        emailSent: false,
        hmsAppointmentId: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock slot availability check
      prismaMock.appointment.findFirst.mockResolvedValue(null);
      prismaMock.appointment.create.mockResolvedValue(mockCreatedAppointment as any);

      const result = await createAppointment(appointmentData);

      expect(result).toEqual(mockCreatedAppointment);
      expect(prismaMock.appointment.create).toHaveBeenCalledWith({
        data: appointmentData,
      });
    });

    it('should throw error when slot is not available', async () => {
      const appointmentData = {
        patientName: 'John Doe',
        patientPhone: '+923001234567',
        patientEmail: 'john@example.com',
        reasonForVisit: null,
        doctorId: 'doctor-1',
        appointmentDate: new Date('2026-03-15'),
        appointmentTime: '10:00',
      };

      // Mock existing appointment
      prismaMock.appointment.findFirst.mockResolvedValue({
        id: 'existing',
        status: 'confirmed',
      } as any);

      await expect(createAppointment(appointmentData)).rejects.toThrow(
        'Time slot is not available'
      );
    });
  });
});
