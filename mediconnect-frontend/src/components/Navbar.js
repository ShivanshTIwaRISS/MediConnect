import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import { assets } from '../assets/assets_frontend/assets';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();

    const getDashboardLink = () => {
        if (!user) return '/';
        switch (user.role) {
            case 'patient':
                return '/patient/dashboard';
            case 'doctor':
                return '/doctor/dashboard';
            case 'admin':
                return '/admin/dashboard';
            default:
                return '/';
        }
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-brand">
                        <span className="brand-text">MediConnect</span>
                    </Link>

                    <div className="navbar-menu">
                        {isAuthenticated ? (
                            <>
                                <Link to={getDashboardLink()} className="nav-link">
                                    Dashboard
                                </Link>
                                <div className="user-info">
                                    <span className="user-role">{user.role}</span>
                                    <span className="user-email">{user.email}</span>
                                </div>
                                <button onClick={logout} className="btn btn-sm btn-outline">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-sm btn-outline">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn btn-sm btn-primary">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
