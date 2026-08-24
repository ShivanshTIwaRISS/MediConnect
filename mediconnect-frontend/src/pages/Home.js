import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { specialityData } from '../assets/assets_frontend/assets';
import Icon from '../components/Icons';
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
        icon: <img src={item.image} alt={item.speciality} style={{ width: '36px', height: '36px', objectFit: 'contain' }} />,
        name: item.speciality
    }));

    const testimonials = [
        {
            name: 'Ananya Sharma',
            role: 'Verified Patient · New Delhi',
            text: 'MediConnect made finding an accredited cardiologist in Delhi NCR immediate and painless. The consultation was thorough and completely on schedule.',
            rating: 5,
        },
        {
            name: 'Dr. Rajesh Malhotra',
            role: 'Senior Consultant · New Delhi',
            text: 'The provider management suite streamlines clinical workflows effortlessly. Our patient response rates and consultation tracking improved significantly.',
            rating: 5,
        },
        {
            name: 'Rohan Verma',
            role: 'Verified Patient · Gurugram',
            text: 'Transparent pricing with upfront consultation fees in ₹ INR. No surprises, no waiting room friction. An essential healthcare platform.',
            rating: 5,
        },
    ];

    const features = [
        {
            iconName: 'stethoscope',
            title: 'Verified Specialists',
            desc: 'Connect with credentialed medical specialists across 50+ clinical disciplines.'
        },
        {
            iconName: 'calendar',
            title: 'Instant Booking',
            desc: 'Real-time appointment slot booking with immediate clinical confirmation.'
        },
        {
            iconName: 'lock',
            title: 'Encrypted & Private',
            desc: 'Enterprise-grade encryption protecting your personal consultation records.'
        },
        {
            iconName: 'zap',
            title: 'Fast Response',
            desc: 'Direct consultation responses and confirmations with zero administrative delay.'
        },
        {
            iconName: 'rupeeSign',
            title: 'Upfront Pricing',
            desc: '100% transparent consultation fees in ₹ INR with zero hidden charges.'
        },
        {
            iconName: 'smartphone',
            title: 'Anywhere Access',
            desc: 'Optimized telemedicine portal accessible on desktop, tablet, and mobile devices.'
        },
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-decorations">
                    <div className="hero-circle hero-circle-1" />
                    <div className="hero-circle hero-circle-2" />
                    <div className="hero-circle hero-circle-3" />
                </div>
                <div className="container">
                    <div className="hero-content anim-fade-up">
                        <div className="hero-badge">
                            <span className="hero-badge-dot" />
                            <span>Accredited Healthcare Network</span>
                        </div>
                        <h1 className="hero-title">
                            Next-Generation <br />
                            <span className="gradient-text-hero">Healthcare Management</span>
                        </h1>
                        <p className="hero-subtitle">
                            Connect with world-class doctors, book appointments instantly,
                            and manage your healthcare journey — all in one place.
                        </p>
                        <div className="hero-actions">
                            {isAuthenticated ? (
                                <Link to={getDashboardLink()} className="btn btn-lg btn-primary hero-btn">
                                    Access Portal
                                    <Icon name="chevronRight" size={18} />
                                </Link>
                            ) : (
                                <>
                                    <Link to="/signup" className="btn btn-lg btn-primary hero-btn">
                                        Get Started Free
                                        <Icon name="chevronRight" size={18} />
                                    </Link>
                                    <Link to="/login" className="btn btn-lg btn-outline hero-btn-outline">
                                        Sign In
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
                    <div className="stats-bar card">
                        <div className="stat-item">
                            <h3><Counter end={500} suffix="+" /></h3>
                            <p>Certified Doctors</p>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <h3><Counter end={10} suffix="K+" /></h3>
                            <p>Active Patients</p>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <h3><Counter end={25} suffix="K+" /></h3>
                            <p>Consultations</p>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <h3><Counter end={50} suffix="+" /></h3>
                            <p>Specialties</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Specialties Section */}
            <section className="specialties-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">Clinical Departments</span>
                        <h2 className="section-title-home">Browse by Specialty</h2>
                        <p className="section-desc">Explore care across specialized departments</p>
                    </div>
                    <div className="specialties-grid">
                        {specialties.map((spec, i) => (
                            <div key={i} className="specialty-card card">
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
                        <span className="section-tag">Platform Excellence</span>
                        <h2 className="section-title-home">Why MediConnect?</h2>
                        <p className="section-desc">Clinical precision and care management at every step</p>
                    </div>
                    <div className="features-grid">
                        {features.map((feat, i) => (
                            <div key={i} className="feature-card card">
                                <div className="feature-icon-wrap">
                                    <Icon name={feat.iconName} size={24} />
                                </div>
                                <h3>{feat.title}</h3>
                                <p>{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">Patient Experience</span>
                        <h2 className="section-title-home">4 Simple Steps to Care</h2>
                        <p className="section-desc">Streamlined access from registration to consultation</p>
                    </div>
                    <div className="steps-grid">
                        {[
                            { num: '01', title: 'Register Account', desc: 'Sign up securely as a patient or clinical provider in seconds.', icon: 'user' },
                            { num: '02', title: 'Select Specialist', desc: 'Filter through certified doctors by expertise, fees, and availability.', icon: 'search' },
                            { num: '03', title: 'Reserve Slot', desc: 'Pick your preferred consultation date and available time slot.', icon: 'calendar' },
                            { num: '04', title: 'Consultation', desc: 'Receive dedicated professional healthcare advice and treatment plans.', icon: 'checkCircle' },
                        ].map((step, i) => (
                            <div key={i} className="step-card">
                                <div className="step-number-badge">{step.num}</div>
                                <div className="step-icon-wrap">
                                    <Icon name={step.icon} size={28} />
                                </div>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">Patient & Doctor Reviews</span>
                        <h2 className="section-title-home">Trusted Healthcare Voices</h2>
                        <p className="section-desc">Real experiences from patients and clinical professionals</p>
                    </div>
                    <div className="testimonials-grid">
                        {testimonials.map((t, i) => (
                            <div key={i} className="testimonial-card card">
                                <div className="testimonial-stars">
                                    {[...Array(t.rating)].map((_, starI) => (
                                        <svg key={starI} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="testimonial-text">"{t.text}"</p>
                                <div className="testimonial-author">
                                    <div className="avatar avatar-md" style={{ background: 'var(--gradient-primary)' }}>
                                        {t.name.charAt(0)}
                                    </div>
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
                                <h2>Experience Modern Healthcare Today</h2>
                                <p>Join thousands of patients and doctors trusting MediConnect for simplified, secure clinical care.</p>
                                <div className="cta-actions">
                                    <Link to="/signup" className="btn btn-lg btn-primary hero-btn">
                                        Create Free Account
                                        <Icon name="chevronRight" size={18} />
                                    </Link>
                                    <Link to="/login" className="btn btn-lg btn-outline hero-btn-outline">
                                        Sign In
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
