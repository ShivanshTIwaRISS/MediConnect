require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect';

const specializations = [
    'Cardiology', 'Dermatology', 'Pediatrics', 'Neurology', 'Orthopedics', 
    'Psychiatry', 'Ophthalmology', 'Gastroenterology', 'Endocrinology', 'Oncology',
    'General Medicine', 'Gynecology', 'Urology', 'ENT Specialist', 'Dentist'
];

const qualifications = [
    'MBBS, MD', 'MBBS, MS', 'MBBS, DNB', 'MBBS, MD, DM', 'MBBS, MS, MCh'
];

const doctorNames = [
    'Arjun Mehta', 'Priya Sharma', 'Vikram Singh', 'Ananya Iyer', 'Rahul Verma',
    'Saira Banu', 'Amit Patel', 'Sneha Reddy', 'Karan Malhotra', 'Ishita Gupta',
    'Siddharth Roy', 'Meera Nair', 'Aditya Joshi', 'Kavita Rao', 'Sanjay Kumar',
    'Ritu Deshmukh', 'Abhishek Shah', 'Zoya Khan', 'Manish Pandey', 'Divya Mittal',
    'Rohan Khanna', 'Shweta Mishra', 'Yash Vardhan', 'Pooja Hegde', 'Sameer Ali',
    'Nandini Bajaj', 'Varun Dhawan', 'Kriti Sanon', 'Akash Ambani', 'Radhika Merchant',
    'Vijay Mallya', 'Nisha Agarwal', 'Gautam Gambhir', 'Shikhar Dhawan', 'Hardik Pandya',
    'Jasprit Bumrah', 'KL Rahul', 'Smriti Mandhana', 'Mithali Raj', 'Harmanpreet Kaur',
    'Shah Rukh Khan', 'Gauri Khan', 'Aryan Khan', 'Suhana Khan', 'AbRam Khan',
    'Salman Khan', 'Aamir Khan', 'Saif Ali Khan', 'Kareena Kapoor', 'Ranbir Kapoor'
];

const seedDoctors = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB for seeding...');

        // Clear existing doctors and their user accounts
        // First find users with role 'doctor' to avoid deleting patients/admins
        const doctorUsers = await User.find({ role: 'doctor' });
        const doctorUserIds = doctorUsers.map(u => u._id);
        
        await Doctor.deleteMany({ userId: { $in: doctorUserIds } });
        await User.deleteMany({ _id: { $in: doctorUserIds } });
        
        console.log('Cleared existing doctors and their user accounts.');

        const doctorsToInsert = [];
        const usersToInsert = [];

        for (let i = 0; i < 50; i++) {
            const name = doctorNames[i];
            const email = `doctor${i + 1}@mediconnect.com`;
            const specialization = specializations[Math.floor(Math.random() * specializations.length)];
            const qualification = qualifications[Math.floor(Math.random() * qualifications.length)];
            const experience = Math.floor(Math.random() * 25) + 3; // 3 to 27 years
            const fees = (Math.floor(Math.random() * 15) + 4) * 100; // 400 to 1800
            
            const user = new User({
                name: name,
                email: email,
                password: 'Password123!',
                role: 'doctor'
            });

            const savedUser = await user.save();

            const doctor = new Doctor({
                userId: savedUser._id,
                specialization: specialization,
                qualifications: qualification,
                experience: experience,
                fees: fees,
                status: 'approved',
                about: `Dr. ${name} is a highly experienced ${specialization} specialist with over ${experience} years of practice. Dedicated to providing the best healthcare services at MediConnect.`,
                image: `https://i.pravatar.cc/300?u=${email}`, // Using pravatar for unique profile pictures
                availability: [
                    { day: 'Monday', startTime: '09:00', endTime: '13:00' },
                    { day: 'Wednesday', startTime: '14:00', endTime: '18:00' },
                    { day: 'Friday', startTime: '09:00', endTime: '17:00' }
                ]
            });

            await doctor.save();
            console.log(`Seeded: Dr. ${name} (${specialization})`);
        }

        console.log('Successfully seeded 50 doctors!');
        process.exit();
    } catch (error) {
        console.error('Error seeding doctors:', error);
        process.exit(1);
    }
};

seedDoctors();
