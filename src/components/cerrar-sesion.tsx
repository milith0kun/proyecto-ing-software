'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CerrarSesion() {
  const router = useRouter();
  const [pendiente, establecerPendiente] = useState(false);
  const [error, establecerError] = useState('');
  async function salir() {
    establecerPendiente(true); establecerError('');
    try {
      const respuesta = await fetch('/api/auth/logout', { method: 'POST' });
      if (!respuesta.ok) throw new Error();
      router.replace('/');
      router.refresh();
    } catch { establecerError('No pudimos cerrar sesión. Inténtalo nuevamente.'); establecerPendiente(false); }
  }
  return <div><button className="boton-secundario" onClick={salir} disabled={pendiente}>{pendiente ? 'Cerrando sesión…' : 'Cerrar sesión'}</button>{error && <p role="alert">{error}</p>}</div>;
}
