/**
 * Database Seed Script
 *
 * Seeds the database with predefined specialties, service categories,
 * and sample data for development.
 *
 * Run: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================================================
  // 1. Seed Hospital (Required for multi-hospital support)
  // ============================================================================
  console.log('🏥 Seeding hospital...');

  const hospital = await prisma.hospital.upsert({
    where: { slug: 'abc-general-hospital' },
    update: {},
    create: {
      name: 'ABC General Hospital',
      slug: 'abc-general-hospital',
      domain: 'abchospital.com',
      tagline: 'Your Health, Our Priority',
      description: 'A multi-specialty hospital providing comprehensive healthcare services with state-of-the-art facilities and experienced medical professionals.',
      brandColors: {
        primary: '#0066CC',
        secondary: '#00AA66',
        accent: '#FF6B35',
      },
      contactEmail: 'info@abchospital.com',
      contactPhone: '+92-300-1234567',
      emergencyPhone: '+92-300-EMERGENCY',
      address: '123 Medical Avenue, Civic Center',
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan',
      postalCode: '75500',
      latitude: 24.8607,
      longitude: 67.0011,
      established: 1985,
      licenseNumber: 'KHI-HOSP-1985-001',
      accreditations: ['ISO 9001:2015', 'JCI Accredited', 'NABH Certified'],
    },
  });

  console.log(`✅ Seeded hospital: ${hospital.name}`);

  // ============================================================================
  // 2. Seed Medical Specialties
  // ============================================================================
  console.log('📋 Seeding medical specialties...');

  const specialties = [
    {
      name: 'ENT (Ear, Nose, Throat)',
      slug: 'ent',
      description: 'Treatment of ear, nose, and throat conditions',
      commonConditions: ['Hearing loss', 'Sinusitis', 'Tonsillitis', 'Voice disorders'],
      displayOrder: 1,
    },
    {
      name: 'Gynecology & Obstetrics',
      slug: 'gynecology',
      description: 'Women\'s health and pregnancy care',
      commonConditions: ['Pregnancy', 'PCOS', 'Menstrual disorders', 'Infertility'],
      displayOrder: 2,
    },
    {
      name: 'Pediatrics',
      slug: 'pediatrics',
      description: 'Medical care for infants, children, and adolescents',
      commonConditions: ['Vaccinations', 'Growth disorders', 'Childhood infections'],
      displayOrder: 3,
    },
    {
      name: 'Gastroenterology',
      slug: 'gastroenterology',
      description: 'Digestive system and liver diseases',
      commonConditions: ['IBS', 'Acid reflux', 'Hepatitis', 'Ulcers'],
      displayOrder: 4,
    },
    {
      name: 'Cardiology',
      slug: 'cardiology',
      description: 'Heart and cardiovascular system disorders',
      commonConditions: ['Hypertension', 'Heart disease', 'Arrhythmia', 'Heart failure'],
      displayOrder: 5,
    },
    {
      name: 'Orthopedics',
      slug: 'orthopedics',
      description: 'Bone, joint, and musculoskeletal conditions',
      commonConditions: ['Fractures', 'Arthritis', 'Sports injuries', 'Back pain'],
      displayOrder: 6,
    },
    {
      name: 'Neurology',
      slug: 'neurology',
      description: 'Nervous system disorders',
      commonConditions: ['Migraine', 'Epilepsy', 'Stroke', 'Parkinson\'s disease'],
      displayOrder: 7,
    },
    {
      name: 'Dermatology',
      slug: 'dermatology',
      description: 'Skin, hair, and nail conditions',
      commonConditions: ['Acne', 'Eczema', 'Psoriasis', 'Skin cancer'],
      displayOrder: 8,
    },
    {
      name: 'Ophthalmology',
      slug: 'ophthalmology',
      description: 'Eye care and vision disorders',
      commonConditions: ['Cataract', 'Glaucoma', 'Refractive errors', 'Retinal disorders'],
      displayOrder: 9,
    },
    {
      name: 'Urology',
      slug: 'urology',
      description: 'Urinary tract and male reproductive system',
      commonConditions: ['Kidney stones', 'UTI', 'Prostate issues', 'Incontinence'],
      displayOrder: 10,
    },
    {
      name: 'Psychiatry',
      slug: 'psychiatry',
      description: 'Mental health and behavioral disorders',
      commonConditions: ['Depression', 'Anxiety', 'ADHD', 'Bipolar disorder'],
      displayOrder: 11,
    },
    {
      name: 'General Medicine',
      slug: 'general-medicine',
      description: 'Diagnosis and treatment of adult diseases',
      commonConditions: ['Diabetes', 'Fever', 'Hypertension', 'Respiratory infections'],
      displayOrder: 12,
    },
    {
      name: 'General Surgery',
      slug: 'general-surgery',
      description: 'Surgical procedures for various conditions',
      commonConditions: ['Appendicitis', 'Hernia', 'Gallstones', 'Trauma'],
      displayOrder: 13,
    },
  ];

  for (const specialty of specialties) {
    await prisma.medicalSpecialty.upsert({
      where: { slug: specialty.slug },
      update: specialty,
      create: specialty,
    });
  }

  console.log(`✅ Seeded ${specialties.length} medical specialties`);

  // ============================================================================
  // 2. Seed Service Categories
  // ============================================================================
  console.log('🏥 Seeding service categories...');

  const serviceCategories = [
    {
      name: 'Laboratory Services',
      slug: 'laboratory',
      description: 'Comprehensive diagnostic testing and pathology services',
      metadata: {
        collectionTiming: 'Mon-Sat 7:00 AM - 11:00 AM',
        reportDelivery: '24-48 hours',
        homeCollection: true,
        tests: ['CBC', 'LFT', 'Blood Sugar', 'Lipid Profile', 'Thyroid Panel', 'Urine Analysis'],
      },
      displayOrder: 1,
    },
    {
      name: 'Pharmacy Services',
      slug: 'pharmacy',
      description: '24/7 pharmacy with wide range of medications',
      metadata: {
        hours: '24/7',
        location: 'Ground Floor, Main Building',
        prescriptionRequired: true,
        homeDelivery: true,
      },
      displayOrder: 2,
    },
    {
      name: 'Radiology & Imaging',
      slug: 'radiology',
      description: 'Advanced diagnostic imaging services',
      metadata: {
        services: ['X-ray', 'CT Scan', 'MRI', 'Ultrasound', 'Mammography', 'Fluoroscopy'],
        equipment: {
          mri: '1.5T Siemens MRI Scanner',
          ct: '64-slice CT Scanner',
          xray: 'Digital Radiography',
        },
        reportTiming: 'Same day for urgent cases',
      },
      displayOrder: 3,
    },
    {
      name: 'Emergency Services',
      slug: 'emergency',
      description: '24/7 emergency medical care',
      metadata: {
        availability: '24/7',
        ambulanceService: true,
        traumaCare: true,
        emergencyNumber: '+1-555-EMERGENCY',
        responseTime: '< 15 minutes',
      },
      displayOrder: 4,
    },
    {
      name: 'ICU / Critical Care',
      slug: 'icu',
      description: 'Intensive care for critically ill patients',
      metadata: {
        types: ['MICU (Medical ICU)', 'CCU (Coronary Care)', 'NICU (Neonatal ICU)', 'PICU (Pediatric ICU)'],
        bedCapacity: 20,
        ventilators: 15,
        visitingHours: '4:00 PM - 5:00 PM',
        features: ['24/7 monitoring', 'Dedicated intensivists', 'Advanced life support'],
      },
      displayOrder: 5,
    },
    {
      name: 'Operation Theaters',
      slug: 'operation-theaters',
      description: 'State-of-the-art surgical facilities',
      metadata: {
        totalTheaters: 8,
        specializedTheaters: ['Cardiac', 'Neuro', 'Orthopedic', 'General'],
        features: ['Modular OTs', 'HEPA filters', 'Advanced anesthesia'],
      },
      displayOrder: 6,
    },
    {
      name: 'Diagnostic Services',
      slug: 'diagnostic',
      description: 'Comprehensive diagnostic procedures',
      metadata: {
        services: ['ECG', 'Echo', 'Endoscopy', 'Colonoscopy', 'Bronchoscopy', 'Pulmonary function tests'],
      },
      displayOrder: 7,
    },
    {
      name: 'Rehabilitation Services',
      slug: 'rehabilitation',
      description: 'Physical therapy and rehabilitation',
      metadata: {
        services: ['Physiotherapy', 'Occupational therapy', 'Speech therapy', 'Cardiac rehab'],
        equipment: 'Modern rehabilitation equipment',
      },
      displayOrder: 8,
    },
  ];

  for (const category of serviceCategories) {
    await prisma.serviceCategory.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  console.log(`✅ Seeded ${serviceCategories.length} service categories`);

  // ============================================================================
  // 4. Seed Departments
  // ============================================================================
  console.log('🏢 Seeding departments...');

  const departments = [
    {
      name: 'Cardiology Department',
      slug: 'cardiology-dept',
      description: 'Specialized cardiac care with state-of-the-art facilities including cardiac catheterization lab and advanced monitoring systems.',
      displayOrder: 1,
    },
    {
      name: 'Emergency Department',
      slug: 'emergency-dept',
      description: '24/7 emergency medical services with trauma care capabilities and rapid response team.',
      displayOrder: 2,
    },
    {
      name: 'Maternity Department',
      slug: 'maternity-dept',
      description: 'Comprehensive maternity and neonatal care with NICU facilities and experienced obstetricians.',
      displayOrder: 3,
    },
    {
      name: 'Surgical Department',
      slug: 'surgical-dept',
      description: 'Advanced surgical procedures and post-operative care with modern operation theaters.',
      displayOrder: 4,
    },
    {
      name: 'Pediatrics Department',
      slug: 'pediatrics-dept',
      description: 'Specialized care for children from newborns to adolescents.',
      displayOrder: 5,
    },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: {
        hospitalId_slug: {
          hospitalId: hospital.id,
          slug: dept.slug,
        }
      },
      update: { ...dept, hospitalId: hospital.id },
      create: { ...dept, hospitalId: hospital.id },
    });
  }

  console.log(`✅ Seeded ${departments.length} departments`);

  // ============================================================================
  // 5. Seed Branches
  // ============================================================================
  console.log('🌍 Seeding branches...');

  const branches = [
    {
      name: 'Main Campus',
      slug: 'main-campus',
      address: '123 Medical Avenue, Civic Center',
      city: 'Karachi',
      state: 'Sindh',
      postalCode: '75500',
      phone: '+92-300-1234567',
      email: 'main@abchospital.com',
      latitude: 24.8607,
      longitude: 67.0011,
      operatingHours: 'Mon-Sun: 24/7',
      isMainBranch: true,
      hospitalId: hospital.id,
    },
    {
      name: 'North Branch',
      slug: 'north-branch',
      address: '456 Health Street, North Nazimabad',
      city: 'Karachi',
      state: 'Sindh',
      postalCode: '74700',
      phone: '+92-300-1234568',
      email: 'north@abchospital.com',
      latitude: 24.9207,
      longitude: 67.0411,
      operatingHours: 'Mon-Sat: 8:00 AM - 10:00 PM',
      isMainBranch: false,
      hospitalId: hospital.id,
    },
  ];

  for (const branch of branches) {
    await prisma.branch.upsert({
      where: {
        hospitalId_slug: {
          hospitalId: hospital.id,
          slug: branch.slug,
        }
      },
      update: branch,
      create: branch,
    });
  }

  console.log(`✅ Seeded ${branches.length} branches`);

  // ============================================================================
  // 6. Seed Facilities
  // ============================================================================
  console.log('🏥 Seeding facilities...');

  const facilities = [
    {
      name: 'ICU (Intensive Care Unit)',
      slug: 'icu',
      category: 'ward',
      description: '24-bed ICU with advanced monitoring and life support systems',
      features: ['24/7 monitoring', 'Ventilator support', 'Dedicated intensivists'],
      capacity: 24,
      displayOrder: 1,
      hospitalId: hospital.id,
    },
    {
      name: 'MRI Scanner (1.5T)',
      slug: 'mri-scanner',
      category: 'diagnostic',
      description: 'State-of-the-art 1.5T MRI scanner for detailed imaging',
      features: ['High resolution', 'Fast scanning', 'Comfortable patient experience'],
      displayOrder: 2,
      hospitalId: hospital.id,
    },
    {
      name: 'Modular Operation Theaters',
      slug: 'operation-theaters',
      category: 'equipment',
      description: '8 modular OTs with HEPA filtration and advanced surgical equipment',
      features: ['Laminar air flow', 'Modern anesthesia machines', 'HD surgical displays'],
      capacity: 8,
      displayOrder: 3,
      hospitalId: hospital.id,
    },
    {
      name: 'Emergency Ward',
      slug: 'emergency-ward',
      category: 'emergency',
      description: '24/7 emergency services with trauma care capabilities',
      features: ['Rapid response team', 'Ambulance service', 'Trauma bay'],
      capacity: 12,
      displayOrder: 4,
      hospitalId: hospital.id,
    },
  ];

  for (const facility of facilities) {
    await prisma.facility.upsert({
      where: {
        hospitalId_slug: {
          hospitalId: hospital.id,
          slug: facility.slug,
        }
      },
      update: facility,
      create: facility,
    });
  }

  console.log(`✅ Seeded ${facilities.length} facilities`);

  // ============================================================================
  // 7. Seed Testimonials
  // ============================================================================
  console.log('💬 Seeding testimonials...');

  const testimonials = [
    {
      patientName: 'Sarah Ahmed',
      condition: 'Cardiac Surgery',
      testimonial: 'The cardiology team at ABC Hospital saved my life. The doctors were highly skilled and the nursing staff was incredibly caring. I am forever grateful.',
      rating: 5,
      featured: true,
      publishedAt: new Date('2026-01-15'),
      hospitalId: hospital.id,
    },
    {
      patientName: 'Muhammad Ali',
      condition: 'Orthopedic Surgery',
      testimonial: 'After my accident, I thought I would never walk again. Thanks to the excellent orthopedic team, I made a full recovery. Highly recommended!',
      rating: 5,
      featured: true,
      publishedAt: new Date('2026-01-20'),
      hospitalId: hospital.id,
    },
    {
      patientName: 'Fatima Khan',
      condition: 'Maternity Care',
      testimonial: 'The maternity ward staff made my delivery experience comfortable and safe. Special thanks to Dr. Ayesha for her excellent care.',
      rating: 5,
      featured: false,
      publishedAt: new Date('2026-02-01'),
      hospitalId: hospital.id,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    });
  }

  console.log(`✅ Seeded ${testimonials.length} testimonials`);

  // ============================================================================
  // 8. Seed Certifications
  // ============================================================================
  console.log('🏆 Seeding certifications...');

  const certifications = [
    {
      name: 'ISO 9001:2015 Certification',
      issuer: 'International Organization for Standardization',
      type: 'certification',
      description: 'Quality Management System certification',
      issuedDate: new Date('2024-01-01'),
      expiryDate: new Date('2027-01-01'),
      displayOrder: 1,
      hospitalId: hospital.id,
    },
    {
      name: 'JCI Accreditation',
      issuer: 'Joint Commission International',
      type: 'accreditation',
      description: 'International healthcare accreditation for patient safety and quality',
      issuedDate: new Date('2023-06-01'),
      expiryDate: new Date('2026-06-01'),
      displayOrder: 2,
      hospitalId: hospital.id,
    },
    {
      name: 'Best Hospital Award 2025',
      issuer: 'Healthcare Excellence Awards',
      type: 'award',
      description: 'Recognized as the best multi-specialty hospital in the region',
      issuedDate: new Date('2025-11-01'),
      displayOrder: 3,
      hospitalId: hospital.id,
    },
  ];

  for (const cert of certifications) {
    await prisma.certification.create({
      data: cert,
    });
  }

  console.log(`✅ Seeded ${certifications.length} certifications`);

  // ============================================================================
  // 9. Seed Job Postings
  // ============================================================================
  console.log('💼 Seeding job postings...');

  const jobs = [
    {
      title: 'Senior Consultant - Cardiology',
      slug: 'senior-consultant-cardiology',
      department: 'Cardiology',
      location: 'Karachi - Main Campus',
      employmentType: 'full-time',
      experience: '5-10 years',
      qualifications: ['MBBS', 'MD/FCPS in Cardiology', 'Valid medical license'],
      responsibilities: 'Provide expert cardiac care, perform diagnostic procedures, supervise junior doctors, participate in research activities.',
      requirements: 'Minimum 5 years of post-MD experience, excellent clinical skills, strong communication abilities.',
      benefits: 'Competitive salary, health insurance, CME allowance, performance bonuses.',
      applicationEmail: 'careers@abchospital.com',
      openings: 2,
      publishedAt: new Date('2026-02-01'),
      closingDate: new Date('2026-03-15'),
      hospitalId: hospital.id,
    },
    {
      title: 'Staff Nurse - ICU',
      slug: 'staff-nurse-icu',
      department: 'Nursing',
      location: 'Karachi - Main Campus',
      employmentType: 'full-time',
      experience: '2-5 years',
      qualifications: ['BSN/Post-RN', 'Valid nursing license', 'ICU experience preferred'],
      responsibilities: 'Provide critical care nursing, monitor patients, administer medications, maintain patient records.',
      requirements: 'Minimum 2 years of ICU experience, BLS/ACLS certified, excellent patient care skills.',
      benefits: 'Health insurance, paid leaves, training opportunities.',
      applicationEmail: 'careers@abchospital.com',
      openings: 5,
      publishedAt: new Date('2026-02-05'),
      closingDate: new Date('2026-03-20'),
      hospitalId: hospital.id,
    },
  ];

  for (const job of jobs) {
    await prisma.jobPosting.upsert({
      where: {
        hospitalId_slug: {
          hospitalId: hospital.id,
          slug: job.slug,
        }
      },
      update: job,
      create: job,
    });
  }

  console.log(`✅ Seeded ${jobs.length} job postings`);

  // ============================================================================
  // 10. Seed FAQs
  // ============================================================================
  console.log('❓ Seeding FAQs...');

  const faqs = [
    {
      question: 'How can I book an appointment?',
      answer: 'You can book an appointment through our website, mobile app, or by calling our helpline at +92-300-1234567. Online booking is available 24/7.',
      category: 'appointments',
      displayOrder: 1,
    },
    {
      question: 'What are the visiting hours?',
      answer: 'General ward visiting hours are 4:00 PM to 6:00 PM daily. ICU visiting hours are 4:00 PM to 5:00 PM. Private rooms allow visitors from 10:00 AM to 8:00 PM.',
      category: 'general',
      displayOrder: 2,
    },
    {
      question: 'Do you accept insurance?',
      answer: 'Yes, we are empaneled with all major insurance providers. Please bring your insurance card and policy documents at the time of admission.',
      category: 'billing',
      displayOrder: 3,
    },
    {
      question: 'Is emergency care available 24/7?',
      answer: 'Yes, our emergency department operates 24/7 with fully equipped trauma care facilities and experienced emergency physicians.',
      category: 'services',
      displayOrder: 4,
    },
    {
      question: 'How do I get my lab reports?',
      answer: 'Lab reports are available online through our patient portal. You can also collect physical copies from the lab reception. Most reports are ready within 24-48 hours.',
      category: 'services',
      displayOrder: 5,
    },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({
      data: faq,
    });
  }

  console.log(`✅ Seeded ${faqs.length} FAQs`);

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
