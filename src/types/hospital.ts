/**
 * Hospital Configuration Types
 *
 * TypeScript types for hospital-specific configuration.
 * These extend the Zod-validated types from lib/config.ts
 */

import type { HospitalConfig } from '@/lib/config';

export type { HospitalConfig };

export interface HospitalInfo {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  favicon: string;
  domain: string;
}

export interface BrandingConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export interface ContactInfo {
  phone: string;
  emergency: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export interface HospitalFeatures {
  appointmentBooking: boolean;
  patientPortal: boolean;
  onlinePayments: boolean;
  telemedicine: boolean;
  multiLanguage: boolean;
  blog: boolean;
  careers: boolean;
}
