import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const HEALTH_TIPS = [
    '💧 Drink at least 8 glasses of water today.',
    '🚶 A 30-minute walk can improve your mood and health.',
    '😴 Quality sleep of 7–9 hours boosts your immune system.',
    '🥗 Eating a balanced diet helps maintain a healthy weight.',
    '🧘 5 minutes of mindfulness reduces stress significantly.',
];

const PatientDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tipIndex] = useState(() => Math.floor(Math.random() * HEALTH_TIPS.length));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/patient/appointments');
                const appointments = res.data.appointments || [];
                setStats({
                    total: appointments.length,
                    pending: appointments.filter(a => a.status === 'pending').length,
                    approved: appointments.filter(a => a.status === 'approved').length,
                });
                setRecentAppointments(appointments.slice(0, 4));
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
        { color: 'amber', icon: '⏳', label: 'Pending', value: stats.pending },
        { color: 'green', icon: '✅', label: 'Approved', value: stats.approved },
        { color: 'purple', icon: '❤️', label: 'Health Score', value: '98%' },
    ];

    const quickActions = [
        { icon: '🔍', title: 'Find Doctors', desc: 'Browse specialists near you', to: '/patient/doctors' },
        { icon: '📅', title: 'Book Appointment', desc: 'Schedule a new visit', to: '/patient/book-appointment' },
        { icon: '🗓', title: 'My Appointments', desc: 'View & manage visits', to: '/patient/appointments' },
        { icon: '👤', title: 'My Profile', desc: 'Update your details', to: '/patient/profile' },
    ];

    return (
        <div>
            {/* Welcome Hero */}
            <div className="welcome-hero anim-fade-up">
                <div className="welcome-hero-inner">
                    <div>
                        <div className="welcome-greeting">
                            <span className="welcome-greeting-dot" />
                            Patient Portal
                        </div>
                        <h1>Welcome back, {user?.name?.split(' ')[0] || 'Patient'} 👋</h1>
                        <p style={{ marginBottom: 0 }}>Here's an overview of your healthcare journey today.</p>
                    </div>
                    <Link to="/patient/book-appointment" className="btn btn-primary btn-lg">
                        + Book Appointment
                    </Link>
                </div>

                {/* Health tip */}
                <div style={{
                    marginTop: '1.5rem',
                    padding: '0.75rem 1.25rem',
                    background: 'var(--stat-blue-bg)',
                    border: '1px solid var(--stat-blue-border)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Health Tip</span>
                    <span style={{ color: 'var(--border-strong)' }}>·</span>
                    <span>{HEALTH_TIPS[tipIndex]}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
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

            {/* Recent Appointments */}
            {recentAppointments.length > 0 && (
                <div className="list-section anim-fade-up anim-d2">
                    <div className="section-header">
                        <h2 className="section-title">Recent Appointments</h2>
                        <Link to="/patient/appointments" className="view-all-link">View All →</Link>
                    </div>
                    <div className="appt-list">
                        {recentAppointments.map((appt, i) => (
                            <div key={i} className="appt-card-new">
                                <div className="appt-left">
                                    <div className="avatar avatar-md" style={{ background: 'var(--gradient-primary)' }}>
                                        {(appt.doctorId?.userId?.name || 'D').charAt(0)}
                                    </div>
                                    <div className="appt-info">
                                        <h4>Dr. {appt.doctorId?.userId?.name || 'Doctor'}</h4>
                                        <span className="appt-info-sub">
                                            {appt.doctorId?.specialization || 'Specialist'} · {appt.time || ''}
                                        </span>
                                    </div>
                                </div>
                                <div className="appt-right">
                                    <span className="appt-date">
                                        {new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span className={`badge badge-${appt.status}`}>{appt.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="anim-fade-up anim-d3" style={{ marginBottom: '1.5rem' }}>
                <div className="section-header">
                    <h2 className="section-title">Quick Actions</h2>
                </div>
                <div className="quick-actions-grid">
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

export default PatientDashboard;
