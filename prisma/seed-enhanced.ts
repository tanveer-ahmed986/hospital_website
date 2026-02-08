/**
 * Enhanced Database Seed Script with Doctors and Hero Images
 *
 * Populates the database with comprehensive sample data including:
 * - Hospital configuration
 * - Medical specialties
 * - Sample doctors with photos
 * - Hero carousel images
 * - Departments with images
 * - Services
 * - Facilities with images
 * - Testimonials
 * - Certifications
 * - Job postings
 * - FAQs
 *
 * Run: npx tsx prisma/seed-enhanced.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting enhanced database seed...');

  // ============================================================================
  // 1. Seed Hospital
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
      description: 'A multi-specialty hospital providing comprehensive healthcare services with state-of-the-art facilities and experienced medical professionals dedicated to your wellbeing.',
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
  // 2. Seed Hero Carousel Images
  // ============================================================================
  console.log('🎠 Seeding hero carousel images...');

  const heroImages = [
    {
      imageUrl: '/images/pexels-zeoxs-11748791.jpg',
      altText: 'Modern Healthcare Facility',
      caption: 'Welcome to ABC General Hospital',
      imageType: 'facility',
      displayOrder: 1,
    },
    {
      imageUrl: '/images/pexels-rdne-6129681.jpg',
      altText: 'Expert Medical Team',
      caption: 'Expert Medical Care',
      imageType: 'staff',
      displayOrder: 2,
    },
    {
      imageUrl: '/images/pexels-pavel-danilyuk-8442110.jpg',
      altText: 'Compassionate Patient Care',
      caption: 'Compassionate Care',
      imageType: 'care',
      displayOrder: 3,
    },
    {
      imageUrl: '/images/pexels-karola-g-6627705.jpg',
      altText: 'State-of-the-Art Medical Equipment',
      caption: 'Advanced Technology',
      imageType: 'equipment',
      displayOrder: 4,
    },
    {
      imageUrl: '/images/pexels-tima-miroshnichenko-5452293.jpg',
      altText: 'Professional Medical Consultation',
      caption: 'Quality Healthcare',
      imageType: 'care',
      displayOrder: 5,
    },
  ];

  for (const image of heroImages) {
    await prisma.heroCarouselImage.create({
      data: image,
    });
  }

  console.log(`✅ Seeded ${heroImages.length} hero carousel images`);

  // ============================================================================
  // 3. Seed Medical Specialties
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
      name: 'General Medicine',
      slug: 'general-medicine',
      description: 'Diagnosis and treatment of adult diseases',
      commonConditions: ['Diabetes', 'Fever', 'Hypertension', 'Respiratory infections'],
      displayOrder: 10,
    },
    {
      name: 'General Surgery',
      slug: 'general-surgery',
      description: 'Surgical procedures for various conditions',
      commonConditions: ['Appendicitis', 'Hernia', 'Gallstones', 'Trauma'],
      displayOrder: 11,
    },
  ];

  const createdSpecialties = [];
  for (const specialty of specialties) {
    const created = await prisma.medicalSpecialty.upsert({
      where: { slug: specialty.slug },
      update: specialty,
      create: specialty,
    });
    createdSpecialties.push(created);
  }

  console.log(`✅ Seeded ${specialties.length} medical specialties`);

  // ============================================================================
  // 4. Seed Departments
  // ============================================================================
  console.log('🏢 Seeding departments...');

  const departments = [
    {
      name: 'Cardiology Department',
      slug: 'cardiology-dept',
      description: 'Specialized cardiac care with state-of-the-art facilities including cardiac catheterization lab and advanced monitoring systems.',
      image: '/images/departments/cardiology.jpg',
      displayOrder: 1,
    },
    {
      name: 'Emergency Department',
      slug: 'emergency-dept',
      description: '24/7 emergency medical services with trauma care capabilities and rapid response team.',
      image: '/images/departments/emergency.jpg',
      displayOrder: 2,
    },
    {
      name: 'Maternity Department',
      slug: 'maternity-dept',
      description: 'Comprehensive maternity and neonatal care with NICU facilities and experienced obstetricians.',
      image: '/images/departments/maternity.jpg',
      displayOrder: 3,
    },
    {
      name: 'Surgical Department',
      slug: 'surgical-dept',
      description: 'Advanced surgical procedures and post-operative care with modern operation theaters.',
      image: '/images/departments/surgery.jpg',
      displayOrder: 4,
    },
    {
      name: 'Pediatrics Department',
      slug: 'pediatrics-dept',
      description: 'Specialized care for children from newborns to adolescents.',
      image: '/images/departments/pediatrics.jpg',
      displayOrder: 5,
    },
    {
      name: 'Neurology Department',
      slug: 'neurology-dept',
      description: 'Expert neurological care for brain and nervous system disorders.',
      image: '/images/departments/neurology.jpg',
      displayOrder: 6,
    },
  ];

  const createdDepartments = [];
  for (const dept of departments) {
    const created = await prisma.department.upsert({
      where: {
        hospitalId_slug: {
          hospitalId: hospital.id,
          slug: dept.slug,
        }
      },
      update: { ...dept, hospitalId: hospital.id },
      create: { ...dept, hospitalId: hospital.id },
    });
    createdDepartments.push(created);
  }

  console.log(`✅ Seeded ${departments.length} departments`);

  // ============================================================================
  // 5. Clear existing doctors and related data
  // ============================================================================
  console.log('🧹 Clearing existing doctors and related data...');

  await prisma.oPDSchedule.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.doctorDepartment.deleteMany({});
  await prisma.doctorSpecialty.deleteMany({});
  await prisma.doctor.deleteMany({});

  console.log('✅ Cleared existing doctor data');

  // ============================================================================
  // 6. Seed Doctors with Photos
  // ============================================================================
  console.log('👨‍⚕️ Seeding doctors...');

  const doctors = [
    {
      name: 'Dr. Sarah Ahmed',
      slug: 'dr-sarah-ahmed',
      designation: 'Senior Consultant Cardiologist',
      qualifications: 'MBBS, MD (Cardiology), FCPS',
      experience: 15,
      photo: '/images/doctors/doctor-1.jpg',
      consultationFee: 2500,
      languages: ['English', 'Urdu', 'Hindi'],
      bio: 'Dr. Sarah Ahmed is a highly experienced cardiologist specializing in interventional cardiology and heart failure management. She has performed over 5000 cardiac procedures and is known for her patient-centered approach.',
      active: true,
      specialty: 'cardiology',
      department: 'cardiology-dept',
    },
    {
      name: 'Dr. Muhammad Khan',
      slug: 'dr-muhammad-khan',
      designation: 'Chief of Emergency Medicine',
      qualifications: 'MBBS, FCPS (Emergency Medicine)',
      experience: 12,
      photo: '/images/doctors/doctor-2.jpg',
      consultationFee: 2000,
      languages: ['English', 'Urdu'],
      bio: 'Dr. Muhammad Khan leads our emergency department with expertise in trauma care and critical care medicine. He has trained medical teams across the country in emergency protocols.',
      active: true,
      specialty: 'general-medicine',
      department: 'emergency-dept',
    },
    {
      name: 'Dr. Ayesha Malik',
      slug: 'dr-ayesha-malik',
      designation: 'Consultant Gynecologist & Obstetrician',
      qualifications: 'MBBS, FCPS (Gynecology), MRCOG',
      experience: 10,
      photo: '/images/doctors/doctor-3.jpg',
      consultationFee: 2200,
      languages: ['English', 'Urdu'],
      bio: 'Dr. Ayesha Malik is a compassionate gynecologist specializing in high-risk pregnancies and minimally invasive gynecological surgery. She has delivered over 3000 babies safely.',
      active: true,
      specialty: 'gynecology',
      department: 'maternity-dept',
    },
    {
      name: 'Dr. Ali Hassan',
      slug: 'dr-ali-hassan',
      designation: 'Senior Pediatrician',
      qualifications: 'MBBS, FCPS (Pediatrics), DCH',
      experience: 18,
      photo: '/images/doctors/doctor-4.jpg',
      consultationFee: 1800,
      languages: ['English', 'Urdu'],
      bio: 'Dr. Ali Hassan is a dedicated pediatrician with extensive experience in neonatal care and childhood developmental disorders. He is loved by children and parents alike for his gentle approach.',
      active: true,
      specialty: 'pediatrics',
      department: 'pediatrics-dept',
    },
    {
      name: 'Dr. Fatima Noor',
      slug: 'dr-fatima-noor',
      designation: 'Consultant General Surgeon',
      qualifications: 'MBBS, FCPS (Surgery), FRCS',
      experience: 14,
      photo: '/images/doctors/doctor-5.jpg',
      consultationFee: 2300,
      languages: ['English', 'Urdu'],
      bio: 'Dr. Fatima Noor is an expert in laparoscopic and robotic surgery with a focus on minimal scarring and faster recovery. She has successfully performed over 4000 surgical procedures.',
      active: true,
      specialty: 'general-surgery',
      department: 'surgical-dept',
    },
    {
      name: 'Dr. Ahmed Raza',
      slug: 'dr-ahmed-raza',
      designation: 'Consultant ENT Specialist',
      qualifications: 'MBBS, FCPS (ENT), FICS',
      experience: 11,
      photo: '/images/doctors/doctor-6.jpg',
      consultationFee: 2000,
      languages: ['English', 'Urdu'],
      bio: 'Dr. Ahmed Raza specializes in ear, nose, and throat disorders with expertise in endoscopic sinus surgery and voice disorders. He has helped thousands of patients improve their quality of life.',
      active: true,
      specialty: 'ent',
      department: 'surgical-dept',
    },
    {
      name: 'Dr. Zainab Iqbal',
      slug: 'dr-zainab-iqbal',
      designation: 'Consultant Neurologist',
      qualifications: 'MBBS, FCPS (Neurology)',
      experience: 9,
      photo: '/images/pexels-tima-miroshnichenko-9574511.jpg',
      consultationFee: 2400,
      languages: ['English', 'Urdu'],
      bio: 'Dr. Zainab Iqbal is a skilled neurologist specializing in stroke management, epilepsy, and movement disorders. She uses the latest diagnostic tools for accurate diagnoses.',
      active: true,
      specialty: 'neurology',
      department: 'neurology-dept',
    },
    {
      name: 'Dr. Hassan Ali',
      slug: 'dr-hassan-ali',
      designation: 'Consultant Orthopedic Surgeon',
      qualifications: 'MBBS, MS (Orthopedics), FACS',
      experience: 16,
      photo: '/images/pexels-mart-production-7089622.jpg',
      consultationFee: 2500,
      languages: ['English', 'Urdu'],
      bio: 'Dr. Hassan Ali is an expert in joint replacement surgery and sports medicine. He has helped countless athletes return to their sports and elderly patients regain mobility.',
      active: true,
      specialty: 'orthopedics',
      department: 'surgical-dept',
    },
  ];

  for (const doctorData of doctors) {
    const { specialty, department, ...doctorInfo } = doctorData;

    // Create doctor
    const doctor = await prisma.doctor.create({
      data: {
        ...doctorInfo,
        hospitalId: hospital.id,
      },
    });

    // Link to specialty
    const specialtyRecord = createdSpecialties.find(s => s.slug === specialty);
    if (specialtyRecord) {
      await prisma.doctorSpecialty.create({
        data: {
          doctorId: doctor.id,
          specialtyId: specialtyRecord.id,
          isPrimary: true,
        },
      });
    }

    // Link to department
    const departmentRecord = createdDepartments.find(d => d.slug === department);
    if (departmentRecord) {
      await prisma.doctorDepartment.create({
        data: {
          doctorId: doctor.id,
          departmentId: departmentRecord.id,
        },
      });
    }

    // Add OPD Schedule (Mon, Wed, Fri for example)
    await prisma.oPDSchedule.createMany({
      data: [
        {
          doctorId: doctor.id,
          dayOfWeek: 1, // Monday
          startTime: '09:00',
          endTime: '13:00',
          slotDuration: 15,
        },
        {
          doctorId: doctor.id,
          dayOfWeek: 3, // Wednesday
          startTime: '09:00',
          endTime: '13:00',
          slotDuration: 15,
        },
        {
          doctorId: doctor.id,
          dayOfWeek: 5, // Friday
          startTime: '14:00',
          endTime: '18:00',
          slotDuration: 15,
        },
      ],
    });
  }

  console.log(`✅ Seeded ${doctors.length} doctors with schedules`);

  // ============================================================================
  // 7. Seed Service Categories
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
      },
      displayOrder: 1,
    },
    {
      name: 'Radiology & Imaging',
      slug: 'radiology',
      description: 'Advanced diagnostic imaging services',
      metadata: {
        services: ['X-ray', 'CT Scan', 'MRI', 'Ultrasound', 'Mammography'],
      },
      displayOrder: 2,
    },
    {
      name: 'Emergency Services',
      slug: 'emergency',
      description: '24/7 emergency medical care',
      metadata: {
        availability: '24/7',
        ambulanceService: true,
      },
      displayOrder: 3,
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
  // 8. Seed Facilities
  // ============================================================================
  console.log('🏥 Seeding facilities...');

  const facilities = [
    {
      name: 'ICU (Intensive Care Unit)',
      slug: 'icu',
      category: 'ward',
      description: '24-bed ICU with advanced monitoring and life support systems',
      image: '/images/pexels-zeoxs-11782003.jpg',
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
      image: '/images/pexels-carloscruz-artegrafia-172084181-11198234.jpg',
      features: ['High resolution', 'Fast scanning', 'Comfortable patient experience'],
      displayOrder: 2,
      hospitalId: hospital.id,
    },
    {
      name: 'Modular Operation Theaters',
      slug: 'operation-theaters',
      category: 'equipment',
      description: '8 modular OTs with HEPA filtration and advanced surgical equipment',
      image: '/images/pexels-tima-miroshnichenko-5407206.jpg',
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
      image: '/images/pexels-rdne-6129104.jpg',
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
  // 9. Seed Testimonials
  // ============================================================================
  console.log('💬 Seeding testimonials...');

  const testimonials = [
    {
      patientName: 'Sarah Ahmed',
      condition: 'Cardiac Surgery',
      testimonial: 'The cardiology team at ABC Hospital saved my life. The doctors were highly skilled and the nursing staff was incredibly caring. I am forever grateful for their exceptional care.',
      rating: 5,
      featured: true,
      publishedAt: new Date('2026-01-15'),
      hospitalId: hospital.id,
    },
    {
      patientName: 'Muhammad Ali',
      condition: 'Orthopedic Surgery',
      testimonial: 'After my accident, I thought I would never walk again. Thanks to the excellent orthopedic team and their advanced treatment methods, I made a full recovery. Highly recommended!',
      rating: 5,
      featured: true,
      publishedAt: new Date('2026-01-20'),
      hospitalId: hospital.id,
    },
    {
      patientName: 'Fatima Khan',
      condition: 'Maternity Care',
      testimonial: 'The maternity ward staff made my delivery experience comfortable and safe. Special thanks to Dr. Ayesha for her excellent care during my pregnancy and delivery.',
      rating: 5,
      featured: true,
      publishedAt: new Date('2026-02-01'),
      hospitalId: hospital.id,
    },
    {
      patientName: 'Ahmed Hassan',
      condition: 'Emergency Care',
      testimonial: 'When I had a medical emergency, the emergency department staff responded immediately. Their quick action and professional care saved my life. Thank you ABC Hospital!',
      rating: 5,
      featured: false,
      publishedAt: new Date('2026-01-25'),
      hospitalId: hospital.id,
    },
    {
      patientName: 'Zainab Iqbal',
      condition: 'Pediatric Care',
      testimonial: 'Dr. Ali Hassan is amazing with children. He took care of my son with such patience and kindness. The pediatrics department is truly world-class.',
      rating: 5,
      featured: false,
      publishedAt: new Date('2026-02-03'),
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
  // 10. Seed Certifications
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
  // 11. Seed FAQs
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
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({
      data: faq,
    });
  }

  console.log(`✅ Seeded ${faqs.length} FAQs`);

  console.log('✅ Enhanced database seed completed successfully!');
  console.log(`
  📊 Summary:
  - Hospital: ${hospital.name}
  - Hero Images: ${heroImages.length}
  - Specialties: ${specialties.length}
  - Departments: ${departments.length}
  - Doctors: ${doctors.length}
  - Facilities: ${facilities.length}
  - Testimonials: ${testimonials.length}
  - Certifications: ${certifications.length}
  - FAQs: ${faqs.length}
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
