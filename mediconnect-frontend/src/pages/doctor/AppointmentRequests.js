import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Icon from '../../components/Icons';

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
        if (!window.confirm('Decline this appointment consultation request?')) return;
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

    if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading consultation requests…</p></div>;

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
                        <Icon name="fileText" size={20} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Appointment Requests</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                    Manage incoming patient consultation requests and schedule allocations.
                </p>
            </div>

            {/* Pending alert */}
            {statusCounts.pending > 0 && (
                <div className="alert alert-warning anim-fade-up" style={{ marginBottom: '1.5rem' }}>
                    <Icon name="clockAlert" size={18} />
                    <span><strong>{statusCounts.pending}</strong> pending consultation request{statusCounts.pending > 1 ? 's' : ''} awaiting clinical confirmation</span>
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
                        {status === 'all' ? 'All Requests' : status.charAt(0).toUpperCase() + status.slice(1)}
                        <span style={{ marginLeft: '0.35rem', opacity: 0.75 }}>({statusCounts[status] ?? 0})</span>
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="card" style={{ padding: 0 }}>
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Icon name="fileText" size={24} />
                        </div>
                        <h3>No Requests</h3>
                        <p>{filter === 'all' ? 'No consultation requests on file.' : `No ${filter} requests.`}</p>
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
                                        style={{ background: 'var(--gradient-primary)', borderRadius: 'var(--radius-xl)' }}
                                    >
                                        {(appt.patientId?.name || 'P').charAt(0)}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.2rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                                            {appt.patientId?.name || 'Patient'}
                                        </h4>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {appt.patientId?.email || 'No email on file'}
                                        </span>
                                    </div>
                                </div>
                                <span className={`badge badge-${appt.status}`}>{appt.status}</span>
                            </div>

                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem', padding: '0.875rem 1.25rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <Icon name="calendar" size={16} />
                                    <span>{new Date(appt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                {appt.time && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <Icon name="clock" size={16} />
                                        <span>{appt.time}</span>
                                    </div>
                                )}
                                {appt.reason && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <Icon name="fileText" size={16} />
                                        <span>{appt.reason}</span>
                                    </div>
                                )}
                            </div>

                            {appt.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                                    <button
                                        onClick={() => handleAccept(appt._id)}
                                        className="btn btn-sm btn-success"
                                    >
                                        <Icon name="check" size={14} />
                                        Accept Request
                                    </button>
                                    <button
                                        onClick={() => handleReject(appt._id)}
                                        className="btn btn-sm btn-error"
                                    >
                                        <Icon name="x" size={14} />
                                        Decline
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
