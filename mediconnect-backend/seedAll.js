require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect';

const SPECIALIZATIONS = [
    'General Medicine', 'Cardiology', 'Dermatology', 'Pediatrics', 
    'Neurology', 'Orthopedics', 'Psychiatry', 'Gastroenterology', 
    'Ophthalmology', 'Gynecology', 'Endocrinology', 'ENT Specialist'
];

const QUALIFICATIONS = [
    'MBBS, MD', 'MBBS, MS', 'MBBS, DNB', 'MBBS, MD, DM (Cardio)', 
    'MBBS, MD (Neuro)', 'MBBS, MS (Ortho)', 'MBBS, MD (Dermatology)',
    'MBBS, MD (Psychiatry)', 'MBBS, MS (Ophthal)', 'MBBS, MS (ENT)'
];

const FIRST_NAMES_MALE = [
    'Arjun', 'Vikram', 'Rahul', 'Amit', 'Karan', 'Siddharth', 'Aditya', 'Sanjay', 
    'Abhishek', 'Manish', 'Rohan', 'Yash', 'Sameer', 'Varun', 'Gautam', 'Shikhar', 
    'Hardik', 'Jasprit', 'Ravi', 'Anand', 'Deepak', 'Nikhil', 'Vivek', 'Pranav',
    'Rajesh', 'Suresh', 'Alok', 'Mohit', 'Harsh', 'Dev', 'Tushar', 'Akash', 'Kunal'
];

const FIRST_NAMES_FEMALE = [
    'Priya', 'Ananya', 'Saira', 'Sneha', 'Ishita', 'Meera', 'Kavita', 'Ritu', 
    'Zoya', 'Divya', 'Shweta', 'Pooja', 'Nandini', 'Kriti', 'Nisha', 'Smriti', 
    'Mithali', 'Harman', 'Tara', 'Rhea', 'Simran', 'Tanvi', 'Isha', 'Ayesha',
    'Neha', 'Aarti', 'Sunita', 'Geeta', 'Swati', 'Preeti', 'Pooja', 'Anjali', 'Kiran'
];

const LAST_NAMES = [
    'Mehta', 'Sharma', 'Singh', 'Iyer', 'Verma', 'Patel', 'Reddy', 'Malhotra', 
    'Gupta', 'Roy', 'Nair', 'Joshi', 'Rao', 'Kumar', 'Deshmukh', 'Shah', 
    'Khan', 'Pandey', 'Mittal', 'Khanna', 'Mishra', 'Vardhan', 'Bajaj', 'Kapoor',
    'Bose', 'Chatterjee', 'Sen', 'Dutta', 'Banerjee', 'Ghosh', 'Mukherjee', 'Das',
    'Bhat', 'Hegde', 'Kulkarni', 'Patil', 'Chavan', 'Shinde', 'Jadhav', 'Pawar'
];

const REASONS = [
    'Routine Annual Health Checkup',
    'Follow-up Consultation on Blood Pressure',
    'Persistent Migraine and Tension Headache',
    'Skin Allergy, Eczema and Rash Evaluation',
    'Acid Reflux, Indigestion and Abdominal Discomfort',
    'Mild Chest Discomfort & Cardiac Screening',
    'General Viral Fever and Fatigue Assessment',
    'Anxiety, Stress and Sleep Management Consultation',
    'Lower Back Pain and Joint Stiffness',
    'Pediatric Vaccination and Growth Tracking',
    'Eye Strain and Blurred Vision Screening',
    'Seasonal Respiratory Allergy and Cough',
    'Metabolic Health and Thyroid Follow-up',
    'Post-Medication Follow-up Evaluation'
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateName = (isFemale = false) => {
    const first = isFemale ? getRandom(FIRST_NAMES_FEMALE) : getRandom(FIRST_NAMES_MALE);
    const last = getRandom(LAST_NAMES);
    return `${first} ${last}`;
};

const seedDatabase = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB.');

        // Hash common password once for fast batch insertion
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Password123!', salt);

        // 1. Ensure Admin Account
        let adminUser = await User.findOne({ email: 'admin@mediconnect.com' });
        if (!adminUser) {
            adminUser = new User({
                name: 'System Administrator',
                email: 'admin@mediconnect.com',
                password: 'Password123!',
                role: 'admin'
            });
            await adminUser.save();
            console.log('🛡️ Created default Admin account: admin@mediconnect.com / Password123!');
        }

        // 2. Clear Previous Seed Data (Keep Admin and real test accounts)
        console.log('🧹 Cleaning previous synthetic data...');
        const doctorsToDelete = await User.find({ 
            email: { $regex: /@(mediconnect\.com|example\.com)$/ },
            role: { $in: ['doctor', 'patient'] },
            _id: { $ne: adminUser._id }
        });
        const deleteIds = doctorsToDelete.map(u => u._id);
        
        await Appointment.deleteMany({ patientId: { $in: deleteIds } });
        await Doctor.deleteMany({ userId: { $in: deleteIds } });
        await User.deleteMany({ _id: { $in: deleteIds } });
        console.log(`Cleaned ${deleteIds.length} synthetic accounts.`);

        // 3. Seed 50 Doctors
        console.log('👨‍⚕️ Seeding 50 Doctors...');
        const doctorUsers = [];
        const doctorProfiles = [];
        const usedEmails = new Set();

        for (let i = 1; i <= 50; i++) {
            const isFemale = i % 2 === 0;
            const name = generateName(isFemale);
            let email = `doctor.${name.toLowerCase().replace(/\s+/g, '.')}${i}@mediconnect.com`;
            while (usedEmails.has(email)) {
                email = `doctor${i}_${getRandomInt(100, 999)}@mediconnect.com`;
            }
            usedEmails.add(email);

            const spec = getRandom(SPECIALIZATIONS);
            const qual = getRandom(QUALIFICATIONS);
            const exp = getRandomInt(3, 28);
            const fee = getRandomInt(4, 12) * 10; // $40 to $120

            // Multi-day availability
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const docDays = days.filter(() => Math.random() > 0.3); // 3-5 days
            if (docDays.length === 0) docDays.push('Monday', 'Wednesday', 'Friday');

            const availability = docDays.map(day => ({
                day,
                startTime: `${String(getRandomInt(8, 10)).padStart(2, '0')}:00`,
                endTime: `${String(getRandomInt(16, 18)).padStart(2, '0')}:00`
            }));

            doctorUsers.push({
                name: `Dr. ${name}`,
                email: email,
                password: hashedPassword,
                role: 'doctor'
            });

            doctorProfiles.push({
                specialization: spec,
                qualifications: qual,
                experience: exp,
                fees: fee,
                status: 'approved',
                about: `Dr. ${name} is a board-certified ${spec} specialist with ${exp} years of distinguished clinical practice. Dedicated to delivering patient-first, evidence-based care at MediConnect.`,
                image: `https://i.pravatar.cc/300?img=${(i % 70) + 1}`,
                availability
            });
        }

        const insertedDocUsers = await User.insertMany(doctorUsers);
        const doctorDocsToSave = insertedDocUsers.map((user, idx) => ({
            ...doctorProfiles[idx],
            userId: user._id
        }));
        const insertedDoctors = await Doctor.insertMany(doctorDocsToSave);
        console.log(`✅ Successfully seeded ${insertedDoctors.length} Doctors.`);

        // 4. Seed 200 Patients
        console.log('🧑‍🤝‍🧑 Seeding 200 Patients...');
        const patientUsers = [];
        for (let i = 1; i <= 200; i++) {
            const isFemale = i % 2 === 0;
            const name = generateName(isFemale);
            let email = `patient.${name.toLowerCase().replace(/\s+/g, '.')}${i}@mediconnect.com`;
            while (usedEmails.has(email)) {
                email = `patient${i}_${getRandomInt(100, 999)}@mediconnect.com`;
            }
            usedEmails.add(email);

            patientUsers.push({
                name,
                email,
                password: hashedPassword,
                role: 'patient'
            });
        }

        const insertedPatients = await User.insertMany(patientUsers);
        console.log(`✅ Successfully seeded ${insertedPatients.length} Patients.`);

        // 5. Seed Realistic Appointments
        console.log('📅 Seeding ~120 Clinical Appointments...');
        const appointmentsToInsert = [];
        const statuses = ['approved', 'approved', 'pending', 'completed', 'approved', 'rejected'];
        const times = ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:30 PM', '04:00 PM'];

        for (let i = 0; i < 120; i++) {
            const patient = getRandom(insertedPatients);
            const doctor = getRandom(insertedDoctors);
            const status = getRandom(statuses);
            const reason = getRandom(REASONS);
            const time = getRandom(times);

            // Date spread: past 14 days to next 14 days
            const dayOffset = getRandomInt(-14, 14);
            const apptDate = new Date();
            apptDate.setDate(apptDate.getDate() + dayOffset);
            apptDate.setHours(10, 0, 0, 0);

            appointmentsToInsert.push({
                patientId: patient._id,
                doctorId: doctor._id,
                date: apptDate,
                time: time,
                status: status,
                reason: reason,
                createdAt: new Date(Date.now() - getRandomInt(1, 10) * 86400000)
            });
        }

        const insertedAppointments = await Appointment.insertMany(appointmentsToInsert);
        console.log(`✅ Successfully seeded ${insertedAppointments.length} Appointments.`);

        console.log('\n=============================================');
        console.log('🎉 MEDICONNECT DATABASE SEED COMPLETE!');
        console.log(`• Doctors:      ${insertedDoctors.length}`);
        console.log(`• Patients:     ${insertedPatients.length}`);
        console.log(`• Appointments: ${insertedAppointments.length}`);
        console.log('• Admin:        admin@mediconnect.com / Password123!');
        console.log('• Sample User:  doctor.arjun.mehta1@mediconnect.com / Password123!');
        console.log('=============================================\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
