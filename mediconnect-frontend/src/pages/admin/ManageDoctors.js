import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import '../patient/PatientDashboard.css';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/admin/doctors');
            setDoctors(response.data.doctors);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.put(`/admin/doctors/${id}/approve`);
            fetchDoctors();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to approve');
        }
    };

    const handleBlock = async (id) => {
        if (!window.confirm('Are you sure you want to block this doctor?')) return;
        try {
            await api.put(`/admin/doctors/${id}/block`);
            fetchDoctors();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to block');
        }
    };

    const filtered = filter === 'all'
        ? doctors
        : doctors.filter(d => d.status === filter);

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="welcome-banner fade-in">
                    <div className="welcome-content" style={{ justifyContent: 'center', textAlign: 'center' }}>
                        <div className="welcome-text">
                            <h1>Manage Doctors 👨‍⚕️</h1>
                            <p>Approve, manage, or block doctor accounts</p>
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="filter-tabs" style={{ marginBottom: '1.5rem' }}>
                    {['all', 'pending', 'approved', 'blocked'].map(status => (
                        <button
                            key={status}
                            className={`filter-tab ${filter === status ? 'active' : ''}`}
                            onClick={() => setFilter(status)}
                        >
                            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                            {` (${status === 'all' ? doctors.length : doctors.filter(d => d.status === status).length})`}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="card card-glass">
                        <div className="empty-state">
                            <div className="empty-state-icon">👨‍⚕️</div>
                            <h3>No Doctors Found</h3>
                            <p>{filter === 'all' ? 'No doctors registered yet' : `No ${filter} doctors`}</p>
                        </div>
                    </div>
                ) : (
                    <div className="doctors-grid stagger-children">
                        {filtered.map((doctor) => (
                            <div key={doctor._id} className="doctor-list-card card card-glass scale-in">
                                <div className="dlc-header">
                                    <div className="avatar avatar-lg">
                                        {(doctor.userId?.name || 'D').charAt(0)}
                                    </div>
                                    <div className="dlc-info">
                                        <h3>{doctor.userId?.name || 'Doctor'}</h3>
                                        <span className="dlc-spec">{doctor.specialization}</span>
                                        <span className="dlc-qual">{doctor.userId?.email}</span>
                                    </div>
                                </div>
                                <div className="dlc-details">
                                    <div className="dlc-detail-row">
                                        <span className="dlc-detail-label">Experience</span>
                                        <span className="dlc-detail-value">{doctor.experience} years</span>
                                    </div>
                                    <div className="dlc-detail-row">
                                        <span className="dlc-detail-label">Fee</span>
                                        <span className="dlc-detail-value dlc-fee">${doctor.fees}</span>
                                    </div>
                                    <div className="dlc-detail-row">
                                        <span className="dlc-detail-label">Status</span>
                                        <span className={`badge badge-${doctor.status}`}>{doctor.status}</span>
                                    </div>
                                </div>
                                <div className="appt-card-actions" style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '0.75rem', marginTop: '0' }}>
                                    {doctor.status !== 'approved' && (
                                        <button onClick={() => handleApprove(doctor._id)} className="btn btn-sm btn-success" style={{ flex: 1 }}>
                                            ✓ Approve
                                        </button>
                                    )}
                                    {doctor.status !== 'blocked' && (
                                        <button onClick={() => handleBlock(doctor._id)} className="btn btn-sm btn-error" style={{ flex: 1 }}>
                                            ✕ Block
                                        </button>
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

export default ManageDoctors;
