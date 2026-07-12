import React from 'react';

export const Logo = () => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px',
      padding: '4px 0',
    }}>
      {/* Blue icon square */}
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
        flexShrink: 0,
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
        <span style={{ 
          fontWeight: 700, 
          fontSize: '15px', 
          color: '#2563eb',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '-0.01em',
        }}>
          Mahaga Admin
        </span>
        <span style={{ 
          fontWeight: 500, 
          fontSize: '10px', 
          color: '#9da1b3',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
        }}>
          Content Management System
        </span>
      </div>
    </div>
  );
};
