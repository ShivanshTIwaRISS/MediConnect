import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import '../patient/PatientDashboard.css';

const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/patient/doctors');
            setDoctors(response.data.doctors);
            setFilteredDoctors(response.data.doctors);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = [...doctors];
        if (searchTerm) {
            result = result.filter(d =>
                d.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedSpecialty !== 'all') {
            result = result.filter(d => d.specialization?.toLowerCase() === selectedSpecialty.toLowerCase());
        }
        setFilteredDoctors(result);
    }, [searchTerm, selectedSpecialty, doctors]);

    const specialties = ['all', ...new Set(doctors.map(d => d.specialization).filter(Boolean))];

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="welcome-banner fade-in">
                    <div className="welcome-content" style={{ justifyContent: 'center', textAlign: 'center' }}>
                        <div className="welcome-text">
                            <h1>Find a Doctor 🔍</h1>
                            <p>Browse through our qualified specialists and book your appointment</p>
                        </div>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="card card-glass" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="🔍 Search by doctor name or specialty..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-tabs">
                        {specialties.map(spec => (
                            <button
                                key={spec}
                                className={`filter-tab ${selectedSpecialty === spec ? 'active' : ''}`}
                                onClick={() => setSelectedSpecialty(spec)}
                            >
                                {spec === 'all' ? 'All Specialties' : spec}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''}
                </p>

                {/* Doctors Grid */}
                {filteredDoctors.length === 0 ? (
                    <div className="card card-glass">
                        <div className="empty-state">
                            <div className="empty-state-icon">🩺</div>
                            <h3>No Doctors Found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                        </div>
                    </div>
                ) : (
                    <div className="doctors-grid stagger-children">
                        {filteredDoctors.map((doctor) => (
                            <div key={doctor._id} className="doctor-list-card card card-glass scale-in">
                                <div className="dlc-header">
                                    <div className="dlc-avatar">
                                        {doctor.image ? (
                                            <img src={doctor.image} alt={doctor.userId?.name} />
                                        ) : (
                                            <div className="avatar avatar-lg">
                                                {(doctor.userId?.name || 'D').charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="dlc-info">
                                        <h3>{doctor.userId?.name || 'Doctor'}</h3>
                                        <span className="dlc-spec">{doctor.specialization}</span>
                                        {doctor.qualifications && (
                                            <span className="dlc-qual">{doctor.qualifications}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="dlc-details">
                                    <div className="dlc-detail-row">
                                        <span className="dlc-detail-label">⏱ Experience</span>
                                        <span className="dlc-detail-value">{doctor.experience} years</span>
                                    </div>
                                    <div className="dlc-detail-row">
                                        <span className="dlc-detail-label">💰 Fee</span>
                                        <span className="dlc-detail-value dlc-fee">${doctor.fees}</span>
                                    </div>
                                    <div className="dlc-detail-row">
                                        <span className="dlc-detail-label">📅 Available</span>
                                        <span className="dlc-detail-value">
                                            {Array.isArray(doctor.availability) && doctor.availability.length > 0
                                                ? doctor.availability.slice(0, 3).join(', ')
                                                : (typeof doctor.availability === 'string' ? doctor.availability : 'Contact for schedule')}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    to={`/patient/book-appointment?doctor=${doctor._id}`}
                                    className="btn btn-primary btn-full"
                                    style={{ marginTop: '1rem' }}
                                >
                                    Book Appointment →
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorsList;
