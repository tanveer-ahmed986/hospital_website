/**
 * Doctor Service Functions
 *
 * Business logic for doctor-related operations.
 */

import { prisma } from './prisma';
import type { DoctorFilterParams } from './utils/validation';
import { generateSlug } from './utils/validation';

// ============================================================================
// Types
// ============================================================================

export interface DoctorWithRelations {
  id: string;
  name: string;
  slug: string;
  designation: string;
  qualifications: string;
  experience: number;
  photo: string | null;
  consultationFee: number | null;
  languages: string[];
  bio: string | null;
  active: boolean;
  specialties: Array<{
    id: string;
    name: string;
    slug: string;
    isPrimary: boolean;
  }>;
  departments?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  opdSchedule?: Array<{
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDuration: number;
  }>;
}

// ============================================================================
// Doctor Queries
// ============================================================================

/**
 * Get all active doctors with filters
 */
export async function getDoctors(
  filters: Partial<DoctorFilterParams> = {}
): Promise<{ doctors: DoctorWithRelations[]; total: number }> {
  const {
    specialty,
    department,
    search,
    languages,
    page = 1,
    limit = 10,
  } = filters;

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    active: true,
  };

  if (specialty) {
    where.specialties = {
      some: {
        specialty: {
          slug: specialty,
        },
      },
    };
  }

  if (department) {
    where.departments = {
      some: {
        department: {
          slug: department,
        },
      },
    };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { qualifications: { contains: search, mode: 'insensitive' } },
      { designation: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (languages && languages.length > 0) {
    where.languages = {
      hasSome: languages,
    };
  }

  // Execute query
  const [doctors, total] = await Promise.all([
    prisma.doctor.findMany({
      where,
      skip,
      take: limit,
      include: {
        specialties: {
          include: {
            specialty: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        departments: {
          include: {
            department: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: [
        { name: 'asc' },
      ],
    }),
    prisma.doctor.count({ where }),
  ]);

  // Transform response
  const transformedDoctors = doctors.map((doctor) => ({
    ...doctor,
    consultationFee: doctor.consultationFee ? Number(doctor.consultationFee) : null,
    specialties: doctor.specialties.map((ds) => ({
      id: ds.specialty.id,
      name: ds.specialty.name,
      slug: ds.specialty.slug,
      isPrimary: ds.isPrimary,
    })),
    departments: doctor.departments.map((dd) => ({
      id: dd.department.id,
      name: dd.department.name,
      slug: dd.department.slug,
    })),
  }));

  return {
    doctors: transformedDoctors,
    total,
  };
}

/**
 * Get doctor by slug
 */
export async function getDoctorBySlug(
  slug: string
): Promise<DoctorWithRelations | null> {
  const doctor = await prisma.doctor.findUnique({
    where: { slug, active: true },
    include: {
      specialties: {
        include: {
          specialty: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
            },
          },
        },
      },
      departments: {
        include: {
          department: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      opdSchedule: {
        where: { active: true },
        orderBy: { dayOfWeek: 'asc' },
      },
    },
  });

  if (!doctor) return null;

  return {
    ...doctor,
    consultationFee: doctor.consultationFee ? Number(doctor.consultationFee) : null,
    specialties: doctor.specialties.map((ds) => ({
      id: ds.specialty.id,
      name: ds.specialty.name,
      slug: ds.specialty.slug,
      isPrimary: ds.isPrimary,
    })),
    departments: doctor.departments.map((dd) => ({
      id: dd.department.id,
      name: dd.department.name,
      slug: dd.department.slug,
    })),
  };
}

/**
 * Get doctor by ID
 */
export async function getDoctorById(id: string): Promise<DoctorWithRelations | null> {
  const doctor = await prisma.doctor.findUnique({
    where: { id, active: true },
    include: {
      specialties: {
        include: {
          specialty: true,
        },
      },
      opdSchedule: {
        where: { active: true },
      },
    },
  });

  if (!doctor) return null;

  return {
    ...doctor,
    consultationFee: doctor.consultationFee ? Number(doctor.consultationFee) : null,
    specialties: doctor.specialties.map((ds) => ({
      id: ds.specialty.id,
      name: ds.specialty.name,
      slug: ds.specialty.slug,
      isPrimary: ds.isPrimary,
    })),
  };
}

/**
 * Get doctors by specialty
 */
export async function getDoctorsBySpecialty(
  specialtySlug: string,
  page: number = 1,
  limit: number = 10
): Promise<{ doctors: DoctorWithRelations[]; total: number }> {
  return getDoctors({ specialty: specialtySlug, page, limit });
}

/**
 * Get doctors by department
 */
export async function getDoctorsByDepartment(
  departmentSlug: string,
  page: number = 1,
  limit: number = 10
): Promise<{ doctors: DoctorWithRelations[]; total: number }> {
  return getDoctors({ department: departmentSlug, page, limit });
}

/**
 * Search doctors
 */
export async function searchDoctors(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<{ doctors: DoctorWithRelations[]; total: number }> {
  return getDoctors({ search: query, page, limit });
}

// ============================================================================
// Doctor Statistics
// ============================================================================

/**
 * Get total count of active doctors
 */
export async function getDoctorCount(): Promise<number> {
  return prisma.doctor.count({
    where: { active: true },
  });
}

/**
 * Get doctor count by specialty
 */
export async function getDoctorCountBySpecialty(): Promise<
  Array<{ specialtyName: string; count: number }>
> {
  const specialties = await prisma.medicalSpecialty.findMany({
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
        },
      },
    },
  });

  return specialties.map((s) => ({
    specialtyName: s.name,
    count: s._count.doctors,
  }));
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate unique slug for doctor
 */
export async function generateDoctorSlug(name: string): Promise<string> {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.doctor.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Check if doctor exists
 */
export async function doctorExists(slug: string): Promise<boolean> {
  const doctor = await prisma.doctor.findUnique({
    where: { slug },
    select: { id: true },
  });

  return !!doctor;
}
