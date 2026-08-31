const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    specialization: {
        type: String,
        required: [true, 'Please provide specialization'],
        trim: true,
    },
    qualifications: {
        type: String,
        required: [true, 'Please provide qualifications'],
    },
    experience: {
        type: Number,
        required: [true, 'Please provide years of experience'],
        min: 0,
    },
    fees: {
        type: Number,
        required: [true, 'Please provide consultation fees'],
        min: 0,
    },
    availability: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
    }],
    about: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        trim: true,
        default: '',
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', ''],
        default: '',
    },
    registrationNumber: {
        type: String,
        trim: true,
        default: '',
    },
    clinicAddress: {
        type: String,
        trim: true,
        default: '',
    },
    city: {
        type: String,
        trim: true,
        default: '',
    },
    languages: [{
        type: String,
        trim: true,
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'blocked'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Doctor', doctorSchema);
