import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => { fetchAppointments(); }, []);

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
        if (!window.confirm('Cancel this appointment?')) return;
        try {
            await api.put(`/patient/appointments/${id}/cancel`);
            fetchAppointments();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to cancel.');
        }
    };

    const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);
    const statusCounts = { all: appointments.length, pending: 0, approved: 0, rejected: 0, cancelled: 0 };
    appointments.forEach(a => { if (statusCounts[a.status] !== undefined) statusCounts[a.status]++; });

    if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading appointments…</p></div>;

    return (
        <div>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }} className="anim-fade-up">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                            background: 'var(--stat-blue-bg)', border: '1px solid var(--stat-blue-border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                        }}>🗓</div>
                        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>My Appointments</h1>
                    </div>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                        View and manage all your healthcare visits.
                    </p>
                </div>
                <Link to="/patient/book-appointment" className="btn btn-primary">
                    + Book New
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs anim-fade-up">
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

            {filtered.length === 0 ? (
                <div className="card" style={{ padding: 0 }}>
                    <div className="empty-state">
                        <div className="empty-state-icon">🗓</div>
                        <h3>No Appointments</h3>
                        <p>{filter === 'all' ? "You haven't booked any appointments yet." : `No ${filter} appointments found.`}</p>
                        {filter === 'all' && (
                            <Link to="/patient/book-appointment" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                                Book Your First Appointment
                            </Link>
                        )}
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
                                        {(appt.doctorId?.userId?.name || 'D').charAt(0)}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.2rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                                            Dr. {appt.doctorId?.userId?.name || 'Doctor'}
                                        </h4>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                                            {appt.doctorId?.specialization || 'Specialist'}
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
                                <div style={{ marginTop: '1rem' }}>
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
    );
};

export default MyAppointments;
