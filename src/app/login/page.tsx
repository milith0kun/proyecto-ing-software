'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react';
import { UnidadesCgb } from '@/components/institucional/UnidadesCgb';

const CLAVE_CORREO = 'cgb_correo_recordado';

function IconoOjo({ oculto }: { oculto: boolean }) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {oculto ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
          <path d="m1 1 22 22" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

export default function PaginaLogin() {
  const [correo, establecerCorreo] = useState('');
  const [contrasena, establecerContrasena] = useState('');
  const [verContrasena, establecerVerContrasena] = useState(false);
  const [recordar, establecerRecordar] = useState(false);
  const [mayusculas, establecerMayusculas] = useState(false);
  const [ayuda, establecerAyuda] = useState(false);
  const [error, establecerError] = useState('');
  const [pendiente, establecerPendiente] = useState(false);

  // Recupera el correo guardado en este equipo (nunca se guarda la contraseña).
  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CLAVE_CORREO);
      if (guardado) { establecerCorreo(guardado); establecerRecordar(true); }
    } catch { /* almacenamiento no disponible */ }
  }, []);

  function detectarMayusculas(evento: KeyboardEvent<HTMLInputElement>) {
    establecerMayusculas(evento.getModifierState('CapsLock'));
  }

  async function ingresar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    establecerError('');
    establecerPendiente(true);

    try {
      const respuesta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena }),
      });
      const resultado = await respuesta.json();
      if (!respuesta.ok) {
        establecerError(resultado.error || 'Credenciales inválidas.');
        establecerContrasena('');
        establecerPendiente(false);
        return;
      }
      try {
        if (recordar) window.localStorage.setItem(CLAVE_CORREO, correo.trim().toLowerCase());
        else window.localStorage.removeItem(CLAVE_CORREO);
      } catch { /* almacenamiento no disponible */ }
      window.location.assign(resultado.destino);
    } catch {
      establecerError('No se pudo conectar con el servidor. Inténtalo nuevamente.');
      establecerPendiente(false);
    }
  }

  return (
    <main className="login-escena">
      <span className="login-circulo login-circulo--superior" aria-hidden="true" />
      <span className="login-circulo login-circulo--inferior" aria-hidden="true" />

      <div className="login-tarjeta">
        <aside className="login-marca" aria-label="Información institucional">
          <Link href="/" className="login-marca__logo" aria-label="CGB Academy, volver al inicio">
            <Image src="/logos/cgb-logo-footer.png" alt="CGB Academy" fill sizes="200px" className="object-contain object-left" priority />
          </Link>

          <div className="login-marca__cuerpo">
            <p className="login-marca__kicker">Capacitación e inducción</p>
            <h2>CGB <span>Academy</span></h2>
            <p className="login-marca__texto">
              Capacitaciones, inducciones y contenidos de CIIP LATAM, Geomina LATAM y BioMedic
              en un solo panel.
            </p>
          </div>

          <UnidadesCgb claro />
        </aside>

        <section className="login-formulario" aria-labelledby="titulo-login">
          <span className="acceso-etiqueta">Acceso interno</span>
          <h1 id="titulo-login">Ingresa a tu panel</h1>
          <p className="login-formulario__ayuda">Usa el correo corporativo asignado por tu escuela.</p>

          <form onSubmit={ingresar} className="login-campos" noValidate={false}>
            <div className="acceso-campo">
              <label htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                name="correo"
                type="email"
                value={correo}
                onChange={(evento) => establecerCorreo(evento.target.value)}
                placeholder="usuario@cgb.latam"
                autoComplete="username"
                autoFocus
                required
                maxLength={254}
                disabled={pendiente}
              />
            </div>

            <div className="acceso-campo">
              <div className="login-campo__cabecera">
                <label htmlFor="contrasena">Contraseña</label>
                <button type="button" className="login-enlace" onClick={() => establecerAyuda((valor) => !valor)} aria-expanded={ayuda} aria-controls="login-ayuda">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="login-clave">
                <input
                  id="contrasena"
                  name="contrasena"
                  type={verContrasena ? 'text' : 'password'}
                  value={contrasena}
                  onChange={(evento) => establecerContrasena(evento.target.value)}
                  onKeyUp={detectarMayusculas}
                  onKeyDown={detectarMayusculas}
                  onBlur={() => establecerMayusculas(false)}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                  required
                  maxLength={256}
                  disabled={pendiente}
                />
                <button
                  type="button"
                  className="login-clave__ojo"
                  onClick={() => establecerVerContrasena((valor) => !valor)}
                  aria-label={verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={verContrasena}
                  disabled={pendiente}
                >
                  <IconoOjo oculto={verContrasena} />
                </button>
              </div>
              {mayusculas && <p className="login-aviso" role="status">Bloq Mayús está activado.</p>}
            </div>

            {ayuda && (
              <div id="login-ayuda" className="login-ayuda" role="note">
                <strong>Recuperación de contraseña</strong>
                <span>Por ahora el restablecimiento lo realiza tu administrador. Solicítalo con tu correo corporativo y recibirás una nueva clave de acceso.</span>
              </div>
            )}

            <label className="login-recordar">
              <input type="checkbox" checked={recordar} onChange={(evento) => establecerRecordar(evento.target.checked)} disabled={pendiente} />
              <span>Recordar mi correo en este equipo</span>
            </label>

            {error && (
              <div className="acceso-error" role="alert" aria-live="assertive">
                <span>{error}</span>
              </div>
            )}

            <button className="boton-primario acceso-boton-submit" disabled={pendiente} type="submit">
              {pendiente ? 'Verificando acceso…' : 'Iniciar sesión'}
            </button>
          </form>

          <Link href="/" className="acceso-volver">← Volver al centro público de capacitaciones</Link>
          <p className="login-pie">© 2026 CGB Academy · CIIP · Geomina · BioMedic</p>
        </section>
      </div>
    </main>
  );
}
