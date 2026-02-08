/**
 * Appointment Entity Types
 *
 * TypeScript types for appointment booking and management.
 * NOTE: Appointment data does NOT contain PHI (Protected Health Information).
 */

export interface Appointment {
  id: string;
  patientName: string; // NOT PHI (basic contact info)
  patientPhone: string; // NOT PHI
  patientEmail: string; // NOT PHI
  reasonForVisit: string | null; // Brief reason, NOT PHI
  appointmentDate: Date;
  appointmentTime: string; // HH:MM format
  status: AppointmentStatus;
  smsSent: boolean;
  emailSent: boolean;
  hmsAppointmentId: string | null;
  notes: string | null;
  doctorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface AppointmentWithDoctor extends Appointment {
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

export interface AppointmentBookingRequest {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  reasonForVisit?: string;
  appointmentDate: string; // ISO date string
  appointmentTime: string; // HH:MM format
  doctorId: string;
  recaptchaToken: string;
}

export interface AppointmentBookingResponse {
  success: boolean;
  appointment?: Appointment;
  message?: string;
  error?: string;
}

export interface TimeSlot {
  time: string; // HH:MM format
  available: boolean;
  reason?: string; // Why unavailable (e.g., "Already booked", "Outside OPD hours")
}

export interface AvailableSlotsRequest {
  doctorId: string;
  date: string; // ISO date string
}

export interface AvailableSlotsResponse {
  date: string;
  slots: TimeSlot[];
  doctor: {
    id: string;
    name: string;
  };
}

export interface AppointmentConfirmation {
  appointmentId: string;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  hospitalName: string;
  hospitalPhone: string;
  hospitalAddress: string;
}

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: 'Pending Confirmation',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: 'yellow',
  confirmed: 'green',
  cancelled: 'red',
  completed: 'blue',
};
