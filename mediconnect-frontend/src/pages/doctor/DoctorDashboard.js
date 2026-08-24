import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
    const [profileStatus, setProfileStatus] = useState(null);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [apptRes, profileRes] = await Promise.all([
                    api.get('/doctor/appointments'),
                    api.get('/doctor/profile').catch(() => null),
                ]);

                const appointments = apptRes.data.appointments || [];
                setStats({
                    total: appointments.length,
                    pending: appointments.filter(a => a.status === 'pending').length,
                    approved: appointments.filter(a => a.status === 'approved').length,
                });

                const today = new Date().toDateString();
                setTodayAppointments(
                    appointments.filter(a => new Date(a.date).toDateString() === today && a.status === 'approved').slice(0, 5)
                );

                if (profileRes?.data?.doctor) {
                    setProfileStatus(profileRes.data.doctor.status);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
                <p>Loading your dashboard…</p>
            </div>
        );
    }

    const statCards = [
        { color: 'blue', icon: '🗓', label: 'Total Appointments', value: stats.total },
        { color: 'amber', icon: '⏳', label: 'Pending Requests', value: stats.pending },
        { color: 'green', icon: '✅', label: 'Approved', value: stats.approved },
    ];

    const quickActions = [
        { icon: '📋', title: 'Appointment Requests', desc: 'Review pending requests', to: '/doctor/appointments' },
        { icon: '🕐', title: 'Consultation History', desc: 'View past consultations', to: '/doctor/history' },
        { icon: '👤', title: 'My Profile', desc: 'Update your profile', to: '/doctor/profile' },
    ];

    const getProfileBadge = () => {
        if (profileStatus === null) {
            return (
                <Link to="/doctor/profile" className="btn btn-primary">
                    Complete Profile →
                </Link>
            );
        }
        if (profileStatus === 'pending') {
            return <span className="badge badge-pending" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>⏳ Profile Under Review</span>;
        }
        if (profileStatus === 'approved') {
            return <span className="badge badge-approved" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>✅ Profile Approved</span>;
        }
        if (profileStatus === 'blocked') {
            return <span className="badge badge-blocked" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>🚫 Account Blocked</span>;
        }
        return null;
    };

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div>
            {/* Welcome Hero */}
            <div className="welcome-hero anim-fade-up">
                <div className="welcome-hero-inner">
                    <div>
                        <div className="welcome-greeting">
                            <span className="welcome-greeting-dot" />
                            Doctor Portal
                        </div>
                        <h1>{getGreeting()}, Dr. {user?.name?.split(' ')[0] || 'Doctor'} 🩺</h1>
                        <p style={{ marginBottom: 0 }}>Here's your practice overview for today.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {getProfileBadge()}
                    </div>
                </div>

                {/* Today info bar */}
                <div style={{
                    marginTop: '1.5rem',
                    padding: '0.75rem 1.25rem',
                    background: 'var(--stat-green-bg)',
                    border: '1px solid var(--stat-green-border)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                }}>
                    <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Today</span>
                    <span style={{ color: 'var(--border-strong)' }}>·</span>
                    <span>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span style={{ color: 'var(--border-strong)' }}>·</span>
                    <span>
                        <strong style={{ color: 'var(--success)' }}>{todayAppointments.length}</strong> appointments scheduled
                    </span>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {statCards.map((s, i) => (
                    <div key={i} className={`stat-card ${s.color} anim-fade-up anim-d${i + 1}`}>
                        <div className="stat-icon">{s.icon}</div>
                        <div className="stat-info">
                            <div className="stat-value">{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Today's Schedule */}
            {todayAppointments.length > 0 && (
                <div className="list-section anim-fade-up anim-d2">
                    <div className="section-header">
                        <h2 className="section-title">📅 Today's Schedule</h2>
                        <Link to="/doctor/appointments" className="view-all-link">View All →</Link>
                    </div>
                    <div className="appt-list">
                        {todayAppointments.map((appt, i) => (
                            <div key={i} className="appt-card-new">
                                <div className="appt-left">
                                    <div
                                        className="avatar avatar-md"
                                        style={{
                                            background: `hsl(${(i * 60) % 360}, 70%, 55%)`,
                                        }}
                                    >
                                        {(appt.patientId?.name || 'P').charAt(0)}
                                    </div>
                                    <div className="appt-info">
                                        <h4>{appt.patientId?.name || 'Patient'}</h4>
                                        <span className="appt-info-sub">
                                            {appt.time || 'TBD'} · {appt.reason || 'General Consultation'}
                                        </span>
                                    </div>
                                </div>
                                <div className="appt-right">
                                    <span className={`badge badge-${appt.status}`}>{appt.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="anim-fade-up anim-d3">
                <div className="section-header">
                    <h2 className="section-title">Quick Actions</h2>
                </div>
                <div className="quick-actions-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {quickActions.map((action, i) => (
                        <Link key={i} to={action.to} className="quick-action-card">
                            <div className="qa-icon-wrap">{action.icon}</div>
                            <div>
                                <div className="qa-title">{action.title}</div>
                                <div className="qa-desc">{action.desc}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
