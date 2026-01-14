import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { assets } from '../../assets/assets_frontend/assets';

const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

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

    const handleBookAppointment = (doctorId) => {
        navigate(`/patient/book-appointment?doctorId=${doctorId}`);
    };

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
                            <div key={doctor._id} className="card card-glass doctor-list-card">
                                <div className="doctor-list-header">
                                    <div className="doctor-list-avatar">
                                        <img
                                            src={doctor.image || assets.doc1}
                                            alt={doctor.userId.name}
                                            onError={(e) => { e.target.src = assets.doc1; }}
                                        />
                                    </div>
                                    <div className="doctor-list-info">
                                        <div className="doctor-name-row">
                                            <h3>{doctor.userId.name}</h3>
                                            <img src={assets.verified_icon} alt="Verified" className="verified-badge" />
                                        </div>
                                        <span className="doctor-specialization">{doctor.specialization}</span>
                                        <span className="badge badge-approved">{doctor.status}</span>
                                    </div>
                                </div>

                                <div className="doctor-list-details">
                                    <p><strong>Qualifications:</strong> {doctor.qualifications}</p>
                                    <p><strong>Experience:</strong> {doctor.experience} years</p>
                                    <p><strong>Consultation Fee:</strong> ${doctor.fees}</p>
                                    <p><strong>Availability:</strong> {doctor.availability}</p>
                                    {doctor.about && (
                                        <p className="doctor-about"><strong>About:</strong> {doctor.about}</p>
                                    )}
                                </div>

                                <button
                                    className="btn btn-primary btn-book-doctor"
                                    onClick={() => handleBookAppointment(doctor._id)}
                                >
                                    Book Appointment
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .doctor-list-card {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .doctor-list-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 40px rgba(79, 70, 229, 0.15);
                }

                .doctor-list-header {
                    display: flex;
                    gap: 1rem;
                    align-items: flex-start;
                }

                .doctor-list-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 12px;
                    overflow: hidden;
                    flex-shrink: 0;
                    background: linear-gradient(145deg, #e0e7ff, #c7d2fe);
                }

                .doctor-list-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .doctor-list-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .doctor-name-row {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .doctor-name-row h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    color: var(--text-primary);
                }

                .verified-badge {
                    width: 18px;
                    height: 18px;
                }

                .doctor-specialization {
                    color: var(--primary);
                    font-weight: 500;
                    font-size: 0.9rem;
                }

                .doctor-list-details {
                    padding-top: 0.5rem;
                    border-top: 1px solid rgba(0, 0, 0, 0.05);
                }

                .doctor-list-details p {
                    margin: 0.4rem 0;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                }

                .doctor-about {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .btn-book-doctor {
                    margin-top: auto;
                    width: 100%;
                    padding: 0.75rem 1.5rem;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
};

export default DoctorsList;
