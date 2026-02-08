import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏥 Adding sample doctors...');

  // Get the hospital
  const hospital = await prisma.hospital.findFirst();

  if (!hospital) {
    console.log('❌ No hospital found!');
    return;
  }

  console.log(`✅ Found hospital: ${hospital.name}`);

  // Get some specialties
  const cardiology = await prisma.medicalSpecialty.findUnique({
    where: { slug: 'cardiology' }
  });

  const ent = await prisma.medicalSpecialty.findUnique({
    where: { slug: 'ent' }
  });

  const pediatrics = await prisma.medicalSpecialty.findUnique({
    where: { slug: 'pediatrics' }
  });

  // Get some departments
  const cardiologyDept = await prisma.department.findFirst({
    where: { slug: 'cardiology-dept' }
  });

  const emergencyDept = await prisma.department.findFirst({
    where: { slug: 'emergency-dept' }
  });

  // Add Doctor 1
  const doctor1 = await prisma.doctor.create({
    data: {
      name: 'Dr. Ahmed Khan',
      slug: 'dr-ahmed-khan',
      designation: 'Senior Consultant - Cardiology',
      qualifications: 'MBBS, MD, FCPS (Cardiology)',
      experience: 15,
      hospitalId: hospital.id,
      active: true,
      bio: 'Dr. Ahmed Khan is a highly experienced cardiologist with over 15 years of practice. Specialized in interventional cardiology and heart failure management.',
      consultationFee: 2500,
      languages: ['English', 'Urdu'],
      photo: '/images/doctors/dr-ahmed-khan.jpg',
    },
  });

  console.log(`✅ Created: ${doctor1.name}`);

  // Link to specialty and department
  if (cardiology) {
    await prisma.doctorSpecialty.create({
      data: {
        doctorId: doctor1.id,
        specialtyId: cardiology.id,
        isPrimary: true,
      },
    });
  }

  if (cardiologyDept) {
    await prisma.doctorDepartment.create({
      data: {
        doctorId: doctor1.id,
        departmentId: cardiologyDept.id,
      },
    });
  }

  // Add Doctor 2
  const doctor2 = await prisma.doctor.create({
    data: {
      name: 'Dr. Fatima Ali',
      slug: 'dr-fatima-ali',
      designation: 'Consultant ENT Specialist',
      qualifications: 'MBBS, FCPS (ENT)',
      experience: 10,
      hospitalId: hospital.id,
      active: true,
      bio: 'Dr. Fatima Ali specializes in ear, nose, and throat conditions with expertise in endoscopic sinus surgery.',
      consultationFee: 2000,
      languages: ['English', 'Urdu'],
      photo: '/images/doctors/dr-fatima-ali.jpg',
    },
  });

  console.log(`✅ Created: ${doctor2.name}`);

  if (ent) {
    await prisma.doctorSpecialty.create({
      data: {
        doctorId: doctor2.id,
        specialtyId: ent.id,
        isPrimary: true,
      },
    });
  }

  // Add Doctor 3
  const doctor3 = await prisma.doctor.create({
    data: {
      name: 'Dr. Sarah Ahmed',
      slug: 'dr-sarah-ahmed',
      designation: 'Pediatrician',
      qualifications: 'MBBS, DCH, FCPS (Pediatrics)',
      experience: 8,
      hospitalId: hospital.id,
      active: true,
      bio: 'Dr. Sarah Ahmed is a dedicated pediatrician with special interest in child development and vaccination.',
      consultationFee: 1500,
      languages: ['English', 'Urdu'],
      photo: '/images/doctors/dr-sarah-ahmed.jpg',
    },
  });

  console.log(`✅ Created: ${doctor3.name}`);

  if (pediatrics) {
    await prisma.doctorSpecialty.create({
      data: {
        doctorId: doctor3.id,
        specialtyId: pediatrics.id,
        isPrimary: true,
      },
    });
  }

  // Add OPD Schedule for Doctor 1
  await prisma.oPDSchedule.createMany({
    data: [
      {
        doctorId: doctor1.id,
        dayOfWeek: 1, // Monday
        startTime: '14:00',
        endTime: '18:00',
        slotDuration: 15,
      },
      {
        doctorId: doctor1.id,
        dayOfWeek: 3, // Wednesday
        startTime: '14:00',
        endTime: '18:00',
        slotDuration: 15,
      },
      {
        doctorId: doctor1.id,
        dayOfWeek: 5, // Friday
        startTime: '14:00',
        endTime: '18:00',
        slotDuration: 15,
      },
    ],
  });

  console.log('✅ Added OPD schedules');

  console.log('\n🎉 Successfully added 3 doctors with specialties and schedules!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
