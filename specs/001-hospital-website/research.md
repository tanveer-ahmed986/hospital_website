# Research: Multi-Hospital Marketing & Patient Acquisition Website

**Date**: 2026-02-02
**Feature**: 001-hospital-website
**Purpose**: Document technology choices, patterns, and best practices for hospital website implementation

## Executive Summary

This document captures research findings and technology decisions for building a professional, multi-hospital website platform. Key decisions include Next.js 14 with App Router for SEO and performance, PostgreSQL + Prisma for type-safe data management, Tailwind CSS for rapid UI development, and configuration-based multi-hospital deployment (not multi-tenant) for healthcare compliance simplicity.

---

## 1. Framework Selection: Next.js 14 with App Router

### Decision
**Chosen**: Next.js 14+ with App Router (React 18+)

### Rationale
1. **Server-Side Rendering (SSR)**: Critical for SEO in healthcare industry where patients search for doctors, specialties, services
2. **Image Optimization**: Built-in Next.js Image component with automatic WebP/AVIF conversion, lazy loading, responsive sizing - essential for hero carousel and doctor photos
3. **API Routes**: Built-in backend API routes for appointment booking, contact forms, HMS integration without separate backend server
4. **Performance**: Automatic code splitting, route pre-fetching, optimized bundling
5. **TypeScript Support**: First-class TypeScript integration for type safety
6. **App Router**: Latest routing paradigm with React Server Components for optimal performance
7. **Deployment**: Seamless deployment to Vercel (or self-hosted) with edge functions support

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| **Astro** | Ultra-fast static generation, minimal JavaScript, islands architecture | Limited interactivity without islands, newer ecosystem, less suitable for highly interactive UI | Hospital website requires high interactivity (carousel, forms, animations) - Astro's islands architecture adds complexity |
| **Remix** | Excellent data loading, nested routing, web standards focus | Smaller ecosystem than Next.js, fewer third-party integrations, deployment considerations | Next.js has larger ecosystem and better enterprise support for healthcare |
| **Create React App** | Simple setup, familiar | No built-in SSR (bad for SEO), no API routes, manual optimization required | SEO is critical for patient acquisition - SSR is essential |
| **Gatsby** | Strong static site generation, GraphQL data layer | Build times increase with content growth, less suitable for dynamic appointment booking | Too static for real-time appointment booking features |

### Best Practices for Next.js 14

**App Router Structure**:
```typescript
// app/layout.tsx - Root layout with sticky header
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StickyHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}

// app/page.tsx - Homepage with hero carousel
export default function HomePage() {
  return (
    <>
      <HeroCarousel images={heroImages} />
      <FeaturedDoctors />
      <Departments />
      <Testimonials />
      <EmergencyBanner />
    </>
  );
}
```

**Performance Optimization**:
- Use React Server Components for static content
- Use Client Components (`'use client'`) only for interactive elements (carousel, forms, modals)
- Implement `loading.tsx` for route segments
- Use `<Image>` component for all images with priority for LCP images
- Implement ISR (Incremental Static Regeneration) for doctor profiles and blog posts

**SEO Implementation**:
```typescript
// app/doctors/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const doctor = await getDoctor(params.slug);

  return {
    title: `Dr. ${doctor.name} - ${doctor.specialty} | ABC Hospital`,
    description: `Book appointment with Dr. ${doctor.name}, experienced ${doctor.specialty} specialist. ${doctor.qualifications}`,
    openGraph: {
      images: [doctor.photo],
    },
  };
}
```

---

## 2. Styling Solution: Tailwind CSS with Design Tokens

### Decision
**Chosen**: Tailwind CSS 3+ with custom design tokens for medical branding

### Rationale
1. **Rapid Development**: Utility-first approach accelerates UI development
2. **Responsive Design**: Built-in responsive modifiers for mobile-first development
3. **Design Tokens**: Easy to define hospital-specific color schemes, spacing, typography
4. **Small Bundle Size**: Only used utilities are included in production
5. **Component Integration**: Works excellently with React component libraries
6. **Dark Mode**: Built-in dark mode support (future enhancement)
7. **Healthcare Trust Colors**: Easy to customize blue/green/white medical color schemes

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| **CSS Modules** | Scoped styles, familiar CSS syntax, zero runtime | More verbose, harder to maintain design consistency | Slower development, harder to implement design tokens |
| **Styled Components** | Component-scoped styles, dynamic theming, TypeScript integration | Runtime cost, larger bundle size | Performance overhead not justified for hospital website |
| **Vanilla CSS** | Full control, no dependencies | Harder to maintain, no design token system, verbose | Poor developer experience, harder to scale |
| **Material-UI** | Pre-built components, accessibility | Opinionated design, harder to customize for medical branding | Medical websites need custom branding, not Material Design |

### Tailwind Configuration for Hospital Website

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Medical trust colors - configurable per hospital
        primary: 'var(--color-primary)', // Blue #0066CC
        secondary: 'var(--color-secondary)', // Green #00A859
        accent: 'var(--color-accent)', // Orange #FF6B35
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          // ... more shades
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Montserrat', 'sans-serif'],
        body: ['var(--font-body)', 'Open Sans', 'sans-serif'],
      },
      spacing: {
        // Custom spacing for medical UI
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'carousel-slide': 'carouselSlide 5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
```

**Design Token System**:
- Load hospital-specific colors from config file
- Apply CSS variables in root layout
- Use Tailwind utilities with CSS variables

---

## 3. Database: PostgreSQL + Prisma ORM

### Decision
**Chosen**: PostgreSQL 15+ with Prisma ORM 5+

### Rationale
1. **Relational Data Model**: Doctors, specialties, departments, appointments are highly relational
2. **Type Safety**: Prisma generates TypeScript types from schema - compile-time safety
3. **Migration System**: Excellent migration tooling for schema evolution
4. **Query Performance**: Optimized queries with proper indexing
5. **ACID Compliance**: Critical for appointment booking (no double-booking)
6. **JSON Support**: Can store flexible configuration data when needed
7. **Healthcare Standard**: Widely used in healthcare applications

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| **MongoDB** | Flexible schema, good for rapid prototyping | Less structured, harder to enforce relationships, no ACID for multi-document | Appointment booking requires ACID transactions |
| **Supabase** | Real-time features, built-in auth, nice DX | Vendor lock-in, less control over database | Want infrastructure independence |
| **Direct SQL (pg)** | Full control, no ORM overhead | Less type-safe, manual migrations, verbose queries | Prisma provides better TypeScript integration |
| **MySQL** | Widely supported, similar to PostgreSQL | Slightly less feature-rich than PostgreSQL | PostgreSQL has better JSON support and full-text search |

### Prisma Schema Design (Excerpt)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Doctor {
  id                String            @id @default(cuid())
  name              String
  slug              String            @unique
  designation       String
  qualifications    String
  experience        Int
  photo             String?
  consultationFee   Decimal?
  languages         String[]
  active            Boolean           @default(true)
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  // Relationships
  specialties       DoctorSpecialty[]
  departments       DoctorDepartment[]
  opdSchedule       OPDSchedule[]
  appointments      Appointment[]

  @@index([slug])
  @@index([active])
}

model MedicalSpecialty {
  id          String            @id @default(cuid())
  name        String            @unique // "ENT", "Cardiology", "Pediatrics"
  slug        String            @unique
  description String?
  icon        String?
  active      Boolean           @default(true)
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  doctors     DoctorSpecialty[]

  @@index([slug])
}

model DoctorSpecialty {
  doctorId      String
  specialtyId   String
  isPrimary     Boolean @default(false)

  doctor        Doctor           @relation(fields: [doctorId], references: [id], onDelete: Cascade)
  specialty     MedicalSpecialty @relation(fields: [specialtyId], references: [id], onDelete: Cascade)

  @@id([doctorId, specialtyId])
  @@index([specialtyId])
}

model Appointment {
  id                String   @id @default(cuid())
  patientName       String
  patientPhone      String
  patientEmail      String
  reasonForVisit    String?
  appointmentDate   DateTime
  appointmentTime   String
  status            String   @default("pending") // pending, confirmed, cancelled, completed
  smsSent           Boolean  @default(false)
  emailSent         Boolean  @default(false)
  hmsAppointmentId  String?  @unique
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  doctorId          String
  doctor            Doctor   @relation(fields: [doctorId], references: [id])

  @@index([doctorId, appointmentDate])
  @@index([status])
}

model ServiceCategory {
  id          String   @id @default(cuid())
  name        String   @unique // "Laboratory", "Pharmacy", "Radiology", "Emergency"
  slug        String   @unique
  description String?
  icon        String?
  metadata    Json?    // Flexible for category-specific data
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  services    Service[]

  @@index([slug])
}
```

**Best Practices**:
- Use `@unique` for slugs and lookup fields
- Add `@@index` for frequently queried fields
- Use `Json` type for flexible metadata (lab tests, pharmacy hours, etc.)
- Implement soft deletes with `active` boolean
- Use `@default(now())` for timestamps
- Enforce relationships with foreign keys and `onDelete` actions

---

## 4. Content Management: Sanity CMS

### Decision
**Chosen**: Sanity CMS (with Contentful as alternative)

### Rationale
1. **Real-Time Updates**: Content changes appear instantly via webhooks
2. **Structured Content**: Define schemas for doctors, departments, blog posts
3. **TypeScript Support**: Generate TypeScript types from Sanity schemas
4. **Flexible**: Can handle complex content structures (nested arrays, references)
5. **Developer Experience**: Excellent Studio UI for content editors
6. **API-First**: Headless CMS with GraphQL and GROQ query languages
7. **Image Pipeline**: Built-in image transformation and optimization

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| **Contentful** | Mature, good UI, excellent API | More expensive, less flexible than Sanity | Cost considerations for multi-hospital deployment |
| **Strapi** | Self-hosted, full control, open-source | Infrastructure management overhead | Adds operational complexity |
| **WordPress (Headless)** | Huge ecosystem, familiar to content creators | Not headless-first, slower, legacy codebase | Poor developer experience for modern stack |
| **Database-Only** | Full control, no external dependency | Manual CMS UI development required | Reinventing the wheel for content management |

### Sanity Schema (Excerpt)

```typescript
// sanity/schemas/doctor.ts
export default {
  name: 'doctor',
  title: 'Doctor',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'name' } },
    { name: 'designation', type: 'string' },
    { name: 'qualifications', type: 'text' },
    { name: 'experience', type: 'number' },
    { name: 'photo', type: 'image' },
    {
      name: 'specialties',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'specialty' }] }],
    },
    { name: 'opdSchedule', type: 'array', of: [{ type: 'scheduleItem' }] },
    { name: 'consultationFee', type: 'number' },
    { name: 'languages', type: 'array', of: [{ type: 'string' }] },
  ],
};
```

**Integration Strategy**:
- Use Sanity for content that changes frequently (blog posts, doctor profiles, testimonials)
- Use database for transactional data (appointments, user interactions)
- Implement webhook revalidation for real-time updates

---

## 5. Multi-Hospital Architecture: Configuration-Based

### Decision
**Chosen**: Configuration-based deployment (separate deployment per hospital, shared codebase)

### Rationale
1. **Healthcare Compliance**: Each hospital has separate database and domain - no cross-hospital data leakage risk
2. **Simpler Security**: No need for row-level security or tenant isolation logic
3. **Better for Sales Model**: Can sell/license to individual hospitals easily
4. **Easier HIPAA Compliance**: Data isolation by default
5. **Independent Scaling**: Each hospital can scale independently
6. **Configuration Flexibility**: YAML/JSON config for branding, features, integrations

### Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| **Multi-Tenant (Single Database)** | Lower infrastructure cost, centralized management | Complex security (RLS), harder compliance, cross-hospital data leakage risk | Healthcare compliance requires strong data isolation |
| **Separate Codebases** | Maximum flexibility per hospital | Maintenance overhead, code duplication, hard to update | Defeats purpose of platform approach |

### Configuration File Structure

```yaml
# config/hospitals/abc-general.yaml

hospital:
  id: "abc-general"
  name: "ABC General Hospital"
  tagline: "Your Health, Our Priority"
  logo: "/assets/abc-general/logo.png"
  favicon: "/assets/abc-general/favicon.ico"
  domain: "abchospital.com"

branding:
  colors:
    primary: "#0066CC"    # Medical blue
    secondary: "#00A859"  # Medical green
    accent: "#FF6B35"     # Accent orange
  fonts:
    heading: "Montserrat"
    body: "Open Sans"

contact:
  phone: "+1-555-HOSPITAL"
  emergency: "+1-555-EMERGENCY"
  email: "info@abchospital.com"
  address:
    street: "123 Medical Center Blvd"
    city: "City Name"
    state: "State"
    zip: "12345"
    country: "USA"

features:
  appointmentBooking: true
  patientPortal: false  # Requires HMS integration
  onlinePayments: false
  telemedicine: false
  multiLanguage: true
  blog: true
  careers: true

languages:
  default: "en"
  supported: ["en", "ur"]

specialties:
  enabled: ["ent", "cardiology", "pediatrics", "gynecology", "gastroenterology", "orthopedics"]

serviceCategories:
  laboratory:
    enabled: true
    collectionTiming: "Mon-Sat 7:00 AM - 11:00 AM"
    reportDelivery: "24-48 hours"
  pharmacy:
    enabled: true
    hours: "24/7"
  radiology:
    enabled: true
    services: ["x-ray", "ct-scan", "mri", "ultrasound"]
  emergency:
    enabled: true
    availability: "24/7"
  icu:
    enabled: true
    types: ["MICU", "CCU", "NICU"]

integrations:
  hms:
    enabled: false
    apiUrl: ""
    apiKey: ""  # From environment variable
  sms:
    provider: "twilio"
    from: "+1-555-0000"
  email:
    provider: "sendgrid"
    from: "noreply@abchospital.com"
  maps:
    latitude: 40.7128
    longitude: -74.0060
  analytics:
    googleAnalyticsId: "G-XXXXXXXXXX"
  recaptcha:
    siteKey: "XXXXXXXXXXXX"  # From environment variable

heroCarousel:
  autoPlay: true
  interval: 5000  # milliseconds
  images:
    - url: "/assets/abc-general/hero/staff.jpg"
      alt: "Our dedicated medical staff"
      type: "staff"
    - url: "/assets/abc-general/hero/facility.jpg"
      alt: "Modern hospital facilities"
      type: "facility"
    - url: "/assets/abc-general/hero/equipment.jpg"
      alt: "Advanced medical equipment"
      type: "equipment"
```

**Configuration Loader**:
```typescript
// lib/config.ts
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { z } from 'zod';

const ConfigSchema = z.object({
  hospital: z.object({
    id: z.string(),
    name: z.string(),
    tagline: z.string(),
    logo: z.string(),
    favicon: z.string(),
    domain: z.string(),
  }),
  branding: z.object({
    colors: z.object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string(),
    }),
    fonts: z.object({
      heading: z.string(),
      body: z.string(),
    }),
  }),
  // ... rest of schema
});

export type HospitalConfig = z.infer<typeof ConfigSchema>;

export function loadConfig(hospitalId: string): HospitalConfig {
  const configPath = path.join(process.cwd(), 'config', 'hospitals', `${hospitalId}.yaml`);
  const configFile = fs.readFileSync(configPath, 'utf8');
  const configData = yaml.parse(configFile);

  // Validate configuration
  return ConfigSchema.parse(configData);
}

// Load config based on environment variable or domain
export function getCurrentHospitalConfig(): HospitalConfig {
  const hospitalId = process.env.HOSPITAL_ID || 'abc-general';
  return loadConfig(hospitalId);
}
```

---

## 6. Animation Library: Framer Motion

### Decision
**Chosen**: Framer Motion for animations and transitions

### Rationale
1. **React-First**: Built for React with hooks API
2. **Declarative**: Easy-to-understand animation syntax
3. **Performance**: Uses GPU-accelerated CSS transforms
4. **Gesture Support**: Built-in drag, hover, tap animations
5. **TypeScript**: Excellent TypeScript support
6. **Variants**: Reusable animation configurations

### Hero Carousel Implementation

```typescript
// components/hero/HeroCarousel.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface HeroCarouselProps {
  images: Array<{
    url: string;
    alt: string;
    type: string;
  }>;
  interval?: number;
}

export function HeroCarousel({ images, interval = 5000 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, images.length, interval, isPaused]);

  const slideVariants = {
    enter: { opacity: 0, scale: 1.1 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <div
      className="relative h-[100vh] max-h-[800px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            fill
            className="object-cover"
            priority={currentIndex === 0}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Hero content overlay */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center text-white"
        >
          <h1 className="text-5xl font-bold">Your Health, Our Priority</h1>
          <button className="mt-6 rounded-lg bg-primary px-8 py-3 font-semibold">
            Book Appointment
          </button>
        </motion.div>
      </div>

      {/* Carousel controls */}
      <CarouselControls
        currentIndex={currentIndex}
        totalSlides={images.length}
        onDotClick={setCurrentIndex}
        onPrevious={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
        onNext={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
      />
    </div>
  );
}
```

---

## 7. HMS Integration: Adapter Pattern with Fallback

### Decision
**Chosen**: HMS client abstraction layer with graceful fallback to manual booking

### Rationale
1. **Flexibility**: Support multiple HMS platforms through adapter pattern
2. **Reliability**: Graceful degradation when HMS unavailable
3. **Independence**: Website functions without HMS integration
4. **Migration Path**: Easy to add HMS integration later

### HMS Client Architecture

```typescript
// lib/hms-client.ts
export interface HMSClient {
  // Appointments
  createAppointment(data: AppointmentRequest): Promise<AppointmentResponse>;
  getAvailableSlots(doctorId: string, date: Date): Promise<TimeSlot[]>;
  cancelAppointment(appointmentId: string): Promise<void>;

  // Doctors
  syncDoctors(): Promise<Doctor[]>;
  getDoctorSchedule(doctorId: string): Promise<OPDSchedule[]>;

  // Patient Portal
  authenticatePatient(credentials: PatientCredentials): Promise<PatientSession>;
  getPatientRecords(patientId: string): Promise<MedicalRecord[]>;
}

// Implement adapter for specific HMS
export class GenericHMSClient implements HMSClient {
  constructor(private apiUrl: string, private apiKey: string) {}

  async createAppointment(data: AppointmentRequest): Promise<AppointmentResponse> {
    // Implementation specific to HMS API
  }
  // ... other methods
}

// Fallback client when HMS unavailable
export class FallbackHMSClient implements HMSClient {
  async createAppointment(data: AppointmentRequest): Promise<AppointmentResponse> {
    // Store locally in database for manual processing
    const appointment = await prisma.appointment.create({
      data: {
        ...data,
        status: 'pending_manual_confirmation',
      },
    });

    return { id: appointment.id, status: 'pending' };
  }

  async getAvailableSlots(doctorId: string, date: Date): Promise<TimeSlot[]> {
    // Return static slots from doctor's OPD schedule
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { opdSchedule: true },
    });

    return generateSlotsFromSchedule(doctor.opdSchedule, date);
  }
  // ... other fallback methods
}

// Factory to create appropriate client
export function createHMSClient(): HMSClient {
  const config = getCurrentHospitalConfig();

  if (config.integrations.hms.enabled && config.integrations.hms.apiUrl) {
    return new GenericHMSClient(
      config.integrations.hms.apiUrl,
      process.env.HMS_API_KEY!
    );
  }

  return new FallbackHMSClient();
}
```

---

## 8. Form Handling: React Hook Form + Zod

### Decision
**Chosen**: React Hook Form for form state management, Zod for validation schemas

### Rationale
1. **Performance**: Minimal re-renders with uncontrolled components
2. **TypeScript**: Zod generates TypeScript types from schemas
3. **Validation**: Powerful validation with clear error messages
4. **Integration**: Works well with Next.js Server Actions
5. **Developer Experience**: Clean API, excellent documentation

### Appointment Form Example

```typescript
// components/appointments/AppointmentForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const appointmentSchema = z.object({
  patientName: z.string().min(2, 'Name must be at least 2 characters'),
  patientPhone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number'),
  patientEmail: z.string().email('Invalid email address'),
  reasonForVisit: z.string().optional(),
  doctorId: z.string(),
  appointmentDate: z.date(),
  appointmentTime: z.string(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export function AppointmentForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const onSubmit = async (data: AppointmentFormData) => {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      // Show success message, redirect to confirmation
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('patientName')} placeholder="Full Name" />
      {errors.patientName && <span className="text-red-600">{errors.patientName.message}</span>}

      <input {...register('patientPhone')} placeholder="Phone Number" />
      {errors.patientPhone && <span className="text-red-600">{errors.patientPhone.message}</span>}

      {/* ... other fields */}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Booking...' : 'Book Appointment'}
      </button>
    </form>
  );
}
```

---

## 9. Testing Strategy

### Testing Stack
- **Unit Tests**: Vitest (faster than Jest, ESM support)
- **Component Tests**: React Testing Library
- **E2E Tests**: Playwright (better than Cypress for modern apps)
- **Performance Tests**: Lighthouse CI
- **Accessibility Tests**: axe-core + Playwright

### Test Pyramid
- 70% Unit Tests (utilities, services, validation)
- 20% Integration Tests (API routes, database operations)
- 10% E2E Tests (critical user flows)

### E2E Test Example (Playwright)

```typescript
// tests/e2e/appointment-booking.spec.ts
import { test, expect } from '@playwright/test';

test('patient can book an appointment', async ({ page }) => {
  // Navigate to homepage
  await page.goto('/');

  // Click "Book Appointment" button
  await page.click('text=Book Appointment');

  // Select a doctor
  await page.click('[data-testid="doctor-card"]:first-child');

  // Select date
  await page.fill('[data-testid="appointment-date"]', '2024-03-15');

  // Select time slot
  await page.click('[data-testid="time-slot"]:first-child');

  // Fill patient details
  await page.fill('[name="patientName"]', 'John Doe');
  await page.fill('[name="patientPhone"]', '+1-555-1234');
  await page.fill('[name="patientEmail"]', 'john@example.com');
  await page.fill('[name="reasonForVisit"]', 'Regular checkup');

  // Submit form
  await page.click('button[type="submit"]');

  // Verify confirmation page
  await expect(page).toHaveURL('/appointments/confirmation');
  await expect(page.locator('text=Appointment Confirmed')).toBeVisible();
});

test('appointment booking validates required fields', async ({ page }) => {
  await page.goto('/appointments');

  // Submit empty form
  await page.click('button[type="submit"]');

  // Verify error messages
  await expect(page.locator('text=Name must be at least 2 characters')).toBeVisible();
  await expect(page.locator('text=Invalid phone number')).toBeVisible();
});
```

---

## 10. Deployment & CI/CD

### Deployment Platform
**Chosen**: Vercel (with AWS/self-hosted as alternatives)

**Rationale**:
- Optimized for Next.js
- Automatic deployments from Git
- Edge functions support
- Excellent performance
- Preview deployments for each PR

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run build

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/doctors
            http://localhost:3000/appointments
          uploadArtifacts: true
```

---

## Summary of Research Findings

**Technology Stack**:
✅ Next.js 14 + TypeScript + Tailwind CSS + PostgreSQL + Prisma + Sanity CMS + Framer Motion

**Architecture**:
✅ Configuration-based multi-hospital deployment (not multi-tenant)
✅ Separation: Public website (no PHI) vs Patient Portal (HMS-integrated)
✅ HMS integration with adapter pattern and graceful fallback

**Key Patterns**:
✅ Server-side rendering for SEO
✅ Component-based architecture with React
✅ Form validation with React Hook Form + Zod
✅ Animations with Framer Motion
✅ API routes for backend logic
✅ Configuration loading with validation

**Testing Strategy**:
✅ TDD with Vitest, React Testing Library, Playwright
✅ E2E tests for critical flows (appointment booking)
✅ Lighthouse CI for performance
✅ axe-core for accessibility

All research tasks complete. Ready for Phase 1: Design & Contracts.