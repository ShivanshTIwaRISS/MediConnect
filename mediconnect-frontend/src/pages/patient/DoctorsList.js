import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/patient/doctors');
            setDoctors(response.data.doctors);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setLoading(false);
        }
    };

    const filteredDoctors = doctors.filter(doctor =>
        doctor.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header fade-in">
                    <h1>Available Doctors</h1>
                    <p>Find and connect with qualified medical professionals</p>
                </div>

                <div className="card card-glass" style={{ marginBottom: '2rem' }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search by name or specialization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {filteredDoctors.length === 0 ? (
                    <div className="card card-glass text-center">
                        <p>No doctors found.</p>
                    </div>
                ) : (
                    <div className="grid grid-2">
                        {filteredDoctors.map((doctor) => (
                            <div key={doctor._id} className="card card-glass">
                                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0 }}>{doctor.userId.name}</h3>
                                    <span className="badge badge-approved">{doctor.status}</span>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <p><strong>Specialization:</strong> {doctor.specialization}</p>
                                    <p><strong>Qualifications:</strong> {doctor.qualifications}</p>
                                    <p><strong>Experience:</strong> {doctor.experience} years</p>
                                    <p><strong>Consultation Fee:</strong> ${doctor.fees}</p>
                                    <p><strong>Availability:</strong> {doctor.availability}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorsList;
