import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const DoctorProfile = () => {
    const [formData, setFormData] = useState({
        specialization: '',
        qualifications: '',
        experience: '',
        fees: '',
        availability: '',
    });
    const [hasProfile, setHasProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/doctor/profile');
            const profile = response.data.doctor;
            setFormData({
                specialization: profile.specialization,
                qualifications: profile.qualifications,
                experience: profile.experience,
                fees: profile.fees,
                availability: profile.availability,
            });
            setHasProfile(true);
            setLoading(false);
        } catch (error) {
            setHasProfile(false);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            if (hasProfile) {
                await api.put('/doctor/profile', formData);
                setMessage('Profile updated successfully!');
            } else {
                await api.post('/doctor/profile', formData);
                setMessage('Profile created successfully! Awaiting admin approval.');
                setHasProfile(true);
            }
            setSaving(false);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to save profile');
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="dashboard-page">
            <div className="container container-sm">
                <div className="dashboard-header fade-in">
                    <h1>{hasProfile ? 'Update' : 'Create'} Doctor Profile</h1>
                    <p>Manage your professional information</p>
                </div>

                <div className="card card-glass">
                    {message && (
                        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Specialization</label>
                            <input
                                type="text"
                                name="specialization"
                                className="form-input"
                                placeholder="e.g., Cardiologist, Dermatologist"
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
                            <label className="form-label">Years of Experience</label>
                            <input
                                type="number"
                                name="experience"
                                className="form-input"
                                placeholder="e.g., 5"
                                value={formData.experience}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Consultation Fees ($)</label>
                            <input
                                type="number"
                                name="fees"
                                className="form-input"
                                placeholder="e.g., 50"
                                value={formData.fees}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Availability</label>
                            <input
                                type="text"
                                name="availability"
                                className="form-input"
                                placeholder="e.g., Mon-Fri, 9 AM - 5 PM"
                                value={formData.availability}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: '100%' }}>
                            {saving ? 'Saving...' : hasProfile ? 'Update Profile' : 'Create Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
