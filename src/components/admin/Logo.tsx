import React from 'react';

export const Logo = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' }}>
      <img 
        src="/logo-transparent.png" 
        alt="Mahaga Widya Cita Logo" 
        style={{ height: '36px', width: 'auto', objectFit: 'contain', display: 'block' }} 
      />
      <span style={{ fontWeight: 700, fontSize: '16px', color: '#0f172a', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
        Mahaga Widya Cita
      </span>
    </div>
  );
};
