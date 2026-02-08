/**
 * Doctor Entity Types
 *
 * TypeScript types for doctor-related data structures.
 */

export interface Doctor {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorWithSpecialties extends Doctor {
  specialties: MedicalSpecialty[];
  departments?: Department[];
  opdSchedule?: OPDSchedule[];
}

export interface MedicalSpecialty {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  commonConditions: string[];
  icon: string | null;
  displayOrder: number;
  active: boolean;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  displayOrder: number;
  active: boolean;
}

export interface OPDSchedule {
  id: string;
  doctorId: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, ... 6=Saturday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  slotDuration: number; // Minutes
  active: boolean;
}

export interface DoctorFilterOptions {
  specialty?: string;
  department?: string;
  search?: string;
  languages?: string[];
}

export interface DoctorCardProps {
  doctor: DoctorWithSpecialties;
  showBookButton?: boolean;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;
