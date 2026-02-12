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
    availability: {
        type: [String],
        required: [true, 'Please provide availability'],
    },
    about: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        default: '',
    },
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
