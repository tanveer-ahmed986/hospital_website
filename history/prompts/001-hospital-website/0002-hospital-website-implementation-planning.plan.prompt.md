---
id: 0002
title: Hospital website implementation planning
stage: plan
date: 2026-02-02
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-hospital-website
branch: 001-hospital-website
user: user
command: /sp.plan
labels: ["planning", "architecture", "hospital", "healthcare", "next.js", "prisma", "tailwind"]
links:
  spec: specs/001-hospital-website/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-hospital-website/plan.md
  - specs/001-hospital-website/research.md
  - specs/001-hospital-website/data-model.md
  - specs/001-hospital-website/quickstart.md
  - specs/001-hospital-website/contracts/appointments.openapi.yaml
tests:
  - No tests run (planning phase)
---

## Prompt

/sp.plan (no additional input)

## Response snapshot

**Created comprehensive implementation plan** for multi-hospital website with Phase 0 (Research) and Phase 1 (Design & Contracts) complete.

**Technical Stack Selected**:
- Next.js 14+ with App Router (React 18+, TypeScript 5+)
- Tailwind CSS 3+ (responsive design system with medical trust colors)
- PostgreSQL 15+ with Prisma ORM 5+ (type-safe database access)
- Sanity CMS (headless content management)
- Framer Motion (animations for interactive UI)
- React Hook Form + Zod (form validation)
- Testing: Vitest + React Testing Library + Playwright

**Architecture Decisions**:
1. **Configuration-Based Multi-Hospital**: Each hospital = separate deployment with shared codebase, individual config file (YAML/JSON) for branding, features, integrations
2. **Privacy-First**: Public website stores NO PHI - only basic contact info for appointments
3. **HMS Integration**: Adapter pattern with graceful fallback to manual booking when HMS unavailable
4. **SSR for SEO**: Server-side rendering critical for patient acquisition through search engines

**Phase 0: Research**:
- Documented 10 key technology decisions with rationale and alternatives
- Framework selection: Next.js 14 App Router (SSR, image optimization, API routes, performance)
- Styling: Tailwind CSS (rapid development, design tokens, responsive utilities)
- Database: PostgreSQL + Prisma (relational data, type safety, ACID transactions)
- CMS: Sanity (real-time updates, TypeScript support, flexible schemas)
- Multi-hospital approach: Configuration-based (simpler compliance than multi-tenant)
- Animations: Framer Motion (React-first, performant, gesture support)
- HMS integration: Adapter pattern with fallback
- Forms: React Hook Form + Zod (performance, validation, TypeScript)
- Testing: TDD with comprehensive stack
- Deployment: Vercel recommended (Next.js optimized, edge functions)

**Phase 1: Design & Contracts**:
- **Data Model** (data-model.md): 12 entities defined
  - Core: Doctor, MedicalSpecialty, Department, OPDSchedule, Appointment
  - Services: ServiceCategory, Service
  - Content: BlogPost, ContactInquiry, HeroCarouselImage
  - Join Tables: DoctorSpecialty, DoctorDepartment
  - Relationships: Properly structured with foreign keys and cascade rules
  - Indexes: Optimized for query patterns (slug, status, active, compound indexes)
  - Privacy: NO PHI storage documented

- **API Contracts** (contracts/appointments.openapi.yaml):
  - POST /api/appointments (create booking)
  - GET /api/appointments (list with filters)
  - GET /api/appointments/{id} (get by ID)
  - PATCH /api/appointments/{id} (update status)
  - GET /api/appointments/available-slots (get doctor availability)
  - OpenAPI 3.0 specification with request/response schemas

- **Quickstart Guide** (quickstart.md):
  - Prerequisites and setup instructions
  - Environment configuration
  - Database setup with Prisma
  - Hospital configuration guide
  - Development workflows
  - Testing procedures
  - Common tasks (add pages, API routes, update schema, configure hospitals)
  - Troubleshooting section
  - Deployment instructions (Vercel and self-hosted)

**Constitution Check**: All gates PASS ✅
- TDD approach planned
- Component-based architecture
- WCAG 2.1 AA accessibility
- Performance optimization (Core Web Vitals)
- Security measures (HTTPS, CSP, input sanitization)
- SEO optimization (SSR, schema markup)
- Healthcare compliance (NO PHI storage)

**Project Structure**: Web application with Next.js App Router - unified frontend/backend, comprehensive folder organization for components, pages, API routes, utilities, types, tests.

## Outcome

- ✅ Impact: Comprehensive implementation plan with technology stack, architecture, data model, API contracts, and development guide ready for implementation
- 🧪 Tests: Planning phase complete - no tests run yet (TDD will begin in implementation)
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, contracts/appointments.openapi.yaml (5 files)
- 🔁 Next prompts: /sp.tasks (generate implementation tasks with TDD approach)
- 🧠 Reflection: Planning phase successfully completed with all constitution gates passing. Selected modern, healthcare-appropriate tech stack (Next.js, TypeScript, PostgreSQL, Prisma, Tailwind) with strong emphasis on configuration-based multi-hospital deployment and privacy-first architecture (NO PHI on public website). Research documented 10 key decisions with rationale. Data model covers 12 entities with proper relationships and indexes. Ready for task generation and implementation.

## Evaluation notes (flywheel)

- Failure modes observed: None - planning phase successful
- Graders run and results (PASS/FAIL): Constitution Check: ALL GATES PASS
- Prompt variant (if applicable): Standard /sp.plan workflow
- Next experiment (smallest change to try): User should run /sp.tasks to generate testable implementation tasks organized by priority
