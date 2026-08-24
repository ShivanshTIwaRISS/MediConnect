import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../../components/Icons';

const DoctorProfile = () => {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
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
                setMessage({ type: 'success', text: 'Clinical profile updated successfully.' });
            } else {
                await api.post('/doctor/profile', formData);
                setMessage({ type: 'success', text: 'Profile submitted for credential verification.' });
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
        return <div className="loading-container"><div className="spinner" /><p>Loading physician record…</p></div>;
    }

    return (
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }} className="anim-fade-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                        background: 'var(--primary-light)', border: '1px solid var(--border-subtle)',
                        color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Icon name="stethoscope" size={20} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{isEdit ? 'Clinical Profile & Settings' : 'Physician Registration'}</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                    {isEdit ? 'Update clinical credentials, consultation hours, and interface preferences.' : 'Complete your practitioner profile to begin accepting patient consultations.'}
                </p>
            </div>

            <div className="card anim-fade-up anim-d1" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                {message.text && (
                    <div className={`alert alert-${message.type}`} style={{ marginBottom: '1.5rem' }}>
                        <Icon name={message.type === 'success' ? 'checkCircle' : 'alertTriangle'} size={18} />
                        <span>{message.text}</span>
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
                                    width: '96px', height: '96px',
                                    borderRadius: 'var(--radius-2xl)',
                                    objectFit: 'cover',
                                    margin: '0 auto 0.75rem',
                                    display: 'block',
                                    border: '3px solid var(--primary)',
                                    boxShadow: 'var(--shadow-md)',
                                }}
                            />
                        ) : (
                            <div className="avatar avatar-xl" style={{
                                margin: '0 auto 0.75rem',
                                width: '88px',
                                height: '88px',
                                background: 'var(--gradient-primary)',
                                borderRadius: 'var(--radius-2xl)',
                                boxShadow: 'var(--shadow-md)',
                            }}>
                                <Icon name="stethoscope" size={36} color="white" />
                            </div>
                        )}
                        <span className="badge badge-approved" style={{ fontSize: '0.75rem' }}>
                            <Icon name="checkCircle" size={12} /> Certified Provider
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        <div className="form-group">
                            <label className="form-label">Clinical Specialization</label>
                            <input
                                type="text"
                                name="specialization"
                                className="form-input"
                                placeholder="e.g., Cardiologist, Neurologist"
                                value={formData.specialization}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Medical Degrees & Qualifications</label>
                            <input
                                type="text"
                                name="qualifications"
                                className="form-input"
                                placeholder="e.g., MBBS, MD, FACC"
                                value={formData.qualifications}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Clinical Experience (Years)</label>
                            <input
                                type="number"
                                name="experience"
                                className="form-input"
                                placeholder="e.g., 12"
                                value={formData.experience}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Consultation Rate ($ USD)</label>
                            <input
                                type="number"
                                name="fees"
                                className="form-input"
                                placeholder="e.g., 120"
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
                            placeholder="https://example.com/provider-photo.jpg"
                            value={formData.image}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Weekly Consultation Schedule (Select Days & Active Hours)</label>
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
                                            padding: '0.75rem 1.25rem',
                                            background: 'var(--bg-glass)',
                                            borderRadius: 'var(--radius-lg)',
                                            border: '1px solid var(--border-subtle)',
                                        }}>
                                            <span style={{ fontWeight: 600, minWidth: '90px', color: 'var(--text-primary)', fontSize: '0.875rem' }}>{day}</span>
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
                        <label className="form-label">Professional Biography & Clinical Approach</label>
                        <textarea
                            name="about"
                            className="form-input"
                            placeholder="Detail your clinical training, areas of clinical focus, and patient care approach..."
                            value={formData.about}
                            onChange={handleChange}
                            rows="4"
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        style={{ marginTop: '0.5rem', justifyContent: 'center' }}
                        disabled={saving}
                    >
                        <Icon name="check" size={16} />
                        {saving ? 'Updating records…' : (isEdit ? 'Save Clinical Profile' : 'Submit Credentials')}
                    </button>
                </form>
            </div>

            {/* Appearance & Preferences Card */}
            <div className="card anim-fade-up anim-d2" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Interface Appearance</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Theme Mode</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                            Currently active: <strong style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>{theme} mode</strong>
                        </div>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="btn btn-outline"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
                        <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                    </button>
                </div>
            </div>

            {/* Account & Session Security Card */}
            <div className="card anim-fade-up anim-d3" style={{ padding: '1.75rem', borderColor: 'var(--error-border)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--error)' }}>Account Session</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Sign out of your physician session on this device.
                </p>
                <button
                    onClick={logout}
                    className="btn btn-error"
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    <Icon name="logout" size={16} />
                    <span>Sign Out of Account</span>
                </button>
            </div>
        </div>
    );
};

export default DoctorProfile;
