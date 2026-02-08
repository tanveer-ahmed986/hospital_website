# Implementation Plan: Multi-Hospital Marketing & Patient Acquisition Website

**Branch**: `001-hospital-website` | **Date**: 2026-02-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-hospital-website/spec.md`

## Summary

Build a professional, highly interactive hospital website platform with configuration-based multi-hospital deployment. Core features include online appointment booking, specialty-based doctor organization, specific service categories (Laboratory, Pharmacy, Radiology, Emergency, ICU), auto-playing hero carousel, sticky header navigation, and seamless HMS integration with fallback support. The platform prioritizes patient acquisition through trust-building, impressive UI/UX, and mobile-first design while maintaining strict healthcare data privacy (public website handles NO PHI).

**Technical Approach**: Next.js 14+ (App Router) with TypeScript for type safety, Tailwind CSS for responsive design system, PostgreSQL for data persistence, Prisma ORM for type-safe database access, and configuration-based multi-hospital support using YAML/JSON config files. Headless CMS (Sanity recommended) for content management, SMS/Email integration for notifications, Google Maps for locations, and optional HMS API integration.

## Technical Context

**Language/Version**: TypeScript 5+ with Node.js 20 LTS
**Framework**: Next.js 14+ with App Router (React 18+)
**Styling**: Tailwind CSS 3+ with custom design tokens for medical branding
**Primary Dependencies**:
- Next.js 14+, React 18+, TypeScript 5+
- Tailwind CSS 3+ (responsive design system)
- Prisma ORM 5+ (database access with TypeScript)
- Sanity CMS or Contentful (headless content management)
- React Hook Form + Zod (form handling and validation)
- Framer Motion or React Spring (animations and transitions)
- Swiper or Embla Carousel (hero image carousel)
- Twilio SDK (SMS notifications)
- SendGrid or Resend (email notifications)
- Google Maps JavaScript API (location display)
- reCAPTCHA v3 (spam protection)
- Sharp (image optimization)
**Storage**: PostgreSQL 15+ (relational database for appointments, doctors, departments, services, specialties)
**Testing**:
- Vitest (unit tests)
- React Testing Library (component tests)
- Playwright (E2E tests for booking flow, navigation, forms)
- Lighthouse CI (performance testing)
- axe-core (accessibility testing)
**Target Platform**: Web (server-side rendering for SEO, client-side interactivity)
**Project Type**: Web application (frontend + backend API routes via Next.js)
**Performance Goals**:
- Initial page load <3s on 3G
- Lighthouse score >90
- Core Web Vitals: LCP <2.5s, INP <200ms, CLS <0.1
- 60 FPS animations
- 1000 concurrent users support
**Constraints**:
- NO Protected Health Information (PHI) storage on public website
- WCAG 2.1 Level AA accessibility compliance
- Mobile-first design (320px to 4K+)
- SEO-optimized (SSR, schema markup, sitemaps)
- Configuration-only multi-hospital deployment (no code changes)
- Hero section ≤2 viewport heights
- Sticky header visible within 0.5s of scroll
- Interactive feedback within 100ms
**Scale/Scope**:
- Estimated 500-5000 monthly visitors per hospital
- 50-200 doctors per hospital
- 10-30 specialties
- 20-50 service categories and sub-services
- 5-15 departments
- 10-100 appointments/day
- Support deployment for 10-100+ hospitals from single codebase

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Core Principles Compliance

**✅ I. Test-Driven Development (TDD)**
- Plan includes comprehensive testing strategy: Vitest (unit), React Testing Library (component), Playwright (E2E)
- Test pyramid: ~70% unit, ~20% integration, ~10% E2E
- E2E tests for P1 flows (appointment booking, navigation)
- Accessibility tests with axe-core
- Performance regression tests with Lighthouse CI
- **Status**: ✅ PASS - TDD approach planned

**✅ II. Component-Based Architecture**
- Next.js 14 App Router with React components
- Modular component structure (common, layout, forms, sections)
- Component library for reusable UI elements (cards, buttons, forms)
- **Status**: ✅ PASS - Component architecture planned

**✅ III. Responsive & Accessible Design with Design System**
- Mobile-first approach with Tailwind CSS
- WCAG 2.1 Level AA compliance requirement
- Design tokens for colors, spacing, typography
- Responsive breakpoints: mobile (320-767px), tablet (768-1023px), desktop (1024-1919px), wide (1920px+)
- Touch targets 44x44px minimum
- **Status**: ✅ PASS - Accessibility and responsive design planned

**✅ IV. Performance & Optimization**
- Core Web Vitals targets: LCP <2.5s, INP <200ms, CLS <0.1
- Image optimization with Sharp and Next.js Image component
- Lazy loading for images below fold
- Code splitting via Next.js App Router
- CDN delivery via Vercel or similar
- Performance budgets: JS <150KB gzipped, CSS <50KB gzipped
- **Status**: ✅ PASS - Performance optimization planned

**✅ V. Clean Code & Maintainability**
- TypeScript for type safety
- ESLint + Prettier for consistent formatting
- Modular folder structure
- Separation of concerns (components, services, utilities)
- **Status**: ✅ PASS - Code quality measures planned

**✅ VI. Security & Privacy**
- HTTPS enforcement
- CSP headers
- Input sanitization (Zod validation)
- reCAPTCHA spam protection
- Rate limiting on forms
- NO PHI storage on public website (critical healthcare requirement)
- GDPR-compliant consent banner
- **Status**: ✅ PASS - Security measures planned

**✅ VII. Documentation & Knowledge Sharing**
- README with setup instructions
- quickstart.md for development
- Architecture decisions documented in plan.md
- Component documentation via Storybook (optional)
- API documentation for HMS integration
- **Status**: ✅ PASS - Documentation planned

**✅ VIII. SEO & Discoverability**
- Server-side rendering (Next.js App Router)
- Schema markup (Hospital, Doctor, MedicalSpecialty, MedicalProcedure)
- XML sitemap generation
- robots.txt
- Meta tags per page
- Open Graph and Twitter Card tags
- **Status**: ✅ PASS - SEO optimization planned

**✅ IX. Analytics & Observability**
- Analytics integration (Google Analytics or Plausible)
- Error tracking (Sentry recommended)
- Appointment funnel tracking
- Real User Monitoring for Core Web Vitals
- **Status**: ✅ PASS - Analytics and monitoring planned

**✅ X. Content Management Strategy**
- Headless CMS (Sanity or Contentful) for content
- Configuration files (YAML/JSON) for hospital-specific settings
- Separation of content from code
- Version control for config files
- **Status**: ✅ PASS - Content management strategy planned

**✅ XI. UI/UX Implementation Techniques**
- Smooth scroll animations (Framer Motion or React Spring)
- Interactive hover effects
- Micro-interactions for feedback
- Skeleton loaders for async content
- Progressive disclosure patterns
- Hero carousel with auto-play and smooth transitions
- **Status**: ✅ PASS - UI/UX techniques planned

### Hospital Website Specific Requirements

**✅ Multi-Hospital Configuration Architecture**
- Configuration-based deployment (YAML/JSON config files)
- Per-hospital branding (name, logo, colors, domain)
- Feature flags per hospital
- Content configuration (departments, services, specialties)
- **Status**: ✅ PASS - Multi-hospital architecture planned

**✅ Healthcare Data Privacy**
- Public website stores NO Protected Health Information (PHI)
- Appointment booking collects only: name, phone, email, reason (NOT PHI until confirmed)
- Clear separation: Public Website (no PHI) vs Patient Portal (HMS-integrated, PHI)
- HTTPS with HSTS
- Input sanitization and validation
- **Status**: ✅ PASS - Privacy-first architecture planned

**✅ Healthcare-Specific Features**
- Appointment booking system (doctor-wise, specialty-wise, department-wise)
- Doctor organization by medical specialty (ENT, Gynecology, Pediatrics, Cardiology, etc.)
- Service categories (Laboratory, Pharmacy, Radiology, Emergency, ICU, Operation Theater)
- Hero carousel with hospital imagery
- Sticky header navigation
- Trust-building elements (testimonials, certifications)
- Emergency contact prominence
- **Status**: ✅ PASS - Healthcare features planned

**✅ HMS Integration with Fallback**
- Optional HMS API integration for appointments, doctor schedules, patient portal
- Graceful fallback to manual booking when HMS unavailable
- API abstraction layer to support multiple HMS platforms
- **Status**: ✅ PASS - Integration architecture planned

**✅ Mobile-First & Accessibility**
- Responsive design 320px to 4K+
- WCAG 2.1 Level AA compliance
- Touch targets 44x44px minimum
- Click-to-call for phone numbers
- Screen reader support
- **Status**: ✅ PASS - Mobile and accessibility planned

**✅ SEO for Healthcare**
- Schema markup for Hospital, Doctor, MedicalSpecialty, MedicalProcedure
- Local SEO optimization
- Health information content strategy
- Specialty and service page SEO
- **Status**: ✅ PASS - Healthcare SEO planned

### Constitution Gates Summary

**All gates PASS** ✅

No constitution violations. The plan adheres to all core principles and hospital-specific requirements from the constitution.

## Project Structure

### Documentation (this feature)

```text
specs/001-hospital-website/
├── spec.md              # Feature specification (COMPLETE)
├── plan.md              # This file - implementation plan (IN PROGRESS)
├── research.md          # Phase 0 output - technology research and decisions
├── data-model.md        # Phase 1 output - database schema and entities
├── quickstart.md        # Phase 1 output - development setup guide
├── contracts/           # Phase 1 output - API contracts
│   ├── appointments.openapi.yaml
│   ├── doctors.openapi.yaml
│   ├── services.openapi.yaml
│   └── hms-integration.openapi.yaml
├── checklists/          # Quality and compliance checklists
│   └── requirements.md  # Specification quality checklist (COMPLETE)
└── tasks.md             # Phase 2 output - NOT created by /sp.plan (created by /sp.tasks)
```

### Source Code (repository root)

```text
# Option 2: Web application (Next.js 14 App Router)

hospital-website/
├── .env.example                    # Environment variables template
├── .env.local                      # Local environment variables (gitignored)
├── next.config.js                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration with design tokens
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies
├── prisma/
│   ├── schema.prisma               # Database schema
│   ├── migrations/                 # Database migrations
│   └── seed.ts                     # Database seeding script
├── config/
│   ├── hospitals/                  # Hospital-specific configurations
│   │   ├── abc-general.yaml        # ABC General Hospital config
│   │   ├── xyz-specialty.yaml      # XYZ Specialty Clinic config
│   │   └── template.yaml           # Template for new hospitals
│   └── load-config.ts              # Configuration loader utility
├── public/
│   ├── assets/                     # Static assets per hospital
│   │   ├── abc-general/            # ABC General Hospital assets
│   │   │   ├── logo.png
│   │   │   ├── favicon.ico
│   │   │   └── hero-images/        # Carousel images
│   │   └── xyz-specialty/          # XYZ Specialty Clinic assets
│   ├── robots.txt                  # SEO robots file
│   └── sitemap.xml                 # Generated sitemap
├── src/
│   ├── app/                        # Next.js 14 App Router
│   │   ├── layout.tsx              # Root layout with sticky header
│   │   ├── page.tsx                # Homepage with hero carousel
│   │   ├── doctors/
│   │   │   ├── page.tsx            # Doctors listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Individual doctor profile
│   │   ├── specialties/
│   │   │   ├── page.tsx            # Specialties listing
│   │   │   └── [specialty]/
│   │   │       └── page.tsx        # Specialty page with doctors
│   │   ├── departments/
│   │   │   ├── page.tsx            # Departments listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Individual department page
│   │   ├── services/
│   │   │   ├── page.tsx            # Services listing
│   │   │   ├── laboratory/
│   │   │   │   └── page.tsx        # Laboratory services
│   │   │   ├── pharmacy/
│   │   │   │   └── page.tsx        # Pharmacy services
│   │   │   ├── radiology/
│   │   │   │   └── page.tsx        # Radiology services
│   │   │   ├── emergency/
│   │   │   │   └── page.tsx        # Emergency services
│   │   │   ├── icu/
│   │   │   │   └── page.tsx        # ICU/Critical Care
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Other service pages
│   │   ├── appointments/
│   │   │   ├── page.tsx            # Appointment booking page
│   │   │   └── confirmation/
│   │   │       └── page.tsx        # Booking confirmation
│   │   ├── contact/
│   │   │   └── page.tsx            # Contact page with form and map
│   │   ├── about/
│   │   │   └── page.tsx            # About hospital page
│   │   ├── facilities/
│   │   │   └── page.tsx            # Facilities page
│   │   ├── blog/
│   │   │   ├── page.tsx            # Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Individual blog post
│   │   ├── careers/
│   │   │   └── page.tsx            # Careers page
│   │   ├── api/                    # API routes
│   │   │   ├── appointments/
│   │   │   │   ├── route.ts        # POST appointment booking
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts    # GET/PUT appointment
│   │   │   ├── doctors/
│   │   │   │   └── route.ts        # GET doctors with filters
│   │   │   ├── specialties/
│   │   │   │   └── route.ts        # GET specialties
│   │   │   ├── contact/
│   │   │   │   └── route.ts        # POST contact form
│   │   │   ├── hms/                # HMS integration endpoints
│   │   │   │   ├── appointments/
│   │   │   │   │   └── route.ts    # HMS appointment sync
│   │   │   │   └── doctors/
│   │   │   │       └── route.ts    # HMS doctor sync
│   │   │   └── webhooks/
│   │   │       ├── sanity/
│   │   │       │   └── route.ts    # Sanity CMS webhooks
│   │   │       └── hms/
│   │   │           └── route.ts    # HMS webhooks
│   │   ├── globals.css             # Global styles and Tailwind imports
│   │   └── not-found.tsx           # 404 page
│   ├── components/
│   │   ├── common/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Spinner.tsx
│   │   ├── layout/                 # Layout components
│   │   │   ├── Header.tsx          # Sticky header with navigation
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── LanguageSelector.tsx
│   │   ├── hero/                   # Hero section components
│   │   │   ├── HeroCarousel.tsx    # Auto-playing image carousel
│   │   │   ├── HeroSlide.tsx
│   │   │   └── CarouselControls.tsx
│   │   ├── doctors/                # Doctor-related components
│   │   │   ├── DoctorCard.tsx
│   │   │   ├── DoctorProfile.tsx
│   │   │   ├── DoctorFilter.tsx
│   │   │   ├── DoctorSearch.tsx
│   │   │   └── OPDSchedule.tsx
│   │   ├── appointments/           # Appointment booking components
│   │   │   ├── AppointmentForm.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── TimeSlotSelector.tsx
│   │   │   ├── DoctorSelector.tsx
│   │   │   └── BookingConfirmation.tsx
│   │   ├── services/               # Service-related components
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── ServiceCategoryList.tsx
│   │   │   ├── LaboratoryInfo.tsx
│   │   │   ├── PharmacyInfo.tsx
│   │   │   ├── RadiologyInfo.tsx
│   │   │   └── EmergencyInfo.tsx
│   │   ├── sections/               # Homepage sections
│   │   │   ├── FeaturedDoctors.tsx
│   │   │   ├── Departments.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Certifications.tsx
│   │   │   ├── LocationMap.tsx
│   │   │   └── EmergencyBanner.tsx
│   │   └── forms/                  # Form components
│   │       ├── ContactForm.tsx
│   │       └── FormValidation.tsx
│   ├── lib/
│   │   ├── config.ts               # Configuration loader and validator
│   │   ├── prisma.ts               # Prisma client singleton
│   │   ├── sanity.ts               # Sanity CMS client
│   │   ├── hms-client.ts           # HMS integration client
│   │   ├── sms.ts                  # SMS notification service (Twilio)
│   │   ├── email.ts                # Email service (SendGrid/Resend)
│   │   ├── maps.ts                 # Google Maps integration
│   │   ├── recaptcha.ts            # reCAPTCHA verification
│   │   ├── analytics.ts            # Analytics integration
│   │   └── utils/
│   │       ├── date.ts             # Date formatting utilities
│   │       ├── slug.ts             # URL slug generation
│   │       ├── validation.ts       # Zod schemas
│   │       └── helpers.ts          # Helper functions
│   ├── types/
│   │   ├── hospital.ts             # Hospital configuration types
│   │   ├── doctor.ts               # Doctor entity types
│   │   ├── specialty.ts            # Medical specialty types
│   │   ├── appointment.ts          # Appointment types
│   │   ├── service.ts              # Service types
│   │   └── hms.ts                  # HMS integration types
│   ├── styles/
│   │   ├── design-tokens.ts        # Design tokens (colors, spacing, typography)
│   │   └── animations.ts           # Animation configurations
│   └── middleware.ts               # Next.js middleware for config loading
├── tests/
│   ├── unit/                       # Unit tests (Vitest)
│   │   ├── components/
│   │   ├── lib/
│   │   └── utils/
│   ├── integration/                # Integration tests (Vitest)
│   │   ├── api/
│   │   └── services/
│   └── e2e/                        # End-to-end tests (Playwright)
│       ├── appointment-booking.spec.ts
│       ├── doctor-search.spec.ts
│       ├── navigation.spec.ts
│       └── contact-form.spec.ts
├── .github/
│   └── workflows/
│       ├── ci.yml                  # CI pipeline (tests, lint, build)
│       ├── lighthouse.yml          # Lighthouse CI performance testing
│       └── deploy.yml              # Deployment workflow
└── docs/
    ├── DEPLOYMENT.md               # Deployment guide
    ├── CONFIGURATION.md            # Hospital configuration guide
    └── HMS_INTEGRATION.md          # HMS integration documentation
```

**Structure Decision**: Web application structure with Next.js 14 App Router. Frontend and backend are unified within Next.js framework (API routes handle backend logic). This structure supports:
- Server-side rendering for SEO
- API routes for appointment booking, contact forms, HMS integration
- Configuration-based multi-hospital deployment
- Component-based architecture
- Type-safe development with TypeScript
- Comprehensive testing at all levels

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations - complexity tracking not needed. The plan follows all core principles and healthcare-specific requirements.

---

## Phase 0: Research & Technology Decisions

*Output: research.md with all technology choices, patterns, and best practices*

Research tasks completed inline (documented below). Full research.md will be generated with detailed findings.

### Key Technology Decisions

**Decision 1: Next.js 14 with App Router**
- **Rationale**: Built-in SSR for SEO, optimal performance, API routes for backend, image optimization, excellent TypeScript support, mature ecosystem
- **Alternatives considered**: Astro (less interactive), Remix (smaller ecosystem), Create React App (no SSR)
- **Chosen**: Next.js 14+ with App Router

**Decision 2: Tailwind CSS for Styling**
- **Rationale**: Rapid UI development, design token system, responsive utilities, small bundle size, excellent with component libraries
- **Alternatives considered**: CSS Modules (more verbose), Styled Components (runtime cost), Vanilla CSS (harder to maintain)
- **Chosen**: Tailwind CSS 3+ with custom design tokens

**Decision 3: PostgreSQL + Prisma ORM**
- **Rationale**: Relational data (doctors, specialties, appointments), TypeScript integration, type-safe queries, excellent migration system
- **Alternatives considered**: MongoDB (less structured), Supabase (vendor lock-in), Direct SQL (less type-safe)
- **Chosen**: PostgreSQL 15+ with Prisma ORM 5+

**Decision 4: Sanity CMS for Content Management**
- **Rationale**: Real-time updates, excellent TypeScript support, flexible schema, good developer experience, webhooks for revalidation
- **Alternatives considered**: Contentful (more expensive), Strapi (self-hosted complexity), WordPress (not headless-first)
- **Chosen**: Sanity CMS (with Contentful as alternative)

**Decision 5: Configuration-Based Multi-Hospital (Not Multi-Tenant)**
- **Rationale**: Better for individual hospital deployments, simpler security model (no cross-hospital data leakage), easier HIPAA compliance, separate databases per hospital
- **Alternatives considered**: Multi-tenant (complex for healthcare compliance), separate codebases (maintenance overhead)
- **Chosen**: Configuration-based with YAML/JSON config files

**Decision 6: Framer Motion for Animations**
- **Rationale**: React-first animation library, excellent performance, declarative API, supports gesture animations, good TypeScript support
- **Alternatives considered**: React Spring (steeper learning curve), GSAP (separate library), CSS animations (less programmatic control)
- **Chosen**: Framer Motion

**Decision 7: HMS Integration Strategy**
- **Rationale**: Abstract HMS client interface to support multiple HMS platforms, fallback to manual booking when unavailable, store appointments locally with HMS sync
- **Pattern**: Adapter pattern with HMS client interface
- **Chosen**: API abstraction layer with graceful fallback

---

*Full research.md will be generated with detailed findings in next step.*