# Database Setup Guide

## Overview

This project uses **PostgreSQL** with **Prisma ORM** for database management. The schema supports a **multi-hospital platform** with comprehensive healthcare management features.

## Prerequisites

- **PostgreSQL 15+** installed and running
- **Node.js 20+** and npm 10+

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database Connection

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Update the `DATABASE_URL` in `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/hospital_website?schema=public"
```

**Replace:**
- `username` - Your PostgreSQL username
- `password` - Your PostgreSQL password
- `hospital_website` - Your database name

### 3. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE hospital_website;

# Exit psql
\q
```

### 4. Run Migrations

```bash
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Create database schema
```

When prompted for migration name, enter: `init_hospital_schema`

### 5. Seed Database

```bash
npm run prisma:seed
```

This will populate the database with:
- ✅ Sample hospital (ABC General Hospital)
- ✅ 13 Medical specialties
- ✅ 8 Service categories
- ✅ 5 Departments
- ✅ 2 Branches
- ✅ 4 Facilities
- ✅ 3 Patient testimonials
- ✅ 3 Certifications
- ✅ 2 Job postings
- ✅ 5 FAQs

### 6. Verify Setup

```bash
npm run prisma:studio
```

This opens Prisma Studio at `http://localhost:5555` to browse your database.

## Database Schema

### Core Entities

#### Hospital
Multi-tenant support for different hospitals/clinics.
- Hospital details (name, logo, branding, contact)
- Location (address, coordinates)
- Accreditations and licenses

#### Doctor
Medical professionals with:
- Profile information (name, photo, bio, qualifications)
- Consultation fees and languages
- OPD schedules
- Specialty and department associations

#### Department
Hospital departments (Cardiology, Emergency, etc.)
- Department details and descriptions
- Service offerings
- Doctor assignments

#### Appointment
Patient appointment bookings:
- Patient contact information (NO PHI)
- Date, time, and status tracking
- SMS/Email confirmation tracking
- HMS integration support

### Supporting Entities

- **MedicalSpecialty** - Medical specializations (ENT, Cardiology, etc.)
- **Service** & **ServiceCategory** - Hospital services (Lab, Pharmacy, etc.)
- **Branch** - Multiple hospital locations
- **Facility** - Equipment and infrastructure (ICU, MRI, OT)
- **Testimonial** - Patient reviews and feedback
- **Certification** - Accreditations and awards
- **JobPosting** - Career opportunities
- **FAQ** - Frequently asked questions
- **BlogPost** - Health articles and news
- **ContactInquiry** - Website contact form submissions
- **HeroCarouselImage** - Homepage carousel images

## Common Commands

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create a new migration
npm run prisma:migrate

# Deploy migrations (production)
npm run prisma:migrate:deploy

# Seed database with sample data
npm run prisma:seed

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Reset database (⚠️ DESTRUCTIVE - development only)
npx prisma migrate reset
```

## Schema Modifications

1. Edit `prisma/schema.prisma`
2. Run `npm run prisma:generate`
3. Create migration: `npm run prisma:migrate`
4. Update seed file if needed: `prisma/seed.ts`

## Multi-Hospital Configuration

Each hospital is isolated by `hospitalId` foreign key:
- Doctors, Departments, Facilities are hospital-specific
- Shared entities: MedicalSpecialty, ServiceCategory, FAQ
- Configure hospital via `HOSPITAL_ID` environment variable

## Production Deployment

### Recommended: PostgreSQL on Cloud

- **Neon** - Serverless PostgreSQL (Free tier available)
- **Supabase** - PostgreSQL with extras (Free tier available)
- **AWS RDS** - Managed PostgreSQL
- **Railway** - Simple PostgreSQL deployment
- **Vercel Postgres** - Built-in with Vercel

### Steps

1. Provision PostgreSQL database on your cloud provider
2. Copy connection string to `DATABASE_URL` in production environment
3. Run migrations:
   ```bash
   npm run prisma:migrate:deploy
   ```
4. Seed production data (customize `seed.ts` for production)

## Security Notes

- ✅ **NO PHI stored** - Patient appointments store only contact info
- ✅ HMS integration via `hmsAppointmentId` reference
- ✅ All sensitive data in `.env` (never commit)
- ✅ Use connection pooling for production (Prisma Accelerate or PgBouncer)

## Backup & Recovery

```bash
# Backup database
pg_dump -U username hospital_website > backup.sql

# Restore database
psql -U username hospital_website < backup.sql
```

## Troubleshooting

### Migration fails
```bash
# Reset and retry (⚠️ development only)
npx prisma migrate reset
npm run prisma:migrate
```

### Connection refused
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check DATABASE_URL format
- Verify database exists

### Seed fails
- Ensure migrations are applied first
- Check for unique constraint violations
- Review seed.ts for errors

## Support

For issues or questions:
- Check Prisma docs: https://www.prisma.io/docs
- Review schema: `prisma/schema.prisma`
- Inspect seed data: `prisma/seed.ts`

---

**Database Version:** PostgreSQL 15+
**ORM:** Prisma 5.20+
**Last Updated:** 2026-02-07
