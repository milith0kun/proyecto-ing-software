'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CabeceraCgb } from '@/components/institucional/CabeceraCgb';
import { PieCgb } from '@/components/institucional/PieCgb';
import {
  evaluarFortalezaContrasena,
  type DatosPerfilActivacion,
} from '@/lib/activacion-cuenta';

function IconoCheck({ cumplido }: { cumplido: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={cumplido ? '#146287' : '#94A3B8'}
      strokeWidth="2.5"
      aria-hidden="true"
    >
      {cumplido ? <polyline points="20 6 9 17 4 12" /> : <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}

export default function FormularioActivarCuenta({ token }: { token: string }) {
  const router = useRouter();
  const [estadoVista, setEstadoVista] = useState<'cargando' | 'valido' | 'invalido' | 'bienvenida'>(
    token ? 'cargando' : 'invalido',
  );
  const [perfil, setPerfil] = useState<DatosPerfilActivacion | null>(null);
  const [errorToken, setErrorToken] = useState<string>(
    token ? '' : 'El enlace de activación no contiene un token válido.',
  );

  const [contrasena, setContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [mostrarClave, setMostrarClave] = useState(false);
  const [errorForm, setErrorForm] = useState('');
  const [enviando, setEnviando] = useState(false);

  const [correoReenvio, setCorreoReenvio] = useState('');
  const [mensajeReenvio, setMensajeReenvio] = useState('');
  const [errorReenvio, setErrorReenvio] = useState('');

  const fortaleza = useMemo(() => evaluarFortalezaContrasena(contrasena), [contrasena]);

  useEffect(() => {
    if (!token) return;
    let activo = true;
    fetch(`/api/auth/activar?token=${encodeURIComponent(token)}`, { cache: 'no-store' })
      .then(async resp => {
        const json = await resp.json();
        if (!activo) return;
        if (resp.ok && json.ok) {
          setPerfil(json.datos);
          setEstadoVista('valido');
        } else {
          setErrorToken(json.error || 'El enlace de activación ha vencido o no es válido.');
          setEstadoVista('invalido');
        }
      })
      .catch(() => {
        if (!activo) return;
        setErrorToken('No pudimos verificar el enlace de activación.');
        setEstadoVista('invalido');
      });
    return () => {
      activo = false;
    };
  }, [token]);

  async function manejarActivacion(e: React.FormEvent) {
    e.preventDefault();
    setErrorForm('');
    if (contrasena !== confirmacion) {
      setErrorForm('Las contraseñas no coinciden.');
      return;
    }

    setEnviando(true);
    try {
      const resp = await fetch('/api/auth/activar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, contrasena }),
      });
      const json = await resp.json();
      if (!resp.ok || !json.ok) {
        setErrorForm(json.error || 'No se pudo activar la cuenta.');
        return;
      }
      setEstadoVista('bienvenida');
      setTimeout(() => {
        router.push(json.redireccion || '/colaborador');
        router.refresh();
      }, 900);
    } catch {
      setErrorForm('Error de conexión al activar tu cuenta.');
    } finally {
      setEnviando(false);
    }
  }

  async function manejarSolicitarNuevoEnlace(e: React.FormEvent) {
    e.preventDefault();
    setMensajeReenvio('');
    setErrorReenvio('');
    setEnviando(true);
    try {
      const resp = await fetch('/api/auth/activar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: correoReenvio }),
      });
      const json = await resp.json();
      if (!resp.ok || !json.ok) {
        setErrorReenvio(json.error || 'No pudimos generar un nuevo enlace.');
        return;
      }
      setMensajeReenvio(json.mensaje);
    } catch {
      setErrorReenvio('Error de conexión al solicitar un nuevo enlace.');
    } finally {
      setEnviando(false);
    }
  }

  const colorBarra =
    fortaleza.nivel === 'FUERTE'
      ? '#4DC4D3'
      : fortaleza.nivel === 'MEDIA'
        ? '#146287'
        : '#DC2626';

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#092A60]">
      <CabeceraCgb />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#D8E2EE] p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#092A60]">Activación de Cuenta</h1>
            <p className="text-sm text-[#146287] mt-1">
              Define tu contraseña personal para ingresar a tu ruta de onboarding.
            </p>
          </div>

          {estadoVista === 'cargando' && (
            <p className="text-sm text-[#146287]">Verificando enlace de activación...</p>
          )}

          {estadoVista === 'bienvenida' && (
            <div className="rounded-xl bg-[#ECFEFF] border border-[#4DC4D3] p-5 space-y-2 text-center">
              <p className="text-base font-bold text-[#092A60]">
                ¡Bienvenido a CGB Academy{perfil?.nombre ? `, ${perfil.nombre}` : ''}!
              </p>
              <p className="text-sm text-[#146287]">
                Tu cuenta fue activada. Redirigiendo a tu ruta de onboarding...
              </p>
            </div>
          )}

          {estadoVista === 'invalido' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]">
                {errorToken}
              </div>

              <form onSubmit={manejarSolicitarNuevoEnlace} className="space-y-3 pt-2 border-t border-[#D8E2EE]">
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#146287]">
                  Correo corporativo
                </label>
                <input
                  type="email"
                  required
                  value={correoReenvio}
                  onChange={e => setCorreoReenvio(e.target.value)}
                  placeholder="colaborador@cgb.latam"
                  className="w-full rounded-lg border border-[#D8E2EE] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4DC4D3]"
                />
                {errorReenvio && <p className="text-xs text-[#991B1B]">{errorReenvio}</p>}
                {mensajeReenvio && (
                  <p className="text-xs text-[#092A60] bg-[#ECFEFF] border border-[#4DC4D3] rounded-lg p-2.5">
                    {mensajeReenvio}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full rounded-xl bg-[#092A60] text-white py-2.5 px-4 text-sm font-semibold hover:bg-[#146287] disabled:opacity-50"
                >
                  Solicitar nuevo enlace de activación
                </button>
              </form>
            </div>
          )}

          {estadoVista === 'valido' && perfil && (
            <form onSubmit={manejarActivacion} className="space-y-4">
              <div className="rounded-xl bg-[#F3F6FA] border border-[#D8E2EE] p-4 space-y-1 text-sm">
                <p className="font-semibold text-[#092A60]">{perfil.nombre}</p>
                <p className="text-[#146287]">{perfil.email}</p>
                {perfil.puestoNombre && (
                  <p className="text-xs text-[#146287]">Puesto: {perfil.puestoNombre}</p>
                )}
                {perfil.rutaNombre && (
                  <p className="text-xs text-[#146287]">Ruta: {perfil.rutaNombre}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#146287]">
                    Nueva contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => setMostrarClave(prev => !prev)}
                    className="text-xs font-semibold text-[#146287] hover:text-[#092A60]"
                  >
                    {mostrarClave ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <input
                  type={mostrarClave ? 'text' : 'password'}
                  required
                  value={contrasena}
                  onChange={e => setContrasena(e.target.value)}
                  placeholder="Mínimo 8 caracteres, número y símbolo"
                  className="w-full rounded-lg border border-[#D8E2EE] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4DC4D3]"
                />

                {contrasena.length > 0 && (
                  <div className="mt-2.5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#146287]">Seguridad de contraseña</span>
                      <span className="text-[#092A60]">{fortaleza.nivel}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#F3F6FA] overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{ width: `${fortaleza.porcentaje}%`, backgroundColor: colorBarra }}
                      />
                    </div>
                    <ul className="grid grid-cols-2 gap-1.5 text-xs text-[#146287]">
                      <li className="flex items-center gap-1.5">
                        <IconoCheck cumplido={fortaleza.criterios.longitudMinima} />
                        <span>8+ caracteres</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <IconoCheck cumplido={fortaleza.criterios.tieneNumero} />
                        <span>Al menos 1 número</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <IconoCheck cumplido={fortaleza.criterios.tieneSimbolo} />
                        <span>Al menos 1 símbolo</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <IconoCheck cumplido={fortaleza.criterios.tieneMayuscula} />
                        <span>Mayúscula (recom.)</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#146287] mb-1">
                  Confirmar contraseña
                </label>
                <input
                  type={mostrarClave ? 'text' : 'password'}
                  required
                  value={confirmacion}
                  onChange={e => setConfirmacion(e.target.value)}
                  placeholder="Repite tu contraseña"
                  className="w-full rounded-lg border border-[#D8E2EE] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4DC4D3]"
                />
              </div>

              {errorForm && (
                <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-xs text-[#991B1B]">
                  {errorForm}
                </div>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="w-full rounded-xl bg-[#092A60] text-white py-2.5 px-4 text-sm font-semibold hover:bg-[#146287] disabled:opacity-50"
              >
                {enviando ? 'Activando cuenta...' : 'Activar cuenta e ingresar'}
              </button>
            </form>
          )}

          <div className="text-center pt-2">
            <Link href="/login" className="text-xs font-medium text-[#146287] hover:underline">
              ¿Ya activaste tu cuenta? Ir a Iniciar Sesión
            </Link>
          </div>
        </div>
      </main>

      <PieCgb />
    </div>
  );
}
