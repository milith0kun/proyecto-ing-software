'use client';

import { useState } from 'react';

export function CerrarSesion() {
  const [pendiente, establecerPendiente] = useState(false);
  const [error, establecerError] = useState('');

  async function salir() {
    establecerPendiente(true);
    establecerError('');
    try {
      const respuesta = await fetch('/api/auth/logout', { method: 'POST' });
      if (!respuesta.ok) throw new Error('Error al cerrar sesión');
      window.location.assign('/');
    } catch {
      establecerError('No se pudo cerrar la sesión.');
      establecerPendiente(false);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        className="boton-secundario"
        onClick={salir}
        disabled={pendiente}
        style={{ padding: '8px 18px', minHeight: '38px', fontSize: '12px' }}
        type="button"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        {pendiente ? 'Cerrando sesión…' : 'Cerrar sesión'}
      </button>
      {error && <span role="alert" style={{ color: '#DC2626', fontSize: '12px' }}>{error}</span>}
    </div>
  );
}
