import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AppointmentRequests = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => { fetchAppointments(); }, []);

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
        if (!window.confirm('Reject this appointment request?')) return;
        try {
            await api.put(`/doctor/appointments/${id}/reject`);
            fetchAppointments();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to reject');
        }
    };

    const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);
    const statusCounts = { all: appointments.length, pending: 0, approved: 0, rejected: 0 };
    appointments.forEach(a => { if (statusCounts[a.status] !== undefined) statusCounts[a.status]++; });

    if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading requests…</p></div>;

    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: '2rem' }} className="anim-fade-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                        background: 'var(--stat-amber-bg)', border: '1px solid var(--stat-amber-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                    }}>📋</div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Appointment Requests</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                    Manage patient consultation requests.
                </p>
            </div>

            {/* Pending alert */}
            {statusCounts.pending > 0 && (
                <div className="alert alert-warning anim-fade-up" style={{ marginBottom: '1.5rem' }}>
                    ⏳ <strong>{statusCounts.pending}</strong> pending request{statusCounts.pending > 1 ? 's' : ''} awaiting your response
                </div>
            )}

            {/* Filter Tabs */}
            <div className="filter-tabs anim-fade-up">
                {['all', 'pending', 'approved', 'rejected'].map(status => (
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

            {filtered.length === 0 ? (
                <div className="card" style={{ padding: 0 }}>
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <h3>No Requests</h3>
                        <p>{filter === 'all' ? 'No appointment requests yet.' : `No ${filter} requests.`}</p>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filtered.map((appt, i) => (
                        <div key={appt._id} className={`card anim-fade-up anim-d${Math.min(i + 1, 5)}`} style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div
                                        className="avatar avatar-lg"
                                        style={{ background: `hsl(${(i * 70 + 200) % 360}, 65%, 55%)`, borderRadius: 'var(--radius-xl)' }}
                                    >
                                        {(appt.patientId?.name || 'P').charAt(0)}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.2rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                                            {appt.patientId?.name || 'Patient'}
                                        </h4>
                                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                            {appt.patientId?.email || 'No email'}
                                        </span>
                                    </div>
                                </div>
                                <span className={`badge badge-${appt.status}`}>{appt.status}</span>
                            </div>

                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem', padding: '0.875rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <span>📅</span>
                                    <span>{new Date(appt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                {appt.time && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <span>🕐</span>
                                        <span>{appt.time}</span>
                                    </div>
                                )}
                                {appt.reason && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <span>📝</span>
                                        <span>{appt.reason}</span>
                                    </div>
                                )}
                            </div>

                            {appt.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button
                                        onClick={() => handleAccept(appt._id)}
                                        className="btn btn-sm btn-success"
                                    >
                                        ✓ Accept Request
                                    </button>
                                    <button
                                        onClick={() => handleReject(appt._id)}
                                        className="btn btn-sm btn-error"
                                    >
                                        ✕ Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AppointmentRequests;
