const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Create doctor profile
// @route   POST /api/doctor/profile
// @access  Private (Doctor)
exports.createProfile = async (req, res) => {
    try {
        const { specialization, qualifications, experience, fees, availability, about, image } = req.body;

        // Check if profile already exists
        const existingProfile = await Doctor.findOne({ userId: req.user.id });

        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: 'Doctor profile already exists. Use update endpoint instead.',
            });
        }

        // Create doctor profile
        const doctor = await Doctor.create({
            userId: req.user.id,
            specialization,
            qualifications,
            experience,
            fees,
            availability,
            about,
            image,
        });

        res.status(201).json({
            success: true,
            message: 'Doctor profile created successfully. Awaiting admin approval.',
            doctor,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update doctor profile
// @route   PUT /api/doctor/profile
// @access  Private (Doctor)
exports.updateProfile = async (req, res) => {
    try {
        const { specialization, qualifications, experience, fees, availability, about, image } = req.body;

        let doctor = await Doctor.findOne({ userId: req.user.id });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor profile not found. Please create a profile first.',
            });
        }

        doctor = await Doctor.findOneAndUpdate(
            { userId: req.user.id },
            { specialization, qualifications, experience, fees, availability, about, image },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            doctor,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get doctor's own profile
// @route   GET /api/doctor/profile
// @access  Private (Doctor)
exports.getProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id }).populate('userId', 'name email');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor profile not found',
            });
        }

        res.status(200).json({
            success: true,
            doctor,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get appointment requests for doctor
// @route   GET /api/doctor/appointments
// @access  Private (Doctor)
exports.getAppointments = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor profile not found',
            });
        }

        const appointments = await Appointment.find({ doctorId: doctor._id })
            .populate('patientId', 'name email')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: appointments.length,
            appointments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Accept appointment
// @route   PUT /api/doctor/appointments/:id/accept
// @access  Private (Doctor)
exports.acceptAppointment = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor profile not found',
            });
        }

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }

        // Check if appointment belongs to this doctor
        if (appointment.doctorId.toString() !== doctor._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to modify this appointment',
            });
        }

        if (appointment.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot accept appointment with status: ${appointment.status}`,
            });
        }

        appointment.status = 'approved';
        await appointment.save();

        res.status(200).json({
            success: true,
            message: 'Appointment accepted successfully',
            appointment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Reject appointment
// @route   PUT /api/doctor/appointments/:id/reject
// @access  Private (Doctor)
exports.rejectAppointment = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor profile not found',
            });
        }

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }

        // Check if appointment belongs to this doctor
        if (appointment.doctorId.toString() !== doctor._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to modify this appointment',
            });
        }

        if (appointment.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot reject appointment with status: ${appointment.status}`,
            });
        }

        appointment.status = 'rejected';
        await appointment.save();

        res.status(200).json({
            success: true,
            message: 'Appointment rejected',
            appointment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get consultation history
// @route   GET /api/doctor/history
// @access  Private (Doctor)
exports.getHistory = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor profile not found',
            });
        }

        const appointments = await Appointment.find({
            doctorId: doctor._id,
            status: { $in: ['approved', 'completed'] },
        })
            .populate('patientId', 'name email')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: appointments.length,
            appointments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
