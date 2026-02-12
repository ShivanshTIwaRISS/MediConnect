import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.message;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            switch (result.user.role) {
                case 'patient': navigate('/patient/dashboard'); break;
                case 'doctor': navigate('/doctor/dashboard'); break;
                case 'admin': navigate('/admin/dashboard'); break;
                default: navigate('/');
            }
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Illustration Panel */}
                <div className="auth-panel-left">
                    <div className="auth-panel-content">
                        <div className="auth-panel-icon">🩺</div>
                        <h2>Welcome Back!</h2>
                        <p>Access your healthcare dashboard, manage appointments, and connect with doctors.</p>
                        <div className="auth-panel-features">
                            <div className="auth-feature-item">
                                <span className="auth-feature-check">✓</span>
                                <span>Quick & Secure Login</span>
                            </div>
                            <div className="auth-feature-item">
                                <span className="auth-feature-check">✓</span>
                                <span>Manage Appointments</span>
                            </div>
                            <div className="auth-feature-item">
                                <span className="auth-feature-check">✓</span>
                                <span>Access Medical Records</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Panel */}
                <div className="auth-panel-right">
                    <div className="auth-form-wrapper fade-in">
                        <div className="auth-header">
                            <Link to="/" className="auth-logo">
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <rect width="28" height="28" rx="8" fill="url(#loginGrad)" />
                                    <path d="M8 14h12M14 8v12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                    <defs>
                                        <linearGradient id="loginGrad" x1="0" y1="0" x2="28" y2="28">
                                            <stop stopColor="#667eea" />
                                            <stop offset="1" stopColor="#764ba2" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <span>MediConnect</span>
                            </Link>
                            <h2>Sign In</h2>
                            <p>Enter your credentials to access your account</p>
                        </div>

                        {successMessage && (
                            <div className="alert alert-success">{successMessage}</div>
                        )}

                        {error && (
                            <div className="alert alert-error">{error}</div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <div className="input-icon-wrap">
                                    <span className="input-icon">📧</span>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-input input-with-icon"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="input-icon-wrap">
                                    <span className="input-icon">🔒</span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        className="form-input input-with-icon"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="btn-loading">
                                        <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></span>
                                        Signing In...
                                    </span>
                                ) : 'Sign In'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-primary auth-link">
                                    Create one now →
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
