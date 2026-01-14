const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const Doctor = require('./models/Doctor');
const User = require('./models/User');

const checkDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect');
        console.log('Connected to MongoDB');

        const doctors = await Doctor.find().populate('userId', 'name email role');
        console.log('--- Doctor Data ---');
        console.log(JSON.stringify(doctors, null, 2));

        const users = await User.find();
        console.log('\n--- User Data ---');
        console.log(JSON.stringify(users, null, 2));

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDoctors();
