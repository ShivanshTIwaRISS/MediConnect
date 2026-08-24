import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

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
        return <div className="loading-container"><div className="spinner"></div><p>Loading profile…</p></div>;
    }

    return (
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }} className="anim-fade-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                        background: 'var(--stat-green-bg)', border: '1px solid var(--stat-green-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                    }}>👨‍⚕️</div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{isEdit ? 'Edit Doctor Profile' : 'Create Doctor Profile'}</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                    {isEdit ? 'Update your clinical details and patient schedule.' : 'Set up your professional credentials to receive patient bookings.'}
                </p>
            </div>

            <div className="card anim-fade-up anim-d1" style={{ padding: '2rem' }}>
                {message.text && (
                    <div className={`alert alert-${message.type}`} style={{ marginBottom: '1.5rem' }}>
                        {message.type === 'success' ? '✓ ' : '✕ '} {message.text}
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
                                    borderRadius: 'var(--radius-2xl)',
                                    objectFit: 'cover',
                                    margin: '0 auto 0.75rem',
                                    display: 'block',
                                    border: '3px solid var(--primary-light)',
                                    boxShadow: 'var(--shadow-md)',
                                }}
                            />
                        ) : (
                            <div className="avatar avatar-xl" style={{
                                margin: '0 auto 0.75rem',
                                fontSize: '2.5rem',
                                width: '90px',
                                height: '90px',
                                background: 'var(--gradient-success)',
                                borderRadius: 'var(--radius-2xl)',
                                boxShadow: 'var(--shadow-md)',
                            }}>
                                👨‍⚕️
                            </div>
                        )}
                        <span className="badge badge-approved" style={{ fontSize: '0.75rem' }}>Doctor Profile</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
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
                        <label className="form-label">Availability Schedule (Select Days)</label>
                        <div className="filter-tabs" style={{ marginBottom: '1rem' }}>
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

                        {formData.availability.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {daysOfWeek.filter(d => formData.availability.find(a => a.day === d)).map(day => {
                                    const slot = formData.availability.find(a => a.day === day);
                                    return (
                                        <div key={day} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1rem',
                                            background: 'var(--bg-glass)',
                                            borderRadius: 'var(--radius-lg)',
                                            border: '1px solid var(--border-subtle)',
                                        }}>
                                            <span style={{ fontWeight: 600, minWidth: '85px', color: 'var(--text-primary)', fontSize: '0.875rem' }}>{day}</span>
                                            <input
                                                type="time"
                                                value={slot.startTime}
                                                onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                                                className="form-input"
                                                style={{ width: 'auto', flex: 1 }}
                                            />
                                            <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>to</span>
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
                        <label className="form-label">About / Biography</label>
                        <textarea
                            name="about"
                            className="form-input"
                            placeholder="Tell patients about your background, expertise, and approach..."
                            value={formData.about}
                            onChange={handleChange}
                            rows="4"
                            style={{ resize: 'vertical' }}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        style={{ marginTop: '1rem', justifyContent: 'center' }}
                        disabled={saving}
                    >
                        {saving ? 'Saving changes…' : (isEdit ? 'Update Profile' : 'Create Profile')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DoctorProfile;
