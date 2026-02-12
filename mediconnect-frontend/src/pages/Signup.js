import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'patient',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const getPasswordStrength = () => {
        const { password } = formData;
        if (!password) return { level: 0, label: '', color: '' };
        if (password.length < 6) return { level: 1, label: 'Weak', color: '#ef4444' };
        if (password.length < 8) return { level: 2, label: 'Fair', color: '#f59e0b' };
        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password))
            return { level: 4, label: 'Strong', color: '#10b981' };
        return { level: 3, label: 'Good', color: '#3b82f6' };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const result = await register(
            formData.name,
            formData.email,
            formData.password,
            formData.role
        );

        if (result.success) {
            navigate('/login', {
                state: { message: 'Registration successful! Please login.' },
            });
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    const strength = getPasswordStrength();

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Illustration Panel */}
                <div className="auth-panel-left">
                    <div className="auth-panel-content">
                        <div className="auth-panel-icon">🏥</div>
                        <h2>Join MediConnect</h2>
                        <p>Create your account and start your healthcare journey with us today.</p>
                        <div className="auth-panel-features">
                            <div className="auth-feature-item">
                                <span className="auth-feature-check">✓</span>
                                <span>Free to sign up</span>
                            </div>
                            <div className="auth-feature-item">
                                <span className="auth-feature-check">✓</span>
                                <span>Book appointments instantly</span>
                            </div>
                            <div className="auth-feature-item">
                                <span className="auth-feature-check">✓</span>
                                <span>Access 500+ doctors</span>
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
                                    <rect width="28" height="28" rx="8" fill="url(#signupGrad)" />
                                    <path d="M8 14h12M14 8v12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                    <defs>
                                        <linearGradient id="signupGrad" x1="0" y1="0" x2="28" y2="28">
                                            <stop stopColor="#667eea" />
                                            <stop offset="1" stopColor="#764ba2" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <span>MediConnect</span>
                            </Link>
                            <h2>Create Account</h2>
                            <p>Fill in your details to get started</p>
                        </div>

                        {error && (
                            <div className="alert alert-error">{error}</div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Full Name</label>
                                <div className="input-icon-wrap">
                                    <span className="input-icon">👤</span>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-input input-with-icon"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

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

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className="input-icon-wrap">
                                        <span className="input-icon">🔒</span>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            className="form-input input-with-icon"
                                            placeholder="Min 6 characters"
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
                                    {formData.password && (
                                        <div className="password-strength">
                                            <div className="strength-bar">
                                                <div
                                                    className="strength-fill"
                                                    style={{
                                                        width: `${(strength.level / 4) * 100}%`,
                                                        background: strength.color,
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="strength-label" style={{ color: strength.color }}>
                                                {strength.label}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                    <div className="input-icon-wrap">
                                        <span className="input-icon">🔒</span>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            className="form-input input-with-icon"
                                            placeholder="Confirm password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="role" className="form-label">Register As</label>
                                <div className="role-selector">
                                    <label className={`role-option ${formData.role === 'patient' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="patient"
                                            checked={formData.role === 'patient'}
                                            onChange={handleChange}
                                        />
                                        <span className="role-icon">🧑‍💉</span>
                                        <span className="role-label">Patient</span>
                                    </label>
                                    <label className={`role-option ${formData.role === 'doctor' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="doctor"
                                            checked={formData.role === 'doctor'}
                                            onChange={handleChange}
                                        />
                                        <span className="role-icon">👨‍⚕️</span>
                                        <span className="role-label">Doctor</span>
                                    </label>
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
                                        Creating Account...
                                    </span>
                                ) : 'Create Account'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary auth-link">
                                    Sign in →
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
