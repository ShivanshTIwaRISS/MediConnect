import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/Icons';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        pendingApprovals: 0,
        totalAppointments: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/statistics');
                const data = response.data.statistics;
                setStats({
                    totalUsers: data.users.total,
                    totalDoctors: data.doctors.total,
                    pendingApprovals: data.doctors.pending,
                    totalAppointments: data.appointments.total,
                });
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
                <p>Loading administration data…</p>
            </div>
        );
    }

    const statCards = [
        { color: 'blue', iconName: 'users', label: 'Registered Users', value: stats.totalUsers },
        { color: 'green', iconName: 'stethoscope', label: 'Clinical Providers', value: stats.totalDoctors },
        { color: 'amber', iconName: 'clockAlert', label: 'Pending Approvals', value: stats.pendingApprovals },
        { color: 'purple', iconName: 'fileText', label: 'Total Consultations', value: stats.totalAppointments },
    ];

    const managementTools = [
        {
            iconName: 'stethoscope',
            title: 'Manage Doctors',
            desc: 'Review credentials, approve applications, or block provider accounts',
            to: '/admin/doctors',
            color: 'green',
        },
        {
            iconName: 'users',
            title: 'Manage Users',
            desc: 'Audit patient and administrator accounts across the network',
            to: '/admin/users',
            color: 'blue',
        },
        {
            iconName: 'fileText',
            title: 'Platform Appointments',
            desc: 'Global monitoring of all active and completed consultations',
            to: '/admin/appointments',
            color: 'purple',
        },
    ];

    return (
        <div>
            {/* Welcome Hero */}
            <div className="welcome-hero anim-fade-up">
                <div className="welcome-hero-inner">
                    <div>
                        <div className="welcome-tag">
                            <span className="welcome-tag-dot" />
                            System Administration Center
                        </div>
                        <h1>Administrator Overview</h1>
                        <p style={{ marginBottom: 0 }}>System metrics, credential review queues, and network oversight.</p>
                    </div>
                    <div style={{
                        padding: '0.85rem 1.5rem',
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-xl)',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
                            Security Clearance
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                            {user?.name || 'Administrator'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending alert */}
            {stats.pendingApprovals > 0 && (
                <div className="alert alert-warning anim-fade-up" style={{ marginBottom: '1.5rem' }}>
                    <Icon name="alertTriangle" size={18} />
                    <span><strong>{stats.pendingApprovals}</strong> doctor registration application{stats.pendingApprovals > 1 ? 's' : ''} awaiting credential verification</span>
                    <Link to="/admin/doctors" style={{ marginLeft: 'auto', color: 'var(--warning)', fontWeight: 700, fontSize: '0.825rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        Review Queue
                        <Icon name="chevronRight" size={14} />
                    </Link>
                </div>
            )}

            {/* Stats */}
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

            {/* Management Tools */}
            <div className="anim-fade-up anim-d2" style={{ marginBottom: '2rem' }}>
                <div className="section-header-bar">
                    <h2 className="section-title">Administrative Modules</h2>
                </div>
                <div className="quick-actions-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                    {managementTools.map((tool, i) => (
                        <Link key={i} to={tool.to} className="quick-action-card">
                            <div className="qa-icon-wrap">
                                <Icon name={tool.iconName} size={22} />
                            </div>
                            <div>
                                <div className="qa-title">{tool.title}</div>
                                <div className="qa-desc">{tool.desc}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Platform Health */}
            <div className="anim-fade-up anim-d3">
                <div className="section-header-bar">
                    <h2 className="section-title">Network Analytics</h2>
                </div>
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.75rem',
                }}>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        {[
                            { label: 'Active Providers', value: stats.totalDoctors, sub: `${stats.pendingApprovals} awaiting approval` },
                            { label: 'Registered Patients', value: Math.max(0, stats.totalUsers - stats.totalDoctors - 1), sub: 'Active accounts' },
                            { label: 'Total Consultations', value: stats.totalAppointments, sub: 'Lifetime volume' },
                            { label: 'Approval Rate', value: stats.totalDoctors > 0 ? `${Math.round(((stats.totalDoctors - stats.pendingApprovals) / stats.totalDoctors) * 100)}%` : '—', sub: 'Provider verification' },
                        ].map((item, i) => (
                            <div key={i} style={{ flex: '1', minWidth: '150px' }}>
                                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
                                    {item.value}
                                </div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.15rem' }}>{item.label}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
