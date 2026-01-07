import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import '../patient/PatientDashboard.css';
import { assets } from '../../assets/assets_frontend/assets';
import { assets as adminAssets } from '../../assets/assets_admin/assets';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        pendingDoctors: 0,
        totalAppointments: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const response = await api.get('/admin/statistics');
            const data = response.data.statistics;

            setStats({
                totalUsers: data.users.total,
                totalDoctors: data.doctors.total,
                pendingDoctors: data.doctors.pending,
                totalAppointments: data.appointments.total,
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching statistics:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header fade-in">
                    <h1>Admin Dashboard</h1>
                    <p>Manage users, doctors, and platform operations</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card card card-glass">
                        <div className="stat-icon">
                            <img src={adminAssets.people_icon} alt="Users" style={{ width: '30px' }} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.totalUsers}</h3>
                            <p>Total Users</p>
                        </div>
                    </div>
                    <div className="stat-card card card-glass">
                        <div className="stat-icon">
                            <img src={adminAssets.doctor_icon} alt="Doctors" style={{ width: '30px' }} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.totalDoctors}</h3>
                            <p>Total Doctors</p>
                        </div>
                    </div>
                    <div className="stat-card card card-glass">
                        <div className="stat-icon">
                            <img src={assets.info_icon} alt="Pending" style={{ width: '30px' }} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.pendingDoctors}</h3>
                            <p>Pending Approvals</p>
                        </div>
                    </div>
                    <div className="stat-card card card-glass">
                        <div className="stat-icon">
                            <img src={adminAssets.appointment_icon} alt="Appointments" style={{ width: '30px' }} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.totalAppointments}</h3>
                            <p>Total Appointments</p>
                        </div>
                    </div>
                </div>

                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <Link to="/admin/doctors" className="action-card card card-glass">
                            <div className="action-icon">
                                <img src={adminAssets.doctor_icon} alt="Manage Doctors" style={{ width: '40px' }} />
                            </div>
                            <h3>Manage Doctors</h3>
                            <p>Approve or block doctor accounts</p>
                        </Link>
                        <Link to="/admin/users" className="action-card card card-glass">
                            <div className="action-icon">
                                <img src={adminAssets.people_icon} alt="Manage Users" style={{ width: '40px' }} />
                            </div>
                            <h3>Manage Users</h3>
                            <p>View and manage all users</p>
                        </Link>
                        <Link to="/admin/appointments" className="action-card card card-glass">
                            <div className="action-icon">
                                <img src={adminAssets.list_icon} alt="All Appointments" style={{ width: '40px' }} />
                            </div>
                            <h3>All Appointments</h3>
                            <p>View all platform appointments</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
