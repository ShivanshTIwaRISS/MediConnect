const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const User = require('./models/User');
require('dotenv').config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect');
        const approvedDoctors = await Doctor.find({ status: 'approved' }).populate('userId');
        console.log('Approved Doctors count:', approvedDoctors.length);
        approvedDoctors.forEach(d => {
            console.log(`- Dr. ${d.userId?.name} (${d.specialization}) - Status: ${d.status}`);
        });
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();
