# Hospital Website – Specifications

## 1. Purpose & Vision
A **professional, multi-hospital, marketing + patient-facing website** that can be deployed for **any hospital or clinic** by configuration only. This website is **separate from HMS** but can integrate with it.

Primary goals:
- Trust-building & credibility
- Patient acquisition
- Online appointments
- Mobile-first & fast
- SEO optimized

---

## 2. Deployment Model

### 2.1 Multi-Hospital Support
- Single codebase
- Hospital-specific configuration file
- Per-hospital:
  - Name, logo, branding colors
  - Domain / subdomain
  - Content & services

### 2.2 Tech Stack (Recommended)
- Next.js (App Router)
- Tailwind CSS
- PostgreSQL / Headless CMS (optional)
- Vercel deployment

---

## 3. Target Users
- Patients
- Patient attendants / family
- Doctors (profile visibility)
- Hospital marketing team

---

## 4. Core Pages

### 4.1 Public Pages
- Home
- About Hospital
- Departments
- Doctors
- Services
- Facilities
- Contact Us
- Careers
- News / Blogs

### 4.2 Patient Pages
- Book Appointment
- View Doctors
- OPD Schedule
- Patient Login (HMS integration)

---

## 5. Homepage Sections

- Hero section (trust message + CTA)
- Emergency contact banner
- Key departments
- Top doctors
- Appointment CTA
- Patient testimonials
- Certifications & partners
- Location & map

---

## 6. Doctors Module (Website)

- Doctor listing
- Profile pages
  - Photo
  - Qualification
  - Experience
  - OPD timings
  - Consultation fee (optional)

---

## 7. Appointment Booking

- Doctor-wise appointment
- Department-wise appointment
- Date & slot selection
- Patient basic details
- Confirmation via SMS/Email

Integration:
- HMS appointment API
- Fallback manual booking

---

## 8. Departments & Services

- Department-wise pages
- Treatments offered
- Equipment & facilities
- CTA per department

---

## 9. Contact & Location

- Contact form
- Google Maps integration
- Multiple branches support
- Emergency numbers

---

## 10. SEO & Performance

- Server-side rendering (SSR)
- Meta tags per page
- Sitemap & robots.txt
- Schema markup (Hospital, Doctor)
- Core Web Vitals optimized

---

## 11. Design & UX Rules

- Clean medical UI
- Accessible (WCAG)
- Mobile-first
- Minimal animations
- Trust colors (blue, green, white)

---

## 12. CMS / Content Management

Options:
- Database-driven admin panel
- Headless CMS (Sanity, Strapi)
- Markdown-based content

Editable content:
- Pages
- Doctors
- Departments
- Blog posts

---

## 13. Security & Privacy

- HTTPS enforced
- Spam protection (reCAPTCHA)
- No sensitive medical data stored
- GDPR-style consent banner

---

## 14. Analytics & Tracking

- Google Analytics / Plausible
- Conversion tracking
- Appointment funnel metrics

---

## 15. Integration Points

- HMS (appointments, doctors)
- WhatsApp API
- SMS gateway
- Email service

---

## 16. Admin Panel (Optional)

- Update content
- Manage doctors visibility
- Manage appointment slots

---

## 17. Multi-Language Support

- English
- Urdu (optional)
- Any local language

---

## 18. Scalability

- Static generation for public pages
- ISR for dynamic content
- CDN caching

---

## 19. Monetization (If Selling)

- One-time setup fee
- Monthly hosting + support
- Add-on modules

---

## 20. Success Criteria

- Lighthouse score > 90
- Mobile load < 3s
- Appointment conversion measurable

---

**This document is the single source of truth for hospital website implementation.**

