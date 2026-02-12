import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);



    const getNavLinks = () => {
        if (!user) return [];
        switch (user.role) {
            case 'patient':
                return [
                    { to: '/patient/dashboard', label: 'Dashboard' },
                    { to: '/patient/doctors', label: 'Find Doctors' },
                    { to: '/patient/appointments', label: 'Appointments' },
                    { to: '/patient/profile', label: 'Profile' },
                ];
            case 'doctor':
                return [
                    { to: '/doctor/dashboard', label: 'Dashboard' },
                    { to: '/doctor/appointments', label: 'Requests' },
                    { to: '/doctor/history', label: 'History' },
                    { to: '/doctor/profile', label: 'Profile' },
                ];
            case 'admin':
                return [
                    { to: '/admin/dashboard', label: 'Dashboard' },
                    { to: '/admin/doctors', label: 'Doctors' },
                    { to: '/admin/users', label: 'Users' },
                    { to: '/admin/appointments', label: 'Appointments' },
                ];
            default: return [];
        }
    };

    const getInitial = () => {
        if (!user?.name) return '?';
        return user.name.charAt(0).toUpperCase();
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
                <div className="container">
                    <div className="navbar-content">
                        <Link to="/" className="navbar-brand">
                            <div className="brand-logo">
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <rect width="28" height="28" rx="8" fill="url(#brandGrad)" />
                                    <path d="M8 14h12M14 8v12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                    <defs>
                                        <linearGradient id="brandGrad" x1="0" y1="0" x2="28" y2="28">
                                            <stop stopColor="#667eea" />
                                            <stop offset="1" stopColor="#764ba2" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <span className="brand-text">MediConnect</span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="navbar-center">
                            {isAuthenticated && getNavLinks().map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="navbar-end">
                            {isAuthenticated ? (
                                <div className="user-section">
                                    <div className="user-chip">
                                        <div className="avatar avatar-sm">
                                            {getInitial()}
                                        </div>
                                        <div className="user-details">
                                            <span className="user-name">{user?.name || 'User'}</span>
                                            <span className="user-role-tag">{user?.role}</span>
                                        </div>
                                    </div>
                                    <button onClick={logout} className="btn btn-sm btn-outline logout-btn">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="auth-buttons">
                                    <Link to="/login" className="btn btn-sm btn-ghost">
                                        Login
                                    </Link>
                                    <Link to="/signup" className="btn btn-sm btn-primary">
                                        Sign Up
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Burger */}
                            <button
                                className={`burger-btn ${mobileMenuOpen ? 'open' : ''}`}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Mobile Drawer */}
            <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-drawer-header">
                    {isAuthenticated && (
                        <div className="mobile-user-info">
                            <div className="avatar avatar-lg">
                                {getInitial()}
                            </div>
                            <div>
                                <p className="mobile-user-name">{user?.name}</p>
                                <span className={`badge badge-${user?.role}`}>{user?.role}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mobile-drawer-links">
                    {isAuthenticated ? (
                        <>
                            {getNavLinks().map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`mobile-nav-link ${isActive(link.to) ? 'active' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <button onClick={logout} className="mobile-nav-link mobile-logout">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="mobile-nav-link">Home</Link>
                            <Link to="/login" className="mobile-nav-link">Login</Link>
                            <Link to="/signup" className="mobile-nav-link">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
