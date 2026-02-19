import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { assets as assetsAdmin } from '../../assets/assets_admin/assets';
import '../patient/PatientDashboard.css';



const DoctorDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
    const [profileStatus, setProfileStatus] = useState(null);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [apptRes, profileRes] = await Promise.all([
                    api.get('/doctor/appointments'),
                    api.get('/doctor/profile').catch(() => null),
                ]);

                const appointments = apptRes.data.appointments || [];
                setStats({
                    total: appointments.length,
                    pending: appointments.filter(a => a.status === 'pending').length,
                    approved: appointments.filter(a => a.status === 'approved').length,
                });

                const today = new Date().toDateString();
                setTodayAppointments(
                    appointments.filter(a => new Date(a.date).toDateString() === today && a.status === 'approved').slice(0, 5)
                );

                if (profileRes?.data?.doctor) {
                    setProfileStatus(profileRes.data.doctor.status);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    const statCards = [
        { icon: <img src={assetsAdmin.appointments_icon} alt="" />, label: 'Total Appointments', value: stats.total, gradient: 'gradient-blue' },
        { icon: <img src={assetsAdmin.appointment_icon} alt="" />, label: 'Pending Requests', value: stats.pending, gradient: 'gradient-amber' },
        { icon: <img src={assetsAdmin.tick_icon} alt="" />, label: 'Approved', value: stats.approved, gradient: 'gradient-green' },
    ];

    const quickActions = [
        { icon: <img src={assetsAdmin.appointments_icon} alt="" style={{ width: '40px' }} />, title: 'Appointment Requests', desc: 'Review pending requests', to: '/doctor/appointments' },
        { icon: <img src={assetsAdmin.list_icon} alt="" style={{ width: '40px' }} />, title: 'Consultation History', desc: 'View past consultations', to: '/doctor/history' },
        { icon: <img src={assetsAdmin.people_icon} alt="" style={{ width: '40px' }} />, title: 'My Profile', desc: 'Update your profile', to: '/doctor/profile' },
    ];

    return (
        <div className="dashboard-page">
            <div className="container">
                {/* Welcome Banner */}
                <div className="welcome-banner slide-in-left">
                    <div className="welcome-content">
                        <div className="welcome-text">
                            <span className="welcome-greeting">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'} ✨</span>

                            <h1>Dr. {user?.name || 'Doctor'}</h1>
                            <p>Here's your practice overview for today</p>
                        </div>
                        <div className="welcome-action">
                            {profileStatus === null && (
                                <Link to="/doctor/profile" className="btn btn-primary">
                                    Create Profile →
                                </Link>
                            )}
                            {profileStatus === 'pending' && (
                                <span className="badge badge-pending" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                                    <img src={assetsAdmin.appointment_icon} alt="" style={{ width: '14px', verticalAlign: 'middle' }} /> Profile Pending Approval

                                </span>
                            )}
                            {profileStatus === 'approved' && (
                                <span className="badge badge-approved" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                                    <img src={assetsAdmin.tick_icon} alt="" style={{ width: '14px', verticalAlign: 'middle' }} /> Profile Approved

                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="dash-stats-grid" style={{ gap: '2rem' }}>
                    {statCards.map((stat, i) => (
                        <div key={i} className={`organic-stat-card premium-glass slide-in-right float-organic ${stat.gradient}`} style={{ animationDelay: `${i * 0.15}s` }}>
                            <div className="dash-stat-icon">{stat.icon}</div>
                            <div className="dash-stat-info">
                                <h3>{stat.value}</h3>
                                <p>{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>


                {/* Today's Schedule */}
                {todayAppointments.length > 0 && (
                    <div className="recent-section fade-in">
                        <div className="section-header-dash">
                            <h2>Today's Schedule</h2>
                            <Link to="/doctor/appointments" className="view-all-link">View All →</Link>
                        </div>
                        <div className="recent-list">
                            {todayAppointments.map((appt, i) => (
                                <div key={i} className="recent-card card card-glass">
                                    <div className="recent-card-left">
                                        <div className="avatar">{(appt.patientId?.name || 'P').charAt(0)}</div>
                                        <div className="recent-info">
                                            <strong>{appt.patientId?.name || 'Patient'}</strong>
                                            <span>{appt.time} — {appt.reason || 'Consultation'}</span>
                                        </div>
                                    </div>
                                    <span className={`badge badge-${appt.status}`}>{appt.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="quick-actions-section slide-in-left">
                    <h2 className="section-title-dash">Quick Actions</h2>
                    <div className="quick-actions-grid stagger-children">
                        {quickActions.map((action, i) => (
                            <Link key={i} to={action.to} className="quick-action-card card card-glass scale-in">
                                <div className="qa-icon">{action.icon}</div>
                                <h3>{action.title}</h3>
                                <p>{action.desc}</p>
                                <span className="qa-arrow">→</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
