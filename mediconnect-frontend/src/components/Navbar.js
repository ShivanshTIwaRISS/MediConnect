import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Icon from './Icons';
import BrandLogo from './BrandLogo';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
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

    const homeUrl = isAuthenticated && user?.role ? `/${user.role}/dashboard` : '/';

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
                    { to: '/admin/settings', label: 'Settings' },
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
                        <Link to={homeUrl} className="navbar-brand">
                            <BrandLogo size={36} iconSize={20} />
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
                            {/* Theme Toggle */}
                            <button
                                className="theme-toggle-btn"
                                onClick={toggleTheme}
                                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            >
                                <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
                            </button>

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
                                        <Icon name="logout" size={14} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="auth-buttons">
                                    <Link to="/login" className="btn btn-sm btn-ghost">Sign In</Link>
                                    <Link to="/signup" className="btn btn-sm btn-primary">Get Started</Link>
                                </div>
                            )}

                            {/* Mobile Burger */}
                            <button
                                className={`burger-btn ${mobileMenuOpen ? 'open' : ''}`}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <span />
                                <span />
                                <span />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Mobile Drawer */}
            <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-drawer-header">
                    {isAuthenticated && (
                        <div className="mobile-user-info">
                            <div className="avatar avatar-lg">{getInitial()}</div>
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
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="mobile-nav-link">Home</Link>
                            <Link to="/login" className="mobile-nav-link">Sign In</Link>
                            <Link to="/signup" className="mobile-nav-link">Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
