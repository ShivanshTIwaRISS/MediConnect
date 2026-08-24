import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from './Icons';

const NAV_CONFIG = {
    patient: [
        { to: '/patient/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { to: '/patient/doctors', label: 'Find Doctors', icon: 'search' },
        { to: '/patient/book-appointment', label: 'Book Appointment', icon: 'calendar' },
        { to: '/patient/appointments', label: 'My Appointments', icon: 'clock' },
        { to: '/patient/profile', label: 'Profile & Settings', icon: 'user' },
    ],
    doctor: [
        { to: '/doctor/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { to: '/doctor/appointments', label: 'Appointment Requests', icon: 'fileText' },
        { to: '/doctor/history', label: 'Consultation History', icon: 'clock' },
        { to: '/doctor/profile', label: 'Profile & Settings', icon: 'user' },
    ],
    admin: [
        { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { to: '/admin/doctors', label: 'Manage Doctors', icon: 'stethoscope' },
        { to: '/admin/users', label: 'Manage Users', icon: 'users' },
        { to: '/admin/appointments', label: 'All Appointments', icon: 'fileText' },
    ],
};

const PAGE_TITLES = {
    '/patient/dashboard': 'Patient Dashboard',
    '/patient/doctors': 'Find Specialists',
    '/patient/book-appointment': 'Book Appointment',
    '/patient/appointments': 'My Appointments',
    '/patient/profile': 'Profile & Settings',
    '/doctor/dashboard': 'Doctor Dashboard',
    '/doctor/appointments': 'Appointment Requests',
    '/doctor/history': 'Consultation History',
    '/doctor/profile': 'Profile & Settings',
    '/admin/dashboard': 'Admin Command Center',
    '/admin/doctors': 'Manage Doctors',
    '/admin/users': 'Manage Users',
    '/admin/appointments': 'Platform Appointments',
};

const ROLE_COLORS = {
    patient: 'var(--gradient-primary)',
    doctor: 'var(--gradient-accent)',
    admin: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
};

const DashboardLayout = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navLinks = NAV_CONFIG[user?.role] || [];
    const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard';
    const homeUrl = user?.role ? `/${user.role}/dashboard` : '/';
    const profileUrl = user?.role === 'admin' ? '/admin/dashboard' : `/${user?.role}/profile`;

    useEffect(() => {
        setSidebarOpen(false);
    }, [location]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') setSidebarOpen(false);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    const getInitial = () => (user?.name || '?').charAt(0).toUpperCase();
    const isActive = (path) => location.pathname === path;

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="layout-root">
            {/* Mobile overlay */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'visible' : 'hidden'}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
                {/* Brand */}
                <Link to={homeUrl} className="sidebar-brand">
                    <div className="sidebar-brand-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
                        </svg>
                    </div>
                    <span className="sidebar-brand-text">MediConnect</span>
                </Link>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">
                        {user?.role === 'admin' ? 'Administration' : user?.role === 'doctor' ? 'Clinical Portal' : 'Patient Services'}
                    </div>
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`sidebar-link ${isActive(link.to) ? 'active' : ''}`}
                        >
                            <Icon name={link.icon} size={18} />
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Profile Footer */}
                <div className="sidebar-footer">
                    <Link to={profileUrl} className="sidebar-user-card" title="View Profile & Settings">
                        <div
                            className="avatar avatar-sm"
                            style={{ background: ROLE_COLORS[user?.role] || 'var(--gradient-primary)' }}
                        >
                            {getInitial()}
                        </div>
                        <div className="sidebar-user-info">
                            <span className="sidebar-user-name">{user?.name || 'User'}</span>
                            <span className="sidebar-user-role">{user?.role}</span>
                        </div>
                        <span style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>
                            <Icon name="chevronRight" size={14} />
                        </span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="layout-main">
                {/* Top Header */}
                <header className="dash-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Mobile toggle */}
                        <button
                            className="sidebar-toggle-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Toggle navigation"
                        >
                            <span />
                            <span />
                            <span />
                        </button>
                        <div className="dash-breadcrumb">
                            <span style={{ color: 'var(--text-muted)' }}>
                                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Portal'}
                            </span>
                            <span style={{ color: 'var(--border-strong)', margin: '0 0.25rem' }}>/</span>
                            <span>{pageTitle}</span>
                        </div>
                    </div>

                    <div className="dash-header-right">
                        <span
                            style={{
                                fontSize: '0.85rem',
                                color: 'var(--text-secondary)',
                                fontWeight: 500,
                            }}
                            className="desktop-only"
                        >
                            {getGreeting()}, <strong style={{ color: 'var(--text-primary)' }}>{user?.name?.split(' ')[0] || 'there'}</strong>
                        </span>

                        <Link
                            to={profileUrl}
                            className="header-logout-btn"
                            style={{ textDecoration: 'none' }}
                            title="Profile & Settings"
                        >
                            <Icon name="user" size={16} />
                            <span>Settings</span>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="dash-content">
                    {children}
                </main>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .desktop-only { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default DashboardLayout;
