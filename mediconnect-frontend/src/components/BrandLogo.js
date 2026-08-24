import React from 'react';

export const BrandLogo = ({ size = 36, iconSize = 22, borderRadius = 10, className = '' }) => (
    <div
        className={className}
        style={{
            width: size,
            height: size,
            borderRadius: borderRadius,
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
            flexShrink: 0,
        }}
    >
        <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ display: 'block' }}
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
        </svg>
    </div>
);

export default BrandLogo;
