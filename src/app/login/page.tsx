'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, type FormEvent } from 'react';

export default function PaginaLogin() {
  const [error, establecerError] = useState('');
  const [pendiente, establecerPendiente] = useState(false);

  async function ingresar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    establecerError('');
    establecerPendiente(true);

    const formulario = new FormData(evento.currentTarget);
    const correo = formulario.get('correo');
    const contrasena = formulario.get('contrasena');

    try {
      const respuesta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena }),
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        establecerError(resultado.error || 'Credenciales inválidas.');
        establecerPendiente(false);
        return;
      }

      window.location.assign(resultado.destino);
    } catch {
      establecerError('No se pudo conectar con el servidor. Inténtalo nuevamente.');
      establecerPendiente(false);
    }
  }

  return (
    <main className="acceso-contenedor">
      <section className="acceso-tarjeta" aria-labelledby="titulo-login">
        <Link href="/" aria-label="CGB Academy, volver al centro público" className="acceso-logo-link">
          <Image
            src="/logos/cgb-logo.png"
            alt="CGB Academy"
            width={160}
            height={60}
            priority
            className="acceso-logo"
          />
        </Link>

        <span className="acceso-etiqueta">Centro de Capacitación e Inducción</span>
        <h1 id="titulo-login">Acceso Interno</h1>
        <p className="acceso-descripcion">
          Ingresa tus credenciales institucionales habilitadas para acceder a tu panel de gestión o entorno de aprendizaje.
        </p>

        <form onSubmit={ingresar} className="acceso-formulario">
          <div className="acceso-campo">
            <label htmlFor="correo">Correo institucional</label>
            <input
              id="correo"
              name="correo"
              type="email"
              placeholder="usuario@cgb.latam"
              autoComplete="username"
              required
              maxLength={254}
              disabled={pendiente}
            />
          </div>

          <div className="acceso-campo">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
              maxLength={256}
              disabled={pendiente}
            />
          </div>

          {error && (
            <div className="acceso-error" role="alert" aria-live="assertive">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            className="boton-primario acceso-boton-submit"
            disabled={pendiente}
            type="submit"
          >
            {pendiente ? 'Verificando acceso…' : 'Ingresar al sistema'}
          </button>
        </form>

        <Link href="/" className="acceso-volver">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          Volver al centro público de capacitaciones
        </Link>
      </section>
    </main>
  );
}
