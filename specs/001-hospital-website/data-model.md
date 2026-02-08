# Data Model: Multi-Hospital Marketing & Patient Acquisition Website

**Date**: 2026-02-02
**Feature**: 001-hospital-website
**Database**: PostgreSQL 15+ with Prisma ORM 5+

## Overview

This document defines the database schema for the hospital website platform. The data model supports configuration-based multi-hospital deployment, specialty-based doctor organization, service categories, appointment booking, and content management.

**Important**: The public website stores NO Protected Health Information (PHI). Appointment booking collects only basic contact information (name, phone, email, reason) which is NOT considered PHI until the appointment is confirmed by hospital staff.

---

## Entity Relationship Diagram (ERD)

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────────┐
│   Doctor    │──────<│ DoctorSpecialty  │>──────│ MedicalSpecialty│
└─────────────┘       └──────────────────┘       └─────────────────┘
       │
       │
       ├──────<│ DoctorDepartment │>──────┐
       │                                   │
       │                              ┌────────────┐
       │                              │ Department │
       │                              └────────────┘
       │
       ├──────< OPDSchedule
       │
       └──────< Appointment
                     │
                     └─── (No patient medical records)


┌────────────────┐       ┌─────────┐
│ ServiceCategory│──────<│ Service │
└────────────────┘       └─────────┘


┌──────────┐
│ BlogPost │
└──────────┘

┌───────────────┐
│ ContactInquiry│
└───────────────┘

┌──────────────────┐
│ HeroCarouselImage│
└──────────────────┘
```

---

## Core Entities

### 1. Doctor

Represents medical professionals working at the hospital.

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Unique identifier |
| name | String | NOT NULL | Full name |
| slug | String | UNIQUE, NOT NULL | URL-friendly identifier |
| designation | String | NOT NULL | e.g., "Senior Consultant", "Chief Surgeon" |
| qualifications | Text | NOT NULL | e.g., "MBBS, MD, FRCS" |
| experience | Integer | NOT NULL | Years of experience |
| photo | String | NULL | Photo URL/path |
| consultationFee | Decimal | NULL | Optional consultation fee |
| languages | String[] | DEFAULT [] | Languages spoken |
| bio | Text | NULL | Doctor biography |
| active | Boolean | DEFAULT true | Active status (soft delete) |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |

**Relationships**:
- Many-to-Many with `MedicalSpecialty` through `DoctorSpecialty`
- Many-to-Many with `Department` through `DoctorDepartment`
- One-to-Many with `OPDSchedule`
- One-to-Many with `Appointment`

**Indexes**:
- `@@index([slug])` - For URL lookups
- `@@index([active])` - For filtering active doctors

**Validation Rules**:
- `name`: 2-100 characters
- `slug`: lowercase, alphanumeric with hyphens
- `experience`: >= 0
- `consultationFee`: >= 0 if provided

---

### 2. MedicalSpecialty

Represents medical specialty categories for doctor organization (ENT, Cardiology, Pediatrics, etc.).

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Unique identifier |
| name | String | UNIQUE, NOT NULL | e.g., "ENT", "Cardiology", "Pediatrics" |
| slug | String | UNIQUE, NOT NULL | URL-friendly identifier |
| description | Text | NULL | Specialty description |
| commonConditions | String[] | DEFAULT [] | Common conditions treated |
| icon | String | NULL | Icon URL/path |
| displayOrder | Integer | DEFAULT 0 | Sort order for display |
| active | Boolean | DEFAULT true | Active status |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |

**Relationships**:
- Many-to-Many with `Doctor` through `DoctorSpecialty`

**Indexes**:
- `@@index([slug])` - For URL lookups
- `@@index([displayOrder])` - For sorted display

**Predefined Specialties**:
- ENT (Ear, Nose, Throat)
- Gynecology & Obstetrics
- Pediatrics
- Gastroenterology
- Cardiology
- Orthopedics
- Neurology
- Dermatology
- Ophthalmology
- Urology
- Psychiatry
- General Medicine
- General Surgery

---

### 3. DoctorSpecialty (Join Table)

Links doctors to their medical specialties. Supports multiple specialties per doctor.

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| doctorId | String | FK → Doctor.id | Doctor reference |
| specialtyId | String | FK → MedicalSpecialty.id | Specialty reference |
| isPrimary | Boolean | DEFAULT false | Primary specialty flag |

**Composite Primary Key**: `[doctorId, specialtyId]`

**Indexes**:
- `@@index([specialtyId])` - For querying doctors by specialty

**Cascade Rules**:
- ON DELETE CASCADE - Delete join when doctor or specialty deleted

---

### 4. Department

Represents hospital departments or divisions.

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Unique identifier |
| name | String | UNIQUE, NOT NULL | e.g., "Cardiology Department" |
| slug | String | UNIQUE, NOT NULL | URL-friendly identifier |
| description | Text | NULL | Department description |
| icon | String | NULL | Icon URL/path |
| image | String | NULL | Department image |
| displayOrder | Integer | DEFAULT 0 | Sort order for display |
| active | Boolean | DEFAULT true | Active status |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |

**Relationships**:
- Many-to-Many with `Doctor` through `DoctorDepartment`
- One-to-Many with `Service`

**Indexes**:
- `@@index([slug])` - For URL lookups

---

### 5. DoctorDepartment (Join Table)

Links doctors to departments.

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| doctorId | String | FK → Doctor.id | Doctor reference |
| departmentId | String | FK → Department.id | Department reference |

**Composite Primary Key**: `[doctorId, departmentId]`

**Cascade Rules**:
- ON DELETE CASCADE

---

### 6. OPDSchedule

Defines doctor availability for outpatient consultations.

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Unique identifier |
| doctorId | String | FK → Doctor.id, NOT NULL | Doctor reference |
| dayOfWeek | Integer | NOT NULL | 0=Sunday, 1=Monday, ... 6=Saturday |
| startTime | String | NOT NULL | e.g., "09:00" |
| endTime | String | NOT NULL | e.g., "12:00" |
| slotDuration | Integer | DEFAULT 15 | Minutes per slot |
| active | Boolean | DEFAULT true | Schedule active status |

**Indexes**:
- `@@index([doctorId, dayOfWeek])` - For querying doctor's weekly schedule

**Validation Rules**:
- `dayOfWeek`: 0-6
- `startTime`, `endTime`: HH:MM format
- `slotDuration`: > 0

**Example**:
```
Dr. Smith - Monday (1) - 09:00 to 12:00 - 15 min slots
Dr. Smith - Wednesday (3) - 14:00 to 17:00 - 20 min slots
```

---

### 7. Appointment

Represents patient appointment bookings. **NO PHI stored** (only basic contact info).

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Unique identifier |
| patientName | String | NOT NULL | Patient full name (NOT PHI) |
| patientPhone | String | NOT NULL | Patient phone (NOT PHI) |
| patientEmail | String | NOT NULL | Patient email (NOT PHI) |
| reasonForVisit | String | NULL | Brief reason (NOT PHI) |
| appointmentDate | DateTime | NOT NULL | Appointment date |
| appointmentTime | String | NOT NULL | Appointment time (HH:MM) |
| status | String | DEFAULT "pending" | pending, confirmed, cancelled, completed |
| smsSent | Boolean | DEFAULT false | SMS confirmation sent |
| emailSent | Boolean | DEFAULT false | Email confirmation sent |
| hmsAppointmentId | String | UNIQUE, NULL | HMS system appointment ID (if integrated) |
| notes | Text | NULL | Internal notes (staff only) |
| createdAt | DateTime | DEFAULT now() | Booking timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |
| doctorId | String | FK → Doctor.id, NOT NULL | Doctor reference |

**Relationships**:
- Many-to-One with `Doctor`

**Indexes**:
- `@@index([doctorId, appointmentDate])` - For querying doctor's appointments by date
- `@@index([status])` - For filtering by status
- `@@index([patientEmail])` - For patient lookup

**Validation Rules**:
- `patientName`: 2-100 characters
- `patientPhone`: Valid phone number format
- `patientEmail`: Valid email format
- `status`: enum ["pending", "confirmed", "cancelled", "completed"]
- `appointmentDate`: Future date only (for new bookings)

**Privacy Note**: This entity does NOT contain Protected Health Information (PHI). Patient medical records are managed by HMS, not this website.

---

### 8. ServiceCategory

Represents hospital service categories (Laboratory, Pharmacy, Radiology, Emergency, ICU, etc.).

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Unique identifier |
| name | String | UNIQUE, NOT NULL | e.g., "Laboratory Services", "Pharmacy" |
| slug | String | UNIQUE, NOT NULL | URL-friendly identifier |
| description | Text | NULL | Category description |
| icon | String | NULL | Icon URL/path |
| metadata | JSON | NULL | Flexible category-specific data |
| displayOrder | Integer | DEFAULT 0 | Sort order |
| active | Boolean | DEFAULT true | Active status |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |

**Relationships**:
- One-to-Many with `Service`

**Indexes**:
- `@@index([slug])` - For URL lookups

**Predefined Categories**:
- Laboratory Services
- Pharmacy Services
- Radiology & Imaging
- Emergency Services
- ICU / Critical Care
- Operation Theaters
- Diagnostic Services
- Rehabilitation Services

**Metadata Examples** (JSON field for category-specific data):
```json
// Laboratory
{
  "collectionTiming": "Mon-Sat 7:00 AM - 11:00 AM",
  "reportDelivery": "24-48 hours",
  "homeCollection": true,
  "tests": ["CBC", "LFT", "Blood Sugar", "Lipid Profile"]
}

// Pharmacy
{
  "hours": "24/7",
  "location": "Ground Floor, Main Building",
  "prescriptionRequired": true
}

// Radiology
{
  "services": ["X-ray", "CT Scan", "MRI", "Ultrasound", "Mammography"],
  "equipment": {
    "mri": "1.5T Siemens MRI Scanner",
    "ct": "64-slice CT Scanner"
  }
}

// Emergency
{
  "availability": "24/7",
  "ambulanceService": true,
  "traumaCare": true,
  "emergencyNumber": "+1-555-EMERGENCY"
}

// ICU
{
  "types": ["MICU", "CCU", "NICU", "PICU"],
  "bedCapacity": 20,
  "ventilators": 15,
  "visitingHours": "4:00 PM - 5:00 PM"
}
```

---

### 9. Service

Individual services offered by the hospital.

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Unique identifier |
| name | String | NOT NULL | Service name |
| slug | String | UNIQUE, NOT NULL | URL-friendly identifier |
| description | Text | NULL | Service description |
| benefits | String[] | DEFAULT [] | Service benefits |
| procedureOverview | Text | NULL | Procedure description |
| image | String | NULL | Service image |
| active | Boolean | DEFAULT true | Active status |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |
| categoryId | String | FK → ServiceCategory.id | Category reference |
| departmentId | String | FK → Department.id, NULL | Related department |

**Relationships**:
- Many-to-One with `ServiceCategory`
- Many-to-One with `Department` (optional)

**Indexes**:
- `@@index([slug])` - For URL lookups
- `@@index([categoryId])` - For filtering by category

---

### 10. BlogPost

Health articles and hospital news/updates.

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Unique identifier |
| title | String | NOT NULL | Post title |
| slug | String | UNIQUE, NOT NULL | URL-friendly identifier |
| content | Text | NOT NULL | Post content (HTML/Markdown) |
| excerpt | String | NULL | Brief summary |
| featuredImage | String | NULL | Featured image URL |
| author | String | NOT NULL | Author name |
| category | String | NULL | Post category |
| tags | String[] | DEFAULT [] | Post tags |
| publishedAt | DateTime | NULL | Publication date |
| active | Boolean | DEFAULT true | Published status |
| viewCount | Integer | DEFAULT 0 | View counter |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |

**Indexes**:
- `@@index([slug])` - For URL lookups
- `@@index([publishedAt])` - For chronological listing
- `@@index([category])` - For category filtering

---

### 11. ContactInquiry

Contact form submissions from website visitors.

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Unique identifier |
| name | String | NOT NULL | Inquirer name |
| email | String | NOT NULL | Inquirer email |
| phone | String | NULL | Inquirer phone |
| subject | String | NULL | Inquiry subject |
| message | Text | NOT NULL | Inquiry message |
| status | String | DEFAULT "new" | new, in_progress, resolved |
| response | Text | NULL | Staff response |
| createdAt | DateTime | DEFAULT now() | Submission timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |

**Indexes**:
- `@@index([status])` - For filtering by status
- `@@index([email])` - For tracking inquiries by email

**Validation Rules**:
- `name`: 2-100 characters
- `email`: Valid email format
- `message`: 10-5000 characters
- `status`: enum ["new", "in_progress", "resolved"]

---

### 12. HeroCarouselImage

Images displayed in homepage hero carousel.

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Unique identifier |
| imageUrl | String | NOT NULL | Image URL/path |
| altText | String | NOT NULL | Alt text for accessibility |
| caption | String | NULL | Image caption |
| imageType | String | NOT NULL | staff, facility, equipment, care |
| displayOrder | Integer | NOT NULL | Sort order for carousel |
| active | Boolean | DEFAULT true | Active status |
| createdAt | DateTime | DEFAULT now() | Creation timestamp |
| updatedAt | DateTime | AUTO | Last update timestamp |

**Indexes**:
- `@@index([displayOrder])` - For carousel ordering
- `@@index([active])` - For filtering active images

**Validation Rules**:
- `imageType`: enum ["staff", "facility", "equipment", "care"]
- `displayOrder`: unique per hospital deployment

---

## Database Migrations Strategy

**Migration Workflow**:
1. Create migration: `npx prisma migrate dev --name add_specialties`
2. Apply to production: `npx prisma migrate deploy`
3. Seed data: `npx prisma db seed`

**Seeding Strategy**:
- Seed predefined specialties (ENT, Cardiology, Pediatrics, etc.)
- Seed service categories (Laboratory, Pharmacy, Radiology, etc.)
- Seed sample doctors and departments (development only)

---

## Data Retention & Privacy

**Retention Policies**:
- **Appointments**: Retain completed appointments for 1 year, then archive
- **Contact Inquiries**: Retain resolved inquiries for 6 months
- **Blog Posts**: Retain indefinitely (soft delete)
- **Doctors/Departments/Services**: Soft delete (set active=false)

**Privacy Compliance**:
- NO Protected Health Information (PHI) stored on public website
- Appointment contact info (name, phone, email, reason) is NOT PHI until confirmed
- Patient medical records managed by HMS, not this database
- GDPR: Support data export and deletion requests
- Log access to appointment data for audit trail

---

## Performance Optimization

**Indexing Strategy**:
- Index all foreign keys
- Index frequently queried fields (slug, status, active)
- Compound indexes for common query patterns (doctorId + appointmentDate)

**Query Optimization**:
- Use Prisma's `select` to retrieve only needed fields
- Implement pagination for listings (doctors, blog posts)
- Cache frequently accessed data (specialties, service categories)
- Use database connection pooling (PgBouncer or Prisma's built-in pooling)

**Estimated Scale**:
- 50-200 doctors per hospital
- 10-30 specialties
- 20-50 services
- 100-1000 appointments/month
- 10-100 blog posts

---

## Summary

**Total Entities**: 12
- **Core**: Doctor, MedicalSpecialty, Department, OPDSchedule, Appointment
- **Services**: ServiceCategory, Service
- **Content**: BlogPost, ContactInquiry, HeroCarouselImage
- **Join Tables**: DoctorSpecialty, DoctorDepartment

**Relationships**: Well-structured with proper foreign keys and cascade rules

**Privacy**: NO PHI storage - compliant with healthcare regulations for public website

**Performance**: Properly indexed for expected query patterns and scale

Data model complete and ready for implementation.