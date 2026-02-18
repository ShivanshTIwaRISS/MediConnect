import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { assets as assetsFrontend } from '../../assets/assets_frontend/assets';
import { assets as assetsAdmin } from '../../assets/assets_admin/assets';
import '../patient/PatientDashboard.css';


const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/patient/appointments');
            setAppointments(response.data.appointments);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            await api.put(`/patient/appointments/${id}/cancel`);
            fetchAppointments();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to cancel.');
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
                            <h1>My Appointments <img src={assetsAdmin.appointment_icon} alt="" style={{ width: '28px', verticalAlign: 'middle' }} /></h1>

                            <p>View and manage all your appointment bookings</p>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="filter-tabs" style={{ marginBottom: '1.5rem' }}>
                    {['all', 'pending', 'approved', 'rejected', 'cancelled'].map(status => (
                        <button
                            key={status}
                            className={`filter-tab ${filter === status ? 'active' : ''}`}
                            onClick={() => setFilter(status)}
                        >
                            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                            {status === 'all' && ` (${appointments.length})`}
                            {status !== 'all' && ` (${appointments.filter(a => a.status === status).length})`}
                        </button>
                    ))}
                </div>

                {/* Appointments List */}
                {filtered.length === 0 ? (
                    <div className="card card-glass">
                        <div className="empty-state">
                            <div className="empty-state-icon"><img src={assetsAdmin.appointment_icon} alt="" style={{ width: '48px', opacity: 0.5 }} /></div>

                            <h3>No Appointments</h3>
                            <p>{filter === 'all' ? "You haven't booked any appointments yet" : `No ${filter} appointments found`}</p>
                        </div>
                    </div>
                ) : (
                    <div className="appt-cards-list">
                        {filtered.map((appt) => (
                            <div key={appt._id} className="appt-card card card-glass fade-in">
                                <div className="appt-card-main">
                                    <div className="appt-card-left">
                                        <div className="avatar">{(appt.doctorId?.userId?.name || 'D').charAt(0)}</div>
                                        <div className="appt-card-info">
                                            <h3>{appt.doctorId?.userId?.name || 'Doctor'}</h3>
                                            <span className="appt-spec">{appt.doctorId?.specialization || 'Specialist'}</span>
                                        </div>
                                    </div>
                                    <span className={`badge badge-${appt.status}`}>{appt.status}</span>
                                </div>
                                <div className="appt-card-details">
                                    <div className="appt-detail-item">
                                        <span className="appt-detail-icon"><img src={assetsAdmin.appointment_icon} alt="" style={{ width: '16px' }} /></span>

                                        <span>{new Date(appt.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
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
                                        <button
                                            onClick={() => handleCancel(appt._id)}
                                            className="btn btn-sm btn-error"
                                        >
                                            Cancel Appointment
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

export default MyAppointments;
