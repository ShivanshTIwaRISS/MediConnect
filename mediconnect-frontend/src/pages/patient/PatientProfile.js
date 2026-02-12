import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import '../patient/PatientDashboard.css';

const PatientProfile = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/patient/profile');
            setFormData({
                name: response.data.user.name,
                email: response.data.user.email,
            });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await api.put('/patient/profile', formData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile',
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
            <div className="container" style={{ maxWidth: '700px' }}>
                <div className="welcome-banner fade-in">
                    <div className="welcome-content" style={{ justifyContent: 'center', textAlign: 'center' }}>
                        <div className="welcome-text">
                            <h1>My Profile 👤</h1>
                            <p>Manage your personal information</p>
                        </div>
                    </div>
                </div>

                <div className="card card-glass fade-in">
                    {/* Avatar Section */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div className="avatar avatar-xl" style={{
                            margin: '0 auto 1rem',
                            fontSize: '2.5rem',
                            width: '100px',
                            height: '100px',
                        }}>
                            {(formData.name || user?.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <h3 style={{ marginBottom: '0.25rem', color: 'var(--gray-800)' }}>{formData.name}</h3>
                        <span className="badge badge-patient">Patient</span>
                    </div>

                    {message.text && (
                        <div className={`alert alert-${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
