import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV_CONFIG = {
    patient: [
        { to: '/patient/dashboard', label: 'Dashboard', icon: '⊞' },
        { to: '/patient/doctors', label: 'Find Doctors', icon: '🔍' },
        { to: '/patient/book-appointment', label: 'Book Appointment', icon: '📅' },
        { to: '/patient/appointments', label: 'My Appointments', icon: '🗓' },
        { to: '/patient/profile', label: 'Profile', icon: '👤' },
    ],
    doctor: [
        { to: '/doctor/dashboard', label: 'Dashboard', icon: '⊞' },
        { to: '/doctor/appointments', label: 'Appointment Requests', icon: '📋' },
        { to: '/doctor/history', label: 'Consultation History', icon: '🕐' },
        { to: '/doctor/profile', label: 'My Profile', icon: '👤' },
    ],
    admin: [
        { to: '/admin/dashboard', label: 'Dashboard', icon: '⊞' },
        { to: '/admin/doctors', label: 'Manage Doctors', icon: '👨‍⚕️' },
        { to: '/admin/users', label: 'Manage Users', icon: '👥' },
        { to: '/admin/appointments', label: 'All Appointments', icon: '📋' },
    ],
};

const PAGE_TITLES = {
    '/patient/dashboard': 'Dashboard',
    '/patient/doctors': 'Find Doctors',
    '/patient/book-appointment': 'Book Appointment',
    '/patient/appointments': 'My Appointments',
    '/patient/profile': 'My Profile',
    '/doctor/dashboard': 'Dashboard',
    '/doctor/appointments': 'Appointment Requests',
    '/doctor/history': 'Consultation History',
    '/doctor/profile': 'My Profile',
    '/admin/dashboard': 'Dashboard',
    '/admin/doctors': 'Manage Doctors',
    '/admin/users': 'Manage Users',
    '/admin/appointments': 'All Appointments',
};

const ROLE_COLORS = {
    patient: 'var(--secondary)',
    doctor: 'var(--success)',
    admin: 'var(--error)',
};

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navLinks = NAV_CONFIG[user?.role] || [];
    const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard';

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
                <Link to="/" className="sidebar-brand">
                    <div className="sidebar-brand-icon">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M5 10h10M10 5v10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span className="sidebar-brand-text">MediConnect</span>
                </Link>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">
                        {user?.role === 'admin' ? 'Admin Panel' : user?.role === 'doctor' ? 'My Practice' : 'Navigation'}
                    </div>
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`sidebar-link ${isActive(link.to) ? 'active' : ''}`}
                        >
                            <span className="sidebar-link-icon">{link.icon}</span>
                            <span className="sidebar-link-label">{link.label}</span>
                            {isActive(link.to) && <span className="sidebar-active-dot" />}
                        </Link>
                    ))}
                </nav>

                {/* User Footer */}
                <div className="sidebar-footer">
                    <div className="sidebar-user-card">
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
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="layout-main">
                {/* Top Header */}
                <header className="dash-header">
                    <div className="dash-header-left">
                        {/* Mobile sidebar toggle */}
                        <button
                            className="sidebar-toggle-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Toggle sidebar"
                        >
                            <span />
                            <span />
                            <span />
                        </button>
                        <div className="dash-breadcrumb">
                            <span style={{ color: 'var(--text-muted)' }}>
                                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                            </span>
                            <span style={{ color: 'var(--text-muted)', margin: '0 0.25rem' }}>/</span>
                            <span>{pageTitle}</span>
                        </div>
                    </div>

                    <div className="dash-header-right">
                        {/* Greeting (desktop) */}
                        <span
                            style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)',
                                fontWeight: 500,
                            }}
                            className="desktop-only"
                        >
                            {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
                        </span>

                        {/* Theme toggle */}
                        <button
                            className="theme-toggle"
                            onClick={toggleTheme}
                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>

                        {/* Logout */}
                        <button className="header-logout-btn" onClick={logout}>
                            <span>⎋</span>
                            <span>Logout</span>
                        </button>
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
