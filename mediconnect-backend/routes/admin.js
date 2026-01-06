const express = require('express');
const router = express.Router();
const {
    getPendingDoctors,
    approveDoctor,
    blockDoctor,
    getAllDoctors,
    getAllUsers,
    deleteUser,
    getAllAppointments,
    getStatistics,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/doctors/pending', getPendingDoctors);
router.get('/doctors', getAllDoctors);
router.put('/doctors/:id/approve', approveDoctor);
router.put('/doctors/:id/block', blockDoctor);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/appointments', getAllAppointments);
router.get('/statistics', getStatistics);

module.exports = router;
