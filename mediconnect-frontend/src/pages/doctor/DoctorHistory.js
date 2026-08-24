import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

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

    if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading history…</p></div>;

    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: '2rem' }} className="anim-fade-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                        background: 'var(--stat-purple-bg)', border: '1px solid var(--stat-purple-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                    }}>🕐</div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Consultation History</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                    Your past consultations and completed patient visits.
                </p>
            </div>

            {/* Summary */}
            {history.length > 0 && (
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    padding: '1rem 1.5rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                }} className="anim-fade-up">
                    <div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{history.length}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Consultations</div>
                    </div>
                </div>
            )}

            {history.length === 0 ? (
                <div className="card" style={{ padding: 0 }}>
                    <div className="empty-state">
                        <div className="empty-state-icon">🕐</div>
                        <h3>No History Yet</h3>
                        <p>Your completed consultations will appear here.</p>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {history.map((appt, i) => (
                        <div key={appt._id} className={`appt-card-new anim-fade-up anim-d${Math.min(i + 1, 5)}`}>
                            <div className="appt-left">
                                <div
                                    className="avatar avatar-md"
                                    style={{ background: `hsl(${(i * 60 + 180) % 360}, 65%, 55%)`, borderRadius: 'var(--radius-lg)' }}
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

export default DoctorHistory;
