/**
 * Appointment Service Functions
 *
 * Business logic for appointment booking and management.
 */

import { prisma } from './prisma';
import type { AppointmentFormData } from './utils/validation';

// ============================================================================
// Types
// ============================================================================

export interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

export interface AppointmentWithDoctor {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  reasonForVisit: string | null;
  appointmentDate: Date;
  appointmentTime: string;
  status: string;
  doctor: {
    id: string;
    name: string;
    designation: string;
    photo: string | null;
    specialties: Array<{
      name: string;
      slug: string;
    }>;
  };
}

// ============================================================================
// Appointment Creation
// ============================================================================

/**
 * Create new appointment
 */
export async function createAppointment(
  data: Omit<AppointmentFormData, 'recaptchaToken'>
): Promise<AppointmentWithDoctor> {
  const appointment = await prisma.appointment.create({
    data: {
      patientName: data.patientName,
      patientPhone: data.patientPhone,
      patientEmail: data.patientEmail,
      reasonForVisit: data.reasonForVisit,
      appointmentDate: new Date(data.appointmentDate),
      appointmentTime: data.appointmentTime,
      doctorId: data.doctorId,
      status: 'pending',
    },
    include: {
      doctor: {
        include: {
          specialties: {
            include: {
              specialty: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return {
    ...appointment,
    doctor: {
      id: appointment.doctor.id,
      name: appointment.doctor.name,
      designation: appointment.doctor.designation,
      photo: appointment.doctor.photo,
      specialties: appointment.doctor.specialties.map((ds) => ({
        name: ds.specialty.name,
        slug: ds.specialty.slug,
      })),
    },
  };
}

// ============================================================================
// Available Slots
// ============================================================================

/**
 * Get available time slots for a doctor on a specific date
 */
export async function getAvailableSlots(
  doctorId: string,
  date: Date
): Promise<TimeSlot[]> {
  const dayOfWeek = date.getDay();

  // Get doctor's OPD schedule for this day
  const schedules = await prisma.oPDSchedule.findMany({
    where: {
      doctorId,
      dayOfWeek,
      active: true,
    },
  });

  if (schedules.length === 0) {
    return [];
  }

  // Get existing appointments for this day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existingAppointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      appointmentDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: {
        in: ['pending', 'confirmed'],
      },
    },
    select: {
      appointmentTime: true,
    },
  });

  const bookedTimes = new Set(existingAppointments.map((a) => a.appointmentTime));

  // Generate time slots for all schedules
  const allSlots: TimeSlot[] = [];

  for (const schedule of schedules) {
    const slots = generateTimeSlots(
      schedule.startTime,
      schedule.endTime,
      schedule.slotDuration,
      bookedTimes
    );
    allSlots.push(...slots);
  }

  // Sort slots by time
  allSlots.sort((a, b) => a.time.localeCompare(b.time));

  return allSlots;
}

/**
 * Generate time slots between start and end time
 */
function generateTimeSlots(
  startTime: string,
  endTime: string,
  slotDuration: number,
  bookedTimes: Set<string>
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  let currentMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  while (currentMinutes + slotDuration <= endMinutes) {
    const hour = Math.floor(currentMinutes / 60);
    const minute = currentMinutes % 60;
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    slots.push({
      time: timeString,
      available: !bookedTimes.has(timeString),
      reason: bookedTimes.has(timeString) ? 'Already booked' : undefined,
    });

    currentMinutes += slotDuration;
  }

  return slots;
}

// ============================================================================
// Appointment Queries
// ============================================================================

/**
 * Get appointment by ID
 */
export async function getAppointmentById(
  id: string
): Promise<AppointmentWithDoctor | null> {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      doctor: {
        include: {
          specialties: {
            include: {
              specialty: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!appointment) return null;

  return {
    ...appointment,
    doctor: {
      id: appointment.doctor.id,
      name: appointment.doctor.name,
      designation: appointment.doctor.designation,
      photo: appointment.doctor.photo,
      specialties: appointment.doctor.specialties.map((ds) => ({
        name: ds.specialty.name,
        slug: ds.specialty.slug,
      })),
    },
  };
}

/**
 * Update appointment status
 */
export async function updateAppointmentStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
): Promise<void> {
  await prisma.appointment.update({
    where: { id },
    data: { status },
  });
}

/**
 * Mark SMS as sent
 */
export async function markSmsSent(id: string): Promise<void> {
  await prisma.appointment.update({
    where: { id },
    data: { smsSent: true },
  });
}

/**
 * Mark email as sent
 */
export async function markEmailSent(id: string): Promise<void> {
  await prisma.appointment.update({
    where: { id },
    data: { emailSent: true },
  });
}
