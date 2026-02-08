# Hospital Website - Image Reference

This document lists all the images that have been integrated into the website.

## Logo & Branding

- **Logo (SVG)**: `/public/images/logo.svg`
  - Blue medical cross with heart pulse line
  - Used in header and throughout the site

- **Favicon**: `/public/favicon.ico`
  - Browser tab icon

## Hero Carousel Images (Homepage)

5 high-quality images rotating on the homepage hero section:

1. **hospital-exterior.jpg** - Modern healthcare facility exterior
2. **doctors-team.jpg** - Professional medical team
3. **patient-care.jpg** - Compassionate patient care scene
4. **modern-facility.jpg** - State-of-the-art medical equipment
5. **patient-consultation.jpg** - Professional medical consultation

Location: `/public/images/hero/`

## Department Images

6 images representing different medical departments:

1. **cardiology.jpg** - Cardiology department
2. **emergency.jpg** - Emergency services
3. **surgery.jpg** - Surgical department
4. **pediatrics.jpg** - Pediatrics ward
5. **neurology.jpg** - Neurology unit
6. **orthopedics.jpg** - Orthopedics department

Location: `/public/images/departments/`

## Doctor Profile Images

6 professional medical staff photos:

1. **doctor-1.jpg**
2. **doctor-2.jpg**
3. **doctor-3.jpg**
4. **doctor-4.jpg**
5. **doctor-5.jpg**
6. **doctor-6.jpg**

Location: `/public/images/doctors/`

## All Source Images

All original images are also available in `/public/images/` with their original Pexels filenames.

## Image Usage in Code

### Homepage Hero Carousel
The hero carousel automatically uses images from `/public/images/hero/` as fallback when database is not connected.

See: `src/app/page.tsx` - Lines 123-165

### Image Optimization
All images are automatically optimized by Next.js Image component for:
- Responsive sizing
- WebP format conversion
- Lazy loading
- Proper caching

## Adding More Images

To add more images:

1. Place images in the appropriate folder under `/public/images/`
2. For hero carousel: Add to `/public/images/hero/`
3. For departments: Add to `/public/images/departments/`
4. For doctors: Add to `/public/images/doctors/`

Images will be automatically available at the URL path without the `/public` prefix.
For example: `/public/images/hero/hospital.jpg` → `/images/hero/hospital.jpg`

## Image Attribution

All images are from Pexels (https://www.pexels.com/) - free to use under Pexels License.
