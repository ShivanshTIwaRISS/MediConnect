import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Icon from '../../components/Icons';

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
        if (!window.confirm('Are you sure you wish to cancel this appointment request?')) return;
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

    if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading your appointments…</p></div>;

    return (
        <div>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }} className="anim-fade-up">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                            background: 'var(--primary-light)', border: '1px solid var(--border-subtle)',
                            color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Icon name="clock" size={20} />
                        </div>
                        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>My Appointments</h1>
                    </div>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                        Review, track, and manage your scheduled clinical appointments.
                    </p>
                </div>
                <Link to="/patient/book-appointment" className="btn btn-primary">
                    <Icon name="plus" size={16} />
                    Book New
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
                        {status === 'all' ? 'All Visits' : status.charAt(0).toUpperCase() + status.slice(1)}
                        <span style={{ marginLeft: '0.35rem', opacity: 0.75 }}>({statusCounts[status] ?? 0})</span>
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="card" style={{ padding: 0 }}>
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Icon name="calendar" size={24} />
                        </div>
                        <h3>No Appointments Found</h3>
                        <p>{filter === 'all' ? "You don't have any appointments scheduled yet." : `No appointments with status "${filter}".`}</p>
                        {filter === 'all' && (
                            <Link to="/patient/book-appointment" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                <Icon name="plus" size={16} />
                                Schedule Appointment
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
                                            {appt.doctorId?.userId?.name || 'Doctor'}
                                        </h4>
                                        <span style={{ fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 600 }}>
                                            {appt.doctorId?.specialization || 'Clinical Specialist'}
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
                                <div style={{ marginTop: '1rem' }}>
                                    <button
                                        onClick={() => handleCancel(appt._id)}
                                        className="btn btn-sm btn-error"
                                    >
                                        <Icon name="x" size={14} />
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
