/**
 * Unit Tests: Contact Form Validation and Service
 *
 * Tests contact inquiry validation, submission, and data handling
 * Task: T120 [US3]
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma';

// Mock Prisma client
vi.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

// Import functions to test (will be implemented)
import {
  validateContactData,
  createContactInquiry,
  getContactInquiries,
  updateContactInquiryStatus,
} from '@/lib/contact';

describe('Contact Form Validation', () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  describe('validateContactData', () => {
    it('should accept valid contact data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+92-300-1234567',
        subject: 'General Inquiry',
        message: 'I would like to know more about your services.',
      };

      const result = validateContactData(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('John Doe');
        expect(result.data.email).toBe('john.doe@example.com');
      }
    });

    it('should require name field', () => {
      const invalidData = {
        email: 'john@example.com',
        message: 'Test message',
      };

      const result = validateContactData(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path[0]).toBe('name');
      }
    });

    it('should require email field', () => {
      const invalidData = {
        name: 'John Doe',
        message: 'Test message',
      };

      const result = validateContactData(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path[0]).toBe('email');
      }
    });

    it('should validate email format', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Test message',
      };

      const result = validateContactData(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path[0]).toBe('email');
      }
    });

    it('should require message field', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const result = validateContactData(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path[0]).toBe('message');
      }
    });

    it('should enforce minimum message length', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hi',
      };

      const result = validateContactData(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path[0]).toBe('message');
      }
    });

    it('should enforce maximum message length', () => {
      const longMessage = 'a'.repeat(2001);
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: longMessage,
      };

      const result = validateContactData(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path[0]).toBe('message');
      }
    });

    it('should accept phone number (optional)', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+92-300-1234567',
        message: 'Test message with phone number',
      };

      const result = validateContactData(validData);

      expect(result.success).toBe(true);
    });

    it('should accept subject (optional)', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Appointment Inquiry',
        message: 'I would like to book an appointment',
      };

      const result = validateContactData(validData);

      expect(result.success).toBe(true);
    });

    it('should accept international phone numbers', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1-555-123-4567',
        message: 'Test message',
      };

      const result = validateContactData(validData);

      expect(result.success).toBe(true);
    });

    it('should trim whitespace from fields', () => {
      const validData = {
        name: '  John Doe  ',
        email: '  john@example.com  ',
        message: '  Test message with spaces  ',
      };

      const result = validateContactData(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('John Doe');
        expect(result.data.email).toBe('john@example.com');
        expect(result.data.message).toBe('Test message with spaces');
      }
    });
  });

  describe('createContactInquiry', () => {
    it('should create contact inquiry in database', async () => {
      const contactData = {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+92-321-7654321',
        subject: 'General Inquiry',
        message: 'I need information about your cardiology department.',
      };

      const mockInquiry = {
        id: 'inquiry-1',
        ...contactData,
        status: 'new',
        response: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.contactInquiry.create.mockResolvedValue(mockInquiry);

      const result = await createContactInquiry(contactData);

      expect(result).toEqual(mockInquiry);
      expect(prismaMock.contactInquiry.create).toHaveBeenCalledWith({
        data: {
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          subject: contactData.subject,
          message: contactData.message,
          status: 'new',
        },
      });
    });

    it('should create inquiry without optional phone and subject', async () => {
      const contactData = {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        message: 'Simple inquiry without phone or subject',
      };

      const mockInquiry = {
        id: 'inquiry-2',
        ...contactData,
        phone: null,
        subject: null,
        status: 'new',
        response: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.contactInquiry.create.mockResolvedValue(mockInquiry);

      const result = await createContactInquiry(contactData);

      expect(result).toEqual(mockInquiry);
    });
  });

  describe('getContactInquiries', () => {
    it('should fetch all contact inquiries', async () => {
      const mockInquiries = [
        {
          id: 'inquiry-1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+92-300-1234567',
          subject: 'Test',
          message: 'Test message',
          status: 'new',
          response: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'inquiry-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: null,
          subject: null,
          message: 'Another test message',
          status: 'in_progress',
          response: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prismaMock.contactInquiry.findMany.mockResolvedValue(mockInquiries);

      const result = await getContactInquiries();

      expect(result).toEqual(mockInquiries);
      expect(prismaMock.contactInquiry.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter inquiries by status', async () => {
      const mockInquiries = [
        {
          id: 'inquiry-1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: null,
          subject: null,
          message: 'Test',
          status: 'new',
          response: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      prismaMock.contactInquiry.findMany.mockResolvedValue(mockInquiries);

      const result = await getContactInquiries({ status: 'new' });

      expect(result).toEqual(mockInquiries);
      expect(prismaMock.contactInquiry.findMany).toHaveBeenCalledWith({
        where: { status: 'new' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('updateContactInquiryStatus', () => {
    it('should update inquiry status and response', async () => {
      const inquiryId = 'inquiry-1';
      const updateData = {
        status: 'resolved' as const,
        response: 'Thank you for your inquiry. We will contact you shortly.',
      };

      const mockUpdatedInquiry = {
        id: inquiryId,
        name: 'John Doe',
        email: 'john@example.com',
        phone: null,
        subject: null,
        message: 'Test inquiry',
        status: 'resolved',
        response: updateData.response,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.contactInquiry.update.mockResolvedValue(mockUpdatedInquiry);

      const result = await updateContactInquiryStatus(inquiryId, updateData);

      expect(result).toEqual(mockUpdatedInquiry);
      expect(prismaMock.contactInquiry.update).toHaveBeenCalledWith({
        where: { id: inquiryId },
        data: updateData,
      });
    });

    it('should update only status without response', async () => {
      const inquiryId = 'inquiry-2';
      const updateData = {
        status: 'in_progress' as const,
      };

      const mockUpdatedInquiry = {
        id: inquiryId,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: null,
        subject: null,
        message: 'Another inquiry',
        status: 'in_progress',
        response: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.contactInquiry.update.mockResolvedValue(mockUpdatedInquiry);

      const result = await updateContactInquiryStatus(inquiryId, updateData);

      expect(result).toEqual(mockUpdatedInquiry);
    });
  });
});
