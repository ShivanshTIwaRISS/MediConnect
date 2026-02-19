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


    const fetchDoctors = async () => {
        try {
            const response = await api.get('/patient/doctors');
            setDoctors(response.data.doctors);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };


    const getAvailableSlots = async () => {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let today = new Date();
        let slots = [];

        for (let i = 0; i < 14; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            // Only show days that match the doctor's availability
            const dayName = dayNames[currentDate.getDay()];
            if (!selectedDoctor.availability || !selectedDoctor.availability.includes(dayName)) {
                continue;
            }

            let endTime = new Date(currentDate);
            endTime.setHours(21, 0, 0, 0);

            if (today.getDate() === currentDate.getDate() && today.getMonth() === currentDate.getMonth()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeSlots = [];

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                timeSlots.push({
                    datetime: new Date(currentDate),
                    time: formattedTime
                });
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            if (timeSlots.length > 0) {
                slots.push(timeSlots);
            }
        }
        setDocSlots(slots);
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

                            <div className="days-scroll">
                                {docSlots.length > 0 && docSlots.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSlotIndex(index)}
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
                                {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSlotTime(item.time)}
                                        className={`time-slot ${item.time === slotTime ? 'active' : ''}`}
                                    >
                                        {item.time.toLowerCase()}
                                    </div>
                                ))}
                            </div>

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
