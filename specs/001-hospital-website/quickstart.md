# Quickstart Guide: Hospital Website Development

**Feature**: 001-hospital-website
**Date**: 2026-02-02

## Prerequisites

- **Node.js**: 20 LTS or higher
- **Package Manager**: npm, yarn, or pnpm
- **Database**: PostgreSQL 15+ (local or cloud)
- **Git**: For version control
- **Code Editor**: VS Code recommended (with extensions: Prisma, Tailwind CSS IntelliSense, ESLint)

---

## Initial Setup

### 1. Clone Repository and Install Dependencies

```bash
# Navigate to project directory
cd hospital_website

# Install dependencies
npm install

# Or with yarn
yarn install

# Or with pnpm
pnpm install
```

### 2. Environment Configuration

Create `.env.local` file in the root directory:

```bash
# Copy example environment file
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hospital_website_dev"

# Hospital Configuration
HOSPITAL_ID="abc-general"  # Matches config file in config/hospitals/

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# CMS (Sanity)
NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="your_api_token"

# SMS (Twilio)
TWILIO_ACCOUNT_SID="your_account_sid"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_PHONE_NUMBER="+1-555-0000"

# Email (SendGrid)
SENDGRID_API_KEY="your_api_key"
SENDGRID_FROM_EMAIL="noreply@abchospital.com"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_maps_api_key"

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your_site_key"
RECAPTCHA_SECRET_KEY="your_secret_key"

# Analytics (Optional)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# HMS Integration (Optional)
HMS_API_URL="https://hms.example.com/api"
HMS_API_KEY="your_hms_api_key"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database with initial data
npx prisma db seed
```

### 4. Hospital Configuration

Create or edit hospital configuration file:

```bash
# Copy template
cp config/hospitals/template.yaml config/hospitals/abc-general.yaml

# Edit configuration
# Update hospital name, branding, contact info, features, etc.
```

Minimal configuration example:

```yaml
# config/hospitals/abc-general.yaml
hospital:
  id: "abc-general"
  name: "ABC General Hospital"
  tagline: "Your Health, Our Priority"
  logo: "/assets/abc-general/logo.png"
  favicon: "/assets/abc-general/favicon.ico"
  domain: "localhost:3000"

branding:
  colors:
    primary: "#0066CC"
    secondary: "#00A859"
    accent: "#FF6B35"

contact:
  phone: "+1-555-HOSPITAL"
  emergency: "+1-555-EMERGENCY"
  email: "info@abchospital.com"
  address:
    street: "123 Medical Center Blvd"
    city: "City Name"
    state: "State"
    zip: "12345"

features:
  appointmentBooking: true
  patientPortal: false
  blog: true
```

---

## Development

### Run Development Server

```bash
# Start development server
npm run dev

# Server runs at http://localhost:3000
```

### Available Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "format": "prettier --write .",
  "type-check": "tsc --noEmit",
  "test": "vitest",
  "test:unit": "vitest run --coverage",
  "test:e2e": "playwright test",
  "db:generate": "prisma generate",
  "db:migrate": "prisma migrate dev",
  "db:seed": "prisma db seed",
  "db:studio": "prisma studio"
}
```

### Key Development Workflows

**Adding a New Doctor**:
```bash
# Option 1: Via Sanity CMS
# Navigate to http://localhost:3333/studio (if Sanity configured)
# Add doctor with: name, specialties, qualifications, OPD schedule

# Option 2: Via Prisma Studio
npx prisma studio
# Navigate to Doctor model, add new record
```

**Adding a New Specialty**:
```typescript
// Update database via Prisma Studio or seed script
const specialty = await prisma.medicalSpecialty.create({
  data: {
    name: "Cardiology",
    slug: "cardiology",
    description: "Heart and cardiovascular system specialists",
    commonConditions: ["Heart disease", "Hypertension", "Arrhythmia"],
  },
});
```

**Booking an Appointment (Test)**:
```bash
# Start dev server
npm run dev

# Navigate to http://localhost:3000/appointments
# Fill form and submit
# Check console logs for SMS/Email (dev mode logs instead of sending)
```

---

## Project Structure

```
hospital_website/
├── config/                    # Hospital configurations
│   └── hospitals/
│       └── abc-general.yaml
├── prisma/                    # Database schema and migrations
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/                    # Static assets
│   └── assets/
│       └── abc-general/
│           ├── logo.png
│           └── hero-images/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── page.tsx           # Homepage
│   │   ├── doctors/           # Doctors pages
│   │   ├── specialties/       # Specialties pages
│   │   ├── appointments/      # Appointment booking
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── common/
│   │   ├── layout/
│   │   ├── hero/
│   │   └── doctors/
│   ├── lib/                   # Utilities and services
│   │   ├── config.ts
│   │   ├── prisma.ts
│   │   ├── sms.ts
│   │   └── email.ts
│   └── types/                 # TypeScript types
└── tests/                     # Test files
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## Testing

### Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run in watch mode
npm run test

# Run specific test file
npx vitest src/lib/validation.test.ts
```

### E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npx playwright test --ui

# Run specific test
npx playwright test tests/e2e/appointment-booking.spec.ts
```

### Performance Testing

```bash
# Run Lighthouse CI
npm run lighthouse
```

---

## Common Tasks

### Add New Page

```bash
# Create new page component
touch src/app/new-page/page.tsx
```

```typescript
// src/app/new-page/page.tsx
export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
}

// Automatic routing at /new-page
```

### Add New API Route

```bash
# Create API route
touch src/app/api/new-endpoint/route.ts
```

```typescript
// src/app/api/new-endpoint/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello' });
}

export async function POST(request: Request) {
  const body = await request.json();
  // Handle POST
  return NextResponse.json({ success: true });
}
```

### Update Database Schema

```typescript
// Edit prisma/schema.prisma
model NewModel {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
}

// Generate migration
npx prisma migrate dev --name add_new_model

// Generate Prisma Client
npx prisma generate
```

### Configure New Hospital

```bash
# Copy template
cp config/hospitals/template.yaml config/hospitals/new-hospital.yaml

# Edit configuration
# Update HOSPITAL_ID in .env.local
HOSPITAL_ID="new-hospital"

# Restart dev server
npm run dev
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql $DATABASE_URL

# Reset database (DESTRUCTIVE)
npx prisma migrate reset
```

### Prisma Client Errors

```bash
# Regenerate Prisma Client
npx prisma generate

# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### TypeScript Errors

```bash
# Run type check
npm run type-check

# Clear Next.js cache
rm -rf .next
npm run dev
```

### Build Errors

```bash
# Clean build
rm -rf .next
npm run build

# Check for errors in build output
```

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Environment Variables**: Add all `.env.local` variables to Vercel project settings

### Self-Hosted

```bash
# Build production bundle
npm run build

# Start production server
npm run start

# Or use PM2
pm2 start npm --name "hospital-website" -- start
```

---

## Next Steps

1. **Review Specification**: Read `specs/001-hospital-website/spec.md`
2. **Review Data Model**: Read `specs/001-hospital-website/data-model.md`
3. **Implement Tasks**: Run `/sp.tasks` to generate implementation tasks
4. **Follow TDD**: Write tests before implementation
5. **Review Constitution**: Ensure compliance with `

.specify/memory/constitution.md`

---

## Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Playwright**: https://playwright.dev/
- **Project Spec**: `specs/001-hospital-website/spec.md`
- **API Contracts**: `specs/001-hospital-website/contracts/`

---

## Support

For questions or issues:
1. Check specification and planning documents
2. Review constitution for development guidelines
3. Consult Next.js/Prisma documentation
4. Check existing tests for usage examples

Happy coding! 🏥