/**
 * Department Service Functions
 *
 * Handles department data fetching and management
 * Task: T101 [US2]
 */

import { prisma } from './prisma';
import type { Department, Doctor, Service } from '@prisma/client';

export interface DepartmentWithRelations extends Department {
  doctors?: Array<{
    doctor: Doctor;
  }>;
  services?: Service[];
  _count?: {
    doctors: number;
    services: number;
  };
}

/**
 * Get all active departments
 */
export async function getAllDepartments(): Promise<DepartmentWithRelations[]> {
  const departments = await prisma.department.findMany({
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

  return departments;
}

/**
 * Get department by slug with full details
 */
export async function getDepartmentBySlug(slug: string): Promise<DepartmentWithRelations | null> {
  const department = await prisma.department.findUnique({
    where: { slug },
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

  return department;
}

/**
 * Get departments with doctor count
 */
export async function getDepartmentsWithStats(): Promise<DepartmentWithRelations[]> {
  const departments = await prisma.department.findMany({
    where: { active: true },
    include: {
      _count: {
        select: {
          doctors: {
            where: {
              doctor: {
                active: true,
              },
            },
          },
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

  return departments;
}

/**
 * Search departments by name
 */
export async function searchDepartments(query: string): Promise<DepartmentWithRelations[]> {
  const departments = await prisma.department.findMany({
    where: {
      active: true,
      name: {
        contains: query,
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

  return departments;
}
