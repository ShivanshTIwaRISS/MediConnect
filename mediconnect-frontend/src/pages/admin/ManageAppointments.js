import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { assets as assetsFrontend } from '../../assets/assets_frontend/assets';
import { assets as assetsAdmin } from '../../assets/assets_admin/assets';
import '../patient/PatientDashboard.css';


const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/admin/appointments');
            setAppointments(response.data.appointments);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = appointments.filter(a => {
        const matchesFilter = filter === 'all' || a.status === filter;
        const matchesSearch = !searchTerm ||
            a.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.doctorId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="welcome-banner fade-in">
                    <div className="welcome-content" style={{ justifyContent: 'center', textAlign: 'center' }}>
                        <div className="welcome-text">
                            <h1>All Appointments <img src={assetsAdmin.appointments_icon} alt="" style={{ width: '28px', verticalAlign: 'middle' }} /></h1>

                            <p>View all appointments across the platform</p>
                        </div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="card card-glass" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search by patient or doctor name..."

                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-tabs">
                        {['all', 'pending', 'approved', 'rejected', 'cancelled'].map(status => (
                            <button
                                key={status}
                                className={`filter-tab ${filter === status ? 'active' : ''}`}
                                onClick={() => setFilter(status)}
                            >
                                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                                {` (${status === 'all' ? appointments.length : appointments.filter(a => a.status === status).length})`}
                            </button>
                        ))}
                    </div>
                </div>

                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    Showing {filtered.length} appointment{filtered.length !== 1 ? 's' : ''}
                </p>

                {filtered.length === 0 ? (
                    <div className="card card-glass">
                        <div className="empty-state">
                            <div className="empty-state-icon"><img src={assetsAdmin.appointments_icon} alt="" style={{ width: '48px', opacity: 0.5 }} /></div>

                            <h3>No Appointments Found</h3>
                            <p>{filter === 'all' ? 'No appointments on the platform yet' : `No ${filter} appointments`}</p>
                        </div>
                    </div>
                ) : (
                    <div className="appt-cards-list">
                        {filtered.map((appt) => (
                            <div key={appt._id} className="appt-card card card-glass fade-in">
                                <div className="appt-card-main">
                                    <div className="appt-card-left">
                                        <div className="avatar">{(appt.patientId?.name || 'P').charAt(0)}</div>
                                        <div className="appt-card-info">
                                            <h3>{appt.patientId?.name || 'Patient'}</h3>
                                            <span className="appt-spec">with Dr. {appt.doctorId?.userId?.name || 'Doctor'}</span>
                                        </div>
                                    </div>
                                    <span className={`badge badge-${appt.status}`}>{appt.status}</span>
                                </div>
                                <div className="appt-card-details">
                                    <div className="appt-detail-item">
                                        <span className="appt-detail-icon"><img src={assetsAdmin.appointment_icon} alt="" style={{ width: '16px' }} /></span>

                                        <span>{new Date(appt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="appt-detail-item">
                                        <span className="appt-detail-icon"><img src={assetsFrontend.chats_icon} alt="" style={{ width: '16px' }} /></span>

                                        <span>{appt.time}</span>
                                    </div>
                                    {appt.reason && (
                                        <div className="appt-detail-item">
                                            <span className="appt-detail-icon"><img src={assetsFrontend.info_icon} alt="" style={{ width: '16px' }} /></span>

                                            <span>{appt.reason}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageAppointments;
