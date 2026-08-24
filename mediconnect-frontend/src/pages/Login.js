import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icons';
import BrandLogo from '../components/BrandLogo';
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
                        <div className="auth-panel-icon" style={{ display: 'inline-flex', marginBottom: '1.5rem', color: '#ffffff' }}>
                            <BrandLogo size={64} iconSize={36} borderRadius={16} />
                        </div>
                        <h2>Welcome Back</h2>
                        <p>Sign in to your account to manage clinical appointments, review records, and connect with healthcare specialists.</p>
                        <div className="auth-panel-features">
                            <div className="auth-feature-item">
                                <span className="auth-feature-check">
                                    <Icon name="check" size={14} color="white" />
                                </span>
                                <span>Encrypted Session Security</span>
                            </div>
                            <div className="auth-feature-item">
                                <span className="auth-feature-check">
                                    <Icon name="check" size={14} color="white" />
                                </span>
                                <span>Real-Time Consultation Scheduling</span>
                            </div>
                            <div className="auth-feature-item">
                                <span className="auth-feature-check">
                                    <Icon name="check" size={14} color="white" />
                                </span>
                                <span>Direct Specialist Access</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Panel */}
                <div className="auth-panel-right">
                    <div className="auth-form-wrapper fade-in">
                        <div className="auth-header">
                            <Link to="/" className="auth-logo">
                                <BrandLogo size={34} iconSize={20} />
                                <span>MediConnect</span>
                            </Link>
                            <h2>Sign In</h2>
                            <p>Enter your credentials to access your account</p>
                        </div>

                        {successMessage && (
                            <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
                                <Icon name="checkCircle" size={16} />
                                <span>{successMessage}</span>
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                                <Icon name="alertTriangle" size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <div className="input-icon-wrap">
                                    <span className="input-icon">
                                        <Icon name="user" size={16} color="var(--text-muted)" />
                                    </span>
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
                                    <span className="input-icon">
                                        <Icon name="lock" size={16} color="var(--text-muted)" />
                                    </span>
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
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        <Icon name={showPassword ? "x" : "search"} size={14} color="var(--text-muted)" />
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={loading}
                                style={{ marginTop: '0.5rem', justifyContent: 'center' }}
                            >
                                {loading ? (
                                    <span className="btn-loading">
                                        <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
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
