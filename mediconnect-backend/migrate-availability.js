const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const Doctor = require('./models/Doctor');

const migrateAvailability = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect');
        console.log('Connected to MongoDB');

        const doctors = await Doctor.find();
        console.log(`Found ${doctors.length} doctors to process.`);

        for (const doctor of doctors) {
            if (typeof doctor.availability === 'string') {
                console.log(`Migrating doctor ${doctor._id} availability string to array...`);
                // Split by common delimiters if present, or just wrap in array
                let availabilityArray = [];
                if (doctor.availability.includes(',')) {
                    availabilityArray = doctor.availability.split(',').map(s => s.trim());
                } else if (doctor.availability.includes('to')) {
                    availabilityArray = [doctor.availability.trim()];
                } else {
                    availabilityArray = [doctor.availability.trim()];
                }

                doctor.availability = availabilityArray;
                await doctor.save();
                console.log(`- Success: ${JSON.stringify(availabilityArray)}`);
            } else {
                console.log(`Skipping doctor ${doctor._id}, availability already ${typeof doctor.availability}`);
            }
        }

        console.log('Migration complete!');
        await mongoose.disconnect();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateAvailability();
