# Feature Specification: Multi-Hospital Marketing & Patient Acquisition Website

**Feature Branch**: `001-hospital-website`
**Created**: 2026-02-02
**Updated**: 2026-02-08
**Status**: In Development
**Input**: User description: "Professional multi-hospital marketing and patient-facing website with appointment booking"

## Current Implementation Status

**Phase**: MVP Development - Static Website Version
**Last Updated**: 2026-02-08

### Implemented Features

**Navigation & Header**:
- ✅ Simplified header with logo (left), navigation (center), appointment button (right)
- ✅ Main navigation: HOME, FIND DOCTOR, SERVICES (dropdown), DEPARTMENTS (dropdown), FACILITIES, ABOUT, CONTACT
- ✅ SERVICES dropdown: All Services, ENT, Cardiology, Pediatrics, Gynecology, Orthopedics, Emergency
- ✅ DEPARTMENTS dropdown: All Departments, Cardiology, Orthopedics, Pediatrics, Gynecology & Obstetrics, ENT, Emergency Services
- ✅ Sticky navigation with whitespace-nowrap to prevent text wrapping
- ✅ Orange "Book an Appointment" button in header

**Homepage**:
- ✅ Hero carousel with 5 images (500px/600px/700px heights for mobile/tablet/desktop)
- ✅ Hero carousel with overlays showing caption, subtitle, and "Read More" button
- ✅ Why Choose Us section with 4 feature cards (Experienced Team, 24/7 Emergency, Modern Facilities, Compassionate Care)
- ✅ Statistics section (15,000+ Patients, 50+ Doctors, 25+ Years, 24/7 Care)
- ✅ Testimonials section with 3 patient testimonials
- ✅ Certifications section with 6 certifications (JCI, ISO, HIPAA, CAP, Green Healthcare, Magnet)
- ❌ No featured doctors section on homepage (intentionally removed per user request)

**Doctor Management**:
- ✅ 6 doctors with complete profiles (name, specialty, experience, education, bio, expertise, languages)
- ✅ Doctor images stored in `/images/doctors/` (doctor-1.jpg through doctor-6.jpg)
- ✅ `/doctors` page - listing all doctors with actual images
- ✅ `/find-doctor` page - search and filter by specialty
- ✅ `/doctors/[id]` - individual doctor profile pages with images
- ✅ Departments page includes doctor information for each department
- ✅ Static data arrays (no database dependency)

**Specialties Covered**:
- ENT Specialist (Dr. Sarah Johnson)
- Cardiologist (Dr. Michael Chen)
- Pediatrician (Dr. Emily Rodriguez)
- Orthopedic Surgeon (Dr. James Wilson)
- Gynecologist (Dr. Priya Sharma)
- General Surgeon (Dr. Robert Martinez)

**Appointments**:
- ✅ `/appointments` page with booking form
- ✅ Form fields: Name, Email, Phone, Department, Doctor (dropdown), Date, Message
- ✅ Doctor selection dropdown populated from static data
- ❌ No time slot selection (removed "Preferred Time")
- ❌ No SMS/email confirmation (not yet implemented)
- ❌ No database storage (static forms only)

**Departments & Services**:
- ✅ `/departments` page with 6 departments
- ✅ Each department card shows specialists working in that department
- ✅ Doctor photos and profiles linked from department cards
- ✅ Individual service pages for ENT, Cardiology, Pediatrics, Gynecology, Orthopedics, Emergency
- ✅ `/services` main listing page
- ✅ `/facilities` page
- ✅ `/about` page
- ✅ `/contact` page

**Footer**:
- ✅ Social media links (Facebook, Twitter, LinkedIn, Instagram)
- ✅ Reduced padding and size for compact footer
- ❌ No "Built with Claude Code" attribution

**Technical Implementation**:
- ✅ Next.js 14 App Router with TypeScript
- ✅ Static Site Generation (no database/Prisma)
- ✅ Tailwind CSS for styling
- ✅ next/image for optimized images
- ✅ Client components for interactive features
- ✅ Responsive design (mobile-first)

### Pending Features

**High Priority**:
- ⏳ SMS/email confirmation for appointments
- ⏳ Contact form submission handling
- ⏳ Time slot selection for appointments
- ⏳ Database integration for appointments
- ⏳ Admin panel for content management

**Medium Priority**:
- ⏳ Multi-hospital configuration system
- ⏳ Multi-language support
- ⏳ SEO optimization (meta tags, schema markup)
- ⏳ Analytics integration
- ⏳ Performance optimization (lazy loading, image optimization)

**Low Priority**:
- ⏳ Blog/News section
- ⏳ Patient portal integration
- ⏳ Careers page
- ⏳ HMS integration

## Overview

A professional, multi-hospital marketing and patient-facing website platform that enables healthcare institutions to establish online presence, build patient trust, and facilitate appointment bookings. The platform uses a single codebase deployable for any hospital or clinic through configuration-only customization, eliminating the need for code changes when deploying for different healthcare institutions.

**Core Value Proposition**: Enable hospitals to acquire patients online through trust-building, professional web presence, and seamless appointment booking while maintaining deployment flexibility through configuration-based multi-hospital support.

**Design Philosophy**: The website must deliver a **highly interactive, visually impressive, and modern user experience** that reflects the professionalism and quality of healthcare services. Every interaction should feel smooth, responsive, and thoughtfully designed to build patient confidence and trust.

## User Scenarios & Testing

### User Story 1 - Patient Discovers Hospital and Books Appointment (Priority: P1)

A patient searches online for a healthcare provider, discovers the hospital website, reviews available doctors and departments, and successfully books an appointment for a specific date and time.

**Why this priority**: This is the primary conversion path and directly supports the core business goal of patient acquisition. Without this, the website fails its primary purpose.

**Independent Test**: Can be fully tested by navigating to the website, browsing doctors, selecting a doctor/department, choosing a date/time slot, submitting appointment request, and receiving SMS/email confirmation. Delivers immediate value by converting website visitors into scheduled patients.

**Acceptance Scenarios**:

1. **Given** a patient visits the hospital website homepage, **When** they click "Book Appointment" or "Find a Doctor", **Then** they see a list of available doctors with photos, qualifications, and specialties
2. **Given** a patient selects a specific doctor, **When** they view the doctor's profile, **Then** they see complete information including qualifications, experience, OPD schedule, and an option to book appointment
3. **Given** a patient chooses to book an appointment, **When** they select a date, **Then** they see available time slots for that date
4. **Given** a patient selects a time slot, **When** they enter their basic details (name, phone, email, reason for visit), **Then** the system validates the information and shows a confirmation screen
5. **Given** a patient submits an appointment request, **When** the submission is successful, **Then** they receive immediate on-screen confirmation with appointment details and receive SMS and email confirmations
6. **Given** a patient wants to book by department instead of doctor, **When** they select a department, **Then** they see doctors available in that department and can proceed with booking

---

### User Story 2 - Patient Explores Hospital Services and Departments (Priority: P1)

A patient or their family member visits the website to learn about hospital capabilities, available departments, treatments offered, and facilities to determine if this hospital meets their healthcare needs.

**Why this priority**: Trust-building and information discovery are essential for conversion. Patients need to understand hospital capabilities before booking appointments. This is a critical step in the patient acquisition funnel.

**Independent Test**: Can be tested by navigating department pages, service pages, facilities section, and verifying all information is clear, comprehensive, and professionally presented with appropriate calls-to-action.

**Acceptance Scenarios**:

1. **Given** a patient visits the homepage, **When** they scroll through or click on "Departments", **Then** they see key hospital departments with icons, brief descriptions, and links to detailed pages
2. **Given** a patient clicks on a specific department, **When** the department page loads, **Then** they see detailed information about services offered, treatments available, equipment/facilities, team of doctors, and a "Book Appointment" call-to-action
3. **Given** a patient explores the Services section, **When** they view individual service pages, **Then** they see comprehensive information about the treatment, benefits, procedure overview, and related doctors/departments
4. **Given** a patient wants to see hospital facilities, **When** they visit the Facilities page, **Then** they see information about modern equipment, infrastructure, and optionally a photo gallery or virtual tour
5. **Given** a patient explores the About page, **When** they read hospital information, **Then** they understand the hospital's mission, history, values, and see certifications/accreditations displayed

---

### User Story 3 - Patient Finds Hospital Location and Contact Information (Priority: P1)

A patient or visitor needs to find the hospital's physical location, get directions, find emergency contact numbers, or reach out via contact form.

**Why this priority**: Contact and location information are critical for both emergency situations and general inquiries. Emergency contact visibility can be life-saving, and easy access to location/directions improves patient experience.

**Independent Test**: Can be tested by finding emergency contact numbers (prominently displayed), viewing hospital location on map, getting directions, and submitting contact form successfully.

**Acceptance Scenarios**:

1. **Given** a patient visits any page on the website, **When** they look at the header or homepage, **Then** they see prominently displayed emergency contact numbers
2. **Given** a patient needs directions, **When** they visit the Contact or Location page, **Then** they see an embedded Google Map showing the hospital location with option to get directions
3. **Given** a hospital has multiple branches, **When** a patient views locations, **Then** they see all branches listed with individual addresses, phone numbers, and map pins
4. **Given** a patient wants to send an inquiry, **When** they fill out the contact form with name, email, phone, and message, **Then** the form validates inputs and submits successfully with confirmation
5. **Given** a patient submits a contact form, **When** submission is complete, **Then** they receive on-screen confirmation and an email acknowledgment

---

### User Story 4 - Hospital Administrator Deploys Website for New Hospital Client (Priority: P2)

A hospital administrator or website administrator needs to deploy the website platform for a new hospital client (e.g., "ABC General Hospital" → "XYZ Specialty Clinic") by updating configuration only, without modifying code.

**Why this priority**: This enables the business model of serving multiple hospitals with a single codebase. Essential for scalability and product viability as a multi-hospital platform, but not critical for initial patient-facing functionality.

**Independent Test**: Can be tested by creating a new hospital configuration file, updating hospital name, logo, branding colors, domain, contact information, and verifying the website reflects all changes without code modifications.

**Acceptance Scenarios**:

1. **Given** an administrator has access to the configuration file, **When** they update the hospital name from "ABC General Hospital" to "XYZ Specialty Clinic", **Then** the website displays the new name across all pages (header, footer, title tags)
2. **Given** an administrator uploads a new hospital logo, **When** they update the logo path in configuration, **Then** the new logo appears in the header and favicon updates
3. **Given** an administrator sets new brand colors (primary, secondary), **When** they update the color values in configuration, **Then** the website theme reflects the new colors across buttons, headings, and key UI elements
4. **Given** an administrator configures hospital-specific content (departments, services), **When** they enable/disable specific departments in configuration, **Then** only enabled departments appear on the website
5. **Given** an administrator sets a custom domain or subdomain, **When** they configure the domain setting, **Then** the website is accessible via the specified domain
6. **Given** an administrator configures contact information (phone, email, address), **When** they update these values, **Then** the new contact information appears throughout the website

---

### User Story 5 - Patient Accesses Doctor Information and Profiles (Priority: P2)

A patient wants to research doctors before booking an appointment, viewing their qualifications, experience, specialties, and OPD schedules to make an informed decision. Doctors should be organized by medical specialty for easy navigation.

**Why this priority**: Enhances trust and helps patients choose the right doctor for their needs, improving appointment quality and patient satisfaction. Specialty-based organization improves findability and user experience. Important for conversion but can be partially covered by appointment booking flow.

**Independent Test**: Can be tested by browsing the doctors listing page, filtering/searching doctors by specialty or name, viewing individual doctor profiles, and verifying all information is accurate and complete.

**Acceptance Scenarios**:

1. **Given** a patient visits the Doctors page, **When** the page loads, **Then** they see a grid or list of doctors with photos, names, specialties, and brief information
2. **Given** a patient wants to filter doctors, **When** they select a specialty filter (ENT, Cardiology, Pediatrics, etc.), **Then** the list updates to show only doctors in that specialty
3. **Given** a patient searches for a doctor by name, **When** they type in the search box, **Then** the results update to show matching doctors
4. **Given** a patient clicks on a doctor, **When** the profile page loads, **Then** they see comprehensive information: professional photo, full name, designation, qualifications, specialties, years of experience, OPD schedule (days and timings), consultation fee (if configured), and a "Book Appointment" button
5. **Given** a patient views a doctor's OPD schedule, **When** they see the schedule, **Then** it clearly shows which days and times the doctor is available for consultations
6. **Given** a patient browses by specialty, **When** they view the Specialties section, **Then** they see organized categories (ENT, Gynecology, Pediatrics, Gastroenterology, Cardiology, Orthopedics, Neurology, Dermatology, etc.) with doctor counts

---

### User Story 5a - Patient Browses Doctors by Medical Specialty and Explores Specific Hospital Services (Priority: P2)

A patient needs a specialist for a specific medical condition (ENT, Gynecology, Pediatrics, Gastroenterology, Cardiology, etc.) and wants to browse doctors organized by specialty. Additionally, patients want to find specific hospital services like Laboratory, Pharmacy, Radiology, Emergency, ICU, and Operation Theater facilities.

**Why this priority**: Specialty-based organization helps patients quickly find the right specialist for their condition. Specific service categories (labs, pharmacy, radiology) are essential hospital capabilities that patients frequently search for. This improves user experience and conversion.

**Independent Test**: Can be tested by navigating to specialty pages (ENT, Gynae, Pediatrics, etc.), viewing doctors in each specialty, and exploring specific service category pages (Laboratory, Pharmacy, Radiology) with complete information.

**Acceptance Scenarios**:

1. **Given** a patient needs a specialist, **When** they navigate to "Specialties" or "Find a Doctor", **Then** they see specialty categories including ENT, Gynecology & Obstetrics, Pediatrics, Gastroenterology, Cardiology, Orthopedics, Neurology, Dermatology, and other configured specialties
2. **Given** a patient selects "ENT" specialty, **When** the specialty page loads, **Then** they see a specialty description, common conditions treated, and all ENT doctors with their profiles and "Book Appointment" options
3. **Given** a patient selects "Gynecology" specialty, **When** the page loads, **Then** they see all gynecologists with their qualifications, experience, OPD schedules, and booking options
4. **Given** a patient needs laboratory services, **When** they navigate to "Services" and select "Laboratory", **Then** they see available lab tests, sample collection timings, report delivery information, and contact details
5. **Given** a patient needs pharmacy services, **When** they visit the Pharmacy page, **Then** they see pharmacy operating hours, available services (prescription filling, OTC medications), location, and contact information
6. **Given** a patient needs imaging services, **When** they explore "Radiology & Imaging", **Then** they see available services (X-ray, CT Scan, MRI, Ultrasound, Mammography), equipment details, timings, and booking process
7. **Given** a patient wants emergency information, **When** they visit Emergency Services, **Then** they see 24/7 availability, emergency contact numbers, ambulance services, and what to expect
8. **Given** a patient explores ICU/Critical Care, **When** they view the page, **Then** they see ICU capabilities, equipment (ventilators, monitoring systems), visiting hours, and contact information
9. **Given** a patient wants diagnostic services, **When** they navigate to Diagnostic Services, **Then** they see available diagnostic tests, procedures, equipment, and appointment process

---

### User Story 6 - Website Visitor Builds Trust Through Social Proof and Credentials (Priority: P2)

A potential patient visits the website and evaluates the hospital's credibility through patient testimonials, certifications, accreditations, awards, and professional presentation.

**Why this priority**: Trust-building is essential for patient acquisition in healthcare. Patients need assurance of quality care before choosing a provider. This directly supports the "trust-building & credibility" primary goal.

**Independent Test**: Can be tested by viewing homepage and relevant pages for testimonials, certifications/accreditations, awards, professional imagery, and verifying all trust elements are professionally displayed.

**Acceptance Scenarios**:

1. **Given** a patient visits the homepage, **When** they scroll to the testimonials section, **Then** they see 3-5 patient success stories with photos (if consent obtained), ratings, and review quotes
2. **Given** a patient views testimonials, **When** they read the reviews, **Then** testimonials do not include any protected health information and display consent notice
3. **Given** a patient scrolls the homepage, **When** they reach the certifications section, **Then** they see logos of hospital certifications (e.g., JCI, NABH, ISO) and accreditations
4. **Given** a patient views the About or homepage, **When** they see partner/insurance logos, **Then** recognized insurance companies and medical associations are displayed, building credibility
5. **Given** a patient explores the website, **When** they view images and design, **Then** they see professional, high-quality photography (not generic stock photos) and clean medical UI with trust-inspiring colors

---

### User Story 7 - Patient Accesses Health Information and Educational Content (Priority: P3)

A patient or website visitor seeks health information, reads blog posts about medical conditions, learns about preventive care, or explores health tips to make informed healthcare decisions.

**Why this priority**: Supports SEO, establishes hospital as a healthcare authority, and provides value to visitors. Important for long-term patient engagement but not critical for initial MVP functionality.

**Independent Test**: Can be tested by navigating to News/Blog section, reading articles, filtering by category, searching for health topics, and verifying content is accurate and helpful.

**Acceptance Scenarios**:

1. **Given** a patient visits the website, **When** they click on "News" or "Blog" in navigation, **Then** they see a list of recent health articles with titles, summaries, publication dates, and featured images
2. **Given** a patient browses blog posts, **When** they click on an article, **Then** they see the full content with proper formatting, images, and related posts suggestions
3. **Given** a patient wants specific health information, **When** they search or filter by category/tag, **Then** relevant articles are displayed
4. **Given** a patient reads health content, **When** they view articles, **Then** content is accurate, written in plain language (minimal jargon), and includes medical disclaimer where appropriate

---

### User Story 8 - Hospital Staff Manages Website Content (Priority: P3)

Hospital marketing team or content administrators need to update website content including doctor profiles, department information, blog posts, and general pages without requiring developer assistance.

**Why this priority**: Enables hospital autonomy and reduces operational costs. Important for long-term sustainability but not critical for initial launch with pre-configured content.

**Independent Test**: Can be tested by logging into admin panel or CMS, creating/editing doctor profiles, department pages, blog posts, and verifying changes appear on the public website.

**Acceptance Scenarios**:

1. **Given** an administrator has access to the content management system, **When** they add a new doctor profile with all required information, **Then** the doctor appears on the website's doctors listing and has an individual profile page
2. **Given** an administrator needs to update department information, **When** they edit a department page in the CMS, **Then** the changes reflect on the public website
3. **Given** a marketing team member creates a blog post, **When** they publish the post, **Then** it appears in the News/Blog section with proper formatting and metadata
4. **Given** an administrator updates hospital contact information, **When** they modify these details in the CMS, **Then** the new information appears across all relevant pages
5. **Given** an administrator manages doctor visibility, **When** they mark a doctor as "inactive" or "hidden", **Then** that doctor no longer appears on the public website

---

### User Story 9 - Patient Accesses Career Opportunities (Priority: P3)

A job seeker visits the website to explore career opportunities at the hospital, view open positions, and understand the application process.

**Why this priority**: Supports hospital recruitment efforts and provides additional value. Low priority as it doesn't directly contribute to patient acquisition (primary goal).

**Independent Test**: Can be tested by navigating to Careers page, viewing job listings, and understanding how to apply for positions.

**Acceptance Scenarios**:

1. **Given** a job seeker visits the website, **When** they click on "Careers" in navigation, **Then** they see information about working at the hospital and current job openings
2. **Given** a job seeker views career page, **When** they browse available positions, **Then** they see job titles, descriptions, requirements, and application instructions
3. **Given** a job seeker wants to apply, **When** they view application process, **Then** they have clear instructions on how to submit their application (email, form, or external link)

---

### User Story 10 - Patient Logs into Patient Portal (HMS Integration) (Priority: P3)

An existing patient wants to access their medical records, lab results, appointment history, or other personalized healthcare information through integration with the Hospital Management System.

**Why this priority**: Valuable for patient engagement and retention but requires HMS integration which may not be available at launch. Can be implemented as an add-on module.

**Independent Test**: Can be tested by logging in with patient credentials, viewing patient dashboard, accessing medical records, and verifying data is correctly retrieved from HMS.

**Acceptance Scenarios**:

1. **Given** an existing patient visits the website, **When** they click "Patient Login", **Then** they are presented with a secure login form
2. **Given** a patient enters valid credentials, **When** they submit the login form, **Then** they are authenticated via HMS integration and directed to their patient dashboard
3. **Given** a logged-in patient views their dashboard, **When** the page loads, **Then** they see their upcoming appointments, recent lab results (if available), and access to medical records
4. **Given** a patient accesses the portal, **When** HMS integration is unavailable, **Then** they see a graceful error message or fallback message indicating the service is temporarily unavailable

---

### Edge Cases

- **What happens when a patient tries to book an appointment for a date/time that just became unavailable?** System should detect the conflict, notify the patient that the slot is no longer available, and prompt them to select a different slot.

- **What happens when SMS or email notification fails after successful appointment booking?** The appointment should still be recorded, and the system should log the notification failure for administrator follow-up. Patient should see on-screen confirmation with appointment details and recommendation to save the information.

- **What happens when a patient enters an invalid phone number or email during appointment booking?** The form should validate inputs in real-time and display clear error messages (e.g., "Please enter a valid 10-digit phone number" or "Please enter a valid email address").

- **What happens when HMS integration is unavailable during appointment booking?** The system should fall back to manual booking mode, storing appointment requests locally for administrator processing, and notify the patient that their appointment will be confirmed via phone/SMS within a specified timeframe.

- **What happens when a hospital administrator deploys the website with incomplete configuration (e.g., missing logo or contact information)?** The system should validate configuration on startup and either use sensible defaults with warnings in admin logs, or prevent deployment until required fields are provided.

- **What happens when a patient tries to book an appointment outside of a doctor's OPD schedule?** The appointment booking interface should only show available slots within the doctor's configured OPD schedule, preventing invalid bookings.

- **What happens when contact form spam protection (reCAPTCHA) fails to load?** The form should still be functional with server-side validation and rate limiting as fallback protection, though with increased spam risk.

- **What happens when a patient accesses the website from a region with very slow internet connection?** The website should progressively load critical content first (emergency contact, basic navigation), lazy-load images, and maintain usability on 3G connections per performance requirements.

- **What happens when a patient tries to access patient portal without HMS integration configured?** The Patient Login option should be hidden or show a message that online patient portal is coming soon, preventing confusion.

- **What happens when multiple hospitals share the same doctor?** Configuration should support per-hospital doctor assignments, with the same doctor profile appearing on multiple hospital websites if needed.

## Requirements

### Functional Requirements

**Hospital Configuration & Multi-Hospital Support**

- **FR-001**: System MUST support deployment for multiple hospitals using a single codebase with hospital-specific configuration files
- **FR-002**: System MUST allow configuration of hospital name, logo, branding colors (primary, secondary, accent), domain/subdomain without code changes
- **FR-003**: System MUST allow configuration of hospital contact information (phone, emergency number, email, physical address) per hospital
- **FR-004**: System MUST support per-hospital content configuration including which departments, services, and features to enable/disable
- **FR-005**: System MUST apply configured branding (colors, logo) consistently across all pages and components

**Homepage & Public Pages**

- **FR-006**: ✅ System MUST implement sticky header navigation that remains visible at the top when scrolling down the page
- **FR-007**: ✅ System MUST display a homepage with hero section containing trust-building message and clear call-to-action (Book Appointment)
- **FR-008**: ✅ Hero section MUST NOT exceed 2 viewport heights (approximately 2 screen pages) to ensure critical content is quickly accessible
- **FR-009**: ✅ Hero section MUST include auto-playing image carousel/slideshow showcasing hospital staff, facilities, modern equipment, and patient care environments with smooth transitions
- **FR-010**: ✅ Hero carousel MUST include navigation controls (previous/next arrows, dot indicators) and pause on hover for user control
- **FR-011**: ✅ Hero carousel MUST display 5-8 high-quality professional images with appropriate alt text for accessibility (Currently: 5 images)
- **FR-012**: ⏳ System MUST prominently display emergency contact number on every page (sticky header, banner, or footer) - PENDING
- **FR-013**: ❌ System MUST showcase key departments on homepage with icons, brief descriptions, and links to detailed pages - REMOVED per user request
- **FR-014**: ❌ System MUST display featured doctors on homepage (top 4-6 doctors) with photos, names, specialties, and quick booking links - REMOVED per user request (moved to /find-doctor)
- **FR-015**: ✅ System MUST include appointment booking call-to-action section on homepage (Orange button in header on every page)
- **FR-016**: ✅ System MUST display patient testimonials on homepage (3-5 testimonials with ratings and quotes, excluding protected health information) - Currently: 3 testimonials
- **FR-017**: ✅ System MUST showcase hospital certifications, accreditations, and partner logos on homepage - Currently: 6 certifications
- **FR-018**: ⏳ System MUST display hospital location with embedded map on homepage and/or contact page - PENDING
- **FR-019**: ✅ System MUST provide About Hospital page with mission, vision, history, and values
- **FR-020**: ✅ System MUST provide Facilities page showcasing hospital infrastructure, equipment, and capabilities

**Doctor Module**

- **FR-021**: ✅ System MUST organize doctors by medical specialty categories including ENT (Ear, Nose, Throat), Gynecology & Obstetrics, Pediatrics, Gastroenterology, Cardiology, Orthopedics, Neurology, Dermatology, Ophthalmology, Urology, and other configured specialties - Currently: ENT, Cardiology, Pediatrics, Orthopedics, Gynecology, General Surgery
- **FR-022**: ✅ System MUST provide specialty-specific landing pages (e.g., /specialties/ent, /specialties/cardiology) with specialty description, common conditions treated, and all doctors in that specialty - Service pages serve this purpose
- **FR-023**: ✅ System MUST provide a doctors listing page showing all active doctors with photos, names, specialties, and basic information - Implemented at /doctors
- **FR-024**: ✅ System MUST allow filtering doctors by specialty (ENT, Cardiology, Pediatrics, etc.) with visual specialty indicators - Implemented at /find-doctor
- **FR-025**: ✅ System MUST provide search functionality to find doctors by name - Implemented at /find-doctor
- **FR-026**: ✅ System MUST display individual doctor profile pages with photo, full name, designation, qualifications, specialties, years of experience, OPD schedule, and optional consultation fee - Implemented at /doctors/[id]
- **FR-027**: ⏳ System MUST show doctor OPD schedule clearly indicating days and timings for consultations - PENDING (data structure ready but not displayed)
- **FR-028**: ✅ System MUST provide "Book Appointment" button on each doctor profile page
- **FR-029**: ⏳ System MUST support doctors having multiple specialties and appearing in multiple specialty categories - PENDING (single specialty per doctor currently)

**Appointment Booking**

- **FR-030**: ✅ System MUST allow patients to book appointments by selecting a specific doctor - Implemented via dropdown in /appointments
- **FR-031**: ⏳ System MUST allow patients to book appointments by selecting a specialty (then choosing a doctor from that specialty) - PENDING
- **FR-032**: ✅ System MUST allow patients to book appointments by selecting a department (then choosing a doctor from that department) - Department dropdown available
- **FR-033**: ✅ System MUST display available dates for booking appointments - Date input field available
- **FR-034**: ❌ System MUST show available time slots for the selected doctor on the selected date - REMOVED (no time slot selection)
- **FR-035**: ❌ System MUST only display time slots that fall within the doctor's configured OPD schedule - REMOVED
- **FR-036**: ✅ System MUST collect patient basic details for appointment booking: name, phone number, email, reason for visit - All fields present
- **FR-037**: ✅ System MUST validate patient inputs (phone number format, email format, required fields) - HTML5 validation in place
- **FR-038**: ⏳ System MUST prevent double-booking of the same time slot - PENDING (no backend storage yet)
- **FR-039**: ⏳ System MUST send appointment confirmation via SMS to the patient's phone number - PENDING
- **FR-040**: ⏳ System MUST send appointment confirmation via email to the patient's email address - PENDING
- **FR-041**: ⏳ System MUST display on-screen confirmation with appointment details after successful booking - PENDING
- **FR-042**: ⏳ System MUST integrate with HMS API for appointment booking when HMS integration is configured - PENDING
- **FR-043**: ✅ System MUST fall back to manual booking mode (store locally for admin processing) when HMS integration is unavailable - Currently in manual mode
- **FR-044**: ⏳ System MUST implement spam protection on appointment booking forms (reCAPTCHA or similar) - PENDING

**Departments & Services**

- **FR-045**: ✅ System MUST provide a departments listing page showing all configured departments - Implemented at /departments (6 departments)
- **FR-046**: ✅ System MUST provide individual department pages with detailed information: description, services offered, treatments available, equipment/facilities, team of doctors, and booking call-to-action - Department cards show doctors, link to service pages
- **FR-047**: ✅ System MUST support distinct hospital service categories: Laboratory Services, Pharmacy Services, Radiology & Imaging, Emergency Services, ICU/Critical Care, Operation Theaters, Diagnostic Services, and Rehabilitation Services - Service pages created for main categories
- **FR-048**: ⏳ System MUST provide dedicated Laboratory Services page with available lab tests, sample collection timings (morning/evening slots), report delivery timeframes, home collection availability (if applicable), and contact information - PENDING (basic page exists)
- **FR-049**: ⏳ System MUST provide dedicated Pharmacy Services page with operating hours, available services (prescription filling, OTC medications), location within hospital, and contact number - PENDING (basic page exists)
- **FR-050**: ⏳ System MUST provide dedicated Radiology & Imaging page with available imaging services (X-ray, CT Scan, MRI, Ultrasound, Mammography, PET Scan), equipment details and specifications, timings, appointment process, and preparation instructions - PENDING (basic page exists)
- **FR-051**: ✅ System MUST provide dedicated Emergency Services page with 24/7 availability indicator, emergency contact numbers, ambulance services information, trauma care capabilities, and what to expect in emergency situations - Implemented at /services/emergency
- **FR-052**: ⏳ System MUST provide dedicated ICU/Critical Care page with ICU capabilities (NICU, PICU, MICU, CCU), equipment (ventilators, monitoring systems, life support), bed capacity, visiting hours/policies, and contact information - PENDING
- **FR-053**: ⏳ System MUST provide dedicated Operation Theater page with number of OTs, equipment and technology, types of surgeries performed, safety protocols, and related surgical specialties - PENDING
- **FR-054**: ⏳ System MUST provide dedicated Diagnostic Services page with available diagnostic tests and procedures, specialized equipment, appointment booking, and preparation instructions - PENDING
- **FR-055**: ✅ System MUST provide a services listing page showing all healthcare services offered - Implemented at /services
- **FR-056**: ✅ System MUST provide individual service pages with detailed information: service description, benefits, procedure overview, recommended conditions, related departments/doctors, and booking call-to-action - Implemented for ENT, Cardiology, Pediatrics, Gynecology, Orthopedics, Emergency

**Contact & Location**

- **FR-057**: System MUST provide a contact page with contact form, phone numbers, email address, and physical address
- **FR-058**: System MUST integrate Google Maps to display hospital location with interactive map
- **FR-059**: System MUST support multiple hospital branches with individual addresses, phone numbers, and map locations
- **FR-060**: System MUST validate contact form inputs and provide clear error messages
- **FR-061**: System MUST implement spam protection on contact forms (reCAPTCHA or similar)
- **FR-062**: System MUST send email confirmation to user after successful contact form submission
- **FR-063**: System MUST notify hospital administrators of new contact form submissions

**Content Management**

- **FR-064**: System MUST provide News/Blog section for publishing health articles, hospital updates, and announcements
- **FR-065**: System MUST display blog posts with titles, summaries, publication dates, featured images, and full content
- **FR-066**: System MUST support blog post categorization and tagging
- **FR-067**: System MUST allow content administrators to create, edit, and publish blog posts
- **FR-068**: System MUST allow content administrators to manage doctor profiles (add, edit, deactivate)
- **FR-069**: System MUST allow content administrators to manage department and service information
- **FR-070**: System MUST allow content administrators to update general page content (About, Facilities, etc.)

**SEO & Performance**

- **FR-071**: System MUST generate unique meta titles and descriptions for each page
- **FR-072**: System MUST implement schema markup for Hospital, Doctor, MedicalSpecialty, MedicalProcedure, and other relevant healthcare entities
- **FR-073**: System MUST generate XML sitemap automatically
- **FR-074**: System MUST provide robots.txt file for search engine crawling control
- **FR-075**: System MUST optimize images for web delivery with appropriate compression and responsive sizing
- **FR-076**: System MUST implement lazy loading for images below the fold
- **FR-077**: System MUST meet Core Web Vitals "Good" thresholds (LCP <2.5s, INP <200ms, CLS <0.1)

**Security & Privacy**

- **FR-078**: System MUST enforce HTTPS for all traffic
- **FR-079**: System MUST implement Content Security Policy (CSP) headers
- **FR-080**: System MUST sanitize all user inputs to prevent XSS and injection attacks
- **FR-081**: System MUST implement rate limiting on forms to prevent spam and abuse
- **FR-082**: System MUST NOT store sensitive medical data (protected health information) on the public website
- **FR-083**: System MUST display GDPR-compliant consent banner for cookie usage and tracking
- **FR-084**: System MUST provide privacy policy and terms of service pages

**Analytics & Tracking**

- **FR-085**: System MUST integrate analytics platform (Google Analytics, Plausible, or similar) for visitor tracking
- **FR-086**: System MUST track appointment booking funnel metrics (views, starts, completions, abandonment)
- **FR-087**: System MUST track conversion events (appointment bookings, contact form submissions)
- **FR-088**: System MUST respect user privacy choices regarding tracking and analytics

**Multi-Language Support**

- **FR-089**: System MUST support English language as default
- **FR-090**: System MUST allow configuration of additional languages (e.g., Urdu, local languages) per hospital
- **FR-091**: System MUST provide language selector for users to switch between available languages
- **FR-092**: System MUST translate all critical patient-facing content (navigation, forms, appointment booking, emergency contact) in configured languages

**Accessibility & Mobile Experience**

- **FR-093**: System MUST meet WCAG 2.1 Level AA accessibility standards
- **FR-094**: System MUST be fully responsive from 320px (mobile) to 4K+ (wide desktop) screen sizes
- **FR-095**: System MUST follow mobile-first design principles
- **FR-096**: System MUST support keyboard navigation for all interactive elements
- **FR-097**: System MUST provide appropriate ARIA labels and semantic HTML
- **FR-098**: System MUST ensure minimum touch target size of 44x44px for mobile interactions
- **FR-099**: System MUST implement click-to-call functionality for phone numbers on mobile devices

**UI/UX & Interactivity**

- **FR-100**: System MUST implement smooth scroll animations for page transitions and anchor link navigation
- **FR-101**: System MUST provide interactive hover effects on cards, buttons, and images (subtle elevation, color changes, or scale transforms)
- **FR-102**: System MUST implement micro-interactions for user feedback (button clicks, form field focus, loading states, success/error messages)
- **FR-103**: System MUST provide visual feedback within 100ms of user interaction for all interactive elements
- **FR-104**: System MUST use professional, high-quality medical photography (not generic stock photos) throughout the website
- **FR-105**: System MUST implement smooth transitions between page states and component updates (fade-in animations for content loading)
- **FR-106**: System MUST provide skeleton loaders or loading states for async content to maintain perceived performance
- **FR-107**: System MUST use medical trust colors (blues, greens, whites) with thoughtful contrast and visual hierarchy
- **FR-108**: System MUST implement card-based or modern UI design patterns for content sections (doctor profiles, services, testimonials)
- **FR-109**: System MUST provide clear visual feedback for form validation (real-time validation with green checkmarks or red error indicators)
- **FR-110**: System MUST implement subtle animations on scroll (fade-in, slide-up) for content sections to create engaging user experience

**Optional Features (Configurable)**

- **FR-111**: System SHOULD support patient login/portal integration with HMS when configured
- **FR-112**: System SHOULD provide Careers page with job listings when configured
- **FR-113**: System SHOULD integrate WhatsApp API for appointment confirmations when configured
- **FR-114**: System SHOULD support online payment integration when configured

### Key Entities

- **Hospital**: Represents the healthcare institution. Key attributes: name, logo, brand colors, domain, contact information (phone, emergency number, email, address), certifications, enabled departments, enabled services, enabled specialties, enabled features, hero carousel images

- **Doctor**: Represents medical professionals. Key attributes: name, photo, designation, qualifications, medical specialties (ENT, Cardiology, Pediatrics, etc.), years of experience, OPD schedule (days and timings), consultation fee (optional), department affiliation, specialty categories, active status, languages spoken (optional)

- **Medical Specialty**: Represents medical specialty categories for doctor organization. Key attributes: specialty name (ENT, Gynecology, Pediatrics, Gastroenterology, Cardiology, Orthopedics, Neurology, Dermatology, etc.), specialty description, common conditions treated, icon/image, associated doctors, active status

- **Department**: Represents hospital divisions or medical departments. Key attributes: name, description, icon/image, services offered, treatments available, facilities/equipment, associated doctors, active status

- **Service Category**: Represents specific hospital service types. Key attributes: category name (Laboratory, Pharmacy, Radiology, Emergency, ICU, Operation Theater, Diagnostic, Rehabilitation), category description, operating hours, specific services within category, equipment details, contact information, booking availability, active status

- **Service**: Represents individual medical treatments or healthcare services. Key attributes: name, description, benefits, procedure overview, recommended conditions, service category, related departments, related doctors, active status

- **Appointment**: Represents patient appointment booking. Key attributes: patient name, patient phone, patient email, selected doctor, selected specialty (if applicable), selected department (if applicable), appointment date, appointment time, reason for visit, confirmation status, SMS sent status, email sent status, booking timestamp, HMS appointment ID (if integrated)

- **Blog Post**: Represents health articles and news. Key attributes: title, slug, content, author, category, tags, featured image, publication date, active status

- **Contact Inquiry**: Represents patient/visitor inquiries. Key attributes: name, email, phone, message, submission timestamp, response status

- **Patient** (Optional, for patient portal): Represents registered patients in HMS. Key attributes: patient ID (from HMS), authentication credentials, medical record access permissions, appointment history

- **Hero Carousel Image**: Represents images displayed in homepage hero section. Key attributes: image URL, alt text, caption (optional), display order, active status, image type (staff, facility, equipment, patient care)

- **Configuration**: Represents hospital-specific deployment settings. Key attributes: hospital details, branding settings (colors, logo, fonts), enabled features, enabled specialties, enabled service categories, integration settings (HMS API, SMS gateway, email service, WhatsApp), language settings, analytics settings, hero carousel settings

## Success Criteria

### Measurable Outcomes

- **SC-001**: Patients can discover hospital information and book an appointment in under 3 minutes from homepage arrival
- **SC-002**: Website loads initial page in under 3 seconds on 3G mobile connections
- **SC-003**: Website achieves Lighthouse performance score above 90 on mobile and desktop
- **SC-004**: 95% of appointment booking attempts result in successful confirmation (excluding user abandonment)
- **SC-005**: Emergency contact information is visible within 2 seconds on every page
- **SC-006**: Website supports 1000 concurrent visitors without performance degradation
- **SC-007**: Appointment booking conversion rate is measurable through analytics funnel tracking
- **SC-008**: 90% of patients successfully complete appointment booking on first attempt without errors
- **SC-009**: Hospital administrator can deploy website for a new hospital client by updating configuration only, without code changes, in under 30 minutes
- **SC-010**: Website meets WCAG 2.1 Level AA accessibility standards with zero critical violations
- **SC-011**: All critical patient-facing content (navigation, booking, contact) is available in configured languages
- **SC-012**: SMS and email confirmations are delivered within 1 minute of appointment booking
- **SC-013**: Contact form submissions are received by hospital administrators within 5 minutes
- **SC-014**: 80% of website visitors can find desired information (departments, doctors, services) within 2 page views
- **SC-015**: Website handles peak traffic periods (500+ concurrent users) without appointment booking failures
- **SC-016**: Patient testimonials and trust elements are visible on homepage without scrolling (above the fold on desktop)
- **SC-017**: Zero protected health information (PHI) is stored or displayed on the public website
- **SC-018**: Search engines successfully index all public pages within 2 weeks of launch
- **SC-019**: Mobile users can complete appointment booking without horizontal scrolling or zoom requirements
- **SC-020**: Website remains functional with graceful degradation when HMS integration is temporarily unavailable
- **SC-021**: Hero section carousel loads and displays first image within 2 seconds with smooth auto-play transitions
- **SC-022**: Sticky header remains visible and accessible within 0.5 seconds of user scrolling
- **SC-023**: Hero section does not exceed 2 viewport heights, ensuring critical content is accessible with minimal scrolling
- **SC-024**: All interactive elements (buttons, cards, links) provide visual feedback (hover effects, animations) within 100ms of user interaction
- **SC-025**: Specialty pages (ENT, Gynecology, Pediatrics, Cardiology, etc.) are accessible within 2 clicks from homepage
- **SC-026**: Specific service category pages (Laboratory, Pharmacy, Radiology) are accessible within 2 clicks from homepage
- **SC-027**: Patients can browse doctors by specialty and find all specialists in a category within 1 page view
- **SC-028**: 85% of visitors rate the website UI as "professional and impressive" based on visual design and interactions (qualitative survey feedback)
- **SC-029**: Hero carousel displays 5-8 high-quality hospital images (staff, facilities, equipment) with smooth transitions every 5-7 seconds
- **SC-030**: All page transitions and animations feel smooth and professional without jank or lag (60 FPS target)

### Qualitative Outcomes

- Patients express trust and confidence in the hospital based on professional website presentation and interactive user experience
- Hospital marketing teams report reduced manual appointment scheduling workload due to online bookings
- Patients find doctor and department information clear and helpful for decision-making, especially with specialty-based organization
- Patients easily discover specific hospital services (Laboratory, Pharmacy, Radiology) and understand service availability
- Hospital administrators successfully deploy the platform for multiple hospital clients without developer assistance
- Website visitors perceive the hospital as modern, professional, technologically advanced, and patient-focused based on web presence and interactive design
- Patients appreciate the smooth, responsive, and visually engaging user interface that reflects quality of care
- Specialty-based doctor browsing helps patients quickly find the right specialist for their medical needs

## Assumptions

- Hospital administrators have basic technical skills to update configuration files (YAML/JSON) or access to support for configuration assistance
- Hospitals have high-quality professional photos of doctors, hospital staff, facilities, equipment, and patient care environments available for website use (5-8 images minimum for hero carousel)
- Hero carousel images are professionally shot, high-resolution, and represent authentic hospital environments (not generic stock photos)
- Hospitals have or can obtain professional photography services for staff, facility, and equipment photos
- Patient testimonials are obtained with proper consent and do not include protected health information
- Hospital has necessary certifications and accreditations to display (or will indicate when not applicable)
- SMS and email services are available via third-party providers (Twilio, SendGrid, or similar)
- Google Maps API access is available for location display
- Hospitals deploying the platform have valid domain names or subdomains configured
- Content (specialty descriptions, department details, service information, blog posts) is provided by hospital or created by hospital staff
- Hospitals have organized their doctors by medical specialties (ENT, Cardiology, Pediatrics, etc.) and can provide this categorization
- Hospitals can provide detailed information about specific service categories (Laboratory tests, Pharmacy hours, Radiology equipment, ICU capabilities, etc.)
- HMS integration is optional and not required for initial website launch (manual appointment processing is acceptable fallback)
- Hospitals comply with local healthcare privacy regulations (HIPAA in US, GDPR in EU, etc.) and website supports but does not enforce compliance
- Analytics tracking complies with user privacy consent requirements per regional regulations
- Website hosting supports expected traffic volumes per hospital (estimated 500-5000 monthly visitors initially)
- Performance optimization is possible through modern hosting platforms (Vercel, Netlify, AWS, etc.) with CDN support for image-heavy hero sections

## Dependencies

- Third-party services: SMS gateway (Twilio, AWS SNS, or regional provider), Email service (SendGrid, AWS SES, Resend), Google Maps API
- Optional HMS integration: Requires HMS to provide API endpoints for appointment booking, doctor schedules, and patient authentication
- Optional WhatsApp integration: Requires WhatsApp Business API access
- Content Management System: Requires selection of headless CMS (Sanity, Contentful, Strapi) or custom database-driven admin panel
- Hosting platform: Requires modern hosting with support for serverless functions, CDN, and auto-scaling
- Domain configuration: Requires DNS access for each hospital deployment
- SSL certificates: Requires HTTPS certificates for secure connections
- Analytics platform: Requires Google Analytics, Plausible, or alternative analytics service setup

## Out of Scope

The following items are explicitly excluded from this specification:

- Hospital Management System (HMS) development - this platform integrates with existing HMS, does not replace it
- Electronic Health Records (EHR) management - patient medical records are managed by HMS, not this website
- Telemedicine or video consultation features - may be added as future enhancement
- Online payment processing for appointments or services - may be added as configurable add-on module
- Patient health data storage beyond appointment booking information - public website does not store protected health information
- Prescription management or medication ordering - managed by HMS
- Lab test result delivery (beyond optional HMS integration for patient portal)
- Complex scheduling algorithms - simple slot-based availability is sufficient for initial version
- Multi-language translation services - hospitals are responsible for providing translated content
- Automated chatbot or AI-powered features - may be considered for future versions
- Native mobile applications (iOS/Android) - responsive web design is sufficient initially
- Email marketing campaigns and automation - integrates with analytics but does not include marketing automation platform
- Appointment reminder automation beyond initial confirmation - SMS/email reminders may be added as future enhancement
- Online reputation management or review aggregation from external platforms
- Referral program or patient loyalty features
- Insurance verification or eligibility checking
- Advanced patient portal features (billing, prescription refills, secure messaging) - basic patient login only if HMS integrated

## Implementation Notes

### Current Architecture Decisions (2026-02-08)

**Static-First Approach**: The initial implementation uses static data arrays instead of database connections. This decision was made to:
- Rapidly prototype and test user interface and user experience
- Eliminate database setup complexity during early development
- Allow client presentation without backend dependencies
- Provide a working demo that can be tested immediately

**Navigation Structure**: The navigation has been simplified from the original spec:
- "FIND DOCTOR" added as a prominent menu item (replaces featured doctors on homepage)
- SERVICES and DEPARTMENTS both have dropdowns with direct links to specialty/service pages
- Removed emergency banner from header (emergency info in footer)
- All navigation items use `whitespace-nowrap` to prevent text wrapping

**Doctor Organization**: Doctors are now accessible through multiple paths:
1. `/find-doctor` - Main discovery page with search and filter
2. `/doctors` - Complete listing of all doctors
3. `/departments` - Doctors shown within their department cards
4. Direct links from navigation dropdowns to specialty service pages

**Image Management**: All doctor images are stored in `/public/images/doctors/` and use Next.js Image component for optimization. Current implementation includes 6 doctor images (doctor-1.jpg through doctor-6.jpg).

**Form Handling**: Appointment and contact forms currently use client-side validation only. Backend submission handling and email/SMS notifications are pending implementation.

### Next Development Phase

**Priority 1 - Backend Integration**:
1. Set up database (PostgreSQL or similar) for appointments, contact inquiries
2. Implement API routes for form submissions
3. Add SMS/email notification services (Twilio, SendGrid)
4. Implement appointment confirmation workflow

**Priority 2 - Content Management**:
1. Admin panel for managing doctors, departments, services
2. Image upload functionality
3. Content editing capabilities
4. Multi-hospital configuration system

**Priority 3 - Enhancement**:
1. Time slot selection for appointments
2. Google Maps integration for location
3. SEO optimization (meta tags, schema markup, sitemap)
4. Analytics integration
5. Performance optimization

### Key Design Decisions

**No Featured Doctors on Homepage**: Per client request, doctors section was removed from homepage to simplify the landing page and drive users to the dedicated "Find Doctor" page where they can search and filter effectively.

**Simplified Appointment Form**: Removed "Preferred Time" field and time slot selection to simplify the initial booking flow. Appointments are submitted with date only, and hospital staff can contact patients to confirm specific times.

**Department-Doctor Association**: Each department card on the departments page now displays the specialists working in that department, making it easy for patients to find the right doctor for their needs through department browsing.

## Notes

This specification prioritizes patient acquisition through trust-building, professional presentation, and seamless appointment booking while maintaining deployment flexibility for multiple hospitals through configuration-based customization. The platform balances feature richness with simplicity, focusing on core patient-facing needs while allowing optional advanced features through configuration.

The multi-hospital deployment model enables a sustainable business approach where a single codebase serves multiple healthcare institutions, each with unique branding and content, reducing development costs and maintenance overhead while providing customization flexibility.

Privacy and security are paramount - the public website intentionally avoids storing protected health information, relying on HMS integration for patient portal features that require medical data access. This separation ensures compliance with healthcare privacy regulations while providing valuable patient-facing services.

**Current Status**: The website is in MVP phase with static content. All patient-facing pages are functional and ready for client presentation. Backend integration and content management features are scheduled for the next development phase.