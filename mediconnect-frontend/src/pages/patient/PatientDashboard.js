import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { assets as assetsAdmin } from '../../assets/assets_admin/assets';
import './PatientDashboard.css';



const PatientDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes] = await Promise.all([
                    api.get('/patient/appointments'),
                ]);
                const appointments = statsRes.data.appointments || [];
                setStats({
                    total: appointments.length,
                    pending: appointments.filter(a => a.status === 'pending').length,
                    approved: appointments.filter(a => a.status === 'approved').length,
                });
                setRecentAppointments(appointments.slice(0, 3));
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
        { icon: <img src={assetsAdmin.appointment_icon} alt="" />, label: 'Pending', value: stats.pending, gradient: 'gradient-amber' },
        { icon: <img src={assetsAdmin.tick_icon} alt="" />, label: 'Approved', value: stats.approved, gradient: 'gradient-green' },
    ];

    const quickActions = [
        { icon: <img src={assetsAdmin.list_icon} alt="" style={{ width: '40px' }} />, title: 'Find Doctors', desc: 'Browse specialists', to: '/patient/doctors' },
        { icon: <img src={assetsAdmin.appointment_icon} alt="" style={{ width: '40px' }} />, title: 'Book Appointment', desc: 'Schedule a visit', to: '/patient/book-appointment' },
        { icon: <img src={assetsAdmin.appointments_icon} alt="" style={{ width: '40px' }} />, title: 'My Appointments', desc: 'View & manage', to: '/patient/appointments' },
        { icon: <img src={assetsAdmin.people_icon} alt="" style={{ width: '40px' }} />, title: 'My Profile', desc: 'Update details', to: '/patient/profile' },
    ];

    return (
        <div className="dashboard-page">
            <div className="container">
                {/* Welcome Banner */}
                <div className="welcome-banner fade-in">
                    <div className="welcome-content">
                        <div className="welcome-text">
                            <span className="welcome-greeting">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'} ✨</span>

                            <h1>{user?.name || 'Patient'}</h1>
                            <p>Here's an overview of your healthcare journey</p>
                        </div>
                        <div className="welcome-action">
                            <Link to="/patient/book-appointment" className="btn btn-primary">
                                Book Appointment →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="dash-stats-grid stagger-children">
                    {statCards.map((stat, i) => (
                        <div key={i} className={`dash-stat-card card card-glass scale-in ${stat.gradient}`}>
                            <div className="dash-stat-icon">{stat.icon}</div>
                            <div className="dash-stat-info">
                                <h3>{stat.value}</h3>
                                <p>{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Appointments */}
                {recentAppointments.length > 0 && (
                    <div className="recent-section fade-in">
                        <div className="section-header-dash">
                            <h2>Recent Appointments</h2>
                            <Link to="/patient/appointments" className="view-all-link">View All →</Link>
                        </div>
                        <div className="recent-list">
                            {recentAppointments.map((appt, i) => (
                                <div key={i} className="recent-card card card-glass">
                                    <div className="recent-card-left">
                                        <div className="avatar">{(appt.doctorId?.userId?.name || 'D').charAt(0)}</div>
                                        <div className="recent-info">
                                            <strong>{appt.doctorId?.userId?.name || 'Doctor'}</strong>
                                            <span>{appt.doctorId?.specialization || 'Specialist'}</span>
                                        </div>
                                    </div>
                                    <div className="recent-card-right">
                                        <span className="recent-date">{new Date(appt.date).toLocaleDateString()}</span>
                                        <span className={`badge badge-${appt.status}`}>{appt.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="quick-actions-section fade-in">
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

export default PatientDashboard;
