import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../../components/Icons';

const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 'Gujarati', 'Urdu', 'Punjabi', 'Malayalam'];
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorProfile = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [currentStep, setCurrentStep] = useState(1);
    const [status, setStatus] = useState('pending');
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        specialization: '',
        qualifications: '',
        experience: '',
        fees: '',
        availability: [
            { day: 'Monday', startTime: '10:00', endTime: '17:00' },
            { day: 'Tuesday', startTime: '10:00', endTime: '17:00' },
            { day: 'Wednesday', startTime: '10:00', endTime: '17:00' },
            { day: 'Thursday', startTime: '10:00', endTime: '17:00' },
            { day: 'Friday', startTime: '10:00', endTime: '17:00' },
        ],
        about: '',
        image: '',
        phone: '',
        gender: 'Male',
        registrationNumber: '',
        clinicAddress: '',
        city: '',
        languages: ['English', 'Hindi'],
    });

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
                    availability: availability.length > 0 ? availability : [
                        { day: 'Monday', startTime: '10:00', endTime: '17:00' },
                        { day: 'Wednesday', startTime: '10:00', endTime: '17:00' },
                        { day: 'Friday', startTime: '10:00', endTime: '17:00' },
                    ],
                    about: doc.about || '',
                    image: doc.image || '',
                    phone: doc.phone || '',
                    gender: doc.gender || 'Male',
                    registrationNumber: doc.registrationNumber || '',
                    clinicAddress: doc.clinicAddress || '',
                    city: doc.city || '',
                    languages: Array.isArray(doc.languages) && doc.languages.length > 0 ? doc.languages : ['English', 'Hindi'],
                });
                setStatus(doc.status || 'pending');
                setIsEdit(true);
            }
        } catch (error) {
            console.log('No existing profile, starting new registration flow');
            setStatus('pending');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const toggleLanguage = (lang) => {
        setFormData(prev => {
            const exists = prev.languages.includes(lang);
            if (exists) {
                return { ...prev, languages: prev.languages.filter(l => l !== lang) };
            } else {
                return { ...prev, languages: [...prev.languages, lang] };
            }
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
        if (e) e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            if (isEdit) {
                const res = await api.put('/doctor/profile', formData);
                if (res.data?.doctor) {
                    setStatus(res.data.doctor.status || status);
                }
                setMessage({ type: 'success', text: 'Clinical credentials and profile updated successfully.' });
            } else {
                const res = await api.post('/doctor/profile', formData);
                if (res.data?.doctor) {
                    setStatus(res.data.doctor.status || 'pending');
                }
                setMessage({ type: 'success', text: 'Practitioner application submitted! Awaiting administrator credential verification.' });
                setIsEdit(true);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to save practitioner profile.',
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setSaving(false);
        }
    };

    const nextStep = () => {
        setMessage({ type: '', text: '' });
        setCurrentStep(prev => Math.min(prev + 1, 4));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const prevStep = () => {
        setMessage({ type: '', text: '' });
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
                <p>Loading physician record…</p>
            </div>
        );
    }

    const steps = [
        { num: 1, title: 'Personal & Contact', icon: 'user' },
        { num: 2, title: 'Medical Credentials', icon: 'stethoscope' },
        { num: 3, title: 'Schedule & Fees', icon: 'calendar' },
        { num: 4, title: 'Bio & Preview', icon: 'checkCircle' },
    ];

    return (
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }} className="anim-fade-up">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 'var(--radius-xl)',
                            background: 'var(--primary-light)', border: '1px solid var(--border-subtle)',
                            color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Icon name="stethoscope" size={22} />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
                                {isEdit ? 'Physician Profile & Settings' : 'Physician Registration'}
                            </h1>
                            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                                {isEdit ? 'Manage your medical privileges, fees, and consultation availability.' : 'Complete your practitioner profile to begin accepting patient bookings.'}
                            </p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                        {status === 'approved' && (
                            <span className="badge badge-approved" style={{ fontSize: '0.85rem', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Icon name="checkCircle" size={14} /> Certified Provider
                            </span>
                        )}
                        {status === 'pending' && (
                            <span className="badge badge-pending" style={{ fontSize: '0.85rem', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Icon name="clockAlert" size={14} /> Pending Verification
                            </span>
                        )}
                        {status === 'blocked' && (
                            <span className="badge badge-blocked" style={{ fontSize: '0.85rem', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <Icon name="ban" size={14} /> Account Suspended
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Alert Banner */}
            {status === 'pending' && (
                <div className="alert alert-warning anim-fade-up" style={{ marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    <Icon name="alertTriangle" size={20} style={{ flexShrink: 0 }} />
                    <div>
                        <strong>Profile Under Review:</strong> Your medical credentials have been submitted and are currently in the verification queue. Once approved by the administration team, your profile will be published on the patient directory.
                    </div>
                </div>
            )}

            {message.text && (
                <div className={`alert alert-${message.type} anim-fade-up`} style={{ marginBottom: '1.5rem' }}>
                    <Icon name={message.type === 'success' ? 'checkCircle' : 'alertTriangle'} size={18} />
                    <span>{message.text}</span>
                </div>
            )}

            {/* Mobile App-Style Step Progress Bar */}
            <div className="card anim-fade-up anim-d1" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', position: 'relative' }}>
                    {steps.map((step) => {
                        const isActive = currentStep === step.num;
                        const isDone = currentStep > step.num;
                        return (
                            <button
                                key={step.num}
                                type="button"
                                onClick={() => setCurrentStep(step.num)}
                                style={{
                                    background: isActive ? 'var(--primary-light)' : 'transparent',
                                    border: '1px solid',
                                    borderColor: isActive ? 'var(--primary)' : isDone ? 'var(--success-border)' : 'var(--border-subtle)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '0.65rem 0.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <div style={{
                                    width: 28, height: 28, borderRadius: '50%',
                                    background: isDone ? 'var(--success)' : isActive ? 'var(--primary)' : 'var(--bg-glass)',
                                    color: isDone || isActive ? '#ffffff' : 'var(--text-muted)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.8rem', fontWeight: 700
                                }}>
                                    {isDone ? '✓' : step.num}
                                </div>
                                <span style={{
                                    fontSize: '0.72rem',
                                    fontWeight: isActive ? 700 : 500,
                                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    width: '100%'
                                }}>
                                    {step.title}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Step Content Cards */}
            <form onSubmit={handleSubmit}>
                {/* STEP 1: Personal & Contact Information */}
                {currentStep === 1 && (
                    <div className="card anim-fade-up" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                            <Icon name="user" size={20} color="var(--primary)" />
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Step 1: Practitioner Details & Clinic Location</h2>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            Provide personal contact info and clinic location where you receive offline patients.
                        </p>

                        {/* Profile Image & Avatar */}
                        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                            {formData.image ? (
                                <img
                                    src={formData.image}
                                    alt="Doctor"
                                    style={{
                                        width: '90px', height: '90px',
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
                                    width: '80px',
                                    height: '80px',
                                    background: 'var(--gradient-primary)',
                                    borderRadius: 'var(--radius-2xl)',
                                    boxShadow: 'var(--shadow-md)',
                                    color: '#ffffff',
                                    fontSize: '2rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {(user?.name || 'Dr').charAt(0)}
                                </div>
                            )}
                            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                Dr. {user?.name || 'Practitioner'}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {user?.email}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Profile Photo URL</label>
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
                                <label className="form-label">Phone Number (with Country Code) *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-input"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Gender</label>
                                <select
                                    name="gender"
                                    className="form-input"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">City / Region *</label>
                                <input
                                    type="text"
                                    name="city"
                                    className="form-input"
                                    placeholder="e.g., Mumbai, Delhi, Bengaluru"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: '1.25rem' }}>
                            <label className="form-label">Clinic / Hospital Address</label>
                            <input
                                type="text"
                                name="clinicAddress"
                                className="form-input"
                                placeholder="e.g., Suite 402, Apex Medical Plaza, MG Road"
                                value={formData.clinicAddress}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={nextStep}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                                Continue to Credentials
                                <Icon name="chevronRight" size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Medical Qualifications & Credentials */}
                {currentStep === 2 && (
                    <div className="card anim-fade-up" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                            <Icon name="stethoscope" size={20} color="var(--primary)" />
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Step 2: Medical Credentials & Specialization</h2>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            Enter your clinical specialization, medical license details, and communication languages.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                            <div className="form-group">
                                <label className="form-label">Clinical Specialization *</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    className="form-input"
                                    placeholder="e.g., Cardiologist, Neurologist, General Physician"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Medical Degrees & Qualifications *</label>
                                <input
                                    type="text"
                                    name="qualifications"
                                    className="form-input"
                                    placeholder="e.g., MBBS, MD, DM (Cardiology)"
                                    value={formData.qualifications}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Medical Registration / License No. *</label>
                                <input
                                    type="text"
                                    name="registrationNumber"
                                    className="form-input"
                                    placeholder="e.g., MCI-2018-984321"
                                    value={formData.registrationNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Years of Clinical Experience *</label>
                                <input
                                    type="number"
                                    name="experience"
                                    className="form-input"
                                    placeholder="e.g., 10"
                                    min="0"
                                    max="70"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Languages Spoken Chips */}
                        <div className="form-group" style={{ marginTop: '1.25rem' }}>
                            <label className="form-label">Languages Spoken with Patients (Select all that apply)</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.4rem' }}>
                                {LANGUAGE_OPTIONS.map(lang => {
                                    const isSelected = formData.languages.includes(lang);
                                    return (
                                        <button
                                            key={lang}
                                            type="button"
                                            onClick={() => toggleLanguage(lang)}
                                            style={{
                                                padding: '0.4rem 0.85rem',
                                                borderRadius: 'var(--radius-full)',
                                                border: '1px solid',
                                                borderColor: isSelected ? 'var(--primary)' : 'var(--border-default)',
                                                background: isSelected ? 'var(--primary-light)' : 'var(--bg-glass)',
                                                color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                                                fontWeight: isSelected ? 700 : 500,
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            {isSelected && '✓ '} {lang}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.75rem' }}>
                            <button type="button" className="btn btn-outline" onClick={prevStep}>
                                Back
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={nextStep}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                                Continue to Schedule & Fees
                                <Icon name="chevronRight" size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Consultation Schedule & Fees */}
                {currentStep === 3 && (
                    <div className="card anim-fade-up" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                            <Icon name="calendar" size={20} color="var(--primary)" />
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Step 3: Consultation Fee & Weekly Schedule</h2>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            Set your consultation rate and pick the active hours you accept patient bookings.
                        </p>

                        <div className="form-group" style={{ maxWidth: '300px', marginBottom: '1.75rem' }}>
                            <label className="form-label">Consultation Fee (₹ INR) *</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                    ₹
                                </span>
                                <input
                                    type="number"
                                    name="fees"
                                    className="form-input"
                                    placeholder="500"
                                    min="0"
                                    value={formData.fees}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '2.25rem', fontSize: '1.1rem', fontWeight: 700 }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Weekly Consultation Days (Select Active Days)</label>
                            <div className="filter-tabs" style={{ marginBottom: '1rem' }}>
                                {DAYS_OF_WEEK.map(day => (
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
                                    {DAYS_OF_WEEK.filter(d => formData.availability.find(a => a.day === d)).map(day => {
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
                                                flexWrap: 'wrap'
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

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.75rem' }}>
                            <button type="button" className="btn btn-outline" onClick={prevStep}>
                                Back
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={nextStep}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                                Continue to Bio & Preview
                                <Icon name="chevronRight" size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 4: Bio & Live Preview Card */}
                {currentStep === 4 && (
                    <div className="card anim-fade-up" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                            <Icon name="checkCircle" size={20} color="var(--primary)" />
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Step 4: Professional Biography & Directory Preview</h2>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            Write a brief description of your clinical approach, and preview how your card appears to patients.
                        </p>

                        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                            <label className="form-label">Professional Biography & Clinical Approach</label>
                            <textarea
                                name="about"
                                className="form-input"
                                placeholder="Describe your clinical training, fellowship certifications, areas of focus, and patient-first approach..."
                                value={formData.about}
                                onChange={handleChange}
                                rows="4"
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        {/* Live Directory Preview Card */}
                        <div style={{ marginBottom: '1.75rem' }}>
                            <label className="form-label" style={{ marginBottom: '0.5rem' }}>
                                Live Patient Directory Card Preview:
                            </label>
                            <div className="doctor-card-new" style={{ maxWidth: '420px', margin: '0 auto', boxShadow: 'var(--shadow-lg)' }}>
                                <div className="doctor-card-header">
                                    {formData.image ? (
                                        <img
                                            src={formData.image}
                                            alt="Doctor Preview"
                                            style={{ width: 56, height: 56, borderRadius: 'var(--radius-xl)', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div
                                            className="avatar avatar-lg"
                                            style={{
                                                borderRadius: 'var(--radius-xl)',
                                                background: 'var(--gradient-primary)',
                                                color: '#ffffff'
                                            }}
                                        >
                                            {(user?.name || 'D').charAt(0)}
                                        </div>
                                    )}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div className="doctor-card-name">Dr. {user?.name || 'Practitioner'}</div>
                                        <span className="doctor-card-spec">{formData.specialization || 'Specialization'}</span>
                                        <span className="doctor-card-qual">{formData.qualifications || 'Medical Degrees'}</span>
                                    </div>
                                </div>

                                <div className="detail-divider" />

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <div className="detail-row">
                                        <span className="detail-row-label">Experience</span>
                                        <span className="detail-row-value">{formData.experience || 0} Years</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-row-label">Consultation Rate</span>
                                        <span className="detail-row-value brand">₹{formData.fees || 0}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-row-label">City</span>
                                        <span className="detail-row-value">{formData.city || 'City Location'}</span>
                                    </div>
                                </div>

                                <div style={{
                                    padding: '0.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-glass)',
                                    textAlign: 'center',
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    Preview of your verified directory listing
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                            <button type="button" className="btn btn-outline" onClick={prevStep}>
                                Back
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={saving}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Icon name="check" size={18} />
                                {saving ? 'Saving Records…' : (isEdit ? 'Save Clinical Profile' : 'Submit Credentials for Verification')}
                            </button>
                        </div>
                    </div>
                )}
            </form>

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
