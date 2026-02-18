import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { assets as assetsFrontend } from '../../assets/assets_frontend/assets';
import { assets as assetsAdmin } from '../../assets/assets_admin/assets';
import '../patient/PatientDashboard.css';


const AppointmentRequests = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/doctor/appointments');
            setAppointments(response.data.appointments);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id) => {
        try {
            await api.put(`/doctor/appointments/${id}/accept`);
            fetchAppointments();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to accept');
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Are you sure you want to reject this appointment?')) return;
        try {
            await api.put(`/doctor/appointments/${id}/reject`);
            fetchAppointments();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to reject');
        }
    };

    const filtered = filter === 'all'
        ? appointments
        : appointments.filter(a => a.status === filter);

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="welcome-banner fade-in">
                    <div className="welcome-content" style={{ justifyContent: 'center', textAlign: 'center' }}>
                        <div className="welcome-text">
                            <h1>Appointment Requests <img src={assetsAdmin.appointments_icon} alt="" style={{ width: '28px', verticalAlign: 'middle' }} /></h1>

                            <p>Manage patient consultation requests</p>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="filter-tabs" style={{ marginBottom: '1.5rem' }}>
                    {['all', 'pending', 'approved', 'rejected'].map(status => (
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

                {/* Appointments */}
                {filtered.length === 0 ? (
                    <div className="card card-glass">
                        <div className="empty-state">
                            <div className="empty-state-icon"><img src={assetsAdmin.appointments_icon} alt="" style={{ width: '48px', opacity: 0.5 }} /></div>

                            <h3>No Requests</h3>
                            <p>{filter === 'all' ? 'No appointment requests yet' : `No ${filter} requests`}</p>
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
                                            <span className="appt-spec">{appt.patientId?.email || ''}</span>
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
                                {appt.status === 'pending' && (
                                    <div className="appt-card-actions">
                                        <button onClick={() => handleAccept(appt._id)} className="btn btn-sm btn-success">
                                            ✓ Accept
                                        </button>
                                        <button onClick={() => handleReject(appt._id)} className="btn btn-sm btn-error">
                                            ✕ Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentRequests;
