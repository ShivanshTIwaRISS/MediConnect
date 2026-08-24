import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/Icons';

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
                <p>Loading clinical dashboard…</p>
            </div>
        );
    }

    const statCards = [
        { color: 'blue', iconName: 'calendar', label: 'Total Appointments', value: stats.total },
        { color: 'amber', iconName: 'clockAlert', label: 'Pending Requests', value: stats.pending },
        { color: 'green', iconName: 'checkCircle', label: 'Confirmed Consultations', value: stats.approved },
    ];

    const quickActions = [
        { iconName: 'fileText', title: 'Appointment Requests', desc: 'Review & accept patient consultations', to: '/doctor/appointments' },
        { iconName: 'clock', title: 'Consultation History', desc: 'Review completed patient histories', to: '/doctor/history' },
        { iconName: 'user', title: 'Clinical Profile', desc: 'Update hours, credentials & bio', to: '/doctor/profile' },
    ];

    const getProfileBadge = () => {
        if (profileStatus === null) {
            return (
                <Link to="/doctor/profile" className="btn btn-primary">
                    Complete Profile
                    <Icon name="chevronRight" size={16} />
                </Link>
            );
        }
        if (profileStatus === 'pending') {
            return (
                <span className="badge badge-pending" style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}>
                    <Icon name="clockAlert" size={14} /> Profile Under Review
                </span>
            );
        }
        if (profileStatus === 'approved') {
            return (
                <span className="badge badge-approved" style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}>
                    <Icon name="checkCircle" size={14} /> Verified Practitioner
                </span>
            );
        }
        if (profileStatus === 'blocked') {
            return (
                <span className="badge badge-blocked" style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}>
                    <Icon name="ban" size={14} /> Practice Inactive
                </span>
            );
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
                        <div className="welcome-tag">
                            <span className="welcome-tag-dot" />
                            Clinical Practice Overview
                        </div>
                        <h1>{getGreeting()}, Dr. {(user?.name || 'Doctor').replace(/^Dr\.\s+/i, '').split(' ')[0]}</h1>
                        <p style={{ marginBottom: 0 }}>Manage consultation queues, patient schedules, and clinical notes.</p>
                    </div>
                    <div>
                        {getProfileBadge()}
                    </div>
                </div>

                {/* Today info bar */}
                <div style={{
                    marginTop: '1.5rem',
                    padding: '0.85rem 1.25rem',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                }}>
                    <div style={{
                        padding: '0.25rem 0.6rem',
                        background: 'var(--success-bg)',
                        border: '1px solid var(--success-border)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--success)',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        Schedule
                    </div>
                    <span>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span style={{ color: 'var(--border-strong)' }}>·</span>
                    <span>
                        <strong style={{ color: 'var(--text-primary)' }}>{todayAppointments.length}</strong> visits scheduled for today
                    </span>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                {statCards.map((s, i) => (
                    <div key={i} className={`stat-card ${s.color} anim-fade-up anim-d${i + 1}`}>
                        <div className="stat-icon-wrap">
                            <Icon name={s.iconName} size={22} />
                        </div>
                        <div className="stat-info">
                            <div className="stat-value">{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Today's Schedule */}
            {todayAppointments.length > 0 && (
                <div className="anim-fade-up anim-d2" style={{ marginBottom: '2rem' }}>
                    <div className="section-header-bar">
                        <h2 className="section-title">Today's Consultations</h2>
                        <Link to="/doctor/appointments" className="view-all-link">
                            View All
                            <Icon name="chevronRight" size={16} />
                        </Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {todayAppointments.map((appt, i) => (
                            <div key={i} className="appt-card-new">
                                <div className="appt-left">
                                    <div
                                        className="avatar avatar-md"
                                        style={{ background: 'var(--gradient-primary)' }}
                                    >
                                        {(appt.patientId?.name || 'P').charAt(0)}
                                    </div>
                                    <div className="appt-info">
                                        <h4>{appt.patientId?.name || 'Patient'}</h4>
                                        <span className="appt-info-sub">
                                            {appt.time || 'Scheduled'} · {appt.reason || 'General Consultation'}
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
                <div className="section-header-bar">
                    <h2 className="section-title">Quick Actions</h2>
                </div>
                <div className="quick-actions-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                    {quickActions.map((action, i) => (
                        <Link key={i} to={action.to} className="quick-action-card">
                            <div className="qa-icon-wrap">
                                <Icon name={action.iconName} size={22} />
                            </div>
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
