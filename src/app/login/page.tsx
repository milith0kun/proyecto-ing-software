'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, type FormEvent } from 'react';
import { UnidadesCgb } from '@/components/institucional/UnidadesCgb';

const beneficios = [
  'Gestión de capacitaciones e inducción institucional',
  'Acceso diferenciado para Administradores y Colaboradores',
  'Sesión protegida: cierre inmediato y revocación de acceso',
];

export default function PaginaLogin() {
  const [error, establecerError] = useState('');
  const [pendiente, establecerPendiente] = useState(false);

  async function ingresar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    establecerError('');
    establecerPendiente(true);

    const formulario = new FormData(evento.currentTarget);
    try {
      const respuesta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: formulario.get('correo'),
          contrasena: formulario.get('contrasena'),
        }),
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
    <main className="acceso-pagina">
      <aside className="acceso-marca" aria-label="Información institucional">
        <Link href="/" className="acceso-marca__logo" aria-label="CGB Academy, volver al inicio">
          <Image src="/logos/cgb-logo-footer.png" alt="CGB Academy" fill sizes="240px" className="object-contain object-left" priority />
        </Link>

        <div className="acceso-marca__cuerpo">
          <p className="acceso-marca__kicker">Centro de Capacitación e Inducción</p>
          <h2>Formación profesional para el equipo CGB Academy</h2>
          <p className="acceso-marca__texto">
            Plataforma institucional de CIIP, GEOMINA y BIOMEDIC para crear, publicar y
            consultar capacitaciones e inducciones.
          </p>
          <ul className="acceso-marca__lista">
            {beneficios.map((beneficio) => (
              <li key={beneficio}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 5 5L20 7" />
                </svg>
                {beneficio}
              </li>
            ))}
          </ul>
        </div>

        <div className="acceso-marca__unidades">
          <span>Unidades institucionales</span>
          <UnidadesCgb claro />
        </div>
      </aside>

      <section className="acceso-panel" aria-labelledby="titulo-login">
        <div className="acceso-tarjeta">
          <span className="acceso-etiqueta">Acceso interno</span>
          <h1 id="titulo-login">Inicia sesión</h1>
          <p className="acceso-descripcion">
            Ingresa con la cuenta habilitada por tu administrador para acceder a tu espacio de trabajo.
          </p>

          <form onSubmit={ingresar} className="acceso-formulario">
            <div className="acceso-campo">
              <label htmlFor="correo">Correo institucional</label>
              <input id="correo" name="correo" type="email" placeholder="usuario@cgb.latam" autoComplete="username" required maxLength={254} disabled={pendiente} />
            </div>

            <div className="acceso-campo">
              <label htmlFor="contrasena">Contraseña</label>
              <input id="contrasena" name="contrasena" type="password" placeholder="••••••••••••" autoComplete="current-password" required maxLength={256} disabled={pendiente} />
            </div>

            {error && (
              <div className="acceso-error" role="alert" aria-live="assertive">
                <span>{error}</span>
              </div>
            )}

            <button className="boton-primario acceso-boton-submit" disabled={pendiente} type="submit">
              {pendiente ? 'Verificando acceso…' : 'Ingresar al sistema'}
            </button>
          </form>

          <Link href="/" className="acceso-volver">← Volver al centro público de capacitaciones</Link>
        </div>
        <p className="acceso-pie">© CGB Academy · CIIP LATAM · GEOMINA LATAM · BIOMEDIC LATAM</p>
      </section>
    </main>
  );
}
