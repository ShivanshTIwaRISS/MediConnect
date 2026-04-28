const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect');
        const users = await User.find();
        console.log('Users found:', users.length);
        users.forEach(u => {
            console.log(`- ${u.name} (${u.email}) - Role: ${u.role}`);
        });
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUsers();
