import React from 'react';

export const Logo = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img src="/logo-transparent.png" alt="Mahaga Widya Cita Logo" style={{ height: '32px', width: 'auto' }} />
      <span style={{ fontWeight: 'bold', fontSize: '18px', color: 'var(--theme-text)' }}>Mahaga Widya Cita</span>
    </div>
  );
};
