import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AppointmentRequests = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/doctor/appointments');
            setAppointments(response.data.appointments);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setLoading(false);
        }
    };

    const handleAccept = async (id) => {
        try {
            await api.put(`/doctor/appointments/${id}/accept`);
            fetchAppointments();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to accept appointment');
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Are you sure you want to reject this appointment?')) return;

        try {
            await api.put(`/doctor/appointments/${id}/reject`);
            fetchAppointments();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to reject appointment');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'badge-pending',
            approved: 'badge-approved',
            rejected: 'badge-rejected',
            cancelled: 'badge-cancelled',
        };
        return `badge ${badges[status] || ''}`;
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header fade-in">
                    <h1>Appointment Requests</h1>
                    <p>Manage patient consultation requests</p>
                </div>

                {appointments.length === 0 ? (
                    <div className="card card-glass text-center">
                        <p>No appointment requests found.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appointment) => (
                                    <tr key={appointment._id}>
                                        <td>{appointment.patientId?.name || 'N/A'}</td>
                                        <td>{new Date(appointment.date).toLocaleDateString()}</td>
                                        <td>{appointment.time}</td>
                                        <td>{appointment.reason}</td>
                                        <td>
                                            <span className={getStatusBadge(appointment.status)}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td>
                                            {appointment.status === 'pending' && (
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleAccept(appointment._id)}
                                                        className="btn btn-sm btn-success"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(appointment._id)}
                                                        className="btn btn-sm btn-error"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentRequests;
