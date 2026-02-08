// Unit tests for service data fetching functions
// Task: T107 [US2]

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';

vi.mock('@/lib/prisma', () => ({
  prisma: mockDeep<PrismaClient>(),
}));

import { prisma } from '@/lib/prisma';
import {
  getAllServiceCategories,
  getServiceCategoryBySlug,
  getAllServices,
  getServiceBySlug,
  getServicesByCategory,
  searchServices,
} from '@/lib/services';

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('Service Data Fetching', () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  describe('getAllServiceCategories', () => {
    it('should return all active service categories with counts', async () => {
      const mockCategories = [
        {
          id: '1',
          name: 'Laboratory Services',
          slug: 'laboratory',
          description: 'Complete diagnostic lab services',
          icon: '/icons/lab.svg',
          metadata: {
            collectionTiming: 'Mon-Sat 7:00 AM - 11:00 AM',
            reportDelivery: '24-48 hours',
          },
          displayOrder: 1,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            services: 15,
          },
        },
      ];

      prismaMock.serviceCategory.findMany.mockResolvedValue(mockCategories as any);

      const result = await getAllServiceCategories();

      expect(result).toHaveLength(1);
      expect(result[0]._count?.services).toBe(15);
      expect(prismaMock.serviceCategory.findMany).toHaveBeenCalledWith({
        where: { active: true },
        include: {
          _count: {
            select: {
              services: {
                where: {
                  active: true,
                },
              },
            },
          },
        },
        orderBy: [
          { displayOrder: 'asc' },
          { name: 'asc' },
        ],
      });
    });
  });

  describe('getServiceCategoryBySlug', () => {
    it('should return category with services', async () => {
      const mockCategory = {
        id: '1',
        name: 'Laboratory Services',
        slug: 'laboratory',
        description: 'Diagnostic lab services',
        icon: '/icons/lab.svg',
        metadata: {
          tests: ['CBC', 'Blood Sugar', 'Lipid Profile'],
        },
        displayOrder: 1,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        services: [
          {
            id: 'svc-1',
            name: 'Complete Blood Count (CBC)',
            slug: 'cbc',
            description: 'Blood test',
            benefits: ['Quick results', 'Accurate'],
            procedureOverview: 'Blood sample collection',
            image: null,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: '1',
            departmentId: null,
            department: null,
          },
        ],
      };

      prismaMock.serviceCategory.findUnique.mockResolvedValue(mockCategory as any);

      const result = await getServiceCategoryBySlug('laboratory');

      expect(result).toBeDefined();
      expect(result?.name).toBe('Laboratory Services');
      expect(result?.services).toHaveLength(1);
    });

    it('should return null for non-existent category', async () => {
      prismaMock.serviceCategory.findUnique.mockResolvedValue(null);

      const result = await getServiceCategoryBySlug('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getAllServices', () => {
    it('should return all active services with category and department', async () => {
      const mockServices = [
        {
          id: '1',
          name: 'X-Ray',
          slug: 'x-ray',
          description: 'Radiographic imaging',
          benefits: ['Non-invasive', 'Quick'],
          procedureOverview: null,
          image: '/services/xray.jpg',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          categoryId: 'cat-1',
          departmentId: 'dept-1',
          category: {
            id: 'cat-1',
            name: 'Radiology',
            slug: 'radiology',
            description: null,
            icon: null,
            metadata: null,
            displayOrder: 0,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          department: {
            id: 'dept-1',
            name: 'Radiology Department',
            slug: 'radiology-dept',
            description: null,
            icon: null,
            image: null,
            displayOrder: 0,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ];

      prismaMock.service.findMany.mockResolvedValue(mockServices as any);

      const result = await getAllServices();

      expect(result).toHaveLength(1);
      expect(result[0].category).toBeDefined();
      expect(result[0].department).toBeDefined();
    });
  });

  describe('getServiceBySlug', () => {
    it('should return service with category and department', async () => {
      const mockService = {
        id: '1',
        name: 'CT Scan',
        slug: 'ct-scan',
        description: 'Computed tomography',
        benefits: ['Detailed imaging', '3D views'],
        procedureOverview: 'Patient lies on table',
        image: null,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryId: 'cat-1',
        departmentId: 'dept-1',
        category: {
          id: 'cat-1',
          name: 'Radiology',
          slug: 'radiology',
          description: null,
          icon: null,
          metadata: null,
          displayOrder: 0,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        department: null,
      };

      prismaMock.service.findUnique.mockResolvedValue(mockService as any);

      const result = await getServiceBySlug('ct-scan');

      expect(result).toBeDefined();
      expect(result?.name).toBe('CT Scan');
      expect(result?.category?.name).toBe('Radiology');
    });

    it('should return null for non-existent service', async () => {
      prismaMock.service.findUnique.mockResolvedValue(null);

      const result = await getServiceBySlug('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getServicesByCategory', () => {
    it('should return services filtered by category slug', async () => {
      const mockServices = [
        {
          id: '1',
          name: 'Blood Test',
          slug: 'blood-test',
          description: null,
          benefits: [],
          procedureOverview: null,
          image: null,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          categoryId: 'cat-1',
          departmentId: null,
          category: {
            id: 'cat-1',
            name: 'Laboratory',
            slug: 'laboratory',
            description: null,
            icon: null,
            metadata: null,
            displayOrder: 0,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          department: null,
        },
      ];

      prismaMock.service.findMany.mockResolvedValue(mockServices as any);

      const result = await getServicesByCategory('laboratory');

      expect(result).toHaveLength(1);
      expect(result[0].category?.slug).toBe('laboratory');
    });
  });

  describe('searchServices', () => {
    it('should search services by name (case-insensitive)', async () => {
      const mockServices = [
        {
          id: '1',
          name: 'MRI Scan',
          slug: 'mri-scan',
          description: null,
          benefits: [],
          procedureOverview: null,
          image: null,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          categoryId: 'cat-1',
          departmentId: null,
          category: {
            id: 'cat-1',
            name: 'Radiology',
            slug: 'radiology',
            description: null,
            icon: null,
            metadata: null,
            displayOrder: 0,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          department: null,
        },
      ];

      prismaMock.service.findMany.mockResolvedValue(mockServices as any);

      const result = await searchServices('MRI');

      expect(result).toHaveLength(1);
      expect(result[0].name).toContain('MRI');
      expect(prismaMock.service.findMany).toHaveBeenCalledWith({
        where: {
          active: true,
          name: {
            contains: 'MRI',
            mode: 'insensitive',
          },
        },
        include: {
          category: true,
          department: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
    });
  });
});
