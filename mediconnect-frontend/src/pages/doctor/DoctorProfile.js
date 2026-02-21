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
                const doc = response.data.doctor;
                // Normalize: handle both old string[] and new object[] formats
                let availability = doc.availability || [];
                if (availability.length > 0 && typeof availability[0] === 'string') {
                    availability = availability.map(day => ({ day, startTime: '10:00', endTime: '17:00' }));
                }
                setFormData({
                    specialization: doc.specialization || '',
                    qualifications: doc.qualifications || '',
                    experience: doc.experience || '',
                    fees: doc.fees || '',
                    availability,
                    about: doc.about || '',
                    image: doc.image || '',
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
        setFormData(prev => {
            const exists = prev.availability.find(a => a.day === day);
            if (exists) {
                return { ...prev, availability: prev.availability.filter(a => a.day !== day) };
            } else {
                return { ...prev, availability: [...prev.availability, { day, startTime: '10:00', endTime: '17:00' }] };
            }
        });
    };

    const handleTimeChange = (day, field, value) => {
        setFormData(prev => ({
            ...prev,
            availability: prev.availability.map(a =>
                a.day === day ? { ...a, [field]: value } : a
            ),
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
                            <h1>{isEdit ? 'Edit Profile' : 'Create Profile'}</h1>
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
                                    D
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
                            <label className="form-label">Availability (select days & set hours)</label>
                            <div className="filter-tabs">
                                {daysOfWeek.map(day => (
                                    <button
                                        key={day}
                                        type="button"
                                        className={`filter-tab ${formData.availability.find(a => a.day === day) ? 'active' : ''}`}
                                        onClick={() => toggleDay(day)}
                                    >
                                        {day.slice(0, 3)}
                                    </button>
                                ))}
                            </div>

                            {/* Time range pickers for selected days */}
                            {formData.availability.length > 0 && (
                                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {daysOfWeek.filter(d => formData.availability.find(a => a.day === d)).map(day => {
                                        const slot = formData.availability.find(a => a.day === day);
                                        return (
                                            <div key={day} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.75rem 1rem',
                                                background: 'rgba(99, 102, 241, 0.05)',
                                                borderRadius: 'var(--radius-lg)',
                                                border: '1px solid rgba(99, 102, 241, 0.1)',
                                            }}>
                                                <span style={{ fontWeight: 600, minWidth: '80px', color: 'var(--gray-700)' }}>{day}</span>
                                                <input
                                                    type="time"
                                                    value={slot.startTime}
                                                    onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                                                    className="form-input"
                                                    style={{ width: 'auto', flex: 1 }}
                                                />
                                                <span style={{ color: 'var(--gray-400)', fontWeight: 500 }}>to</span>
                                                <input
                                                    type="time"
                                                    value={slot.endTime}
                                                    onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                                                    className="form-input"
                                                    style={{ width: 'auto', flex: 1 }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
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
