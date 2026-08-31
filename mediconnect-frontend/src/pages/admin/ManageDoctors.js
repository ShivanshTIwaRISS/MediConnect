import React, { useState, useEffect, useMemo } from 'react';
import api from '../../utils/api';
import Icon from '../../components/Icons';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [maxFee, setMaxFee] = useState(10000);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchDoctors = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/admin/doctors');
            if (response.data && response.data.doctors) {
                setDoctors(response.data.doctors);
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
            setError(err.response?.data?.message || 'Unable to fetch doctors list. Please check your network connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchDoctors(); 
    }, []);

    const handleApprove = async (id) => {
        setActionLoading(id);
        try {
            await api.put(`/admin/doctors/${id}/approve`);
            await fetchDoctors();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to approve doctor');
        } finally {
            setActionLoading(null);
        }
    };

    const handleBlock = async (id) => {
        if (!window.confirm('Are you sure you want to suspend this doctor account?')) return;
        setActionLoading(id);
        try {
            await api.put(`/admin/doctors/${id}/block`);
            await fetchDoctors();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to block doctor');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id, doctorName) => {
        const confirmDelete = window.confirm(
            `⚠️ Are you sure you want to PERMANENTLY delete Dr. ${doctorName || 'Doctor'} from the database?\n\nThis will remove their profile, login account, and appointment records.`
        );
        if (!confirmDelete) return;

        setActionLoading(id);
        try {
            await api.delete(`/admin/doctors/${id}`);
            alert(`Dr. ${doctorName || 'Doctor'} has been deleted from the database.`);
            await fetchDoctors();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete doctor');
        } finally {
            setActionLoading(null);
        }
    };

    // Calculate categories and dynamic stats
    const categories = useMemo(() => {
        const specs = new Set(doctors.map(d => d.specialization).filter(Boolean));
        return ['all', ...Array.from(specs)];
    }, [doctors]);

    const maxAvailableFee = useMemo(() => {
        if (doctors.length === 0) return 5000;
        const highest = Math.max(...doctors.map(d => Number(d.fees) || 0));
        return Math.max(highest, 1000);
    }, [doctors]);

    // Status counts
    const filterCounts = useMemo(() => {
        const counts = { all: doctors.length, pending: 0, approved: 0, blocked: 0 };
        doctors.forEach(d => {
            if (counts[d.status] !== undefined) counts[d.status]++;
        });
        return counts;
    }, [doctors]);

    // Filter & Sort Logic
    const filteredAndSortedDoctors = useMemo(() => {
        let list = doctors.filter(doctor => {
            // Status filter
            if (statusFilter !== 'all' && doctor.status !== statusFilter) return false;

            // Category filter
            if (categoryFilter !== 'all' && doctor.specialization?.toLowerCase() !== categoryFilter.toLowerCase()) {
                return false;
            }

            // Fee filter
            if (doctor.fees && doctor.fees > maxFee) return false;

            // Search term
            if (searchTerm.trim()) {
                const term = searchTerm.toLowerCase();
                const nameMatch = doctor.userId?.name?.toLowerCase().includes(term);
                const emailMatch = doctor.userId?.email?.toLowerCase().includes(term);
                const specMatch = doctor.specialization?.toLowerCase().includes(term);
                const qualMatch = doctor.qualifications?.toLowerCase().includes(term);
                const cityMatch = doctor.city?.toLowerCase().includes(term);
                if (!nameMatch && !emailMatch && !specMatch && !qualMatch && !cityMatch) return false;
            }

            return true;
        });

        // Sorting
        list.sort((a, b) => {
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

        return list;
    }, [doctors, statusFilter, categoryFilter, maxFee, searchTerm, sortBy]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" />
                <p>Loading medical staff records…</p>
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
                        <Icon name="stethoscope" size={20} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Manage Doctors</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                    Verify practitioner credentials, filter & compare rates, search specialists, or remove providers from the system.
                </p>
            </div>

            {error && (
                <div className="alert alert-error anim-fade-up" style={{ marginBottom: '1.5rem', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Icon name="alertTriangle" size={18} />
                        <span>{error}</span>
                    </div>
                    <button onClick={fetchDoctors} className="btn btn-sm btn-outline" style={{ background: 'var(--bg-surface)' }}>
                        Retry
                    </button>
                </div>
            )}

            {/* Pending alert */}
            {filterCounts.pending > 0 && (
                <div className="alert alert-warning anim-fade-up" style={{ marginBottom: '1.5rem' }}>
                    <Icon name="alertTriangle" size={18} />
                    <span><strong>{filterCounts.pending}</strong> doctor application{filterCounts.pending > 1 ? 's' : ''} awaiting approval</span>
                    <button
                        onClick={() => setStatusFilter('pending')}
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--warning)', fontWeight: 700, fontSize: '0.825rem', fontFamily: 'var(--font-sans)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                        Filter Pending
                        <Icon name="chevronRight" size={14} />
                    </button>
                </div>
            )}

            {/* Search & Filter Control Bar */}
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
                            placeholder="Search by doctor name, email, specialty..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>

                    {/* Category Selector */}
                    <div>
                        <select
                            className="form-input"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            style={{ width: '100%', cursor: 'pointer' }}
                        >
                            <option value="all">All Specialties ({doctors.length})</option>
                            {categories.filter(c => c !== 'all').map(cat => (
                                <option key={cat} value={cat}>
                                    {cat} ({doctors.filter(d => d.specialization === cat).length})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Selector */}
                    <div>
                        <select
                            className="form-input"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{ width: '100%', cursor: 'pointer' }}
                        >
                            <option value="default">Sort by: Default</option>
                            <option value="fee-asc">Fees: Low to High (₹)</option>
                            <option value="fee-desc">Fees: High to Low (₹)</option>
                            <option value="exp-desc">Experience: Most Experienced</option>
                            <option value="name-asc">Name: A to Z</option>
                        </select>
                    </div>

                    {/* Fee Range Slider */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                            <span>Max Fee Filter:</span>
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

                {/* Status Filter Tabs */}
                <div className="filter-tabs" style={{ marginBottom: 0 }}>
                    {['all', 'pending', 'approved', 'blocked'].map(status => (
                        <button
                            key={status}
                            className={`filter-tab ${statusFilter === status ? 'active' : ''}`}
                            onClick={() => setStatusFilter(status)}
                        >
                            {status === 'all' ? 'All Doctors' : status.charAt(0).toUpperCase() + status.slice(1)}
                            <span style={{ marginLeft: '0.35rem', opacity: 0.8 }}>({filterCounts[status] ?? 0})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Results count info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>
                    Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredAndSortedDoctors.length}</strong> of {doctors.length} doctors
                </span>
                {(searchTerm || categoryFilter !== 'all' || maxFee < maxAvailableFee || statusFilter !== 'all') && (
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setCategoryFilter('all');
                            setStatusFilter('all');
                            setMaxFee(maxAvailableFee);
                            setSortBy('default');
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                    >
                        Reset All Filters
                    </button>
                )}
            </div>

            {/* Doctors Grid */}
            {filteredAndSortedDoctors.length === 0 ? (
                <div className="card" style={{ padding: 0 }}>
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Icon name="stethoscope" size={24} />
                        </div>
                        <h3>No Doctors Matched</h3>
                        <p>Try adjusting your search criteria, price range, or category filter.</p>
                    </div>
                </div>
            ) : (
                <div className="doctors-grid">
                    {filteredAndSortedDoctors.map((doctor, i) => (
                        <div key={doctor._id} className={`doctor-card-new anim-fade-up anim-d${Math.min(i + 1, 5)}`}>
                            <div className="doctor-card-header">
                                <div
                                    className="avatar avatar-lg"
                                    style={{
                                        borderRadius: 'var(--radius-xl)',
                                        background: doctor.status === 'approved' ? 'var(--gradient-primary)' : 'var(--bg-glass)',
                                        color: doctor.status === 'approved' ? '#ffffff' : 'var(--text-primary)',
                                        border: '1px solid var(--border-default)',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {doctor.image ? (
                                        <img src={doctor.image} alt={doctor.userId?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        (doctor.userId?.name || 'D').charAt(0)
                                    )}
                                </div>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <div className="doctor-card-name">{doctor.userId?.name || 'Doctor'}</div>
                                    <span className="doctor-card-spec">{doctor.specialization}</span>
                                    <span className="doctor-card-qual">{doctor.userId?.email}</span>
                                </div>
                            </div>

                            <div className="detail-divider" />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                <div className="detail-row">
                                    <span className="detail-row-label">Experience</span>
                                    <span className="detail-row-value">{doctor.experience} Years</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-row-label">Consultation Rate</span>
                                    <span className="detail-row-value brand">₹{doctor.fees}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-row-label">Verification Status</span>
                                    <span className={`badge badge-${doctor.status}`}>
                                        {doctor.status === 'approved' && '✅ Approved'}
                                        {doctor.status === 'pending' && '🟡 Pending Review'}
                                        {doctor.status === 'blocked' && '🔴 Suspended'}
                                    </span>
                                </div>
                                {doctor.qualifications && (
                                    <div className="detail-row">
                                        <span className="detail-row-label">Degrees</span>
                                        <span className="detail-row-value" style={{ fontSize: '0.8rem', textAlign: 'right', maxWidth: '60%' }}>
                                            {doctor.qualifications}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="card-actions" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                                {doctor.status !== 'approved' && (
                                    <button
                                        onClick={() => handleApprove(doctor._id)}
                                        className="btn btn-sm btn-success"
                                        style={{ flex: '1 1 45%' }}
                                        disabled={actionLoading === doctor._id}
                                    >
                                        <Icon name="check" size={14} />
                                        Approve
                                    </button>
                                )}
                                {doctor.status !== 'blocked' && (
                                    <button
                                        onClick={() => handleBlock(doctor._id)}
                                        className="btn btn-sm btn-outline"
                                        style={{ flex: '1 1 45%', color: 'var(--warning)', borderColor: 'var(--warning)' }}
                                        disabled={actionLoading === doctor._id}
                                    >
                                        <Icon name="ban" size={14} />
                                        Suspend
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(doctor._id, doctor.userId?.name)}
                                    className="btn btn-sm btn-error"
                                    style={{ flex: '1 1 100%' }}
                                    disabled={actionLoading === doctor._id}
                                    title="Permanently remove doctor from database"
                                >
                                    <Icon name="trash" size={14} />
                                    Delete from Database
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageDoctors;
