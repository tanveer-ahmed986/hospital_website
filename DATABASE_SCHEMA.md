# Database Schema Reference

## Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MULTI-HOSPITAL PLATFORM                          │
└─────────────────────────────────────────────────────────────────────────┘

                                 ┌──────────────┐
                                 │   Hospital   │
                                 ├──────────────┤
                                 │ id           │
                                 │ name         │
                                 │ slug         │
                                 │ domain       │
                                 │ logo         │
                                 │ branding     │
                                 │ contact      │
                                 │ location     │
                                 └──────────────┘
                                        │
                 ┌──────────────────────┼──────────────────────┐
                 │                      │                      │
            ┌────▼────┐          ┌─────▼─────┐         ┌─────▼─────┐
            │ Doctor  │          │Department │         │  Branch   │
            └─────────┘          └───────────┘         └───────────┘
                 │                      │
                 │                      │
            ┌────▼────┐          ┌─────▼─────┐
            │  OPD    │          │  Service  │
            │Schedule │          └───────────┘
            └─────────┘
                 │
            ┌────▼────────┐
            │ Appointment │
            └─────────────┘
```

## Core Tables

### Hospital (Multi-Tenant Root)
Central entity for multi-hospital support.

| Field          | Type      | Description                      |
|----------------|-----------|----------------------------------|
| id             | String    | Primary key (cuid)               |
| name           | String    | Hospital name                    |
| slug           | String    | URL-friendly identifier (unique) |
| domain         | String?   | Custom domain (unique)           |
| logo           | String?   | Logo URL                         |
| tagline        | String?   | Hospital tagline                 |
| brandColors    | JSON?     | Primary, secondary, accent       |
| contactEmail   | String    | Contact email                    |
| contactPhone   | String    | Contact phone                    |
| emergencyPhone | String?   | Emergency contact                |
| address        | String?   | Full address                     |
| latitude       | Decimal?  | GPS coordinates                  |
| longitude      | Decimal?  | GPS coordinates                  |
| established    | Int?      | Year established                 |
| accreditations | String[]  | List of accreditations           |

**Relationships:**
- Has many: Doctors, Departments, Branches, Facilities, Testimonials, Certifications, JobPostings

---

### Doctor
Medical professionals in the hospital.

| Field           | Type      | Description                          |
|-----------------|-----------|--------------------------------------|
| id              | String    | Primary key (cuid)                   |
| hospitalId      | String    | FK to Hospital                       |
| name            | String    | Doctor's full name                   |
| slug            | String    | URL-friendly identifier (unique)     |
| designation     | String    | E.g., "Senior Consultant"            |
| qualifications  | String    | E.g., "MBBS, MD, FRCS"               |
| experience      | Int       | Years of experience                  |
| photo           | String?   | Photo URL                            |
| consultationFee | Decimal?  | Consultation fee (optional)          |
| languages       | String[]  | Languages spoken                     |
| bio             | Text?     | Biography                            |
| active          | Boolean   | Is doctor currently active           |

**Relationships:**
- Belongs to: Hospital
- Has many: Specialties (via DoctorSpecialty), Departments (via DoctorDepartment), OPDSchedules, Appointments

---

### Department
Hospital departments or divisions.

| Field        | Type    | Description                      |
|--------------|---------|----------------------------------|
| id           | String  | Primary key (cuid)               |
| hospitalId   | String  | FK to Hospital                   |
| name         | String  | Department name                  |
| slug         | String  | URL-friendly identifier          |
| description  | Text?   | Department description           |
| icon         | String? | Icon URL                         |
| image        | String? | Department image                 |
| displayOrder | Int     | Display order on website         |
| active       | Boolean | Is department currently active   |

**Relationships:**
- Belongs to: Hospital
- Has many: Doctors (via DoctorDepartment), Services

---

### Appointment
Patient appointment bookings (NO PHI).

| Field             | Type     | Description                           |
|-------------------|----------|---------------------------------------|
| id                | String   | Primary key (cuid)                    |
| doctorId          | String   | FK to Doctor                          |
| patientName       | String   | Patient's name                        |
| patientPhone      | String   | Patient's phone                       |
| patientEmail      | String   | Patient's email                       |
| reasonForVisit    | String?  | Reason for appointment                |
| appointmentDate   | DateTime | Appointment date                      |
| appointmentTime   | String   | Time in HH:MM format                  |
| status            | String   | pending/confirmed/cancelled/completed |
| smsSent           | Boolean  | SMS notification sent                 |
| emailSent         | Boolean  | Email notification sent               |
| hmsAppointmentId  | String?  | HMS system reference (unique)         |
| notes             | Text?    | Internal notes (staff only)           |

**Relationships:**
- Belongs to: Doctor

---

## Supporting Tables

### MedicalSpecialty
Medical specialization categories (shared across hospitals).

| Field            | Type     | Description                  |
|------------------|----------|------------------------------|
| id               | String   | Primary key (cuid)           |
| name             | String   | Specialty name (unique)      |
| slug             | String   | URL-friendly identifier      |
| description      | Text?    | Specialty description        |
| commonConditions | String[] | Common conditions treated    |
| icon             | String?  | Icon URL                     |
| displayOrder     | Int      | Display order                |

**Relationships:**
- Has many: Doctors (via DoctorSpecialty)

---

### OPDSchedule
Doctor's outpatient department schedule.

| Field        | Type    | Description                    |
|--------------|---------|--------------------------------|
| id           | String  | Primary key (cuid)             |
| doctorId     | String  | FK to Doctor                   |
| dayOfWeek    | Int     | 0=Sunday, 1=Monday, ... 6=Sat  |
| startTime    | String  | Start time (HH:MM)             |
| endTime      | String  | End time (HH:MM)               |
| slotDuration | Int     | Minutes per slot (default 15)  |
| active       | Boolean | Is schedule active             |

---

### Service & ServiceCategory
Hospital services and categories.

**ServiceCategory** (shared across hospitals)
- Laboratory Services
- Pharmacy Services
- Radiology & Imaging
- Emergency Services
- ICU / Critical Care
- Operation Theaters
- Diagnostic Services
- Rehabilitation Services

**Service** (linked to Department)
- Individual services offered
- Benefits and procedure overview
- Can be department-specific

---

### Branch
Hospital branches/locations.

| Field          | Type     | Description                  |
|----------------|----------|------------------------------|
| id             | String   | Primary key (cuid)           |
| hospitalId     | String   | FK to Hospital               |
| name           | String   | Branch name                  |
| slug           | String   | URL-friendly identifier      |
| address        | String   | Full address                 |
| city           | String   | City name                    |
| phone          | String   | Branch phone                 |
| latitude       | Decimal? | GPS coordinates              |
| longitude      | Decimal? | GPS coordinates              |
| operatingHours | String?  | Operating hours (JSON/text)  |
| isMainBranch   | Boolean  | Is this the main branch      |

---

### Facility
Hospital facilities and equipment.

| Field        | Type     | Description                               |
|--------------|----------|-------------------------------------------|
| id           | String   | Primary key (cuid)                        |
| hospitalId   | String   | FK to Hospital                            |
| name         | String   | Facility name                             |
| slug         | String   | URL-friendly identifier                   |
| category     | String   | equipment/ward/diagnostic/emergency/amenity|
| description  | Text?    | Facility description                      |
| image        | String?  | Facility image                            |
| features     | String[] | List of features                          |
| capacity     | Int?     | Capacity (for wards/beds)                 |

**Examples:**
- ICU (24 beds)
- MRI Scanner (1.5T)
- Modular Operation Theaters (8 OTs)
- Emergency Ward

---

### Testimonial
Patient testimonials and reviews.

| Field        | Type     | Description                  |
|--------------|----------|------------------------------|
| id           | String   | Primary key (cuid)           |
| hospitalId   | String   | FK to Hospital               |
| patientName  | String   | Patient's name               |
| patientPhoto | String?  | Patient's photo (optional)   |
| condition    | String?  | Treated condition            |
| testimonial  | Text     | Testimonial text             |
| rating       | Int?     | Rating (1-5 stars)           |
| treatment    | String?  | Treatment received           |
| featured     | Boolean  | Show on homepage             |
| publishedAt  | DateTime?| Publication date             |

---

### Certification
Hospital certifications, accreditations, and awards.

| Field        | Type     | Description                             |
|--------------|----------|-----------------------------------------|
| id           | String   | Primary key (cuid)                      |
| hospitalId   | String   | FK to Hospital                          |
| name         | String   | Certification name                      |
| issuer       | String   | Issuing organization                    |
| type         | String   | certification/accreditation/award/partnership|
| logo         | String?  | Certification logo                      |
| description  | Text?    | Description                             |
| issuedDate   | DateTime?| Date issued                             |
| expiryDate   | DateTime?| Expiry date                             |
| verifyUrl    | String?  | Verification URL                        |

**Examples:**
- ISO 9001:2015
- JCI Accreditation
- Best Hospital Award 2025

---

### JobPosting
Career opportunities and job openings.

| Field            | Type     | Description                          |
|------------------|----------|--------------------------------------|
| id               | String   | Primary key (cuid)                   |
| hospitalId       | String   | FK to Hospital                       |
| title            | String   | Job title                            |
| slug             | String   | URL-friendly identifier              |
| department       | String   | Department name                      |
| location         | String   | Job location                         |
| employmentType   | String   | full-time/part-time/contract/internship|
| experience       | String   | Required experience (e.g., "2-5 years")|
| qualifications   | String[] | Required qualifications              |
| responsibilities | Text     | Job responsibilities                 |
| requirements     | Text     | Job requirements                     |
| benefits         | Text?    | Benefits offered                     |
| salaryRange      | String?  | Salary range (optional)              |
| applicationEmail | String   | Application email                    |
| openings         | Int      | Number of openings                   |
| closingDate      | DateTime?| Application deadline                 |

---

### FAQ
Frequently Asked Questions (shared across hospitals).

| Field        | Type    | Description                        |
|--------------|---------|------------------------------------|
| id           | String  | Primary key (cuid)                 |
| question     | String  | Question text                      |
| answer       | Text    | Answer text                        |
| category     | String  | appointments/billing/general/services|
| displayOrder | Int     | Display order                      |
| viewCount    | Int     | Number of views (analytics)        |

---

### BlogPost
Health articles and hospital news.

| Field         | Type     | Description                  |
|---------------|----------|------------------------------|
| id            | String   | Primary key (cuid)           |
| title         | String   | Article title                |
| slug          | String   | URL-friendly identifier      |
| content       | Text     | Article content (HTML/MD)    |
| excerpt       | String?  | Short excerpt                |
| featuredImage | String?  | Featured image URL           |
| author        | String   | Author name                  |
| category      | String?  | Article category             |
| tags          | String[] | Article tags                 |
| publishedAt   | DateTime?| Publication date             |
| viewCount     | Int      | Number of views              |

---

### ContactInquiry
Contact form submissions.

| Field     | Type     | Description                  |
|-----------|----------|------------------------------|
| id        | String   | Primary key (cuid)           |
| name      | String   | Sender's name                |
| email     | String   | Sender's email               |
| phone     | String?  | Sender's phone               |
| subject   | String?  | Inquiry subject              |
| message   | Text     | Inquiry message              |
| status    | String   | new/in_progress/resolved     |
| response  | Text?    | Staff response               |

---

## Join Tables

### DoctorSpecialty
Many-to-many relationship between Doctor and MedicalSpecialty.

| Field       | Type    | Description                |
|-------------|---------|----------------------------|
| doctorId    | String  | FK to Doctor               |
| specialtyId | String  | FK to MedicalSpecialty     |
| isPrimary   | Boolean | Is this primary specialty  |

### DoctorDepartment
Many-to-many relationship between Doctor and Department.

| Field        | Type   | Description          |
|--------------|--------|----------------------|
| doctorId     | String | FK to Doctor         |
| departmentId | String | FK to Department     |

---

## Indexes

**Performance-critical indexes:**
- Hospital: `slug`, `domain`
- Doctor: `slug`, `active`, `hospitalId`
- Department: `slug`, `hospitalId`, `[hospitalId, slug]` (composite unique)
- Appointment: `[doctorId, appointmentDate]`, `status`, `patientEmail`
- MedicalSpecialty: `slug`, `displayOrder`
- OPDSchedule: `[doctorId, dayOfWeek]`
- Service: `slug`, `categoryId`
- BlogPost: `slug`, `publishedAt`, `category`
- Branch: `hospitalId`, `[hospitalId, slug]` (composite unique)
- Facility: `hospitalId`, `category`, `[hospitalId, slug]` (composite unique)
- JobPosting: `hospitalId`, `active`, `publishedAt`
- FAQ: `category`, `displayOrder`

---

## Data Privacy & Compliance

### No PHI (Protected Health Information)
✅ **Appointment** table stores only contact information (name, phone, email)
✅ No diagnosis, treatment, or medical records stored
✅ HMS integration via `hmsAppointmentId` for medical data

### Multi-Tenancy
✅ Hospital-specific data isolated by `hospitalId`
✅ Shared entities: MedicalSpecialty, ServiceCategory, FAQ
✅ Configure active hospital via `HOSPITAL_ID` environment variable

---

**Schema Version:** 1.0
**Last Updated:** 2026-02-07
**Total Tables:** 19 core + 2 join tables
