# SEO Improvements Guide

## Current SEO Status: ⚠️ Needs Enhancement

### ✅ Implemented
- Basic meta titles and descriptions
- Semantic HTML structure
- Image alt attributes
- Clean URL structure
- robots.txt file

### ❌ Missing (High Priority)

#### 1. Sitemap.xml
Generate a sitemap for better crawling:

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://your-domain.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://your-domain.com/find-doctor',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://your-domain.com/doctors',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://your-domain.com/appointments',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Add all pages...
  ]
}
```

#### 2. Schema Markup (JSON-LD)
Add structured data for better rich snippets:

```typescript
// components/schema/HospitalSchema.tsx
export function HospitalSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Hospital",
    "name": "ABC General Hospital",
    "image": "https://your-domain.com/images/hospital_logo.png",
    "telephone": "+92-300-1234567",
    "email": "info@abchospital.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Main Street",
      "addressLocality": "City",
      "addressCountry": "PK"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "medicalSpecialty": [
      "Cardiology",
      "ENT",
      "Pediatrics",
      "Gynecology",
      "Orthopedics"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

#### 3. Open Graph Tags
Add social media sharing metadata:

```typescript
// app/layout.tsx or page.tsx
export const metadata = {
  title: 'ABC General Hospital',
  description: 'Quality healthcare services...',
  openGraph: {
    title: 'ABC General Hospital',
    description: 'Quality healthcare services...',
    url: 'https://your-domain.com',
    siteName: 'ABC General Hospital',
    images: [
      {
        url: 'https://your-domain.com/images/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ABC General Hospital',
    description: 'Quality healthcare services...',
    images: ['https://your-domain.com/images/og-image.jpg'],
  },
}
```

#### 4. Doctor Schema for Individual Profiles

```typescript
// app/doctors/[id]/page.tsx
const doctorSchema = {
  "@context": "https://schema.org",
  "@type": "Physician",
  "name": doctor.name,
  "image": doctor.image,
  "jobTitle": doctor.specialty,
  "worksFor": {
    "@type": "Hospital",
    "name": "ABC General Hospital"
  },
  "medicalSpecialty": doctor.specialty,
  "memberOf": {
    "@type": "MedicalOrganization",
    "name": "ABC General Hospital"
  }
}
```

#### 5. Canonical URLs
Add canonical tags to prevent duplicate content:

```typescript
export const metadata = {
  alternates: {
    canonical: 'https://your-domain.com/page-url',
  },
}
```

#### 6. Meta Keywords (Optional)
Add relevant keywords:

```typescript
export const metadata = {
  keywords: ['hospital', 'healthcare', 'doctors', 'appointment', 'ENT', 'cardiology'],
}
```

## Recommendations

### High Priority
1. ✅ Create sitemap.xml
2. ✅ Add Schema markup for Hospital
3. ✅ Add Schema markup for Doctors
4. ✅ Implement Open Graph tags
5. ✅ Add canonical URLs

### Medium Priority
6. Optimize meta descriptions (155 characters max)
7. Add alt text to all images
8. Implement breadcrumbs with schema
9. Create XML sitemap for images
10. Add hreflang tags for multi-language (if applicable)

### Low Priority
11. Create FAQ schema
12. Add review/rating schema
13. Implement AMP pages (optional)
14. Add video schema (if videos added)

## Tools to Test SEO

1. **Google Search Console** - Track indexing and performance
2. **Google PageSpeed Insights** - Performance and SEO audit
3. **Screaming Frog** - Technical SEO crawler
4. **Ahrefs** or **SEMrush** - Comprehensive SEO analysis
5. **Schema Markup Validator** - Test structured data

## Expected Impact

After implementing these improvements:
- 📈 Better search engine rankings
- 🔍 Rich snippets in search results
- 📱 Better social media sharing previews
- 🎯 Improved click-through rates
- 📊 Better tracking and analytics
