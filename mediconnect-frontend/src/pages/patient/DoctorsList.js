import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Icon from '../../components/Icons';

const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');

    useEffect(() => { fetchDoctors(); }, []);

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

    if (loading) return <div className="loading-container"><div className="spinner" /><p>Finding accredited specialists…</p></div>;

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
                        <Icon name="search" size={20} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Find a Specialist</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                    Browse verified physicians and book clinical consultations online.
                </p>
            </div>

            {/* Search + Filters */}
            <div className="card anim-fade-up" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
                <div style={{ marginBottom: '1rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                        <Icon name="search" size={18} />
                    </div>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search doctor by name or medical specialty…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '2.5rem' }}
                    />
                </div>
                <div className="filter-tabs" style={{ marginBottom: 0 }}>
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

            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.825rem' }}>
                Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredDoctors.length}</strong> available specialist{filteredDoctors.length !== 1 ? 's' : ''}
            </p>

            {filteredDoctors.length === 0 ? (
                <div className="card" style={{ padding: 0 }}>
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Icon name="stethoscope" size={24} />
                        </div>
                        <h3>No Specialists Found</h3>
                        <p>Try adjusting your search terms or specialty filter criteria.</p>
                    </div>
                </div>
            ) : (
                <div className="doctors-grid">
                    {filteredDoctors.map((doctor, i) => (
                        <div key={doctor._id} className={`doctor-card-new anim-fade-up anim-d${Math.min(i + 1, 5)}`}>
                            <div className="doctor-card-header">
                                <div>
                                    {doctor.image ? (
                                        <img
                                            src={doctor.image}
                                            alt={doctor.userId?.name}
                                            style={{ width: 56, height: 56, borderRadius: 'var(--radius-xl)', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div
                                            className="avatar avatar-lg"
                                            style={{
                                                borderRadius: 'var(--radius-xl)',
                                                background: 'var(--gradient-primary)',
                                                color: '#ffffff'
                                            }}
                                        >
                                            {(doctor.userId?.name || 'D').charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div className="doctor-card-name">Dr. {doctor.userId?.name || 'Doctor'}</div>
                                    <span className="doctor-card-spec">{doctor.specialization}</span>
                                    {doctor.qualifications && (
                                        <span className="doctor-card-qual">{doctor.qualifications}</span>
                                    )}
                                </div>
                            </div>

                            <div className="detail-divider" />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                <div className="detail-row">
                                    <span className="detail-row-label">Experience</span>
                                    <span className="detail-row-value">{doctor.experience} Years</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-row-label">Consultation Fee</span>
                                    <span className="detail-row-value brand">${doctor.fees}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-row-label">Availability</span>
                                    <span className="detail-row-value" style={{ fontSize: '0.8rem', textAlign: 'right', maxWidth: '60%' }}>
                                        {Array.isArray(doctor.availability) && doctor.availability.length > 0
                                            ? doctor.availability.slice(0, 2).map(a => `${a.day}`).join(', ')
                                            : (typeof doctor.availability === 'string' ? doctor.availability : 'By Appointment')}
                                    </span>
                                </div>
                            </div>

                            <Link
                                to={`/patient/book-appointment?doctor=${doctor._id}`}
                                className="btn btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                Book Appointment
                                <Icon name="chevronRight" size={16} />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorsList;
