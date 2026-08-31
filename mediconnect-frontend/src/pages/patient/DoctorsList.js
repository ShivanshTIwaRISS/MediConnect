import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Icon from '../../components/Icons';
import DoctorBadge from '../../components/DoctorBadge';

const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [maxFee, setMaxFee] = useState(10000);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/patient/doctors');
            if (response.data && response.data.doctors) {
                setDoctors(response.data.doctors);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchDoctors(); 
    }, []);

    const specialties = useMemo(() => {
        const specs = new Set(doctors.map(d => d.specialization).filter(Boolean));
        return ['all', ...Array.from(specs)];
    }, [doctors]);

    const maxAvailableFee = useMemo(() => {
        if (doctors.length === 0) return 5000;
        const highest = Math.max(...doctors.map(d => Number(d.fees) || 0));
        return Math.max(highest, 1000);
    }, [doctors]);

    const filteredAndSortedDoctors = useMemo(() => {
        let result = doctors.filter(doctor => {
            // Specialty filter
            if (selectedSpecialty !== 'all' && doctor.specialization?.toLowerCase() !== selectedSpecialty.toLowerCase()) {
                return false;
            }

            // Fee filter
            if (doctor.fees && doctor.fees > maxFee) {
                return false;
            }

            // Search filter
            if (searchTerm.trim()) {
                const term = searchTerm.toLowerCase();
                const name = doctor.userId?.name?.toLowerCase() || '';
                const spec = doctor.specialization?.toLowerCase() || '';
                const qual = doctor.qualifications?.toLowerCase() || '';
                const city = doctor.city?.toLowerCase() || '';
                const about = doctor.about?.toLowerCase() || '';
                if (!name.includes(term) && !spec.includes(term) && !qual.includes(term) && !city.includes(term) && !about.includes(term)) {
                    return false;
                }
            }

            return true;
        });

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'fee-asc') return (a.fees || 0) - (b.fees || 0);
            if (sortBy === 'fee-desc') return (b.fees || 0) - (a.fees || 0);
            if (sortBy === 'exp-desc') return (b.experience || 0) - (a.experience || 0);
            if (sortBy === 'name-asc') {
                const nameA = a.userId?.name || '';
                const nameB = b.userId?.name || '';
                return nameA.localeCompare(nameB);
            }
            return 0;
        });

        return result;
    }, [doctors, selectedSpecialty, maxFee, searchTerm, sortBy]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
                <p>Finding accredited specialists…</p>
            </div>
        );
    }

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
                    Browse verified physicians, compare consultation fees, and schedule your appointment online.
                </p>
            </div>

            {/* Search + Filter Controls */}
            <div className="card anim-fade-up" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    {/* Search Bar */}
                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                            <Icon name="search" size={18} />
                        </div>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search doctor by name, specialty, or condition..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>

                    {/* Specialty Selector */}
                    <div>
                        <select
                            className="form-input"
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            style={{ width: '100%', cursor: 'pointer' }}
                        >
                            <option value="all">All Specialties ({doctors.length})</option>
                            {specialties.filter(s => s !== 'all').map(spec => (
                                <option key={spec} value={spec}>
                                    {spec} ({doctors.filter(d => d.specialization === spec).length})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Options */}
                    <div>
                        <select
                            className="form-input"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{ width: '100%', cursor: 'pointer' }}
                        >
                            <option value="default">Sort by: Recommended</option>
                            <option value="fee-asc">Fee: Lowest to Highest (₹)</option>
                            <option value="fee-desc">Fee: Highest to Lowest (₹)</option>
                            <option value="exp-desc">Experience: Most Senior</option>
                            <option value="name-asc">Name: A to Z</option>
                        </select>
                    </div>

                    {/* Fee Range Slider */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                            <span>Max Fee:</span>
                            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Up to ₹{maxFee}</span>
                        </div>
                        <input
                            type="range"
                            min="100"
                            max={maxAvailableFee}
                            step="50"
                            value={maxFee}
                            onChange={(e) => setMaxFee(Number(e.target.value))}
                            style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                        />
                    </div>
                </div>

                {/* Specialty Quick Filter Tabs */}
                <div className="filter-tabs" style={{ marginBottom: 0 }}>
                    {specialties.map(spec => (
                        <button
                            key={spec}
                            className={`filter-tab ${selectedSpecialty === spec ? 'active' : ''}`}
                            onClick={() => setSelectedSpecialty(spec)}
                        >
                            {spec === 'all' ? 'All' : spec}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                <span>
                    Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredAndSortedDoctors.length}</strong> accredited specialist{filteredAndSortedDoctors.length !== 1 ? 's' : ''}
                </span>
                {(searchTerm || selectedSpecialty !== 'all' || maxFee < maxAvailableFee || sortBy !== 'default') && (
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedSpecialty('all');
                            setMaxFee(maxAvailableFee);
                            setSortBy('default');
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                    >
                        Reset Filters
                    </button>
                )}
            </div>

            {filteredAndSortedDoctors.length === 0 ? (
                <div className="card" style={{ padding: 0 }}>
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Icon name="stethoscope" size={24} />
                        </div>
                        <h3>No Specialists Found</h3>
                        <p>Try adjusting your search terms or increasing the fee filter range.</p>
                    </div>
                </div>
            ) : (
                <div className="doctors-grid">
                    {filteredAndSortedDoctors.map((doctor, i) => (
                        <div key={doctor._id} className={`doctor-card-new anim-fade-up anim-d${Math.min(i + 1, 5)}`}>
                            <div className="doctor-card-header">
                                <div style={{ position: 'relative' }}>
                                    {doctor.image ? (
                                        <img
                                            src={doctor.image}
                                            alt={doctor.userId?.name}
                                            style={{ width: 56, height: 56, borderRadius: 'var(--radius-xl)', objectFit: 'cover', border: '2px solid var(--border-default)' }}
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                        <div className="doctor-card-name">{doctor.userId?.name || 'Doctor'}</div>
                                    </div>
                                    <span className="doctor-card-spec">{doctor.specialization}</span>
                                    {doctor.qualifications && (
                                        <span className="doctor-card-qual">{doctor.qualifications}</span>
                                    )}
                                </div>
                            </div>

                            <div className="detail-divider" />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                <div className="detail-row">
                                    <span className="detail-row-label">Clinical Experience</span>
                                    <span className="detail-row-value">{doctor.experience} Years</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-row-label">Consultation Fee</span>
                                    <span className="detail-row-value brand" style={{ fontSize: '1rem', fontWeight: 800 }}>₹{doctor.fees}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-row-label">Credential Status</span>
                                    <DoctorBadge status="approved" customLabel="Verified Specialist" />
                                </div>
                                <div className="detail-row">
                                    <span className="detail-row-label">Availability</span>
                                    <span className="detail-row-value" style={{ fontSize: '0.8rem', textAlign: 'right', maxWidth: '60%' }}>
                                        {Array.isArray(doctor.availability) && doctor.availability.length > 0
                                            ? doctor.availability.slice(0, 3).map(a => a.day.slice(0, 3)).join(', ')
                                            : (typeof doctor.availability === 'string' ? doctor.availability : 'By Appointment')}
                                    </span>
                                </div>
                            </div>

                            <Link
                                to={`/patient/book-appointment?doctor=${doctor._id}`}
                                className="btn btn-primary"
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                Book Appointment (₹{doctor.fees})
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
