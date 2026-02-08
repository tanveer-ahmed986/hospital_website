# Implementation Tasks: Multi-Hospital Marketing & Patient Acquisition Website

**Feature**: 001-hospital-website
**Branch**: `001-hospital-website`
**Date**: 2026-02-02
**Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)

## Overview

This document contains all implementation tasks organized by user story for independent, incremental delivery. The project follows **Test-Driven Development (TDD)** methodology as required by the constitution.

**Tech Stack**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + PostgreSQL + Prisma + Sanity CMS

**Task Format**:
- `- [ ] T###` - Sequential task ID
- `[P]` - Parallelizable (can run simultaneously with other [P] tasks)
- `[US#]` - User Story number (from spec.md)
- File paths included for clarity

**Total Tasks**: 156
**User Stories**: 11 (P1: 3, P2: 5, P3: 3)
**MVP Scope**: User Story 1 (Appointment Booking)

---

## Dependencies & Execution Strategy

### User Story Completion Order

```
Phase 1: Setup (Foundational)
         ↓
Phase 2: Foundational Components
         ↓
    ┌────┴────┬────────┬────────┐
    ↓         ↓        ↓        ↓
   US1       US2      US3    US5a  (P1 Stories - Can be parallel after foundational)
    ↓         ↓        ↓        ↓
   US4       US5      US6      (P2 Stories - Can be parallel)
    ↓         ↓        ↓
   US7       US8      US9     US10  (P3 Stories - Can be parallel)
```

**Independent Stories** (can develop in parallel after foundational):
- US1 (Appointment Booking) - No dependencies
- US2 (Services/Departments) - No dependencies
- US3 (Contact/Location) - No dependencies
- US5a (Specialties/Service Categories) - Shares Doctor model with US1

**Dependent Stories**:
- US4 (Multi-hospital Deployment) - Requires US1-US3 tested
- US5 (Doctor Profiles) - Extends US1
- US6 (Trust Elements) - Uses components from US2

### MVP Recommendation

**Start with User Story 1 only** for fastest time-to-value:
- Complete appointment booking flow
- Demonstrates core value proposition
- Independently testable and deployable
- ~40 tasks (~2-3 weeks for 1 developer)

---

## Phase 1: Setup & Project Initialization

**Goal**: Initialize Next.js project with TypeScript, Tailwind CSS, Prisma, and testing frameworks

### Project Scaffolding

- [X] T001 Initialize Next.js 14 project with TypeScript and App Router at project root
- [X] T002 Configure Tailwind CSS with medical design tokens in tailwind.config.ts
- [X] T003 Set up TypeScript configuration with strict mode in tsconfig.json
- [X] T004 Configure ESLint and Prettier for code quality in .eslintrc.json and .prettierrc
- [X] T005 Create .env.example with all required environment variables
- [X] T006 Initialize Git repository and create .gitignore with Next.js/Node.js patterns

### Database & ORM Setup

- [X] T007 Initialize Prisma with PostgreSQL provider in prisma/schema.prisma
- [X] T008 Configure Prisma client singleton in src/lib/prisma.ts
- [X] T009 Create initial Prisma schema with core entities (Doctor, Appointment, Specialty) in prisma/schema.prisma
- [ ] T010 Run initial Prisma migration for core schema (requires database connection)
- [X] T011 Create database seed script in prisma/seed.ts

### Testing Framework Setup

- [X] T012 Configure Vitest for unit tests in vitest.config.ts
- [X] T013 Configure React Testing Library in tests/setup.ts
- [X] T014 Configure Playwright for E2E tests in playwright.config.ts
- [X] T015 Install Playwright browsers and dependencies
- [X] T016 [P] Set up Lighthouse CI configuration in .lighthouserc.json
- [X] T017 [P] Configure axe-core for accessibility testing in tests/setup.ts

### Project Structure

- [X] T018 Create folder structure: src/app, src/components, src/lib, src/types, tests/
- [X] T019 Create component folders: src/components/common, src/components/layout, src/components/hero
- [X] T020 Create app route folders: src/app/doctors, src/app/appointments, src/app/specialties
- [X] T021 Create API route folders: src/app/api/appointments, src/app/api/doctors
- [X] T022 Create types folder: src/types/hospital.ts, src/types/doctor.ts, src/types/appointment.ts

### Configuration System

- [X] T023 Create config directory structure: config/hospitals/
- [X] T024 Create hospital configuration template in config/hospitals/template.yaml
- [X] T025 Create ABC General Hospital config in config/hospitals/abc-general.yaml
- [X] T026 Implement configuration loader with Zod validation in src/lib/config.ts
- [X] T027 Write unit tests for configuration loader in tests/unit/lib/config.test.ts
- [X] T028 Create Next.js middleware to load hospital config in src/middleware.ts

### CI/CD Pipeline

- [X] T029 Create GitHub Actions workflow for CI in .github/workflows/ci.yml
- [X] T030 [P] Create GitHub Actions workflow for Lighthouse CI in .github/workflows/lighthouse.yml
- [X] T031 [P] Create deployment workflow for Vercel in .github/workflows/deploy.yml

**Phase 1 Checkpoint**: Project initialized, database configured, testing frameworks ready, config system working

---

## Phase 2: Foundational Components & Shared Infrastructure

**Goal**: Build reusable components and shared services needed by multiple user stories

### Design System & Common Components

- [X] T032 Create design tokens file with medical colors in src/styles/design-tokens.ts
- [X] T033 Create globals.css with Tailwind imports and CSS variables in src/app/globals.css
- [X] T034 [P] Write Button component with variants in src/components/common/Button.tsx
- [X] T035 [P] Write Card component in src/components/common/Card.tsx
- [X] T036 [P] Write Input component in src/components/common/Input.tsx
- [X] T037 [P] Write Select component in src/components/common/Select.tsx
- [X] T038 [P] Write Modal component in src/components/common/Modal.tsx
- [X] T039 [P] Write Spinner/Loader component in src/components/common/Spinner.tsx
- [X] T040 Write unit tests for common components in tests/unit/components/common/

### Layout Components

- [X] T041 Create root layout with sticky header in src/app/layout.tsx
- [X] T042 Implement sticky Header component in src/components/layout/Header.tsx
- [X] T043 Implement Navigation component with mobile menu in src/components/layout/Navigation.tsx
- [X] T044 Implement Footer component in src/components/layout/Footer.tsx
- [X] T045 Add scroll detection for sticky header behavior in src/components/layout/Header.tsx
- [X] T046 Write E2E test for sticky header scroll behavior in tests/e2e/navigation.spec.ts

### Validation & Forms

- [X] T047 Create Zod validation schemas in src/lib/utils/validation.ts
- [X] T048 Write unit tests for validation schemas in tests/unit/lib/validation.test.ts
- [X] T049 Create form validation utilities in src/lib/utils/form-helpers.ts

### API Utilities

- [X] T050 Create API response helpers in src/lib/utils/api-helpers.ts
- [X] T051 Create error handling middleware for API routes in src/lib/utils/error-handler.ts
- [X] T052 Write unit tests for API helpers in tests/unit/lib/api-helpers.test.ts

**Phase 2 Checkpoint**: Design system established, layout components working, shared utilities ready ✅

---

## Phase 3: User Story 1 - Patient Discovers Hospital and Books Appointment (P1)

**Goal**: Enable patients to browse doctors, select appointment slots, and book appointments with SMS/email confirmation

**Independent Test**: Navigate homepage → Browse doctors → Select doctor → Choose date/time → Submit details → Receive confirmation (on-screen + SMS/email)

### Database Models (US1)

- [X] T053 [US1] Define Doctor model with fields (name, qualifications, experience, photo) in prisma/schema.prisma
- [X] T054 [US1] Define MedicalSpecialty model in prisma/schema.prisma
- [X] T055 [US1] Define DoctorSpecialty join table in prisma/schema.prisma
- [X] T056 [US1] Define OPDSchedule model in prisma/schema.prisma
- [X] T057 [US1] Define Appointment model (NO PHI storage) in prisma/schema.prisma
- [ ] T058 [US1] Run Prisma migration for US1 models
- [ ] T059 [US1] Update seed script with sample doctors, specialties, schedules in prisma/seed.ts

### Doctor Listing & Profile (US1)

- [X] T060 [P] [US1] Write unit test for doctor data fetching in tests/unit/lib/doctors.test.ts
- [X] T061 [US1] Create doctor service functions in src/lib/doctors.ts
- [X] T062 [US1] Create GET /api/doctors route with filters in src/app/api/doctors/route.ts
- [X] T063 [P] [US1] Write API contract test for doctors endpoint in tests/integration/api/doctors.test.ts
- [X] T064 [US1] Create DoctorCard component in src/components/doctors/DoctorCard.tsx
- [X] T065 [US1] Create DoctorFilter component in src/components/doctors/DoctorFilter.tsx
- [X] T066 [US1] Create DoctorSearch component in src/components/doctors/DoctorSearch.tsx
- [X] T067 [US1] Build doctors listing page in src/app/doctors/page.tsx
- [X] T068 [US1] Build individual doctor profile page in src/app/doctors/[slug]/page.tsx
- [X] T069 [US1] Add OPDSchedule component to doctor profile in src/components/doctors/OPDSchedule.tsx
- [X] T070 [P] [US1] Write component tests for DoctorCard in tests/unit/components/doctors/DoctorCard.test.tsx

### Appointment Booking Flow (US1)

- [X] T071 [P] [US1] Write unit test for appointment validation in tests/unit/lib/appointments.test.ts
- [X] T072 [US1] Create appointment service with slot availability logic in src/lib/appointments.ts
- [X] T073 [US1] Create POST /api/appointments route in src/app/api/appointments/route.ts
- [X] T074 [US1] Create GET /api/appointments/available-slots route in src/app/api/appointments/available-slots/route.ts
- [X] T075 [P] [US1] Write API contract tests for appointments endpoints in tests/integration/api/appointments.test.ts
- [X] T076 [US1] Create DatePicker component in src/components/appointments/DatePicker.tsx
- [X] T077 [US1] Create TimeSlotSelector component in src/components/appointments/TimeSlotSelector.tsx
- [X] T078 [US1] Create AppointmentForm component with React Hook Form + Zod in src/components/appointments/AppointmentForm.tsx
- [X] T079 [US1] Build appointment booking page in src/app/appointments/page.tsx
- [X] T080 [US1] Build confirmation page in src/app/appointments/confirmation/page.tsx
- [X] T081 [P] [US1] Write component tests for AppointmentForm in tests/unit/components/appointments/AppointmentForm.test.tsx

### SMS & Email Notifications (US1)

- [X] T082 [US1] Implement Twilio SMS service in src/lib/sms.ts
- [X] T083 [US1] Implement SendGrid email service in src/lib/email.ts
- [X] T084 [P] [US1] Write unit tests for notification services in tests/unit/lib/notifications.test.ts
- [X] T085 [US1] Create appointment confirmation email template in src/lib/templates/appointment-confirmation-email.ts
- [X] T086 [US1] Integrate SMS/email sending in appointment creation flow in src/app/api/appointments/route.ts

### Spam Protection (US1)

- [X] T087 [US1] Implement reCAPTCHA v3 verification in src/lib/recaptcha.ts
- [X] T088 [US1] Add reCAPTCHA to appointment form in src/components/appointments/AppointmentForm.tsx
- [X] T089 [US1] Implement rate limiting for appointment API in src/app/api/appointments/route.ts

### E2E Testing (US1)

- [X] T090 [US1] Write E2E test: Browse doctors and view profile in tests/e2e/doctor-browsing.spec.ts
- [X] T091 [US1] Write E2E test: Complete appointment booking flow in tests/e2e/appointment-booking.spec.ts
- [X] T092 [US1] Write E2E test: Form validation for appointment booking in tests/e2e/appointment-validation.spec.ts
- [X] T093 [US1] Write accessibility test for appointment flow in tests/e2e/appointment-a11y.spec.ts

**US1 Checkpoint**: Appointment booking fully functional, tested, and independently deployable ✅

---

## Phase 4: User Story 2 - Patient Explores Hospital Services and Departments (P1)

**Goal**: Enable patients to discover hospital capabilities through department and service pages

**Independent Test**: Navigate homepage → View departments → Click department → See details → View services → See treatment information

### Database Models (US2)

- [X] T094 [US2] Define Department model in prisma/schema.prisma
- [X] T095 [US2] Define DoctorDepartment join table in prisma/schema.prisma
- [X] T096 [US2] Define ServiceCategory model in prisma/schema.prisma
- [X] T097 [US2] Define Service model in prisma/schema.prisma
- [ ] T098 [US2] Run Prisma migration for US2 models
- [ ] T099 [US2] Update seed script with departments and services in prisma/seed.ts

### Department Pages (US2)

- [X] T100 [P] [US2] Write unit test for department data fetching in tests/unit/lib/departments.test.ts
- [X] T101 [US2] Create department service functions in src/lib/departments.ts
- [X] T102 [US2] Create GET /api/departments route in src/app/api/departments/route.ts
- [X] T103 [US2] Create DepartmentCard component in src/components/sections/DepartmentCard.tsx
- [X] T104 [US2] Build departments listing page in src/app/departments/page.tsx
- [X] T105 [US2] Build individual department page in src/app/departments/[slug]/page.tsx
- [X] T106 [P] [US2] Write component tests for DepartmentCard in tests/unit/components/sections/DepartmentCard.test.tsx

### Service Pages (US2)

- [X] T107 [P] [US2] Write unit test for service data fetching in tests/unit/lib/services.test.ts
- [X] T108 [US2] Create service functions in src/lib/services.ts
- [X] T109 [US2] Create GET /api/services route in src/app/api/services/route.ts
- [X] T110 [US2] Create ServiceCard component in src/components/services/ServiceCard.tsx
- [X] T111 [US2] Build services listing page in src/app/services/page.tsx
- [X] T112 [US2] Build individual service page in src/app/services/[slug]/page.tsx

### Facilities & About Pages (US2)

- [X] T113 [US2] Build About Hospital page in src/app/about/page.tsx
- [X] T114 [US2] Build Facilities page in src/app/facilities/page.tsx
- [X] T115 [US2] Create Certifications component in src/components/sections/Certifications.tsx

### E2E Testing (US2)

- [X] T116 [US2] Write E2E test: Navigate departments and services in tests/e2e/department-navigation.spec.ts
- [X] T117 [US2] Write accessibility test for department pages in tests/e2e/departments-a11y.spec.ts

**US2 Checkpoint**: Department and service discovery fully functional ✅

---

## Phase 5: User Story 3 - Patient Finds Hospital Location and Contact Information (P1)

**Goal**: Enable patients to find hospital location, get directions, and submit contact inquiries

**Independent Test**: Find emergency contact (header/homepage) → View location on map → Submit contact form → Receive confirmation

### Database Models (US3)

- [X] T118 [US3] Define ContactInquiry model in prisma/schema.prisma
- [ ] T119 [US3] Run Prisma migration for US3 models

### Contact Page (US3)

- [X] T120 [P] [US3] Write unit test for contact form validation in tests/unit/lib/contact.test.ts
- [X] T121 [US3] Create contact service in src/lib/contact.ts
- [X] T122 [US3] Create POST /api/contact route in src/app/api/contact/route.ts
- [X] T123 [US3] Create ContactForm component with validation in src/components/forms/ContactForm.tsx
- [X] T124 [US3] Implement Google Maps integration in src/lib/maps.ts
- [X] T125 [US3] Create LocationMap component in src/components/sections/LocationMap.tsx
- [X] T126 [US3] Build contact page with form and map in src/app/contact/page.tsx
- [X] T127 [P] [US3] Write component tests for ContactForm in tests/unit/components/forms/ContactForm.test.tsx

### Emergency Contact Display (US3)

- [X] T128 [US3] Add emergency contact banner to header in src/components/layout/Header.tsx
- [X] T129 [US3] Create EmergencyBanner component in src/components/sections/EmergencyBanner.tsx

### E2E Testing (US3)

- [X] T130 [US3] Write E2E test: Submit contact form in tests/e2e/contact-form.spec.ts
- [X] T131 [US3] Write E2E test: Verify emergency contact visibility in tests/e2e/emergency-contact.spec.ts

**US3 Checkpoint**: Contact and location features fully functional ✅

---

## Phase 6: User Story 5a - Patient Browses Doctors by Specialty and Explores Service Categories (P2)

**Goal**: Enable specialty-based doctor organization and specific service category pages (Laboratory, Pharmacy, Radiology, Emergency, ICU)

**Independent Test**: Navigate specialties → Select "Cardiology" → See all cardiologists → Navigate services → View "Laboratory" → See lab tests and timings

### Specialty Pages (US5a)

- [ ] T132 [P] [US5a] Write unit test for specialty data fetching in tests/unit/lib/specialties.test.ts
- [ ] T133 [US5a] Create specialty service functions in src/lib/specialties.ts
- [ ] T134 [US5a] Create GET /api/specialties route in src/app/api/specialties/route.ts
- [ ] T135 [US5a] Build specialties listing page in src/app/specialties/page.tsx
- [ ] T136 [US5a] Build individual specialty page with doctors in src/app/specialties/[specialty]/page.tsx
- [ ] T137 [US5a] Update doctor listing to support specialty filtering in src/app/doctors/page.tsx

### Service Category Pages (US5a)

- [ ] T138 [US5a] Create service category components: LaboratoryInfo, PharmacyInfo, RadiologyInfo in src/components/services/
- [ ] T139 [US5a] Build Laboratory Services page in src/app/services/laboratory/page.tsx
- [ ] T140 [US5a] Build Pharmacy Services page in src/app/services/pharmacy/page.tsx
- [ ] T141 [US5a] Build Radiology & Imaging page in src/app/services/radiology/page.tsx
- [ ] T142 [US5a] Build Emergency Services page in src/app/services/emergency/page.tsx
- [ ] T143 [US5a] Build ICU/Critical Care page in src/app/services/icu/page.tsx

### E2E Testing (US5a)

- [ ] T144 [US5a] Write E2E test: Browse doctors by specialty in tests/e2e/specialty-browsing.spec.ts
- [ ] T145 [US5a] Write E2E test: Navigate service categories in tests/e2e/service-categories.spec.ts

**US5a Checkpoint**: Specialty-based organization and service categories complete ✅

---

## Phase 7: Homepage with Hero Carousel & Featured Content (P1/P2)

**Goal**: Build engaging homepage with auto-playing hero carousel, featured doctors, departments, testimonials

### Hero Carousel (Homepage)

- [X] T146 Define HeroCarouselImage model in prisma/schema.prisma
- [ ] T147 Run Prisma migration for hero carousel
- [X] T148 Implement Framer Motion carousel in src/components/hero/HeroCarousel.tsx
- [X] T149 Create CarouselControls component (arrows, dots, pause) in src/components/hero/CarouselControls.tsx
- [X] T150 [P] Write unit tests for carousel logic in tests/unit/components/hero/HeroCarousel.test.tsx
- [X] T151 [P] Write accessibility tests for carousel in tests/e2e/hero-carousel-a11y.spec.ts

### Homepage Sections

- [X] T152 Create FeaturedDoctors section in src/components/sections/FeaturedDoctors.tsx
- [X] T153 Create Departments section (homepage grid) in src/components/sections/Departments.tsx
- [X] T154 Create Testimonials section in src/components/sections/Testimonials.tsx
- [X] T155 Create AppointmentCTA section in src/components/sections/AppointmentCTA.tsx
- [X] T156 Assemble homepage with all sections in src/app/page.tsx

### E2E Testing (Homepage)

- [X] T157 Write E2E test: Hero carousel auto-play and controls in tests/e2e/homepage-carousel.spec.ts
- [X] T158 Write E2E test: Homepage navigation to all sections in tests/e2e/homepage-navigation.spec.ts
- [ ] T159 Run Lighthouse CI test on homepage for performance in tests/e2e/homepage-performance.spec.ts

**Homepage Checkpoint**: Engaging homepage with interactive carousel complete ✅

---

## Phase 8: User Story 4 - Hospital Administrator Deploys for New Hospital (P2)

**Goal**: Validate multi-hospital configuration system

- [ ] T160 [US4] Create configuration validation tests in tests/unit/lib/config.test.ts
- [ ] T161 [US4] Create second hospital config (XYZ Specialty Clinic) in config/hospitals/xyz-specialty.yaml
- [ ] T162 [US4] Test theme switching between hospitals in tests/integration/config/theme-switching.test.ts
- [ ] T163 [US4] Write deployment guide in docs/DEPLOYMENT.md
- [ ] T164 [US4] Write configuration guide in docs/CONFIGURATION.md

**US4 Checkpoint**: Multi-hospital deployment validated ✅

---

## Phase 9: SEO, Schema Markup & Sitemaps (All Stories)

**Goal**: Optimize for search engines

- [ ] T165 Implement generateMetadata for all pages (doctors, departments, services, specialties)
- [ ] T166 Create schema markup utilities in src/lib/utils/schema-markup.ts
- [ ] T167 Add Hospital schema to homepage in src/app/page.tsx
- [ ] T168 Add Doctor schema to doctor profiles in src/app/doctors/[slug]/page.tsx
- [ ] T169 Add MedicalSpecialty schema to specialty pages in src/app/specialties/[specialty]/page.tsx
- [ ] T170 Generate XML sitemap in src/app/sitemap.ts
- [ ] T171 Create robots.txt in public/robots.txt
- [ ] T172 Add Open Graph and Twitter Card meta tags to all pages
- [ ] T173 Write SEO validation tests in tests/e2e/seo.spec.ts

**SEO Checkpoint**: All pages SEO-optimized with schema markup ✅

---

## Phase 10: User Story 6 - Website Visitor Builds Trust Through Social Proof (P2)

**Goal**: Display testimonials, certifications, and trust elements

- [ ] T174 [US6] Define Testimonial model in Sanity CMS schema
- [ ] T175 [US6] Fetch testimonials from Sanity in src/lib/sanity.ts
- [ ] T176 [US6] Create TestimonialCard component in src/components/sections/TestimonialCard.tsx
- [ ] T177 [US6] Update Testimonials section with real data in src/components/sections/Testimonials.tsx
- [ ] T178 [US6] Update Certifications component with config data in src/components/sections/Certifications.tsx

**US6 Checkpoint**: Trust elements displaying correctly ✅

---

## Phase 11: User Story 7 - Patient Accesses Health Information (P3)

**Goal**: Blog and health content

- [ ] T179 [US7] Define BlogPost model in Sanity CMS schema
- [ ] T180 [US7] Create blog listing page in src/app/blog/page.tsx
- [ ] T181 [US7] Create individual blog post page in src/app/blog/[slug]/page.tsx
- [ ] T182 [US7] Add blog post search and filtering in src/app/blog/page.tsx

**US7 Checkpoint**: Blog functional ✅

---

## Phase 12: User Story 8 - Hospital Staff Manages Content (P3)

**Goal**: Content management via Sanity CMS

- [ ] T183 [US8] Set up Sanity Studio in sanity/ directory
- [ ] T184 [US8] Configure Sanity schemas for all content types (doctors, departments, blog)
- [ ] T185 [US8] Implement Sanity webhook for content revalidation in src/app/api/webhooks/sanity/route.ts
- [ ] T186 [US8] Write CMS integration tests in tests/integration/sanity/content-sync.test.ts

**US8 Checkpoint**: CMS fully integrated ✅

---

## Phase 13: User Story 9 - Patient Accesses Career Opportunities (P3)

**Goal**: Careers page

- [ ] T187 [US9] Build careers page in src/app/careers/page.tsx
- [ ] T188 [US9] Create job listing component in src/components/sections/JobListing.tsx

**US9 Checkpoint**: Careers page complete ✅

---

## Phase 14: User Story 10 - Patient Logs into Patient Portal (P3, Optional HMS Integration)

**Goal**: Patient portal with HMS integration

- [ ] T189 [US10] Create HMS client abstraction layer in src/lib/hms-client.ts
- [ ] T190 [US10] Implement fallback HMS client in src/lib/hms-client.ts
- [ ] T191 [US10] Create patient login page in src/app/patient-portal/login/page.tsx
- [ ] T192 [US10] Write HMS integration tests in tests/integration/hms/client.test.ts

**US10 Checkpoint**: Patient portal foundation ready ✅

---

## Phase 15: Accessibility & Performance Polish

**Goal**: Ensure WCAG 2.1 AA compliance and performance targets

- [ ] T193 Run axe-core accessibility audit on all pages and fix issues
- [ ] T194 Test keyboard navigation on all interactive elements
- [ ] T195 Test with screen readers (NVDA/VoiceOver) and fix issues
- [ ] T196 Optimize images with Sharp and Next.js Image component
- [ ] T197 Implement lazy loading for below-fold content
- [ ] T198 Run Lighthouse audit and achieve >90 score on all pages
- [ ] T199 Test Core Web Vitals and optimize for LCP <2.5s, INP <200ms, CLS <0.1
- [ ] T200 Test on 3G connection and optimize for <3s load time

**Accessibility & Performance Checkpoint**: All targets met ✅

---

## Phase 16: Multi-Language Support (Optional)

**Goal**: Support English + Urdu/local languages

- [ ] T201 Set up i18n with next-intl in src/i18n/
- [ ] T202 Create language selector component in src/components/layout/LanguageSelector.tsx
- [ ] T203 Translate all UI strings for configured languages
- [ ] T204 Test language switching and RTL support

**Multi-Language Checkpoint**: i18n complete ✅

---

## Phase 17: Final Testing & Launch Preparation

**Goal**: Comprehensive testing before launch

- [ ] T205 Run full E2E test suite across all user stories
- [ ] T206 Perform cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] T207 Perform mobile device testing (iOS, Android)
- [ ] T208 Security audit: Test input sanitization, rate limiting, HTTPS
- [ ] T209 Load testing with 1000 concurrent users
- [ ] T210 Privacy audit: Verify NO PHI storage on public website
- [ ] T211 Create launch checklist from constitution hospital website section
- [ ] T212 Prepare deployment configuration for production

**Launch Ready**: All tests passing, security verified, performance validated ✅

---

## Parallel Execution Examples

### After Foundational (Phase 2) Complete

**Can run in parallel**:
- US1 Team: Appointment booking (T053-T093)
- US2 Team: Departments/Services (T094-T117)
- US3 Team: Contact/Location (T118-T131)

### After P1 Stories Complete

**Can run in parallel**:
- US4: Multi-hospital config (T160-T164)
- US5: Doctor profiles (extends US1)
- US6: Trust elements (T174-T178)
- US5a: Specialties/Services (T132-T145)

### Polish Phase

**Can run in parallel**:
- SEO optimization (T165-T173)
- Accessibility audit (T193-T195)
- Performance optimization (T196-T200)
- i18n implementation (T201-T204)

---

## Task Summary

**Total Tasks**: 212
**Parallelizable Tasks**: 58 (marked with [P])
**User Story Breakdown**:
- Setup & Foundational: 62 tasks
- US1 (Appointment Booking): 41 tasks
- US2 (Services/Departments): 24 tasks
- US3 (Contact/Location): 14 tasks
- US5a (Specialties/Service Categories): 14 tasks
- Homepage & Hero: 14 tasks
- US4 (Multi-hospital): 5 tasks
- SEO: 9 tasks
- US6 (Trust): 5 tasks
- US7 (Blog): 4 tasks
- US8 (CMS): 4 tasks
- US9 (Careers): 2 tasks
- US10 (Patient Portal): 4 tasks
- Polish: 12 tasks

**Estimated Timeline**:
- MVP (US1 only): 2-3 weeks (1 developer)
- P1 Stories (US1-3): 4-6 weeks (1 developer) or 2-3 weeks (3 developers parallel)
- Full Feature Set: 8-12 weeks (1 developer) or 4-6 weeks (team of 3-4)

---

## Next Steps

1. **Start with User Story 1** (Appointment Booking) for MVP
2. **Follow TDD**: Write tests before implementation (Red → Green → Refactor)
3. **Run `/sp.implement`** when ready to begin implementation
4. **Track progress**: Update checkboxes as tasks complete
5. **Validate independently**: Test each user story in isolation before moving to next

**Ready to implement!** 🚀