import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import './BookAppointment.css';
import { assets } from '../../assets/assets_frontend/assets';

const BookAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    const [bookedSlots, setBookedSlots] = useState([]);
    const [formData, setFormData] = useState({
        reason: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        fetchDoctors();
    }, []);

    // Auto-select doctor from URL param
    useEffect(() => {
        const doctorId = searchParams.get('doctorId');
        if (doctorId && doctors.length > 0) {
            const doc = doctors.find(d => d._id === doctorId);
            if (doc) {
                setSelectedDoctor(doc);
            }
        }
    }, [doctors, searchParams]);

    useEffect(() => {
        if (selectedDoctor) {
            getAvailableSlots();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDoctor]);

    // Fetch booked slots when selected day changes
    useEffect(() => {
        if (selectedDoctor && docSlots.length > 0 && docSlots[slotIndex] && docSlots[slotIndex].length > 0) {
            fetchBookedSlots(docSlots[slotIndex][0].datetime);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slotIndex, docSlots]);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/patient/doctors');
            setDoctors(response.data.doctors);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchBookedSlots = async (dateObj) => {
        try {
            const dateStr = dateObj.toISOString().split('T')[0];
            const response = await api.get(`/patient/doctors/${selectedDoctor._id}/booked-slots?date=${dateStr}`);
            setBookedSlots(response.data.bookedSlots || []);
        } catch (error) {
            console.error('Error fetching booked slots:', error);
            setBookedSlots([]);
        }
    };

    const getAvailableSlots = () => {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();
        const slots = [];

        // Normalize availability: handle both old string[] and new object[] formats
        let availability = selectedDoctor.availability || [];
        if (availability.length > 0 && typeof availability[0] === 'string') {
            availability = availability.map(day => ({ day, startTime: '10:00', endTime: '17:00' }));
        }

        for (let i = 0; i < 14; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            const dayName = dayNames[currentDate.getDay()];
            const daySlot = availability.find(a => a.day === dayName);
            if (!daySlot) continue;

            // Parse doctor's start and end hours
            const [startH, startM] = daySlot.startTime.split(':').map(Number);
            const [endH, endM] = daySlot.endTime.split(':').map(Number);

            const slotDate = new Date(currentDate);
            slotDate.setHours(startH, startM, 0, 0);

            const endTime = new Date(currentDate);
            endTime.setHours(endH, endM, 0, 0);

            // If today, skip past times
            if (currentDate.toDateString() === today.toDateString()) {
                const nowPlus = new Date(today);
                nowPlus.setHours(nowPlus.getHours() + 1);
                nowPlus.setMinutes(nowPlus.getMinutes() > 30 ? 30 : 0);
                if (nowPlus > slotDate) {
                    slotDate.setHours(nowPlus.getHours(), nowPlus.getMinutes(), 0, 0);
                }
            }

            const timeSlots = [];
            while (slotDate < endTime) {
                const formattedTime = slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                timeSlots.push({
                    datetime: new Date(slotDate),
                    time: formattedTime,
                });
                slotDate.setMinutes(slotDate.getMinutes() + 30);
            }

            if (timeSlots.length > 0) {
                slots.push(timeSlots);
            }
        }
        setDocSlots(slots);
        setSlotIndex(0);
        setSlotTime('');
        setBookedSlots([]);
    };

    const handleDoctorSelect = (e) => {
        const doc = doctors.find(d => d._id === e.target.value);
        setSelectedDoctor(doc);
        setSlotTime('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!slotTime) {
            setError('Please select a time slot');
            return;
        }

        setError('');
        setSuccess('');
        setLoading(true);

        const date = docSlots[slotIndex][0].datetime;

        try {
            await api.post('/patient/appointments', {
                doctorId: selectedDoctor._id,
                date: date,
                time: slotTime,
                reason: formData.reason || 'General Consultation',
            });
            setSuccess('Appointment booked successfully!');
            setTimeout(() => navigate('/patient/appointments'), 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to book appointment');
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-page">
            <div className="booking-container fade-in">
                <div className="dashboard-header">
                    <h1>Book Appointment</h1>
                    {!selectedDoctor && <p>Select a doctor to see availability</p>}
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="card card-glass mb-4" style={{ padding: '1.5rem' }}>
                    <div className="form-group mb-0">
                        <label className="form-label">Select Doctor</label>
                        <select
                            className="form-select"
                            onChange={handleDoctorSelect}
                            value={selectedDoctor?._id || ''}
                        >
                            <option value="">Choose a doctor...</option>
                            {doctors.map((doc) => (
                                <option key={doc._id} value={doc._id}>
                                    {doc.userId.name} - {doc.specialization}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedDoctor && (
                    <>
                        {/* Doctor Details Card */}
                        <div className="card doctor-card">
                            <div className="doctor-image-container">
                                <img src={selectedDoctor.image || assets.doc1} alt={selectedDoctor.userId.name} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="doctor-info-header">
                                    <h2 className="doctor-name">{selectedDoctor.userId.name}</h2>
                                    <img src={assets.verified_icon} alt="Verified" className="verified-icon" />
                                </div>
                                <p className="doctor-credentials">
                                    {selectedDoctor.qualifications} - {selectedDoctor.specialization}
                                    <span className="experience-badge ml-2">{selectedDoctor.experience} Years</span>
                                </p>

                                <div className="about-section">
                                    <h3 className="about-title">
                                        About <img src={assets.info_icon} alt="info" style={{ width: '15px' }} />
                                    </h3>
                                    <p className="about-text">
                                        {selectedDoctor.about || 'No description provided.'}
                                    </p>
                                </div>

                                <p className="fee-text">
                                    Appointment fee: <span className="fee-amount">${selectedDoctor.fees}</span>
                                </p>
                            </div>
                        </div>

                        {/* Booking Slots */}
                        <div className="booking-slots-container card card-glass p-4">
                            <h3 className="slots-title">Booking slots</h3>

                            {docSlots.length === 0 ? (
                                <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '2rem' }}>
                                    No available slots for this doctor in the next 2 weeks.
                                </p>
                            ) : (
                                <>
                                    <div className="days-scroll">
                                        {docSlots.map((item, index) => (
                                            <div
                                                key={index}
                                                onClick={() => { setSlotIndex(index); setSlotTime(''); }}
                                                className={`day-slot ${slotIndex === index ? 'active' : ''}`}
                                            >
                                                <span className="day-name">
                                                    {item[0] && item[0].datetime.toLocaleDateString([], { weekday: 'short' })}
                                                </span>
                                                <span className="day-date">
                                                    {item[0] && item[0].datetime.getDate()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="times-scroll">
                                        {docSlots[slotIndex].map((item, index) => {
                                            const isBooked = bookedSlots.includes(item.time);
                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => !isBooked && setSlotTime(item.time)}
                                                    className={`time-slot ${item.time === slotTime ? 'active' : ''} ${isBooked ? 'booked' : ''}`}
                                                    title={isBooked ? 'This slot is already booked' : ''}
                                                >
                                                    {item.time.toLowerCase()}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            <div className="form-group mt-4">
                                <label className="form-label">Reason for Consultation</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Describe your symptoms..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="btn btn-primary btn-book"
                                disabled={loading || !slotTime}
                            >
                                {loading ? 'Booking...' : 'Book an appointment'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookAppointment;
