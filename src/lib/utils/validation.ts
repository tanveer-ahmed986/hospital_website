/**
 * Validation Schemas and Utilities
 *
 * Zod validation schemas for forms and data validation.
 */

import { z } from 'zod';

// ============================================================================
// Appointment Validation
// ============================================================================

export const appointmentSchema = z.object({
  patientName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),

  patientPhone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^\+?[1-9]\d{9,14}$/, 'Please enter a valid phone number'),

  patientEmail: z
    .string()
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),

  reasonForVisit: z
    .string()
    .max(500, 'Reason must be less than 500 characters')
    .optional(),

  appointmentDate: z
    .string()
    .or(z.date())
    .refine((date) => {
      const appointmentDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return appointmentDate >= today;
    }, 'Appointment date must be today or in the future'),

  appointmentTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),

  doctorId: z.string().min(1, 'Please select a doctor'),

  recaptchaToken: z.string().min(1, 'Please complete the reCAPTCHA verification'),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

// ============================================================================
// Contact Form Validation
// ============================================================================

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),

  phone: z
    .string()
    .regex(/^\+?[1-9]\d{9,14}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),

  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must be less than 200 characters')
    .optional(),

  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters'),

  recaptchaToken: z.string().min(1, 'Please complete the reCAPTCHA verification'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ============================================================================
// Doctor Search/Filter Validation
// ============================================================================

export const doctorFilterSchema = z.object({
  specialty: z.string().optional(),
  department: z.string().optional(),
  search: z.string().max(100).optional(),
  languages: z.array(z.string()).optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(10),
});

export type DoctorFilterParams = z.infer<typeof doctorFilterSchema>;

// ============================================================================
// Common Validation Helpers
// ============================================================================

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate date is not in the past
 */
export function validateFutureDate(date: Date | string): boolean {
  const checkDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return checkDate >= today;
}

/**
 * Validate time format (HH:MM)
 */
export function validateTimeFormat(time: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

/**
 * Sanitize HTML input (remove dangerous tags)
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .trim();
}

/**
 * Validate slug format (URL-friendly)
 */
export function validateSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Generate slug from string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Validate CUID format (Prisma ID)
 */
export function validateCuid(id: string): boolean {
  const cuidRegex = /^c[a-z0-9]{24}$/;
  return cuidRegex.test(id);
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11) {
    return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  return phone; // Return original if can't format
}

/**
 * Validate required environment variables
 */
export function validateEnvVars(requiredVars: string[]): void {
  const missing: string[] = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
