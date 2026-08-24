import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/Icons';

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
            setMessage({ type: 'success', text: 'Profile information updated successfully.' });
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
        return <div className="loading-container"><div className="spinner" /><p>Loading patient record…</p></div>;
    }

    return (
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }} className="anim-fade-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                        background: 'var(--primary-light)', border: '1px solid var(--border-subtle)',
                        color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Icon name="user" size={20} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Personal Profile</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                    Update your personal account credentials and contact information.
                </p>
            </div>

            <div className="card anim-fade-up anim-d1" style={{ padding: '2rem' }}>
                {/* Avatar Section */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div className="avatar avatar-xl" style={{
                        margin: '0 auto 1rem',
                        fontSize: '2rem',
                        width: '88px',
                        height: '88px',
                        background: 'var(--gradient-primary)',
                        borderRadius: 'var(--radius-2xl)',
                        boxShadow: 'var(--shadow-md)',
                    }}>
                        {(formData.name || user?.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <h3 style={{ margin: '0 0 0.35rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                        {formData.name || user?.name}
                    </h3>
                    <span className="badge badge-patient">Registered Patient</span>
                </div>

                {message.text && (
                    <div className={`alert alert-${message.type}`} style={{ marginBottom: '1.5rem' }}>
                        <Icon name={message.type === 'success' ? 'checkCircle' : 'alertTriangle'} size={18} />
                        <span>{message.text}</span>
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
                        style={{ marginTop: '1rem', justifyContent: 'center' }}
                        disabled={saving}
                    >
                        {saving ? 'Saving changes…' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PatientProfile;
