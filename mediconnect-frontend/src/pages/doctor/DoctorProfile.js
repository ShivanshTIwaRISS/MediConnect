import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import '../patient/PatientDashboard.css';

const DoctorProfile = () => {
    const [formData, setFormData] = useState({
        specialization: '',
        qualifications: '',
        experience: '',
        fees: '',
        availability: [],
        about: '',
        image: '',
    });
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/doctor/profile');
            if (response.data.doctor) {
                setFormData({
                    specialization: response.data.doctor.specialization || '',
                    qualifications: response.data.doctor.qualifications || '',
                    experience: response.data.doctor.experience || '',
                    fees: response.data.doctor.fees || '',
                    availability: response.data.doctor.availability || [],
                    about: response.data.doctor.about || '',
                    image: response.data.doctor.image || '',
                });
                setIsEdit(true);
            }
        } catch (error) {
            console.error('Profile not found, will create new');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const toggleDay = (day) => {
        setFormData(prev => ({
            ...prev,
            availability: prev.availability.includes(day)
                ? prev.availability.filter(d => d !== day)
                : [...prev.availability, day],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            if (isEdit) {
                await api.put('/doctor/profile', formData);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                await api.post('/doctor/profile', formData);
                setMessage({ type: 'success', text: 'Profile created successfully! Awaiting admin approval.' });
                setIsEdit(true);
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to save profile',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="dashboard-page">
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="welcome-banner fade-in">
                    <div className="welcome-content" style={{ justifyContent: 'center', textAlign: 'center' }}>
                        <div className="welcome-text">
                            <h1>{isEdit ? 'Edit Profile' : 'Create Profile'} 👨‍⚕️</h1>
                            <p>{isEdit ? 'Update your professional information' : 'Set up your doctor profile to start receiving patients'}</p>
                        </div>
                    </div>
                </div>

                <div className="card card-glass fade-in">
                    {message.text && (
                        <div className={`alert alert-${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Image & Preview */}
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            {formData.image ? (
                                <img
                                    src={formData.image}
                                    alt="Profile"
                                    style={{
                                        width: '100px', height: '100px',
                                        borderRadius: 'var(--radius-xl)',
                                        objectFit: 'cover',
                                        margin: '0 auto 0.75rem',
                                        display: 'block',
                                        border: '3px solid var(--primary-200)',
                                    }}
                                />
                            ) : (
                                <div className="avatar avatar-xl" style={{
                                    margin: '0 auto 0.75rem',
                                    fontSize: '2.5rem',
                                    width: '100px',
                                    height: '100px',
                                }}>
                                    👨‍⚕️
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Specialization</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    className="form-input"
                                    placeholder="e.g., Cardiologist"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Qualifications</label>
                                <input
                                    type="text"
                                    name="qualifications"
                                    className="form-input"
                                    placeholder="e.g., MBBS, MD"
                                    value={formData.qualifications}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Experience (years)</label>
                                <input
                                    type="number"
                                    name="experience"
                                    className="form-input"
                                    placeholder="e.g., 10"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Consultation Fee ($)</label>
                                <input
                                    type="number"
                                    name="fees"
                                    className="form-input"
                                    placeholder="e.g., 100"
                                    value={formData.fees}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Profile Image URL</label>
                            <input
                                type="url"
                                name="image"
                                className="form-input"
                                placeholder="https://example.com/photo.jpg"
                                value={formData.image}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Availability</label>
                            <div className="filter-tabs">
                                {daysOfWeek.map(day => (
                                    <button
                                        key={day}
                                        type="button"
                                        className={`filter-tab ${formData.availability.includes(day) ? 'active' : ''}`}
                                        onClick={() => toggleDay(day)}
                                    >
                                        {day.slice(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">About</label>
                            <textarea
                                name="about"
                                className="form-input"
                                placeholder="Tell patients about yourself, your experience, and your approach..."
                                value={formData.about}
                                onChange={handleChange}
                                rows="4"
                                style={{ resize: 'vertical' }}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : (isEdit ? 'Update Profile' : 'Create Profile')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
