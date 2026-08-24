import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/Icons';

const CLINICAL_INSIGHTS = [
    'Optimal hydration supports sustained cognitive focus and cellular vitality.',
    'Daily 30-minute moderate aerobic activity reduces cardiovascular risk factors by 25%.',
    '7 to 9 hours of uninterrupted circadian sleep strengthens natural immune resilience.',
    'Nutrient-dense whole food intake stabilizes glycemic balance and metabolic health.',
    'Daily 5-minute mindfulness breathing actively modulates autonomic nervous tone.',
];

const PatientDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, specialistsCount: 0 });
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [insightIndex] = useState(() => Math.floor(Math.random() * CLINICAL_INSIGHTS.length));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/patient/appointments');
                const appointments = res.data.appointments || [];
                const uniqueDoctors = new Set(appointments.map(a => a.doctorId?._id).filter(Boolean));

                setStats({
                    total: appointments.length,
                    pending: appointments.filter(a => a.status === 'pending').length,
                    approved: appointments.filter(a => a.status === 'approved').length,
                    specialistsCount: uniqueDoctors.size,
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
                <p>Loading patient portal…</p>
            </div>
        );
    }

    const statCards = [
        { color: 'blue', iconName: 'calendar', label: 'Total Appointments', value: stats.total },
        { color: 'amber', iconName: 'clockAlert', label: 'Pending Review', value: stats.pending },
        { color: 'green', iconName: 'checkCircle', label: 'Confirmed Visits', value: stats.approved },
        { color: 'purple', iconName: 'stethoscope', label: 'Specialists Consulted', value: stats.specialistsCount },
    ];

    const quickActions = [
        { iconName: 'search', title: 'Find Doctors', desc: 'Browse credentialed specialists', to: '/patient/doctors' },
        { iconName: 'calendar', title: 'Book Appointment', desc: 'Schedule a new clinical consultation', to: '/patient/book-appointment' },
        { iconName: 'clock', title: 'My Appointments', desc: 'Review scheduled and past visits', to: '/patient/appointments' },
        { iconName: 'user', title: 'Profile & Settings', desc: 'Manage account preferences & theme', to: '/patient/profile' },
    ];

    return (
        <div>
            {/* Welcome Hero */}
            <div className="welcome-hero anim-fade-up">
                <div className="welcome-hero-inner">
                    <div>
                        <div className="welcome-tag">
                            <span className="welcome-tag-dot" />
                            Patient Services Portal
                        </div>
                        <h1>Welcome back, {user?.name?.split(' ')[0] || 'Patient'}</h1>
                        <p style={{ marginBottom: 0 }}>Overview of your scheduled care, specialist consultations, and health record.</p>
                    </div>
                    <Link to="/patient/book-appointment" className="btn btn-primary btn-lg">
                        <Icon name="plus" size={18} />
                        Book Appointment
                    </Link>
                </div>

                {/* Health Insight */}
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
                    gap: '0.75rem',
                }}>
                    <div style={{
                        padding: '0.25rem 0.6rem',
                        background: 'var(--primary-light)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--primary-text)',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        Clinical Insight
                    </div>
                    <span>{CLINICAL_INSIGHTS[insightIndex]}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
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

            {/* Recent Appointments */}
            {recentAppointments.length > 0 && (
                <div className="anim-fade-up anim-d2" style={{ marginBottom: '2rem' }}>
                    <div className="section-header-bar">
                        <h2 className="section-title">Recent Appointments</h2>
                        <Link to="/patient/appointments" className="view-all-link">
                            View All
                            <Icon name="chevronRight" size={16} />
                        </Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {recentAppointments.map((appt, i) => (
                            <div key={i} className="appt-card-new">
                                <div className="appt-left">
                                    <div className="avatar avatar-md" style={{ background: 'var(--gradient-primary)' }}>
                                        {(appt.doctorId?.userId?.name || 'D').charAt(0)}
                                    </div>
                                    <div className="appt-info">
                                        <h4>{appt.doctorId?.userId?.name || 'Doctor'}</h4>
                                        <span className="appt-info-sub">
                                            {appt.doctorId?.specialization || 'Specialist'} {appt.time ? `· ${appt.time}` : ''}
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
            <div className="anim-fade-up anim-d3">
                <div className="section-header-bar">
                    <h2 className="section-title">Quick Actions</h2>
                </div>
                <div className="quick-actions-grid">
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

export default PatientDashboard;
