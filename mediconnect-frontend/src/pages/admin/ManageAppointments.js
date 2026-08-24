import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchAppointments(); }, []);

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

    const statusCounts = { all: appointments.length, pending: 0, approved: 0, rejected: 0, cancelled: 0 };
    appointments.forEach(a => { if (statusCounts[a.status] !== undefined) statusCounts[a.status]++; });

    if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading appointments…</p></div>;

    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: '2rem' }} className="anim-fade-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                        background: 'var(--stat-purple-bg)', border: '1px solid var(--stat-purple-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                    }}>📋</div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>All Appointments</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                    View and monitor all appointments across the platform.
                </p>
            </div>

            {/* Search + Filter */}
            <div className="card anim-fade-up" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search by patient or doctor name…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.25rem' }}
                        />
                    </div>
                </div>
                <div className="filter-tabs" style={{ marginBottom: 0 }}>
                    {['all', 'pending', 'approved', 'rejected', 'cancelled'].map(status => (
                        <button
                            key={status}
                            className={`filter-tab ${filter === status ? 'active' : ''}`}
                            onClick={() => setFilter(status)}
                        >
                            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                            <span style={{ marginLeft: '0.35rem', opacity: 0.7 }}>({statusCounts[status] ?? 0})</span>
                        </button>
                    ))}
                </div>
            </div>

            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.8rem' }}>
                Showing <strong style={{ color: 'var(--text-secondary)' }}>{filtered.length}</strong> appointment{filtered.length !== 1 ? 's' : ''}
            </p>

            {filtered.length === 0 ? (
                <div className="card" style={{ padding: 0 }}>
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <h3>No Appointments Found</h3>
                        <p>{filter === 'all' ? 'No appointments on the platform yet.' : `No ${filter} appointments.`}</p>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filtered.map((appt, i) => (
                        <div key={appt._id} className={`appt-card-new anim-fade-up anim-d${Math.min(i + 1, 5)}`}>
                            <div className="appt-left">
                                <div className="avatar avatar-md" style={{ background: 'var(--gradient-primary)' }}>
                                    {(appt.patientId?.name || 'P').charAt(0)}
                                </div>
                                <div className="appt-info">
                                    <h4>{appt.patientId?.name || 'Patient'}</h4>
                                    <span className="appt-info-sub">
                                        with Dr. {appt.doctorId?.userId?.name || 'Doctor'}
                                        {appt.doctorId?.specialization ? ` · ${appt.doctorId.specialization}` : ''}
                                    </span>
                                </div>
                            </div>
                            <div className="appt-right">
                                <div style={{ textAlign: 'right' }}>
                                    <div className="appt-date">
                                        {new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    {appt.time && (
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{appt.time}</div>
                                    )}
                                </div>
                                <span className={`badge badge-${appt.status}`}>{appt.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageAppointments;
