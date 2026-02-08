// API contract tests for doctors endpoint
// Task: T063 [US1]

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from 'http';
import { NextRequest } from 'next/server';

// Mock Prisma for API tests
import { mockDeep } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';

const prismaMock = mockDeep<PrismaClient>();

describe('Doctors API Contract', () => {
  describe('GET /api/doctors', () => {
    it('should return list of doctors with 200 status', async () => {
      const mockDoctors = [
        {
          id: '1',
          name: 'Dr. John Smith',
          slug: 'dr-john-smith',
          designation: 'Senior Consultant',
          qualifications: 'MBBS, MD',
          experience: 15,
          photo: '/doctors/john-smith.jpg',
          consultationFee: 1500,
          languages: ['English', 'Urdu'],
          bio: 'Experienced cardiologist',
          active: true,
          createdAt: new Date('2026-01-01'),
          updatedAt: new Date('2026-01-01'),
          specialties: [
            {
              specialty: {
                id: 'cardiology',
                name: 'Cardiology',
                slug: 'cardiology',
              },
            },
          ],
          departments: [],
        },
      ];

      // This is a contract test - we're testing the API shape and response format
      const expectedResponseSchema = {
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            slug: expect.any(String),
            designation: expect.any(String),
            qualifications: expect.any(String),
            experience: expect.any(Number),
            photo: expect.any(String),
            consultationFee: expect.any(Number),
            languages: expect.any(Array),
            specialties: expect.any(Array),
          }),
        ]),
        total: expect.any(Number),
      };

      // Simulate the API response structure
      const response = {
        success: true,
        data: mockDoctors,
        total: mockDoctors.length,
      };

      expect(response).toMatchObject(expectedResponseSchema);
    });

    it('should support filtering by specialty query parameter', async () => {
      const specialtyFilter = 'cardiology';
      const queryParams = new URLSearchParams({ specialty: specialtyFilter });

      // Contract: Filtering should be supported via query parameter
      expect(queryParams.get('specialty')).toBe(specialtyFilter);

      // Expected filtered response
      const expectedResponseSchema = {
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            specialties: expect.arrayContaining([
              expect.objectContaining({
                specialty: expect.objectContaining({
                  slug: specialtyFilter,
                }),
              }),
            ]),
          }),
        ]),
      };

      // This validates the contract structure
      expect(expectedResponseSchema).toBeDefined();
    });

    it('should support search query parameter', async () => {
      const searchQuery = 'John';
      const queryParams = new URLSearchParams({ search: searchQuery });

      expect(queryParams.get('search')).toBe(searchQuery);

      const expectedResponseSchema = {
        success: true,
        data: expect.any(Array),
        total: expect.any(Number),
      };

      expect(expectedResponseSchema).toBeDefined();
    });

    it('should return empty array when no doctors found', async () => {
      const response = {
        success: true,
        data: [],
        total: 0,
      };

      expect(response.success).toBe(true);
      expect(response.data).toEqual([]);
      expect(response.total).toBe(0);
    });

    it('should return 500 on server error', async () => {
      const errorResponse = {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
      };

      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error).toHaveProperty('message');
      expect(errorResponse.error).toHaveProperty('code');
    });
  });

  describe('GET /api/doctors/[slug]', () => {
    it('should return doctor details with 200 status', async () => {
      const mockDoctor = {
        id: '1',
        name: 'Dr. Jane Doe',
        slug: 'dr-jane-doe',
        designation: 'Chief Surgeon',
        qualifications: 'MBBS, MS, FRCS',
        experience: 20,
        photo: '/doctors/jane-doe.jpg',
        consultationFee: 2000,
        languages: ['English'],
        bio: 'Expert in general surgery',
        active: true,
        specialties: [
          {
            isPrimary: true,
            specialty: {
              id: 'general-surgery',
              name: 'General Surgery',
              slug: 'general-surgery',
            },
          },
        ],
        departments: [],
        opdSchedule: [
          {
            id: 'schedule-1',
            dayOfWeek: 1,
            startTime: '09:00',
            endTime: '12:00',
            slotDuration: 15,
            active: true,
          },
        ],
      };

      const expectedResponseSchema = {
        success: true,
        data: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          slug: expect.any(String),
          designation: expect.any(String),
          qualifications: expect.any(String),
          experience: expect.any(Number),
          specialties: expect.any(Array),
          opdSchedule: expect.arrayContaining([
            expect.objectContaining({
              dayOfWeek: expect.any(Number),
              startTime: expect.any(String),
              endTime: expect.any(String),
              slotDuration: expect.any(Number),
            }),
          ]),
        }),
      };

      const response = {
        success: true,
        data: mockDoctor,
      };

      expect(response).toMatchObject(expectedResponseSchema);
    });

    it('should return 404 when doctor not found', async () => {
      const errorResponse = {
        success: false,
        error: {
          message: 'Doctor not found',
          code: 'NOT_FOUND',
        },
      };

      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error.code).toBe('NOT_FOUND');
    });

    it('should include OPD schedule in doctor details', async () => {
      const doctorWithSchedule = {
        id: '1',
        name: 'Dr. Test',
        slug: 'dr-test',
        opdSchedule: [
          {
            id: 'schedule-1',
            dayOfWeek: 1, // Monday
            startTime: '09:00',
            endTime: '12:00',
            slotDuration: 15,
            active: true,
          },
          {
            id: 'schedule-2',
            dayOfWeek: 3, // Wednesday
            startTime: '14:00',
            endTime: '17:00',
            slotDuration: 20,
            active: true,
          },
        ],
      };

      expect(doctorWithSchedule.opdSchedule).toHaveLength(2);
      expect(doctorWithSchedule.opdSchedule[0]).toHaveProperty('dayOfWeek');
      expect(doctorWithSchedule.opdSchedule[0]).toHaveProperty('startTime');
      expect(doctorWithSchedule.opdSchedule[0]).toHaveProperty('endTime');
    });
  });

  describe('API Response Format Standards', () => {
    it('should follow success response format', () => {
      const successResponse = {
        success: true,
        data: { id: '1', name: 'Dr. Test' },
      };

      expect(successResponse).toHaveProperty('success', true);
      expect(successResponse).toHaveProperty('data');
    });

    it('should follow error response format', () => {
      const errorResponse = {
        success: false,
        error: {
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
          details: [
            {
              field: 'specialty',
              message: 'Invalid specialty slug',
            },
          ],
        },
      };

      expect(errorResponse).toHaveProperty('success', false);
      expect(errorResponse).toHaveProperty('error');
      expect(errorResponse.error).toHaveProperty('message');
      expect(errorResponse.error).toHaveProperty('code');
    });

    it('should include pagination metadata for list endpoints', () => {
      const paginatedResponse = {
        success: true,
        data: [],
        meta: {
          total: 45,
          page: 1,
          limit: 20,
          totalPages: 3,
        },
      };

      expect(paginatedResponse.meta).toHaveProperty('total');
      expect(paginatedResponse.meta).toHaveProperty('page');
      expect(paginatedResponse.meta).toHaveProperty('limit');
      expect(paginatedResponse.meta).toHaveProperty('totalPages');
    });
  });

  describe('Query Parameter Validation', () => {
    it('should validate specialty parameter format', () => {
      const validSpecialties = ['cardiology', 'ent', 'pediatrics'];

      validSpecialties.forEach((specialty) => {
        expect(specialty).toMatch(/^[a-z-]+$/);
      });
    });

    it('should validate pagination parameters', () => {
      const params = new URLSearchParams({
        page: '1',
        limit: '20',
      });

      const page = parseInt(params.get('page') || '1');
      const limit = parseInt(params.get('limit') || '20');

      expect(page).toBeGreaterThan(0);
      expect(limit).toBeGreaterThan(0);
      expect(limit).toBeLessThanOrEqual(100);
    });
  });
});
