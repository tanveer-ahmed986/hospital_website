// Unit tests for department data fetching functions
// Task: T100 [US2]

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';

vi.mock('@/lib/prisma', () => ({
  prisma: mockDeep<PrismaClient>(),
}));

import { prisma } from '@/lib/prisma';
import {
  getAllDepartments,
  getDepartmentBySlug,
  getDepartmentsWithStats,
  searchDepartments,
} from '@/lib/departments';

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('Department Data Fetching', () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  describe('getAllDepartments', () => {
    it('should return all active departments ordered by displayOrder', async () => {
      const mockDepartments = [
        {
          id: '1',
          name: 'Cardiology Department',
          slug: 'cardiology',
          description: 'Heart and cardiovascular care',
          icon: '/icons/cardiology.svg',
          image: '/departments/cardiology.jpg',
          displayOrder: 1,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            doctors: 5,
            services: 10,
          },
        },
        {
          id: '2',
          name: 'Emergency Department',
          slug: 'emergency',
          description: '24/7 emergency care',
          icon: '/icons/emergency.svg',
          image: '/departments/emergency.jpg',
          displayOrder: 0,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            doctors: 8,
            services: 5,
          },
        },
      ];

      prismaMock.department.findMany.mockResolvedValue(mockDepartments as any);

      const result = await getAllDepartments();

      expect(result).toHaveLength(2);
      expect(prismaMock.department.findMany).toHaveBeenCalledWith({
        where: { active: true },
        include: {
          _count: {
            select: {
              doctors: true,
              services: true,
            },
          },
        },
        orderBy: [
          { displayOrder: 'asc' },
          { name: 'asc' },
        ],
      });
    });

    it('should return empty array when no departments exist', async () => {
      prismaMock.department.findMany.mockResolvedValue([]);

      const result = await getAllDepartments();

      expect(result).toEqual([]);
    });
  });

  describe('getDepartmentBySlug', () => {
    it('should return department with doctors and services', async () => {
      const mockDepartment = {
        id: '1',
        name: 'Cardiology Department',
        slug: 'cardiology',
        description: 'Comprehensive cardiac care',
        icon: '/icons/cardiology.svg',
        image: '/departments/cardiology.jpg',
        displayOrder: 1,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        doctors: [
          {
            doctorId: 'doc-1',
            departmentId: '1',
            doctor: {
              id: 'doc-1',
              name: 'Dr. Heart Specialist',
              slug: 'dr-heart-specialist',
              designation: 'Cardiologist',
              qualifications: 'MBBS, MD, DM Cardiology',
              experience: 15,
              photo: '/doctors/heart.jpg',
              consultationFee: 2000,
              languages: ['English'],
              bio: null,
              active: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              specialties: [],
            },
          },
        ],
        services: [
          {
            id: 'svc-1',
            name: 'ECG',
            slug: 'ecg',
            description: 'Electrocardiogram testing',
            benefits: ['Quick', 'Non-invasive'],
            procedureOverview: null,
            image: null,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 'cat-1',
            departmentId: '1',
          },
        ],
        _count: {
          doctors: 5,
          services: 10,
        },
      };

      prismaMock.department.findUnique.mockResolvedValue(mockDepartment as any);

      const result = await getDepartmentBySlug('cardiology');

      expect(result).toBeDefined();
      expect(result?.name).toBe('Cardiology Department');
      expect(result?.doctors).toHaveLength(1);
      expect(result?.services).toHaveLength(1);
      expect(prismaMock.department.findUnique).toHaveBeenCalledWith({
        where: { slug: 'cardiology' },
        include: {
          doctors: {
            include: {
              doctor: {
                include: {
                  specialties: {
                    include: {
                      specialty: true,
                    },
                  },
                },
              },
            },
            where: {
              doctor: {
                active: true,
              },
            },
          },
          services: {
            where: { active: true },
            orderBy: { name: 'asc' },
          },
          _count: {
            select: {
              doctors: true,
              services: true,
            },
          },
        },
      });
    });

    it('should return null for non-existent department', async () => {
      prismaMock.department.findUnique.mockResolvedValue(null);

      const result = await getDepartmentBySlug('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getDepartmentsWithStats', () => {
    it('should return departments with doctor and service counts', async () => {
      const mockDepartments = [
        {
          id: '1',
          name: 'Emergency',
          slug: 'emergency',
          description: '24/7 care',
          icon: null,
          image: null,
          displayOrder: 0,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            doctors: 12,
            services: 8,
          },
        },
      ];

      prismaMock.department.findMany.mockResolvedValue(mockDepartments as any);

      const result = await getDepartmentsWithStats();

      expect(result).toHaveLength(1);
      expect(result[0]._count?.doctors).toBe(12);
      expect(result[0]._count?.services).toBe(8);
    });
  });

  describe('searchDepartments', () => {
    it('should search departments by name (case-insensitive)', async () => {
      const mockDepartments = [
        {
          id: '1',
          name: 'Cardiology Department',
          slug: 'cardiology',
          description: null,
          icon: null,
          image: null,
          displayOrder: 0,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            doctors: 5,
            services: 10,
          },
        },
      ];

      prismaMock.department.findMany.mockResolvedValue(mockDepartments as any);

      const result = await searchDepartments('cardio');

      expect(result).toHaveLength(1);
      expect(result[0].name).toContain('Cardiology');
      expect(prismaMock.department.findMany).toHaveBeenCalledWith({
        where: {
          active: true,
          name: {
            contains: 'cardio',
            mode: 'insensitive',
          },
        },
        include: {
          _count: {
            select: {
              doctors: true,
              services: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
    });

    it('should return empty array for no matches', async () => {
      prismaMock.department.findMany.mockResolvedValue([]);

      const result = await searchDepartments('NonExistent');

      expect(result).toEqual([]);
    });
  });
});
