import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => { fetchUsers(); }, []);

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
        if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
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

    const roleCounts = { all: users.length, patient: 0, doctor: 0, admin: 0 };
    users.forEach(u => { if (roleCounts[u.role] !== undefined) roleCounts[u.role]++; });

    if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading users…</p></div>;

    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: '2rem' }} className="anim-fade-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                        background: 'var(--stat-blue-bg)', border: '1px solid var(--stat-blue-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                    }}>👥</div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Manage Users</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                    View and manage all registered users on the platform.
                </p>
            </div>

            {/* Search + Filter */}
            <div className="card anim-fade-up" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>🔍</span>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search by name or email…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.25rem' }}
                        />
                    </div>
                </div>
                <div className="filter-tabs" style={{ marginBottom: 0 }}>
                    {['all', 'patient', 'doctor', 'admin'].map(role => (
                        <button
                            key={role}
                            className={`filter-tab ${roleFilter === role ? 'active' : ''}`}
                            onClick={() => setRoleFilter(role)}
                        >
                            {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
                            <span style={{ marginLeft: '0.35rem', opacity: 0.7 }}>({roleCounts[role] ?? 0})</span>
                        </button>
                    ))}
                </div>
            </div>

            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.8rem' }}>
                Showing <strong style={{ color: 'var(--text-secondary)' }}>{filtered.length}</strong> user{filtered.length !== 1 ? 's' : ''}
            </p>

            {filtered.length === 0 ? (
                <div className="card" style={{ padding: 0 }}>
                    <div className="empty-state">
                        <div className="empty-state-icon">👥</div>
                        <h3>No Users Found</h3>
                        <p>Try adjusting your search or filter.</p>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filtered.map((u, i) => (
                        <div key={u._id} className={`appt-card-new anim-fade-up anim-d${Math.min(i + 1, 5)}`}>
                            <div className="appt-left">
                                <div
                                    className="avatar avatar-md"
                                    style={{
                                        background: u.role === 'admin' ? 'var(--gradient-rose)' : u.role === 'doctor' ? 'var(--gradient-success)' : 'var(--gradient-primary)'
                                    }}
                                >
                                    {(u.name || '?').charAt(0).toUpperCase()}
                                </div>
                                <div className="appt-info">
                                    <h4>{u.name}</h4>
                                    <span className="appt-info-sub">{u.email}</span>
                                </div>
                            </div>
                            <div className="appt-right">
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                    Joined {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className={`badge badge-${u.role}`}>{u.role}</span>
                                {u.role !== 'admin' && (
                                    <button
                                        onClick={() => handleDelete(u._id, u.name)}
                                        className="btn btn-sm btn-error"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
