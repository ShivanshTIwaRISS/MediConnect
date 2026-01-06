const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Get all approved doctors
// @route   GET /api/patient/doctors
// @access  Private (Patient)
exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({ status: 'approved' }).populate('userId', 'name email');

        res.status(200).json({
            success: true,
            count: doctors.length,
            doctors,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Book an appointment
// @route   POST /api/patient/appointments
// @access  Private (Patient)
exports.bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, reason } = req.body;

        // Check if doctor exists and is approved
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        if (doctor.status !== 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Doctor is not available for appointments',
            });
        }

        // Create appointment
        const appointment = await Appointment.create({
            patientId: req.user.id,
            doctorId,
            date,
            time,
            reason,
        });

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            appointment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get patient's appointments
// @route   GET /api/patient/appointments
// @access  Private (Patient)
exports.getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user.id })
            .populate('doctorId')
            .populate({
                path: 'doctorId',
                populate: {
                    path: 'userId',
                    select: 'name email',
                },
            })
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

// @desc    Cancel appointment
// @route   PUT /api/patient/appointments/:id/cancel
// @access  Private (Patient)
exports.cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }

        // Check if appointment belongs to patient
        if (appointment.patientId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this appointment',
            });
        }

        // Check if appointment can be cancelled
        if (appointment.status === 'cancelled' || appointment.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel appointment with status: ${appointment.status}`,
            });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.status(200).json({
            success: true,
            message: 'Appointment cancelled successfully',
            appointment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get patient profile
// @route   GET /api/patient/profile
// @access  Private (Patient)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update patient profile
// @route   PUT /api/patient/profile
// @access  Private (Patient)
exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
