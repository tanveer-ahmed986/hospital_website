/**
 * Service Functions
 *
 * Handles hospital services data fetching
 * Task: T108 [US2]
 */

import { prisma } from './prisma';
import type { Service, ServiceCategory, Department } from '@prisma/client';

export interface ServiceWithRelations extends Service {
  category?: ServiceCategory;
  department?: Department | null;
}

export interface ServiceCategoryWithServices extends ServiceCategory {
  services?: Service[];
  _count?: {
    services: number;
  };
}

/**
 * Get all active service categories
 */
export async function getAllServiceCategories(): Promise<ServiceCategoryWithServices[]> {
  const categories = await prisma.serviceCategory.findMany({
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

  return categories;
}

/**
 * Get service category by slug with services
 */
export async function getServiceCategoryBySlug(slug: string): Promise<ServiceCategoryWithServices | null> {
  const category = await prisma.serviceCategory.findUnique({
    where: { slug },
    include: {
      services: {
        where: { active: true },
        orderBy: { name: 'asc' },
        include: {
          department: true,
        },
      },
    },
  });

  return category;
}

/**
 * Get all active services
 */
export async function getAllServices(): Promise<ServiceWithRelations[]> {
  const services = await prisma.service.findMany({
    where: { active: true },
    include: {
      category: true,
      department: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return services;
}

/**
 * Get service by slug
 */
export async function getServiceBySlug(slug: string): Promise<ServiceWithRelations | null> {
  const service = await prisma.service.findUnique({
    where: { slug },
    include: {
      category: true,
      department: true,
    },
  });

  return service;
}

/**
 * Get services by category
 */
export async function getServicesByCategory(categorySlug: string): Promise<ServiceWithRelations[]> {
  const services = await prisma.service.findMany({
    where: {
      active: true,
      category: {
        slug: categorySlug,
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

  return services;
}

/**
 * Search services by name
 */
export async function searchServices(query: string): Promise<ServiceWithRelations[]> {
  const services = await prisma.service.findMany({
    where: {
      active: true,
      name: {
        contains: query,
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

  return services;
}
