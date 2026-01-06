const express = require('express');
const router = express.Router();
const {
    createProfile,
    updateProfile,
    getProfile,
    getAppointments,
    acceptAppointment,
    rejectAppointment,
    getHistory,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require doctor role
router.use(protect);
router.use(authorize('doctor'));

router.post('/profile', createProfile);
router.put('/profile', updateProfile);
router.get('/profile', getProfile);
router.get('/appointments', getAppointments);
router.put('/appointments/:id/accept', acceptAppointment);
router.put('/appointments/:id/reject', rejectAppointment);
router.get('/history', getHistory);

module.exports = router;
