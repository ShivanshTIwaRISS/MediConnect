import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { isAuthenticated, user } = useAuth();

    const getDashboardLink = () => {
        if (!user) return '/login';
        switch (user.role) {
            case 'patient':
                return '/patient/dashboard';
            case 'doctor':
                return '/doctor/dashboard';
            case 'admin':
                return '/admin/dashboard';
            default:
                return '/login';
        }
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content fade-in">
                        <h1 className="hero-title">
                            Welcome to <span className="gradient-text">MediConnect</span>
                        </h1>
                        <p className="hero-subtitle">
                            Your trusted platform for seamless online doctor consultations
                        </p>
                        <p className="hero-description">
                            Book appointments with qualified doctors, manage your health records,
                            and get expert medical advice from the comfort of your home.
                        </p>
                        <div className="hero-actions">
                            {isAuthenticated ? (
                                <Link to={getDashboardLink()} className="btn btn-lg btn-primary">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/signup" className="btn btn-lg btn-primary">
                                        Get Started
                                    </Link>
                                    <Link to="/login" className="btn btn-lg btn-outline">
                                        Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <h2 className="section-title">Why Choose MediConnect?</h2>
                    <div className="features-grid">
                        <div className="feature-card card card-glass">
                            <div className="feature-icon">👨‍⚕️</div>
                            <h3>Qualified Doctors</h3>
                            <p>Connect with verified and experienced medical professionals</p>
                        </div>
                        <div className="feature-card card card-glass">
                            <div className="feature-icon">📅</div>
                            <h3>Easy Booking</h3>
                            <p>Schedule appointments at your convenience with just a few clicks</p>
                        </div>
                        <div className="feature-card card card-glass">
                            <div className="feature-icon">🔒</div>
                            <h3>Secure & Private</h3>
                            <p>Your health data is protected with industry-standard security</p>
                        </div>
                        <div className="feature-card card card-glass">
                            <div className="feature-icon">⚡</div>
                            <h3>Quick Response</h3>
                            <p>Get timely responses from doctors for your health concerns</p>
                        </div>
                        <div className="feature-card card card-glass">
                            <div className="feature-icon">💰</div>
                            <h3>Transparent Pricing</h3>
                            <p>Know consultation fees upfront with no hidden charges</p>
                        </div>
                        <div className="feature-card card card-glass">
                            <div className="feature-icon">📱</div>
                            <h3>Easy Access</h3>
                            <p>Access healthcare from anywhere, anytime on any device</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <div className="steps-grid">
                        <div className="step card card-glass">
                            <div className="step-number">1</div>
                            <h3>Create Account</h3>
                            <p>Sign up as a patient or doctor in just a few seconds</p>
                        </div>
                        <div className="step card card-glass">
                            <div className="step-number">2</div>
                            <h3>Find a Doctor</h3>
                            <p>Browse through our list of qualified doctors and their specializations</p>
                        </div>
                        <div className="step card card-glass">
                            <div className="step-number">3</div>
                            <h3>Book Appointment</h3>
                            <p>Select a convenient date and time for your consultation</p>
                        </div>
                        <div className="step card card-glass">
                            <div className="step-number">4</div>
                            <h3>Get Consultation</h3>
                            <p>Receive expert medical advice and treatment recommendations</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!isAuthenticated && (
                <section className="cta">
                    <div className="container">
                        <div className="cta-content card card-glass">
                            <h2>Ready to Get Started?</h2>
                            <p>Join thousands of users who trust MediConnect for their healthcare needs</p>
                            <Link to="/signup" className="btn btn-lg btn-primary">
                                Sign Up Now
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
