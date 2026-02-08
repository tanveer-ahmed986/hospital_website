// Unit tests for doctor data fetching functions
// Task: T060 [US1]

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: mockDeep<PrismaClient>(),
}));

import { prisma } from '@/lib/prisma';
import {
  getAllDoctors,
  getDoctorBySlug,
  getDoctorsBySpecialty,
  searchDoctors,
} from '@/lib/doctors';

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('Doctor Data Fetching', () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  describe('getAllDoctors', () => {
    it('should return all active doctors', async () => {
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
          createdAt: new Date(),
          updatedAt: new Date(),
          specialties: [
            {
              doctorId: '1',
              specialtyId: 'cardiology',
              isPrimary: true,
              specialty: {
                id: 'cardiology',
                name: 'Cardiology',
                slug: 'cardiology',
                description: 'Heart specialist',
                commonConditions: ['Heart attack', 'Arrhythmia'],
                icon: '/icons/heart.svg',
                displayOrder: 1,
                active: true,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          ],
          departments: [],
          opdSchedule: [],
          appointments: [],
        },
      ];

      prismaMock.doctor.findMany.mockResolvedValue(mockDoctors as any);

      const result = await getAllDoctors();

      expect(result).toEqual(mockDoctors);
      expect(prismaMock.doctor.findMany).toHaveBeenCalledWith({
        where: { active: true },
        include: {
          specialties: {
            include: {
              specialty: true,
            },
          },
          departments: {
            include: {
              department: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
    });

    it('should handle empty results', async () => {
      prismaMock.doctor.findMany.mockResolvedValue([]);

      const result = await getAllDoctors();

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      prismaMock.doctor.findMany.mockRejectedValue(new Error('Database connection failed'));

      await expect(getAllDoctors()).rejects.toThrow('Database connection failed');
    });
  });

  describe('getDoctorBySlug', () => {
    it('should return doctor by slug with full details', async () => {
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
        createdAt: new Date(),
        updatedAt: new Date(),
        specialties: [],
        departments: [],
        opdSchedule: [
          {
            id: 'schedule-1',
            doctorId: '1',
            dayOfWeek: 1,
            startTime: '09:00',
            endTime: '12:00',
            slotDuration: 15,
            active: true,
          },
        ],
        appointments: [],
      };

      prismaMock.doctor.findUnique.mockResolvedValue(mockDoctor as any);

      const result = await getDoctorBySlug('dr-jane-doe');

      expect(result).toEqual(mockDoctor);
      expect(prismaMock.doctor.findUnique).toHaveBeenCalledWith({
        where: { slug: 'dr-jane-doe' },
        include: {
          specialties: {
            include: {
              specialty: true,
            },
          },
          departments: {
            include: {
              department: true,
            },
          },
          opdSchedule: {
            where: { active: true },
            orderBy: { dayOfWeek: 'asc' },
          },
        },
      });
    });

    it('should return null for non-existent doctor', async () => {
      prismaMock.doctor.findUnique.mockResolvedValue(null);

      const result = await getDoctorBySlug('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getDoctorsBySpecialty', () => {
    it('should return doctors filtered by specialty', async () => {
      const mockDoctors = [
        {
          id: '1',
          name: 'Dr. Heart Specialist',
          slug: 'dr-heart-specialist',
          designation: 'Cardiologist',
          qualifications: 'MBBS, DM Cardiology',
          experience: 12,
          photo: '/doctors/heart.jpg',
          consultationFee: 1800,
          languages: ['English'],
          bio: null,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          specialties: [],
          departments: [],
          opdSchedule: [],
          appointments: [],
        },
      ];

      prismaMock.doctor.findMany.mockResolvedValue(mockDoctors as any);

      const result = await getDoctorsBySpecialty('cardiology');

      expect(result).toEqual(mockDoctors);
      expect(prismaMock.doctor.findMany).toHaveBeenCalledWith({
        where: {
          active: true,
          specialties: {
            some: {
              specialty: {
                slug: 'cardiology',
              },
            },
          },
        },
        include: {
          specialties: {
            include: {
              specialty: true,
            },
          },
          departments: {
            include: {
              department: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
    });
  });

  describe('searchDoctors', () => {
    it('should search doctors by name', async () => {
      const mockDoctors = [
        {
          id: '1',
          name: 'Dr. John Smith',
          slug: 'dr-john-smith',
          designation: 'Consultant',
          qualifications: 'MBBS',
          experience: 10,
          photo: null,
          consultationFee: null,
          languages: [],
          bio: null,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          specialties: [],
          departments: [],
          opdSchedule: [],
          appointments: [],
        },
      ];

      prismaMock.doctor.findMany.mockResolvedValue(mockDoctors as any);

      const result = await searchDoctors('John');

      expect(result).toEqual(mockDoctors);
      expect(prismaMock.doctor.findMany).toHaveBeenCalledWith({
        where: {
          active: true,
          name: {
            contains: 'John',
            mode: 'insensitive',
          },
        },
        include: {
          specialties: {
            include: {
              specialty: true,
            },
          },
          departments: {
            include: {
              department: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
    });

    it('should return empty array for no matches', async () => {
      prismaMock.doctor.findMany.mockResolvedValue([]);

      const result = await searchDoctors('NonExistent');

      expect(result).toEqual([]);
    });
  });
});
