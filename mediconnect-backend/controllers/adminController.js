const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get pending doctor approvals
// @route   GET /api/admin/doctors/pending
// @access  Private (Admin)
exports.getPendingDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({ status: 'pending' }).populate('userId', 'name email');

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

// @desc    Approve doctor
// @route   PUT /api/admin/doctors/:id/approve
// @access  Private (Admin)
exports.approveDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        doctor.status = 'approved';
        await doctor.save();

        res.status(200).json({
            success: true,
            message: 'Doctor approved successfully',
            doctor,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Block doctor
// @route   PUT /api/admin/doctors/:id/block
// @access  Private (Admin)
exports.blockDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        doctor.status = 'blocked';
        await doctor.save();

        res.status(200).json({
            success: true,
            message: 'Doctor blocked successfully',
            doctor,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Private (Admin)
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('userId', 'name email');

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

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Don't allow admin to delete themselves
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account',
            });
        }

        await User.findByIdAndDelete(req.params.id);

        // If user is a doctor, delete their profile too
        if (user.role === 'doctor') {
            await Doctor.findOneAndDelete({ userId: user._id });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Private (Admin)
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patientId', 'name email')
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

// @desc    Get platform statistics
// @route   GET /api/admin/statistics
// @access  Private (Admin)
exports.getStatistics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPatients = await User.countDocuments({ role: 'patient' });
        const totalDoctors = await Doctor.countDocuments();
        const approvedDoctors = await Doctor.countDocuments({ status: 'approved' });
        const pendingDoctors = await Doctor.countDocuments({ status: 'pending' });
        const blockedDoctors = await Doctor.countDocuments({ status: 'blocked' });
        const totalAppointments = await Appointment.countDocuments();
        const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
        const approvedAppointments = await Appointment.countDocuments({ status: 'approved' });
        const completedAppointments = await Appointment.countDocuments({ status: 'completed' });

        res.status(200).json({
            success: true,
            statistics: {
                users: {
                    total: totalUsers,
                    patients: totalPatients,
                    doctors: totalDoctors,
                },
                doctors: {
                    total: totalDoctors,
                    approved: approvedDoctors,
                    pending: pendingDoctors,
                    blocked: blockedDoctors,
                },
                appointments: {
                    total: totalAppointments,
                    pending: pendingAppointments,
                    approved: approvedAppointments,
                    completed: completedAppointments,
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
