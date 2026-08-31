import React from 'react';
import Icon from './Icons';

/**
 * Classic, professional medical verification badge
 * Replaces informal emojis with classic SVG verified rosettes / shield credentials.
 */
const DoctorBadge = ({ status = 'approved', size = 'md', showText = true, customLabel = null }) => {
    if (status === 'approved') {
        return (
            <span
                className="classic-verified-badge approved"
                style={{
                    fontSize: size === 'sm' ? '0.7rem' : size === 'lg' ? '0.85rem' : '0.76rem',
                    padding: size === 'sm' ? '2px 7px' : size === 'lg' ? '5px 12px' : '3px 10px',
                }}
                title="Verified Medical Practitioner (Credentials Authenticated)"
            >
                <Icon name="verifiedBadge" size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />
                {showText && <span>{customLabel || 'Verified Specialist'}</span>}
            </span>
        );
    }

    if (status === 'pending') {
        return (
            <span
                className="classic-verified-badge pending"
                style={{
                    fontSize: size === 'sm' ? '0.7rem' : size === 'lg' ? '0.85rem' : '0.76rem',
                    padding: size === 'sm' ? '2px 7px' : size === 'lg' ? '5px 12px' : '3px 10px',
                }}
                title="Application under credential review"
            >
                <Icon name="clockAlert" size={size === 'sm' ? 12 : size === 'lg' ? 15 : 13} />
                {showText && <span>{customLabel || 'Pending Review'}</span>}
            </span>
        );
    }

    if (status === 'blocked') {
        return (
            <span
                className="classic-verified-badge blocked"
                style={{
                    fontSize: size === 'sm' ? '0.7rem' : size === 'lg' ? '0.85rem' : '0.76rem',
                    padding: size === 'sm' ? '2px 7px' : size === 'lg' ? '5px 12px' : '3px 10px',
                }}
                title="Account Suspended"
            >
                <Icon name="ban" size={size === 'sm' ? 12 : size === 'lg' ? 15 : 13} />
                {showText && <span>{customLabel || 'Suspended'}</span>}
            </span>
        );
    }

    return null;
};

export default DoctorBadge;
