import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import '../patient/PatientDashboard.css';

const DoctorHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

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

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="welcome-banner fade-in">
                    <div className="welcome-content" style={{ justifyContent: 'center', textAlign: 'center' }}>
                        <div className="welcome-text">
                            <h1>Consultation History 📜</h1>
                            <p>View your past consultations and patient records</p>
                        </div>
                    </div>
                </div>

                {history.length === 0 ? (
                    <div className="card card-glass">
                        <div className="empty-state">
                            <div className="empty-state-icon">📜</div>
                            <h3>No History Yet</h3>
                            <p>Your completed consultations will appear here</p>
                        </div>
                    </div>
                ) : (
                    <div className="appt-cards-list">
                        {history.map((appt) => (
                            <div key={appt._id} className="appt-card card card-glass fade-in">
                                <div className="appt-card-main">
                                    <div className="appt-card-left">
                                        <div className="avatar">{(appt.patientId?.name || 'P').charAt(0)}</div>
                                        <div className="appt-card-info">
                                            <h3>{appt.patientId?.name || 'Patient'}</h3>
                                            <span className="appt-spec">{appt.patientId?.email || ''}</span>
                                        </div>
                                    </div>
                                    <span className={`badge badge-${appt.status}`}>{appt.status}</span>
                                </div>
                                <div className="appt-card-details">
                                    <div className="appt-detail-item">
                                        <span className="appt-detail-icon">📅</span>
                                        <span>{new Date(appt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="appt-detail-item">
                                        <span className="appt-detail-icon">🕐</span>
                                        <span>{appt.time}</span>
                                    </div>
                                    {appt.reason && (
                                        <div className="appt-detail-item">
                                            <span className="appt-detail-icon">📝</span>
                                            <span>{appt.reason}</span>
                                        </div>
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

export default DoctorHistory;
