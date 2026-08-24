import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Icon from '../../components/Icons';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    const fetchDoctors = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/admin/doctors');
            if (response.data && response.data.doctors) {
                setDoctors(response.data.doctors);
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
            setError(err.response?.data?.message || 'Unable to fetch doctors list. Please check your network connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchDoctors(); 
    }, []);

    const handleApprove = async (id) => {
        try {
            await api.put(`/admin/doctors/${id}/approve`);
            fetchDoctors();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to approve');
        }
    };

    const handleBlock = async (id) => {
        if (!window.confirm('Are you sure you want to suspend this doctor account?')) return;
        try {
            await api.put(`/admin/doctors/${id}/block`);
            fetchDoctors();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to block');
        }
    };

    const filtered = filter === 'all' ? doctors : doctors.filter(d => d.status === filter);
    const filterCounts = { all: doctors.length, pending: 0, approved: 0, blocked: 0 };
    doctors.forEach(d => { if (filterCounts[d.status] !== undefined) filterCounts[d.status]++; });

    if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading medical staff records…</p></div>;

    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: '2rem' }} className="anim-fade-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                        background: 'var(--primary-light)', border: '1px solid var(--border-subtle)',
                        color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Icon name="stethoscope" size={20} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Manage Doctors</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                    Verify practitioner credentials, approve registrations, and manage clinical privileges.
                </p>
            </div>

            {error && (
                <div className="alert alert-error anim-fade-up" style={{ marginBottom: '1.5rem', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Icon name="alertTriangle" size={18} />
                        <span>{error}</span>
                    </div>
                    <button onClick={fetchDoctors} className="btn btn-sm btn-outline" style={{ background: 'var(--bg-surface)' }}>
                        Retry
                    </button>
                </div>
            )}

            {/* Pending alert */}
            {filterCounts.pending > 0 && (
                <div className="alert alert-warning anim-fade-up" style={{ marginBottom: '1.5rem' }}>
                    <Icon name="alertTriangle" size={18} />
                    <span><strong>{filterCounts.pending}</strong> doctor application{filterCounts.pending > 1 ? 's' : ''} awaiting approval</span>
                    <button
                        onClick={() => setFilter('pending')}
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--warning)', fontWeight: 700, fontSize: '0.825rem', fontFamily: 'var(--font-sans)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                        Filter Pending
                        <Icon name="chevronRight" size={14} />
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
                        {status === 'all' ? 'All Providers' : status.charAt(0).toUpperCase() + status.slice(1)}
                        <span style={{ marginLeft: '0.35rem', opacity: 0.75 }}>({filterCounts[status] ?? 0})</span>
                    </button>
                ))}
            </div>

            {/* Doctors Grid */}
            {filtered.length === 0 ? (
                <div className="card" style={{ padding: 0 }}>
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Icon name="stethoscope" size={24} />
                        </div>
                        <h3>No Providers Found</h3>
                        <p>{filter === 'all' ? 'No registered doctors on file.' : `No doctors found with status "${filter}".`}</p>
                    </div>
                </div>
            ) : (
                <div className="doctors-grid">
                    {filtered.map((doctor, i) => (
                        <div key={doctor._id} className={`doctor-card-new anim-fade-up anim-d${Math.min(i + 1, 5)}`}>
                            <div className="doctor-card-header">
                                <div
                                    className="avatar avatar-lg"
                                    style={{
                                        borderRadius: 'var(--radius-xl)',
                                        background: doctor.status === 'approved' ? 'var(--gradient-primary)' : 'var(--bg-glass)',
                                        color: doctor.status === 'approved' ? '#ffffff' : 'var(--text-primary)',
                                        border: '1px solid var(--border-default)'
                                    }}
                                >
                                    {(doctor.userId?.name || 'D').charAt(0)}
                                </div>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <div className="doctor-card-name">{doctor.userId?.name || 'Doctor'}</div>
                                    <span className="doctor-card-spec">{doctor.specialization}</span>
                                    <span className="doctor-card-qual">{doctor.userId?.email}</span>
                                </div>
                            </div>

                            <div className="detail-divider" />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                <div className="detail-row">
                                    <span className="detail-row-label">Clinical Experience</span>
                                    <span className="detail-row-value">{doctor.experience} Years</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-row-label">Consultation Rate</span>
                                    <span className="detail-row-value brand">${doctor.fees}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-row-label">Account Status</span>
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
                                        <Icon name="check" size={14} />
                                        Approve
                                    </button>
                                )}
                                {doctor.status !== 'blocked' && (
                                    <button
                                        onClick={() => handleBlock(doctor._id)}
                                        className="btn btn-sm btn-error"
                                        style={{ flex: 1 }}
                                    >
                                        <Icon name="ban" size={14} />
                                        Suspend
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
