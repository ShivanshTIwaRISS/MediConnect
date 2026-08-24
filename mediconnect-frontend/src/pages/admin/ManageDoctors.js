import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => { fetchDoctors(); }, []);

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

    const filtered = filter === 'all' ? doctors : doctors.filter(d => d.status === filter);
    const filterCounts = { all: doctors.length, pending: 0, approved: 0, blocked: 0 };
    doctors.forEach(d => { if (filterCounts[d.status] !== undefined) filterCounts[d.status]++; });

    if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading doctors…</p></div>;

    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: '2rem' }} className="anim-fade-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                        background: 'var(--stat-green-bg)', border: '1px solid var(--stat-green-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                    }}>👨‍⚕️</div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Manage Doctors</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                    Approve, manage, or block doctor accounts on the platform.
                </p>
            </div>

            {/* Pending alert */}
            {filterCounts.pending > 0 && (
                <div className="alert alert-warning anim-fade-up" style={{ marginBottom: '1.5rem' }}>
                    ⚠️ <strong>{filterCounts.pending}</strong> doctor{filterCounts.pending > 1 ? 's' : ''} awaiting approval
                    <button
                        onClick={() => setFilter('pending')}
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--warning)', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'var(--font-family)' }}
                    >
                        Review →
                    </button>
                </div>
            )}

            {/* Filter Tabs */}
            <div className="filter-tabs anim-fade-up">
                {['all', 'pending', 'approved', 'blocked'].map(status => (
                    <button
                        key={status}
                        className={`filter-tab ${filter === status ? 'active' : ''}`}
                        onClick={() => setFilter(status)}
                    >
                        {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                        <span style={{ marginLeft: '0.35rem', opacity: 0.7 }}>({filterCounts[status] ?? 0})</span>
                    </button>
                ))}
            </div>

            {/* Doctors Grid */}
            {filtered.length === 0 ? (
                <div className="card" style={{ padding: 0 }}>
                    <div className="empty-state">
                        <div className="empty-state-icon">👨‍⚕️</div>
                        <h3>No Doctors Found</h3>
                        <p>{filter === 'all' ? 'No doctors registered yet.' : `No ${filter} doctors.`}</p>
                    </div>
                </div>
            ) : (
                <div className="doctors-grid">
                    {filtered.map((doctor, i) => (
                        <div key={doctor._id} className={`doctor-card-new anim-fade-up anim-d${Math.min(i + 1, 5)}`}>
                            <div className="doctor-card-header">
                                <div
                                    className="avatar avatar-lg"
                                    style={{ borderRadius: 'var(--radius-xl)', background: doctor.status === 'approved' ? 'var(--gradient-success)' : doctor.status === 'blocked' ? 'var(--gradient-rose)' : 'var(--gradient-primary)' }}
                                >
                                    {(doctor.userId?.name || 'D').charAt(0)}
                                </div>
                                <div>
                                    <div className="doctor-card-name">{doctor.userId?.name || 'Doctor'}</div>
                                    <span className="doctor-card-spec">{doctor.specialization}</span>
                                    <span className="doctor-card-qual">{doctor.userId?.email}</span>
                                </div>
                            </div>

                            <div className="detail-divider" />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                                <div className="detail-row">
                                    <span className="detail-row-label">Experience</span>
                                    <span className="detail-row-value">{doctor.experience} yrs</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-row-label">Consultation Fee</span>
                                    <span className="detail-row-value brand">${doctor.fees}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-row-label">Status</span>
                                    <span className={`badge badge-${doctor.status}`}>{doctor.status}</span>
                                </div>
                            </div>

                            <div className="card-actions">
                                {doctor.status !== 'approved' && (
                                    <button
                                        onClick={() => handleApprove(doctor._id)}
                                        className="btn btn-sm btn-success"
                                        style={{ flex: 1 }}
                                    >
                                        ✓ Approve
                                    </button>
                                )}
                                {doctor.status !== 'blocked' && (
                                    <button
                                        onClick={() => handleBlock(doctor._id)}
                                        className="btn btn-sm btn-error"
                                        style={{ flex: 1 }}
                                    >
                                        ✕ Block
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageDoctors;
