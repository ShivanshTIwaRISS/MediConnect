const express = require('express');
const router = express.Router();
const {
    getDoctors,
    getBookedSlots,
    bookAppointment,
    getMyAppointments,
    cancelAppointment,
    getProfile,
    updateProfile,
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require patient role
router.use(protect);
router.use(authorize('patient'));

router.get('/doctors', getDoctors);
router.get('/doctors/:id/booked-slots', getBookedSlots);
router.post('/appointments', bookAppointment);
router.get('/appointments', getMyAppointments);
router.put('/appointments/:id/cancel', cancelAppointment);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
