import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const BookAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        doctorId: '',
        date: '',
        time: '',
        reason: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/patient/doctors');
            setDoctors(response.data.doctors);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await api.post('/patient/appointments', formData);
            setSuccess('Appointment booked successfully!');
            setTimeout(() => navigate('/patient/appointments'), 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to book appointment');
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-page">
            <div className="container container-sm">
                <div className="dashboard-header fade-in">
                    <h1>Book Appointment</h1>
                    <p>Schedule a consultation with a doctor</p>
                </div>

                <div className="card card-glass">
                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Select Doctor</label>
                            <select
                                name="doctorId"
                                className="form-select"
                                value={formData.doctorId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Choose a doctor...</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor._id} value={doctor._id}>
                                        {doctor.userId.name} - {doctor.specialization} (${doctor.fees})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Appointment Date</label>
                            <input
                                type="date"
                                name="date"
                                className="form-input"
                                value={formData.date}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Appointment Time</label>
                            <input
                                type="time"
                                name="time"
                                className="form-input"
                                value={formData.time}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Reason for Consultation</label>
                            <textarea
                                name="reason"
                                className="form-textarea"
                                value={formData.reason}
                                onChange={handleChange}
                                placeholder="Describe your symptoms or reason for consultation..."
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                            {loading ? 'Booking...' : 'Book Appointment'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
