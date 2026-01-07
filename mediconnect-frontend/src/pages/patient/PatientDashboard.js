import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './PatientDashboard.css';
import { assets } from '../../assets/assets_frontend/assets';
import { assets as adminAssets } from '../../assets/assets_admin/assets';

const PatientDashboard = () => {
    const [stats, setStats] = useState({
        totalAppointments: 0,
        pendingAppointments: 0,
        approvedAppointments: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/patient/appointments');
            const appointments = response.data.appointments;

            setStats({
                totalAppointments: appointments.length,
                pendingAppointments: appointments.filter(a => a.status === 'pending').length,
                approvedAppointments: appointments.filter(a => a.status === 'approved').length,
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header fade-in">
                    <h1>Patient Dashboard</h1>
                    <p>Manage your appointments and health consultations</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card card card-glass">
                        <div className="stat-icon">
                            <img src={adminAssets.home_icon} alt="Total" style={{ width: '30px' }} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.totalAppointments}</h3>
                            <p>Total Appointments</p>
                        </div>
                    </div>
                    <div className="stat-card card card-glass">
                        <div className="stat-icon">
                            <img src={assets.info_icon} alt="Pending" style={{ width: '30px' }} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.pendingAppointments}</h3>
                            <p>Pending</p>
                        </div>
                    </div>
                    <div className="stat-card card card-glass">
                        <div className="stat-icon">
                            <img src={assets.verified_icon} alt="Approved" style={{ width: '30px' }} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.approvedAppointments}</h3>
                            <p>Approved</p>
                        </div>
                    </div>
                </div>

                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                        <Link to="/patient/doctors" className="action-card card card-glass">
                            <div className="action-icon">
                                <img src={adminAssets.doctor_icon} alt="Doctors" style={{ width: '40px' }} />
                            </div>
                            <h3>Find Doctors</h3>
                            <p>Browse and view available doctors</p>
                        </Link>
                        <Link to="/patient/book-appointment" className="action-card card card-glass">
                            <div className="action-icon">
                                <img src={adminAssets.appointment_icon} alt="Book" style={{ width: '40px' }} />
                            </div>
                            <h3>Book Appointment</h3>
                            <p>Schedule a new consultation</p>
                        </Link>
                        <Link to="/patient/appointments" className="action-card card card-glass">
                            <div className="action-icon">
                                <img src={adminAssets.list_icon} alt="Appointments" style={{ width: '40px' }} />
                            </div>
                            <h3>My Appointments</h3>
                            <p>View and manage your appointments</p>
                        </Link>
                        <Link to="/patient/profile" className="action-card card card-glass">
                            <div className="action-icon">
                                <img src={assets.profile_pic} alt="Profile" style={{ width: '40px' }} />
                            </div>
                            <h3>My Profile</h3>
                            <p>Update your personal information</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
