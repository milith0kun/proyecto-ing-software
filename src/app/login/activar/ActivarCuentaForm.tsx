'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, type FormEvent } from 'react';

export default function ActivarCuentaForm({ token }: { token: string }) {
  const [contrasena, setContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState('');
  const [pendiente, setPendiente] = useState(false);
  const [activada, setActivada] = useState(false);

  async function activar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError('');
    if (!token) {
      setError('El enlace de activación no es válido o ya venció.');
      return;
    }
    if (contrasena !== confirmacion) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setPendiente(true);
    try {
      const respuesta = await fetch('/api/auth/activar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, contrasena }),
      });
      const resultado = await respuesta.json();
      if (!respuesta.ok) throw new Error(resultado.error || 'No se pudo activar la cuenta.');
      setActivada(true);
    } catch (errorActivacion) {
      setError(errorActivacion instanceof Error ? errorActivacion.message : 'No se pudo conectar con el servidor.');
    } finally {
      setPendiente(false);
    }
  }

  return (
    <main className="login-escena">
      <div className="login-tarjeta">
        <aside className="login-marca" aria-label="CGB Academy">
          <Link href="/" className="login-marca__logo" aria-label="CGB Academy, volver al inicio">
            <Image src="/logos/recortados/cgb-logo-footer.png" alt="CGB Academy" width={700} height={247} sizes="140px" className="login-marca__logo-img" priority />
          </Link>
          <div className="login-marca__cuerpo">
            <p className="login-marca__kicker">Capacitación e inducción</p>
            <h2>CGB <span>Academy</span></h2>
            <p className="login-marca__texto">Activa tu acceso personal a las rutas de onboarding institucional.</p>
          </div>
        </aside>

        <section className="login-formulario" aria-labelledby="titulo-activacion">
          <span className="acceso-etiqueta">Activación de cuenta</span>
          <h1 id="titulo-activacion">Define tu contraseña</h1>
          {activada ? (
            <>
              <p className="login-formulario__ayuda" role="status">Tu cuenta está activa. Ya puedes iniciar sesión.</p>
              <Link href="/login" className="boton-primario acceso-boton-submit">Ir al inicio de sesión</Link>
            </>
          ) : (
            <>
              <p className="login-formulario__ayuda">Usa una contraseña de al menos 12 caracteres.</p>
              <form className="login-campos" onSubmit={activar}>
                <div className="acceso-campo">
                  <label htmlFor="contrasena-nueva">Contraseña</label>
                  <input
                    id="contrasena-nueva"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={72}
                    required
                    value={contrasena}
                    onChange={evento => setContrasena(evento.target.value)}
                    disabled={pendiente || !token}
                  />
                </div>
                <div className="acceso-campo">
                  <label htmlFor="confirmar-contrasena">Confirmar contraseña</label>
                  <input
                    id="confirmar-contrasena"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={72}
                    required
                    value={confirmacion}
                    onChange={evento => setConfirmacion(evento.target.value)}
                    disabled={pendiente || !token}
                  />
                </div>
                {error && <div className="acceso-error" role="alert">{error}</div>}
                <button className="boton-primario acceso-boton-submit" type="submit" disabled={pendiente || !token}>
                  {pendiente ? 'Activando…' : 'Activar cuenta'}
                </button>
              </form>
            </>
          )}
          <Link href="/login" className="acceso-volver">Volver al inicio de sesión</Link>
        </section>
      </div>
    </main>
  );
}