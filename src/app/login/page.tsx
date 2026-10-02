'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, type FormEvent } from 'react';

export default function PaginaLogin() {
  const [error, establecerError] = useState('');
  const [pendiente, establecerPendiente] = useState(false);
  async function ingresar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault(); establecerError(''); establecerPendiente(true);
    const formulario = new FormData(evento.currentTarget);
    try {
      const respuesta = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ correo: formulario.get('correo'), contrasena: formulario.get('contrasena') }) });
      const resultado = await respuesta.json();
      if (!respuesta.ok) { establecerError(resultado.error || 'No pudimos iniciar sesión.'); establecerPendiente(false); return; }
      window.location.assign(resultado.destino);
    } catch { establecerError('No pudimos conectar. Inténtalo nuevamente.'); establecerPendiente(false); }
  }
  return <main className="acceso-contenedor"><section className="acceso-tarjeta"><Link href="/" aria-label="CGB Academy, volver al inicio"><Image src="/logos/cgb-logo.png" alt="CGB Academy" width={180} height={90} className="acceso-logo" /></Link><p className="acceso-etiqueta">Acceso interno</p><h1>Inicia sesión</h1><p>Ingresa con la cuenta habilitada por tu administrador.</p><form onSubmit={ingresar}><label htmlFor="correo">Correo institucional</label><input id="correo" name="correo" type="email" autoComplete="username" required maxLength={254} disabled={pendiente} /><label htmlFor="contrasena">Contraseña</label><input id="contrasena" name="contrasena" type="password" autoComplete="current-password" required maxLength={256} disabled={pendiente} />{error && <p className="acceso-error" role="alert">{error}</p>}<button className="boton-primario" disabled={pendiente} type="submit">{pendiente ? 'Ingresando…' : 'Ingresar'}</button></form><Link href="/">Volver al centro público</Link></section></main>;
}
