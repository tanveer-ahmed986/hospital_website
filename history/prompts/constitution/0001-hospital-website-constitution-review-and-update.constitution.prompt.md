---
id: 0001
title: Hospital website constitution review and update
stage: constitution
date: 2026-02-02
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: user
command: /sp.constitution
labels: ["constitution", "healthcare", "hospital", "compliance", "HIPAA", "multi-tenant"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - No tests run (documentation update)
---

## Prompt

i am creating this website for hospitals. initially hospiatal name is 'ABC General Hospital', later it will be changed as per clients requests. check the constitution is fit for hospital website or modification is required?

## Response snapshot

**Analysis**: The existing constitution v1.7.0 is a "Universal Website Constitution" that covers multiple website types (e-commerce, SaaS, blogs, portfolios, schools, etc.) but does NOT include a specific section for hospital/healthcare websites.

**Action Taken**: Added comprehensive "Hospital Websites & Healthcare Platforms" section to constitution (v1.7.0 → v1.8.0).

**New Section Includes**:

1. **Multi-Hospital Architecture** - Configuration-based approach for deploying single codebase to multiple hospitals with per-hospital customization (name, branding, domain, content)

2. **Healthcare Compliance** - Comprehensive HIPAA, HITECH, and GDPR compliance requirements for handling Protected Health Information (PHI)

3. **Core Healthcare Features**:
   - Online appointment booking system
   - Doctor profiles and listings
   - Department and service showcases
   - Patient portal integration (HMS)
   - Emergency contact systems
   - Trust-building elements (certifications, testimonials)

4. **Configuration File Approach** - YAML/JSON-based hospital configuration for easy multi-hospital deployment (supports "ABC General Hospital" → "XYZ Specialty Clinic" with config changes only)

5. **Healthcare-Specific Requirements**:
   - Trust and credibility requirements
   - Healthcare SEO optimization (schema markup for medical entities)
   - Enhanced accessibility for diverse patient populations
   - Multi-language support
   - Mobile-first design (majority of patients use mobile)
   - AI safety for healthcare chatbots (no medical advice)

6. **Security & Privacy** - Distinction between public website (minimal compliance) and patient portal (full HIPAA compliance)

7. **Recommended Tech Stacks**:
   - Next.js (recommended for most)
   - Django (healthcare-industry proven)
   - FastAPI + Next.js (AI-ready, scalable)

8. **Database Design** - Configuration-based vs multi-tenant approaches with healthcare-specific schema considerations

**Version Bump Rationale**: MINOR version bump (1.7.0 → 1.8.0) - Added new substantial section (Hospital Websites) without breaking changes to existing principles.

## Outcome

- ✅ Impact: Constitution now fully supports hospital website requirements with comprehensive healthcare-specific guidance
- 🧪 Tests: No tests required (documentation-only change)
- 📁 Files: Modified .specify/memory/constitution.md (added ~600 lines for hospital websites section)
- 🔁 Next prompts: Consider creating hospital website spec.md, plan.md, or tasks.md using updated constitution as guidance
- 🧠 Reflection: The constitution's modular "Website Type Adaptations" section made it straightforward to add hospital requirements following the established pattern from School Websites section. The configuration-based multi-hospital approach aligns perfectly with user's requirement for "ABC General Hospital" name changes per client.

## Evaluation notes (flywheel)

- Failure modes observed: None - successful constitution amendment following established patterns
- Graders run and results (PASS/FAIL): N/A (documentation update, no code)
- Prompt variant (if applicable): Standard /sp.constitution command
- Next experiment (smallest change to try): User can now proceed with /sp.specify to create hospital website specification using the updated constitution principles
