import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Icon from '../../components/Icons';

const DoctorHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchHistory(); }, []);

    const fetchHistory = async () => {
        try {
            const response = await api.get('/doctor/history');
            setHistory(response.data.appointments || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading patient consultation history…</p></div>;

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
                        <Icon name="clock" size={20} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Consultation History</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                    Archived record of all completed consultations and historical patient appointments.
                </p>
            </div>

            {/* Summary Banner */}
            {history.length > 0 && (
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    padding: '1.25rem 1.75rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                }} className="anim-fade-up">
                    <div>
                        <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{history.length}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Consultations Completed</div>
                    </div>
                </div>
            )}

            {history.length === 0 ? (
                <div className="card" style={{ padding: 0 }}>
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Icon name="clock" size={24} />
                        </div>
                        <h3>No Consultation History</h3>
                        <p>Completed patient consultations and medical notes will appear here.</p>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {history.map((appt, i) => (
                        <div key={appt._id} className={`appt-card-new anim-fade-up anim-d${Math.min(i + 1, 5)}`}>
                            <div className="appt-left">
                                <div
                                    className="avatar avatar-md"
                                    style={{ background: 'var(--gradient-primary)', borderRadius: 'var(--radius-lg)' }}
                                >
                                    {(appt.patientId?.name || 'P').charAt(0)}
                                </div>
                                <div className="appt-info">
                                    <h4>{appt.patientId?.name || 'Patient'}</h4>
                                    <span className="appt-info-sub">
                                        {appt.patientId?.email || ''}
                                        {appt.reason ? ` · ${appt.reason}` : ''}
                                    </span>
                                </div>
                            </div>
                            <div className="appt-right">
                                <div style={{ textAlign: 'right' }}>
                                    <div className="appt-date">
                                        {new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    {appt.time && (
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{appt.time}</div>
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

export default DoctorHistory;
