const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const findSuryansh = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediconnect');
        const user = await User.findOne({ name: /suryansh/i });
        if (user) {
            console.log('Found user:', user.name, user.email, user.role);
        } else {
            console.log('Suryansh not found in this database.');
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

findSuryansh();
