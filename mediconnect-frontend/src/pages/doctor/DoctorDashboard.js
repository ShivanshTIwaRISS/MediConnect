import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import '../patient/PatientDashboard.css';
import { assets } from '../../assets/assets_frontend/assets';
import { assets as adminAssets } from '../../assets/assets_admin/assets';

const DoctorDashboard = () => {
    const [stats, setStats] = useState({
        totalAppointments: 0,
        pendingAppointments: 0,
        approvedAppointments: 0,
    });
    const [hasProfile, setHasProfile] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkProfile();
        fetchAppointments();
    }, []);

    const checkProfile = async () => {
        try {
            await api.get('/doctor/profile');
            setHasProfile(true);
        } catch (error) {
            setHasProfile(false);
        }
    };

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/doctor/appointments');
            const appointments = response.data.appointments;

            setStats({
                totalAppointments: appointments.length,
                pendingAppointments: appointments.filter(a => a.status === 'pending').length,
                approvedAppointments: appointments.filter(a => a.status === 'approved').length,
            });
            setLoading(false);
        } catch (error) {
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
                    <h1>Doctor Dashboard</h1>
                    <p>Manage your profile and patient consultations</p>
                </div>

                {!hasProfile && (
                    <div className="alert alert-info">
                        Please create your doctor profile to start receiving appointment requests.
                    </div>
                )}

                <div className="stats-grid">
                    <div className="stat-card card card-glass">
                        <div className="stat-icon">
                            <img src={adminAssets.people_icon} alt="Total" style={{ width: '30px' }} />
                        </div>
                        <div className="stat-info">
                            <h3>{stats.totalAppointments}</h3>
                            <p>Total Requests</p>
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
                        <Link to="/doctor/profile" className="action-card card card-glass">
                            <div className="action-icon">
                                <img src={assets.profile_pic} alt="Profile" style={{ width: '40px' }} />
                            </div>
                            <h3>My Profile</h3>
                            <p>{hasProfile ? 'Update' : 'Create'} your doctor profile</p>
                        </Link>
                        <Link to="/doctor/appointments" className="action-card card card-glass">
                            <div className="action-icon">
                                <img src={adminAssets.list_icon} alt="Requests" style={{ width: '40px' }} />
                            </div>
                            <h3>Appointment Requests</h3>
                            <p>View and manage patient requests</p>
                        </Link>
                        <Link to="/doctor/history" className="action-card card card-glass">
                            <div className="action-icon">
                                <img src={adminAssets.appointments_icon} alt="History" style={{ width: '40px' }} />
                            </div>
                            <h3>Consultation History</h3>
                            <p>View past consultations</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
