/**
 * Contact Service
 *
 * Handles contact form submissions and inquiries
 * Task: T121 [US3]
 */

import { z } from 'zod';
import prisma from '@/lib/prisma';
import type { ContactInquiry } from '@prisma/client';

/**
 * Contact form validation schema
 */
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Invalid email address').trim(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must not exceed 2000 characters')
    .trim(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Validate contact form data
 */
export function validateContactData(data: unknown) {
  return contactSchema.safeParse(data);
}

/**
 * Create a new contact inquiry
 */
export async function createContactInquiry(
  data: ContactFormData
): Promise<ContactInquiry> {
  return await prisma.contactInquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
      status: 'new',
    },
  });
}

/**
 * Fetch contact inquiries with optional filtering
 */
export async function getContactInquiries(options?: {
  status?: 'new' | 'in_progress' | 'resolved';
  limit?: number;
}): Promise<ContactInquiry[]> {
  return await prisma.contactInquiry.findMany({
    where: options?.status ? { status: options.status } : undefined,
    orderBy: { createdAt: 'desc' },
    take: options?.limit,
  });
}

/**
 * Get a single contact inquiry by ID
 */
export async function getContactInquiryById(id: string): Promise<ContactInquiry | null> {
  return await prisma.contactInquiry.findUnique({
    where: { id },
  });
}

/**
 * Update contact inquiry status and response
 */
export async function updateContactInquiryStatus(
  id: string,
  data: {
    status?: 'new' | 'in_progress' | 'resolved';
    response?: string;
  }
): Promise<ContactInquiry> {
  return await prisma.contactInquiry.update({
    where: { id },
    data,
  });
}

/**
 * Delete a contact inquiry
 */
export async function deleteContactInquiry(id: string): Promise<ContactInquiry> {
  return await prisma.contactInquiry.delete({
    where: { id },
  });
}

/**
 * Get contact inquiry statistics
 */
export async function getContactInquiryStats() {
  const [total, newCount, inProgressCount, resolvedCount] = await Promise.all([
    prisma.contactInquiry.count(),
    prisma.contactInquiry.count({ where: { status: 'new' } }),
    prisma.contactInquiry.count({ where: { status: 'in_progress' } }),
    prisma.contactInquiry.count({ where: { status: 'resolved' } }),
  ]);

  return {
    total,
    new: newCount,
    inProgress: inProgressCount,
    resolved: resolvedCount,
  };
}
