import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Icon from '../../components/Icons';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/admin/users');
            if (response.data && response.data.users) {
                setUsers(response.data.users);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.response?.data?.message || 'Unable to fetch user directory. Please check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchUsers(); 
    }, []);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete user account "${name}"? This action cannot be reversed.`)) return;
        try {
            await api.delete(`/admin/users/${id}`);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user');
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

    if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading user directory…</p></div>;

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
                        <Icon name="users" size={20} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>User Management</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                    Audit registered patients, medical practitioners, and platform administrators.
                </p>
            </div>

            {error && (
                <div className="alert alert-error anim-fade-up" style={{ marginBottom: '1.5rem', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Icon name="alertTriangle" size={18} />
                        <span>{error}</span>
                    </div>
                    <button onClick={fetchUsers} className="btn btn-sm btn-outline" style={{ background: 'var(--bg-surface)' }}>
                        Retry
                    </button>
                </div>
            )}

            {/* Search + Filter Bar */}
            <div className="card anim-fade-up" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
                <div style={{ marginBottom: '1rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
                        <Icon name="search" size={18} />
                    </div>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search by full name or email address…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '2.5rem' }}
                    />
                </div>
                <div className="filter-tabs" style={{ marginBottom: 0 }}>
                    {['all', 'patient', 'doctor', 'admin'].map(role => (
                        <button
                            key={role}
                            className={`filter-tab ${roleFilter === role ? 'active' : ''}`}
                            onClick={() => setRoleFilter(role)}
                        >
                            {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1) + 's'}
                            <span style={{ marginLeft: '0.35rem', opacity: 0.75 }}>({roleCounts[role] ?? 0})</span>
                        </button>
                    ))}
                </div>
            </div>

            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.825rem' }}>
                Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> registered account{filtered.length !== 1 ? 's' : ''}
            </p>

            {filtered.length === 0 ? (
                <div className="card" style={{ padding: 0 }}>
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Icon name="users" size={24} />
                        </div>
                        <h3>No Users Found</h3>
                        <p>No account matches your search query or role filter.</p>
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
                                        background: u.role === 'admin' ? 'linear-gradient(135deg, #e11d48, #be123c)' : u.role === 'doctor' ? 'var(--gradient-accent)' : 'var(--gradient-primary)'
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
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    Joined {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className={`badge badge-${u.role}`}>{u.role}</span>
                                {u.role !== 'admin' && (
                                    <button
                                        onClick={() => handleDelete(u._id, u.name)}
                                        className="btn btn-sm btn-error"
                                        title="Delete User"
                                    >
                                        <Icon name="trash" size={14} />
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
