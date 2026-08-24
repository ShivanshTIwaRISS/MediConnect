import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

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
                <p>Loading platform data…</p>
            </div>
        );
    }

    const statCards = [
        { color: 'blue', icon: '👥', label: 'Total Users', value: stats.totalUsers },
        { color: 'green', icon: '👨‍⚕️', label: 'Total Doctors', value: stats.totalDoctors },
        { color: 'amber', icon: '⏳', label: 'Pending Approvals', value: stats.pendingApprovals },
        { color: 'purple', icon: '🗓', label: 'All Appointments', value: stats.totalAppointments },
    ];

    const managementTools = [
        {
            icon: '👨‍⚕️',
            title: 'Manage Doctors',
            desc: 'Approve, block, or review doctor profiles',
            to: '/admin/doctors',
            color: 'green',
        },
        {
            icon: '👥',
            title: 'Manage Users',
            desc: 'View and manage all registered users',
            to: '/admin/users',
            color: 'blue',
        },
        {
            icon: '📋',
            title: 'All Appointments',
            desc: 'View every appointment across the platform',
            to: '/admin/appointments',
            color: 'purple',
        },
    ];

    const alerts = stats.pendingApprovals > 0
        ? [{ type: 'amber', icon: '⚠️', message: `${stats.pendingApprovals} doctor${stats.pendingApprovals > 1 ? 's' : ''} awaiting approval` }]
        : [];

    return (
        <div>
            {/* Welcome Hero */}
            <div className="welcome-hero anim-fade-up">
                <div className="welcome-hero-inner">
                    <div>
                        <div className="welcome-greeting">
                            <span className="welcome-greeting-dot" />
                            Admin Control Panel
                        </div>
                        <h1>Welcome, {user?.name || 'Admin'} 🛡</h1>
                        <p style={{ marginBottom: 0 }}>Platform overview and management tools.</p>
                    </div>
                    <div style={{
                        padding: '0.875rem 1.5rem',
                        background: 'var(--stat-rose-bg)',
                        border: '1px solid var(--stat-rose-border)',
                        borderRadius: 'var(--radius-xl)',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--error)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.25rem' }}>
                            Admin Access
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Alerts */}
            {alerts.map((alert, i) => (
                <div key={i} className={`alert alert-warning anim-fade-up`} style={{ marginBottom: '1.5rem' }}>
                    <span>{alert.icon}</span>
                    <span>{alert.message}</span>
                    <Link to="/admin/doctors" style={{ marginLeft: 'auto', color: 'var(--warning)', fontWeight: 700, fontSize: '0.8rem' }}>
                        Review →
                    </Link>
                </div>
            ))}

            {/* Stats */}
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

            {/* Management Tools */}
            <div className="anim-fade-up anim-d2">
                <div className="section-header">
                    <h2 className="section-title">Management Tools</h2>
                </div>
                <div className="quick-actions-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {managementTools.map((tool, i) => (
                        <Link key={i} to={tool.to} className="quick-action-card">
                            <div
                                className="qa-icon-wrap"
                                style={{
                                    background: `var(--stat-${tool.color}-bg)`,
                                    border: `1px solid var(--stat-${tool.color}-border)`,
                                    fontSize: '1.5rem',
                                    width: '52px',
                                    height: '52px',
                                }}
                            >
                                {tool.icon}
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
                <div className="section-header">
                    <h2 className="section-title">Platform Summary</h2>
                </div>
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.5rem',
                }}>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        {[
                            { label: 'Platform Doctors', value: stats.totalDoctors, sub: `${stats.pendingApprovals} pending` },
                            { label: 'Registered Patients', value: Math.max(0, stats.totalUsers - stats.totalDoctors - 1), sub: 'Active users' },
                            { label: 'Total Appointments', value: stats.totalAppointments, sub: 'All time' },
                            { label: 'Approval Rate', value: stats.totalDoctors > 0 ? `${Math.round(((stats.totalDoctors - stats.pendingApprovals) / stats.totalDoctors) * 100)}%` : '—', sub: 'Doctor approval' },
                        ].map((item, i) => (
                            <div key={i} style={{ flex: '1', minWidth: '120px' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
                                    {item.value}
                                </div>
                                <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>{item.label}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
