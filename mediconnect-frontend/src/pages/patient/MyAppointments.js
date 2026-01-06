import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/patient/appointments');
            setAppointments(response.data.appointments);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

        try {
            await api.put(`/patient/appointments/${id}/cancel`);
            fetchAppointments();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to cancel appointment');
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
                    <h1>My Appointments</h1>
                    <p>View and manage your consultation appointments</p>
                </div>

                {appointments.length === 0 ? (
                    <div className="card card-glass text-center">
                        <p>No appointments found.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Doctor</th>
                                    <th>Specialization</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appointment) => (
                                    <tr key={appointment._id}>
                                        <td>{appointment.doctorId?.userId?.name || 'N/A'}</td>
                                        <td>{appointment.doctorId?.specialization || 'N/A'}</td>
                                        <td>{new Date(appointment.date).toLocaleDateString()}</td>
                                        <td>{appointment.time}</td>
                                        <td>
                                            <span className={getStatusBadge(appointment.status)}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td>
                                            {appointment.status === 'pending' && (
                                                <button
                                                    onClick={() => handleCancel(appointment._id)}
                                                    className="btn btn-sm btn-error"
                                                >
                                                    Cancel
                                                </button>
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

export default MyAppointments;
