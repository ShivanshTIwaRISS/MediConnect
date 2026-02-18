import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assets, specialityData } from '../assets/assets_frontend/assets';
import './Home.css';


const Counter = ({ end, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const counted = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !counted.current) {
                    counted.current = true;
                    let start = 0;
                    const step = end / (duration / 16);
                    const timer = setInterval(() => {
                        start += step;
                        if (start >= end) {
                            setCount(end);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
};

const Home = () => {
    const { isAuthenticated, user } = useAuth();

    const getDashboardLink = () => {
        if (!user) return '/login';
        switch (user.role) {
            case 'patient': return '/patient/dashboard';
            case 'doctor': return '/doctor/dashboard';
            case 'admin': return '/admin/dashboard';
            default: return '/login';
        }
    };

    const specialties = specialityData.map(item => ({
        icon: <img src={item.image} alt={item.speciality} style={{ width: '32px', height: '32px' }} />,
        name: item.speciality
    }));

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Patient',
            text: 'MediConnect made finding a specialist so easy. I booked my appointment in minutes and the doctor was incredibly professional.',
            rating: 5,
        },
        {
            name: 'Dr. Michael Chen',
            role: 'Cardiologist',
            text: 'As a doctor, this platform helps me manage my appointments efficiently. The interface is clean and my patients love it.',
            rating: 5,
        },
        {
            name: 'Emily Rivera',
            role: 'Patient',
            text: 'I love how transparent the pricing is. No hidden fees, and the booking process is seamless. Highly recommend!',
            rating: 5,
        },
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-decorations">
                    <div className="hero-circle hero-circle-1"></div>
                    <div className="hero-circle hero-circle-2"></div>
                    <div className="hero-circle hero-circle-3"></div>
                    <div className="floating-icon fi-1"><img src={assets.info_icon} alt="" style={{ width: '24px' }} /></div>
                    <div className="floating-icon fi-2"><img src={assets.verified_icon} alt="" style={{ width: '24px' }} /></div>
                    <div className="floating-icon fi-3"><img src={assets.logo} alt="" style={{ width: '24px' }} /></div>
                    <div className="floating-icon fi-4">✨</div>
                </div>
                <div className="container">
                    <div className="hero-content fade-in">
                        <div className="hero-badge">
                            <span className="hero-badge-dot"></span>
                            Trusted by 10,000+ patients
                        </div>
                        <h1 className="hero-title">
                            Your Health, Our <span className="gradient-text-hero">Priority</span>
                        </h1>
                        <p className="hero-subtitle">
                            Connect with world-class doctors, book appointments instantly,
                            and manage your healthcare journey — all in one place.
                        </p>
                        <div className="hero-actions">
                            {isAuthenticated ? (
                                <Link to={getDashboardLink()} className="btn btn-lg btn-primary hero-btn">
                                    Go to Dashboard →
                                </Link>
                            ) : (
                                <>
                                    <Link to="/signup" className="btn btn-lg btn-primary hero-btn">
                                        Get Started Free →
                                    </Link>
                                    <Link to="/login" className="btn btn-lg btn-outline hero-btn-outline">
                                        Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-bar card card-glass">
                        <div className="stat-item">
                            <h3><Counter end={500} suffix="+" /></h3>
                            <p>Expert Doctors</p>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <h3><Counter end={10} suffix="K+" /></h3>
                            <p>Happy Patients</p>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <h3><Counter end={25} suffix="K+" /></h3>
                            <p>Appointments</p>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <h3><Counter end={50} suffix="+" /></h3>
                            <p>Specialties</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Specialties */}
            <section className="specialties-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">Specialties</span>
                        <h2 className="section-title-home">Browse by Specialty</h2>
                        <p className="section-desc">Find the right specialist for your needs</p>
                    </div>
                    <div className="specialties-grid">
                        {specialties.map((spec, i) => (
                            <div key={i} className="specialty-card card card-glass" style={{ animationDelay: `${i * 0.05}s` }}>
                                <span className="specialty-icon">{spec.icon}</span>
                                <span className="specialty-name">{spec.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">Why Choose Us</span>
                        <h2 className="section-title-home">Why MediConnect?</h2>
                        <p className="section-desc">We make healthcare accessible, affordable, and efficient</p>
                    </div>
                    <div className="features-grid stagger-children">
                        <div className="feature-card card card-glass slide-up">
                            <div className="feature-icon-wrap gradient-1"><img src={assets.info_icon} alt="" style={{ width: '24px', filter: 'brightness(0) invert(1)' }} /></div>
                            <h3>Qualified Doctors</h3>
                            <p>Connect with verified and experienced medical professionals across 50+ specialties</p>
                        </div>
                        <div className="feature-card card card-glass slide-up">
                            <div className="feature-icon-wrap gradient-2">📅</div>
                            <h3>Easy Booking</h3>
                            <p>Schedule appointments at your convenience with just a few clicks, 24/7</p>
                        </div>
                        <div className="feature-card card card-glass slide-up">
                            <div className="feature-icon-wrap gradient-3">🔒</div>
                            <h3>Secure & Private</h3>
                            <p>Your health data is protected with industry-standard encryption and security</p>
                        </div>
                        <div className="feature-card card card-glass slide-up">
                            <div className="feature-icon-wrap gradient-4">⚡</div>
                            <h3>Quick Response</h3>
                            <p>Get timely responses from doctors — most appointments confirmed within hours</p>
                        </div>
                        <div className="feature-card card card-glass slide-up">
                            <div className="feature-icon-wrap gradient-5">💰</div>
                            <h3>Transparent Pricing</h3>
                            <p>Know consultation fees upfront with no hidden charges or surprise bills</p>
                        </div>
                        <div className="feature-card card card-glass slide-up">
                            <div className="feature-icon-wrap gradient-6">📱</div>
                            <h3>Access Anywhere</h3>
                            <p>Access healthcare from anywhere, anytime on any device — phone, tablet, or desktop</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">How It Works</span>
                        <h2 className="section-title-home">Get Started in 4 Steps</h2>
                        <p className="section-desc">Simple and seamless healthcare experience</p>
                    </div>
                    <div className="steps-grid">
                        {[
                            { num: '01', title: 'Create Account', desc: 'Sign up as a patient or doctor in just a few seconds', icon: '👤' },
                            { num: '02', title: 'Find a Doctor', desc: 'Browse through our qualified doctors and specializations', icon: '🔍' },
                            { num: '03', title: 'Book Appointment', desc: 'Select a convenient date and time for your consultation', icon: <img src={assets.chats_icon} alt="" style={{ width: '40px' }} /> },
                            { num: '04', title: 'Get Consultation', desc: 'Receive expert medical advice and treatment plans', icon: <img src={assets.verified_icon} alt="" style={{ width: '40px' }} /> },
                        ].map((step, i) => (
                            <div key={i} className="step-card">
                                <div className="step-number-badge">{step.num}</div>
                                <div className="step-icon-large">{step.icon}</div>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                                {i < 3 && <div className="step-connector"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">Testimonials</span>
                        <h2 className="section-title-home">What People Say</h2>
                        <p className="section-desc">Hear from our happy patients and doctors</p>
                    </div>
                    <div className="testimonials-grid">
                        {testimonials.map((t, i) => (
                            <div key={i} className="testimonial-card card card-glass">
                                <div className="testimonial-stars">
                                    {'★'.repeat(t.rating)}
                                </div>
                                <p className="testimonial-text">"{t.text}"</p>
                                <div className="testimonial-author">
                                    <div className="avatar">{t.name.charAt(0)}</div>
                                    <div>
                                        <strong>{t.name}</strong>
                                        <span className="testimonial-role">{t.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!isAuthenticated && (
                <section className="cta-section">
                    <div className="container">
                        <div className="cta-card">
                            <div className="cta-content">
                                <h2>Ready to Take Control of Your Health?</h2>
                                <p>Join thousands of users who trust MediConnect for their healthcare needs. Sign up today — it's free.</p>
                                <div className="cta-actions">
                                    <Link to="/signup" className="btn btn-lg btn-primary hero-btn">
                                        Create Free Account →
                                    </Link>
                                    <Link to="/login" className="btn btn-lg btn-outline hero-btn-outline">
                                        Login Instead
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
