import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { assets } from '../../assets/assets_admin/assets';
import '../patient/PatientDashboard.css';


const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        pendingApprovals: 0,
        totalAppointments: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/statistics');
            const data = response.data.statistics;
            setStats({
                totalUsers: data.users.total,
                totalDoctors: data.doctors.total,
                pendingApprovals: data.doctors.pending,
                totalAppointments: data.appointments.total,
            });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    const statCards = [
        { icon: <img src={assets.people_icon} alt="" />, label: 'Total Users', value: stats.totalUsers, gradient: 'gradient-blue' },
        { icon: <img src={assets.doctor_icon} alt="" />, label: 'Total Doctors', value: stats.totalDoctors, gradient: 'gradient-green' },
        { icon: <img src={assets.list_icon} alt="" />, label: 'Pending Approvals', value: stats.pendingApprovals, gradient: 'gradient-amber' },
        { icon: <img src={assets.appointments_icon} alt="" />, label: 'Appointments', value: stats.totalAppointments, gradient: 'gradient-blue' },
    ];

    const quickActions = [
        { icon: <img src={assets.doctor_icon} alt="" style={{ width: '40px' }} />, title: 'Manage Doctors', desc: 'Approve or block doctors', to: '/admin/doctors' },
        { icon: <img src={assets.people_icon} alt="" style={{ width: '40px' }} />, title: 'Manage Users', desc: 'View & manage users', to: '/admin/users' },
        { icon: <img src={assets.appointments_icon} alt="" style={{ width: '40px' }} />, title: 'All Appointments', desc: 'View platform appointments', to: '/admin/appointments' },
    ];

    return (
        <div className="dashboard-page">
            <div className="container">
                {/* Welcome Banner */}
                <div className="welcome-banner fade-in">
                    <div className="welcome-content">
                        <div className="welcome-text">
                            <span className="welcome-greeting">Admin Panel <img src={assets.admin_logo} alt="" style={{ width: '16px', display: 'inline' }} /></span>

                            <h1>Welcome, {user?.name || 'Admin'}</h1>
                            <p>Platform overview and management tools</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="dash-stats-grid stagger-children" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
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

                {/* Quick Actions */}
                <div className="quick-actions-section fade-in">
                    <h2 className="section-title-dash">Management Tools</h2>
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

export default AdminDashboard;
