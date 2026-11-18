'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CabeceraAdminCgb } from '@/components/institucional/CabeceraAdminCgb';
import { PieCgb } from '@/components/institucional/PieCgb';
import { moverPasoSecuencia } from '@/lib/rutas-onboarding';
import {
  activarRutaCliente,
  crearRutaCliente,
  guardarSecuenciaCliente,
  type AreaConstructorVista,
  type CapacitacionCatalogoVista,
  type RutaOnboardingVista,
} from '@/lib/rutas-cliente';
import { ListaPasosRuta } from './ListaPasosRuta';

interface PropsConstructorRutas {
  areas: AreaConstructorVista[];
  capacitaciones: CapacitacionCatalogoVista[];
  rutasIniciales: RutaOnboardingVista[];
}

export default function ConstructorRutas({
  areas,
  capacitaciones,
  rutasIniciales,
}: PropsConstructorRutas) {
  const [rutas, setRutas] = useState<RutaOnboardingVista[]>(rutasIniciales);
  const [rutaSeleccionadaId, setRutaSeleccionadaId] = useState<string>(rutasIniciales[0]?.id ?? '');
  const [titulo, setTitulo] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [areaId, setAreaId] = useState(areas[0]?.id ?? '');
  const [puestoId, setPuestoId] = useState('');
  const [secuenciaIds, setSecuenciaIds] = useState<string[]>(
    rutasIniciales[0]?.pasos.map(p => p.capacitacionId) ?? [],
  );
  const [capacitacionAgregarId, setCapacitacionAgregarId] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const areaActual = useMemo(() => areas.find(a => a.id === areaId), [areas, areaId]);
  const rutaActiva = useMemo(
    () => rutas.find(r => r.id === rutaSeleccionadaId) ?? null,
    [rutas, rutaSeleccionadaId],
  );
  const mapaCapacitaciones = useMemo(
    () => new Map(capacitaciones.map(c => [c.id, c])),
    [capacitaciones],
  );
  const disponibles = useMemo(
    () => capacitaciones.filter(c => !secuenciaIds.includes(c.id)),
    [capacitaciones, secuenciaIds],
  );
  const estaActiva = rutaActiva?.estado === 'ACTIVA';

  function seleccionarRuta(ruta: RutaOnboardingVista) {
    setRutaSeleccionadaId(ruta.id);
    setSecuenciaIds(ruta.pasos.map(p => p.capacitacionId));
    setMensaje(null);
    setError(null);
  }

  async function manejarCrearRuta(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);
    setError(null);
    try {
      const nueva = await crearRutaCliente({ titulo, objetivo, areaId, puestoId: puestoId || null });
      setRutas(prev => [nueva, ...prev]);
      seleccionarRuta(nueva);
      setTitulo('');
      setObjetivo('');
      setPuestoId('');
      setMensaje('Ruta creada en borrador. Añade y ordena sus capacitaciones.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión al crear la ruta.');
    } finally {
      setCargando(false);
    }
  }

  function agregarPaso() {
    if (estaActiva || !capacitacionAgregarId || secuenciaIds.includes(capacitacionAgregarId)) return;
    setSecuenciaIds(prev => [...prev, capacitacionAgregarId]);
    setCapacitacionAgregarId('');
  }

  function quitarPaso(capId: string) {
    if (estaActiva) return;
    setSecuenciaIds(prev => prev.filter(id => id !== capId));
  }

  function moverPaso(origen: number, destino: number) {
    if (estaActiva) return;
    setSecuenciaIds(prev => moverPasoSecuencia(prev, origen, destino));
  }

  async function guardarSecuencia() {
    if (!rutaActiva || estaActiva) return;
    setCargando(true);
    setMensaje(null);
    setError(null);
    try {
      const actualizada = await guardarSecuenciaCliente(rutaActiva.id, secuenciaIds);
      setRutas(prev => prev.map(r => (r.id === actualizada.id ? actualizada : r)));
      setMensaje('Secuencia correlativa guardada correctamente.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión al guardar la secuencia.');
    } finally {
      setCargando(false);
    }
  }

  async function activarRutaActual() {
    if (!rutaActiva || estaActiva) return;
    setCargando(true);
    setMensaje(null);
    setError(null);
    try {
      const activada = await activarRutaCliente(rutaActiva.id);
      setRutas(prev => prev.map(r => (r.id === activada.id ? activada : r)));
      setMensaje('Ruta activada y disponible para asignación a colaboradores.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión al activar la ruta.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#092A60]">
      <CabeceraAdminCgb>
        <nav className="flex items-center gap-3 text-sm font-medium" aria-label="Navegación administrativa">
          <Link
            href="/admin/capacitaciones"
            className="px-3 py-1.5 rounded-lg border border-[#D8E2EE] text-[#092A60] hover:bg-[#F3F6FA]"
          >
            Capacitaciones
          </Link>
          <span className="px-3 py-1.5 rounded-lg bg-[#092A60] text-white" aria-current="page">
            Rutas de Onboarding
          </span>
        </nav>
      </CabeceraAdminCgb>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#092A60]">Constructor de Rutas de Onboarding</h1>
          <p className="text-sm text-[#146287]">
            Estructura itinerarios correlativos por área y puesto de trabajo (HU-008).
          </p>
        </div>

        {(mensaje || error) && (
          <div
            role={error ? 'alert' : 'status'}
            aria-live="polite"
            className={`rounded-xl px-4 py-3 text-sm font-medium border ${
              error
                ? 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
                : 'bg-[#ECFEFF] border-[#4DC4D3] text-[#092A60]'
            }`}
          >
            {error || mensaje}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-5 space-y-6" aria-label="Creación y listado de rutas">
            <form
              onSubmit={manejarCrearRuta}
              className="bg-white rounded-2xl border border-[#D8E2EE] p-5 space-y-4 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-[#092A60]">Nueva ruta en borrador</h2>

              <div>
                <label
                  htmlFor="ruta-titulo"
                  className="block text-xs font-semibold uppercase tracking-wide text-[#146287] mb-1"
                >
                  Título de la ruta
                </label>
                <input
                  id="ruta-titulo"
                  type="text"
                  required
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  placeholder="Ej. Onboarding Backend Node.js"
                  className="w-full rounded-lg border border-[#D8E2EE] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4DC4D3]"
                />
              </div>

              <div>
                <label
                  htmlFor="ruta-objetivo"
                  className="block text-xs font-semibold uppercase tracking-wide text-[#146287] mb-1"
                >
                  Objetivo formativo
                </label>
                <textarea
                  id="ruta-objetivo"
                  required
                  rows={2}
                  value={objetivo}
                  onChange={e => setObjetivo(e.target.value)}
                  placeholder="Describe qué dominará el colaborador al completar esta ruta"
                  className="w-full rounded-lg border border-[#D8E2EE] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4DC4D3]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="ruta-area"
                    className="block text-xs font-semibold uppercase tracking-wide text-[#146287] mb-1"
                  >
                    Área
                  </label>
                  <select
                    id="ruta-area"
                    value={areaId}
                    onChange={e => {
                      setAreaId(e.target.value);
                      setPuestoId('');
                    }}
                    className="w-full rounded-lg border border-[#D8E2EE] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4DC4D3]"
                  >
                    {areas.length === 0 && <option value="">Sin áreas activas</option>}
                    {areas.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="ruta-puesto"
                    className="block text-xs font-semibold uppercase tracking-wide text-[#146287] mb-1"
                  >
                    Puesto (opcional)
                  </label>
                  <select
                    id="ruta-puesto"
                    value={puestoId}
                    onChange={e => setPuestoId(e.target.value)}
                    className="w-full rounded-lg border border-[#D8E2EE] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4DC4D3]"
                  >
                    <option value="">Transversal a toda el área</option>
                    {areaActual?.puestos.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={cargando || areas.length === 0}
                className="w-full rounded-xl bg-[#092A60] text-white py-2.5 px-4 text-sm font-semibold hover:bg-[#146287] disabled:opacity-50 transition-colors"
              >
                Registrar Ruta en Borrador
              </button>
            </form>

            <div className="bg-white rounded-2xl border border-[#D8E2EE] p-5 space-y-3 shadow-sm">
              <h2 className="text-lg font-semibold text-[#092A60]">Rutas registradas ({rutas.length})</h2>
              {rutas.length === 0 ? (
                <p className="text-sm text-[#146287]">Aún no hay rutas creadas.</p>
              ) : (
                <ul className="space-y-2" aria-label="Lista de rutas registradas">
                  {rutas.map(ruta => (
                    <li key={ruta.id}>
                      <button
                        type="button"
                        aria-pressed={ruta.id === rutaSeleccionadaId}
                        onClick={() => seleccionarRuta(ruta)}
                        className={`w-full text-left rounded-xl p-3 border transition-colors ${
                          ruta.id === rutaSeleccionadaId
                            ? 'bg-[#F3F6FA] border-[#092A60]'
                            : 'bg-white border-[#D8E2EE] hover:bg-[#F9FAFB]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm text-[#092A60]">{ruta.titulo}</span>
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              ruta.estado === 'ACTIVA'
                                ? 'bg-[#4DC4D3] text-[#092A60]'
                                : 'bg-[#F3F6FA] text-[#146287] border border-[#D8E2EE]'
                            }`}
                          >
                            {ruta.estado}
                          </span>
                        </div>
                        <p className="text-xs text-[#146287] mt-1">
                          {ruta.pasos.length} {ruta.pasos.length === 1 ? 'capacitación' : 'capacitaciones'}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section
            className="lg:col-span-7 bg-white rounded-2xl border border-[#D8E2EE] p-5 space-y-5 shadow-sm"
            aria-label="Editor de secuencia de la ruta"
          >
            {!rutaActiva ? (
              <div className="py-16 text-center text-sm text-[#146287]">
                Crea o selecciona una ruta para secuenciar sus capacitaciones obligatorias.
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#D8E2EE] pb-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#146287]">
                      Secuencia correlativa
                    </span>
                    <h2 className="text-xl font-bold text-[#092A60]">{rutaActiva.titulo}</h2>
                    <p className="text-sm text-[#146287] mt-1">{rutaActiva.objetivo}</p>
                  </div>
                  <button
                    type="button"
                    onClick={activarRutaActual}
                    disabled={cargando || rutaActiva.pasos.length === 0 || estaActiva}
                    className="rounded-xl bg-[#4DC4D3] text-[#092A60] px-4 py-2 text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-opacity"
                  >
                    {estaActiva ? 'Ruta Activa' : 'Activar Ruta'}
                  </button>
                </div>

                {estaActiva && (
                  <div
                    role="status"
                    className="rounded-xl border border-[#4DC4D3] bg-[#ECFEFF] px-4 py-3 text-xs font-medium text-[#092A60]"
                  >
                    Esta ruta ya está ACTIVA. Su secuencia queda en modo solo lectura para proteger el avance de los colaboradores asignados.
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <label htmlFor="selector-capacitacion-paso" className="sr-only">
                    Seleccionar capacitación publicada
                  </label>
                  <select
                    id="selector-capacitacion-paso"
                    value={capacitacionAgregarId}
                    disabled={estaActiva}
                    onChange={e => setCapacitacionAgregarId(e.target.value)}
                    className="flex-1 min-w-[220px] rounded-lg border border-[#D8E2EE] px-3 py-2 text-sm bg-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#4DC4D3]"
                  >
                    <option value="">Selecciona una capacitación publicada...</option>
                    {disponibles.map(cap => (
                      <option key={cap.id} value={cap.id}>
                        {cap.titulo} ({cap.unidad})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={agregarPaso}
                    disabled={estaActiva || !capacitacionAgregarId}
                    className="rounded-xl border border-[#092A60] text-[#092A60] px-4 py-2 text-sm font-semibold hover:bg-[#F3F6FA] disabled:opacity-40"
                  >
                    Añadir Paso
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-[#146287]">
                    Arrastra las tarjetas o usa los botones de orden para definir los prerequisitos (Paso 1 → Paso 2 → Paso 3).
                  </p>

                  <ListaPasosRuta
                    secuenciaIds={secuenciaIds}
                    mapaCapacitaciones={mapaCapacitaciones}
                    bloqueada={estaActiva}
                    onMover={moverPaso}
                    onQuitar={quitarPaso}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={guardarSecuencia}
                    disabled={cargando || estaActiva}
                    className="rounded-xl bg-[#092A60] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#146287] disabled:opacity-50 transition-colors"
                  >
                    Guardar Secuencia
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      <PieCgb />
    </div>
  );
}
