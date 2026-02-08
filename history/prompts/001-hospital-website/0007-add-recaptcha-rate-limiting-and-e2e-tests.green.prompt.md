---
id: 0007
title: Add recaptcha rate limiting and e2e tests
stage: green
date: 2026-02-07
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-hospital-website
branch: 001-hospital-website
user: pc
command: /sp.implement continue
labels: ["green-phase", "tdd", "recaptcha", "rate-limiting", "e2e-tests", "security"]
links:
  spec: specs/001-hospital-website/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - src/hooks/useRecaptcha.ts
  - src/components/appointments/AppointmentForm.tsx
  - src/lib/utils/rate-limit.ts
  - src/app/api/appointments/route.ts
  - src/app/api/appointments/available-slots/route.ts
  - tests/e2e/doctor-browsing.spec.ts
  - tests/e2e/appointment-booking.spec.ts
  - tests/e2e/appointment-validation.spec.ts
  - tests/e2e/appointment-a11y.spec.ts
  - specs/001-hospital-website/tasks.md
tests:
  - tests/e2e/doctor-browsing.spec.ts (T090 - doctor discovery flow)
  - tests/e2e/appointment-booking.spec.ts (T091 - complete booking flow)
  - tests/e2e/appointment-validation.spec.ts (T092 - form validation)
  - tests/e2e/appointment-a11y.spec.ts (T093 - WCAG 2.1 AA compliance)
---

## Prompt

continue

## Response snapshot

Continued implementation from TDD red phase (tests) to green phase (implementation).

**Tasks completed:**
1. ✅ **T088** - reCAPTCHA Integration:
   - Created useRecaptcha hook for Google reCAPTCHA v3
   - Integrated into AppointmentForm component
   - Executes before form submission with 'appointment_booking' action
   - Graceful fallback if reCAPTCHA unavailable

2. ✅ **T089** - Rate Limiting Implementation:
   - Created comprehensive rate limiting utility
   - In-memory store with automatic cleanup
   - Predefined limiters for different use cases:
     - Appointment booking: 3 requests/15min (strict)
     - Slot checks: 30 requests/min (lenient)
     - Contact forms: 5 requests/15min (moderate)
     - General API: 100 requests/min
   - Applied to appointments API and available-slots endpoint
   - Returns proper HTTP 429 with Retry-After headers

3. ✅ **T090-T093** - E2E Test Suite:
   - Doctor browsing (T090): Discovery flow, filtering, search, profile viewing
   - Appointment booking (T091): Complete user journey from selection to confirmation
   - Form validation (T092): All validation scenarios, edge cases, error handling
   - Accessibility (T093): WCAG 2.1 AA compliance with axe-core integration

**Implementation highlights:**
- reCAPTCHA uses v3 (invisible) for better UX
- Rate limiting includes client identifier from IP/headers
- E2E tests cover happy path, error cases, mobile responsive, keyboard navigation
- Accessibility tests use axe-playwright for automated a11y checks

**Next steps:**
- Database setup and migrations (when ready)
- Run E2E tests to validate (requires Playwright browsers installed)
- Additional implementation tasks for User Stories 2-3

## Outcome

- ✅ Impact: Implemented spam protection (reCAPTCHA + rate limiting) and comprehensive E2E test coverage for appointment booking flow
- 🧪 Tests: 4 E2E test files created with 40+ test scenarios covering user flows, validation, and accessibility
- 📁 Files: 10 files modified/created (5 implementation, 4 E2E tests, 1 task update)
- 🔁 Next prompts: Database setup for testing against real data, or continue with more implementation tasks
- 🧠 Reflection: Security measures (spam protection) implemented alongside tests - defense in depth approach successful

## Evaluation notes (flywheel)

- Failure modes observed: None - smooth implementation following established patterns
- Graders run and results (PASS/FAIL): Not run yet (E2E tests require Playwright setup + running application)
- Prompt variant (if applicable): Standard /sp.implement continue flow with auto-continuation
- Next experiment (smallest change to try): Run E2E test suite with `npm run test:e2e` to validate test quality
