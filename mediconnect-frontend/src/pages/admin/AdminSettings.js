import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../../components/Icons';

const AdminSettings = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }} className="anim-fade-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                        background: 'var(--primary-light)', border: '1px solid var(--border-subtle)',
                        color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Icon name="shield" size={20} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Admin Profile & Settings</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
                    Manage your administrator credentials, system appearance, and session security.
                </p>
            </div>

            {/* Admin Info Card */}
            <div className="card anim-fade-up anim-d1" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div className="avatar avatar-xl" style={{
                        margin: '0 auto 1rem',
                        fontSize: '2rem',
                        width: '88px',
                        height: '88px',
                        background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                        borderRadius: 'var(--radius-2xl)',
                        boxShadow: 'var(--shadow-md)',
                    }}>
                        {(user?.name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <h3 style={{ margin: '0 0 0.35rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                        {user?.name || 'System Administrator'}
                    </h3>
                    <span className="badge badge-admin" style={{ fontSize: '0.75rem' }}>
                        <Icon name="shield" size={12} /> System Administrator
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div className="detail-row" style={{ padding: '0.75rem 1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                        <span className="detail-row-label">Administrator Name</span>
                        <span className="detail-row-value">{user?.name || 'Admin'}</span>
                    </div>
                    <div className="detail-row" style={{ padding: '0.75rem 1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                        <span className="detail-row-label">Email Address</span>
                        <span className="detail-row-value">{user?.email || 'admin@mediconnect.com'}</span>
                    </div>
                    <div className="detail-row" style={{ padding: '0.75rem 1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                        <span className="detail-row-label">Access Level</span>
                        <span className="detail-row-value" style={{ color: 'var(--error)', fontWeight: 700 }}>Super Admin</span>
                    </div>
                </div>
            </div>

            {/* Appearance & Preferences Card */}
            <div className="card anim-fade-up anim-d2" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Interface Appearance</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Theme Mode</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                            Currently active: <strong style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>{theme} mode</strong>
                        </div>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="btn btn-outline"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
                        <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                    </button>
                </div>
            </div>

            {/* Account & Session Security Card */}
            <div className="card anim-fade-up anim-d3" style={{ padding: '1.75rem', borderColor: 'var(--error-border)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--error)' }}>Admin Session Security</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Sign out of this administrative session.
                </p>
                <button
                    onClick={logout}
                    className="btn btn-error"
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    <Icon name="logout" size={16} />
                    <span>Sign Out of Admin Console</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSettings;
