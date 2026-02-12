import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import '../patient/PatientDashboard.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete user "${name}"? This cannot be undone.`)) return;
        try {
            await api.delete(`/admin/users/${id}`);
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const filtered = users.filter(u => {
        const matchesSearch = !searchTerm ||
            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="welcome-banner fade-in">
                    <div className="welcome-content" style={{ justifyContent: 'center', textAlign: 'center' }}>
                        <div className="welcome-text">
                            <h1>Manage Users 👥</h1>
                            <p>View and manage all registered users on the platform</p>
                        </div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="card card-glass" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="🔍 Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-tabs">
                        {['all', 'patient', 'doctor', 'admin'].map(role => (
                            <button
                                key={role}
                                className={`filter-tab ${roleFilter === role ? 'active' : ''}`}
                                onClick={() => setRoleFilter(role)}
                            >
                                {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
                                {` (${role === 'all' ? users.length : users.filter(u => u.role === role).length})`}
                            </button>
                        ))}
                    </div>
                </div>

                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    Showing {filtered.length} user{filtered.length !== 1 ? 's' : ''}
                </p>

                {filtered.length === 0 ? (
                    <div className="card card-glass">
                        <div className="empty-state">
                            <div className="empty-state-icon">👥</div>
                            <h3>No Users Found</h3>
                            <p>Try adjusting your search or filter</p>
                        </div>
                    </div>
                ) : (
                    <div className="appt-cards-list">
                        {filtered.map((u) => (
                            <div key={u._id} className="appt-card card card-glass fade-in">
                                <div className="appt-card-main">
                                    <div className="appt-card-left">
                                        <div className="avatar">{(u.name || '?').charAt(0).toUpperCase()}</div>
                                        <div className="appt-card-info">
                                            <h3>{u.name}</h3>
                                            <span className="appt-spec">{u.email}</span>
                                        </div>
                                    </div>
                                    <span className={`badge badge-${u.role === 'admin' ? 'approved' : u.role === 'doctor' ? 'pending' : 'patient'}`}>
                                        {u.role}
                                    </span>
                                </div>
                                <div className="appt-card-details">
                                    <div className="appt-detail-item">
                                        <span className="appt-detail-icon">📅</span>
                                        <span>Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {u.role !== 'admin' && (
                                    <div className="appt-card-actions">
                                        <button
                                            onClick={() => handleDelete(u._id, u.name)}
                                            className="btn btn-sm btn-error"
                                        >
                                            Delete User
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
