import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/admin/doctors');
            setDoctors(response.data.doctors);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.put(`/admin/doctors/${id}/approve`);
            fetchDoctors();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to approve doctor');
        }
    };

    const handleBlock = async (id) => {
        if (!window.confirm('Are you sure you want to block this doctor?')) return;

        try {
            await api.put(`/admin/doctors/${id}/block`);
            fetchDoctors();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to block doctor');
        }
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header fade-in">
                    <h1>Manage Doctors</h1>
                    <p>Approve or block doctor accounts</p>
                </div>

                {doctors.length === 0 ? (
                    <div className="card card-glass text-center">
                        <p>No doctors found.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Specialization</th>
                                    <th>Experience</th>
                                    <th>Fees</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map((doctor) => (
                                    <tr key={doctor._id}>
                                        <td>{doctor.userId?.name || 'N/A'}</td>
                                        <td>{doctor.userId?.email || 'N/A'}</td>
                                        <td>{doctor.specialization}</td>
                                        <td>{doctor.experience} years</td>
                                        <td>${doctor.fees}</td>
                                        <td>
                                            <span className={`badge badge-${doctor.status}`}>
                                                {doctor.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-1">
                                                {doctor.status !== 'approved' && (
                                                    <button
                                                        onClick={() => handleApprove(doctor._id)}
                                                        className="btn btn-sm btn-success"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {doctor.status !== 'blocked' && (
                                                    <button
                                                        onClick={() => handleBlock(doctor._id)}
                                                        className="btn btn-sm btn-error"
                                                    >
                                                        Block
                                                    </button>
                                                )}
                                            </div>
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

export default ManageDoctors;
