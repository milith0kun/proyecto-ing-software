'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CabeceraAdminCgb } from '@/components/institucional/CabeceraAdminCgb';
import { PieCgb } from '@/components/institucional/PieCgb';
import { moverPasoSecuencia } from '@/lib/rutas-onboarding';

interface PuestoItem {
  id: string;
  nombre: string;
  areaId: string;
}

interface AreaItem {
  id: string;
  nombre: string;
  puestos: PuestoItem[];
}

interface CapacitacionItem {
  id: string;
  titulo: string;
  unidad: string;
  duracionMin: number | null;
}

interface PasoItem {
  id: string;
  rutaId: string;
  capacitacionId: string;
  orden: number;
  obligatorio: boolean;
  capacitacionTitulo?: string;
}

interface RutaItem {
  id: string;
  titulo: string;
  objetivo: string;
  estado: string;
  areaId: string;
  puestoId: string | null;
  activadaEn: string | null;
  pasos: PasoItem[];
}

interface PropsConstructorRutas {
  areas: AreaItem[];
  capacitaciones: CapacitacionItem[];
  rutasIniciales: RutaItem[];
}

export default function ConstructorRutas({
  areas,
  capacitaciones,
  rutasIniciales,
}: PropsConstructorRutas) {
  const [rutas, setRutas] = useState<RutaItem[]>(rutasIniciales);
  const [rutaSeleccionadaId, setRutaSeleccionadaId] = useState<string>(rutasIniciales[0]?.id ?? '');
  const [titulo, setTitulo] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [areaId, setAreaId] = useState(areas[0]?.id ?? '');
  const [puestoId, setPuestoId] = useState('');
  const [secuenciaIds, setSecuenciaIds] = useState<string[]>(
    rutasIniciales[0]?.pasos.map(p => p.capacitacionId) ?? [],
  );
  const [indiceArrastrado, setIndiceArrastrado] = useState<number | null>(null);
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

  function seleccionarRuta(ruta: RutaItem) {
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
      const resp = await fetch('/api/rutas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, objetivo, areaId, puestoId: puestoId || null }),
      });
      const json = await resp.json();
      if (!resp.ok || !json.ok) {
        setError(json.error || 'No se pudo crear la ruta.');
        return;
      }
      const nueva: RutaItem = json.datos;
      setRutas(prev => [nueva, ...prev]);
      seleccionarRuta(nueva);
      setTitulo('');
      setObjetivo('');
      setPuestoId('');
      setMensaje('Ruta creada en borrador. Añade y ordena sus capacitaciones.');
    } catch {
      setError('Error de conexión al crear la ruta.');
    } finally {
      setCargando(false);
    }
  }

  function agregarPaso() {
    if (!capacitacionAgregarId || secuenciaIds.includes(capacitacionAgregarId)) return;
    setSecuenciaIds(prev => [...prev, capacitacionAgregarId]);
    setCapacitacionAgregarId('');
  }

  function quitarPaso(capId: string) {
    setSecuenciaIds(prev => prev.filter(id => id !== capId));
  }

  function moverPaso(origen: number, destino: number) {
    setSecuenciaIds(prev => moverPasoSecuencia(prev, origen, destino));
  }

  async function guardarSecuencia() {
    if (!rutaActiva) return;
    setCargando(true);
    setMensaje(null);
    setError(null);
    try {
      const resp = await fetch(`/api/rutas/${rutaActiva.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capacitacionIds: secuenciaIds }),
      });
      const json = await resp.json();
      if (!resp.ok || !json.ok) {
        setError(json.error || 'No se pudo guardar la secuencia.');
        return;
      }
      const actualizada: RutaItem = json.datos;
      setRutas(prev => prev.map(r => (r.id === actualizada.id ? actualizada : r)));
      setMensaje('Secuencia correlativa guardada correctamente.');
    } catch {
      setError('Error de conexión al guardar la secuencia.');
    } finally {
      setCargando(false);
    }
  }

  async function activarRutaActual() {
    if (!rutaActiva) return;
    setCargando(true);
    setMensaje(null);
    setError(null);
    try {
      const resp = await fetch(`/api/rutas/${rutaActiva.id}/activar`, { method: 'POST' });
      const json = await resp.json();
      if (!resp.ok || !json.ok) {
        setError(json.error || 'No se pudo activar la ruta.');
        return;
      }
      const activada: RutaItem = json.datos;
      setRutas(prev => prev.map(r => (r.id === activada.id ? activada : r)));
      setMensaje('Ruta activada y disponible para asignación a colaboradores.');
    } catch {
      setError('Error de conexión al activar la ruta.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#092A60]">
      <CabeceraAdminCgb>
        <nav className="flex items-center gap-3 text-sm font-medium">
          <Link
            href="/admin/capacitaciones"
            className="px-3 py-1.5 rounded-lg border border-[#D8E2EE] text-[#092A60] hover:bg-[#F3F6FA]"
          >
            Capacitaciones
          </Link>
          <span className="px-3 py-1.5 rounded-lg bg-[#092A60] text-white">
            Rutas de Onboarding
          </span>
        </nav>
      </CabeceraAdminCgb>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#092A60]">Constructor de Rutas de Onboarding</h1>
            <p className="text-sm text-[#146287]">
              Estructura itinerarios correlativos por área y puesto de trabajo (HU-008).
            </p>
          </div>
        </div>

        {(mensaje || error) && (
          <div
            role="status"
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
          <section className="lg:col-span-5 space-y-6">
            <form
              onSubmit={manejarCrearRuta}
              className="bg-white rounded-2xl border border-[#D8E2EE] p-5 space-y-4 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-[#092A60]">Nueva ruta en borrador</h2>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#146287] mb-1">
                  Título de la ruta
                </label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  placeholder="Ej. Onboarding Backend Node.js"
                  className="w-full rounded-lg border border-[#D8E2EE] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4DC4D3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-[#146287] mb-1">
                  Objetivo formativo
                </label>
                <textarea
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
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#146287] mb-1">
                    Área
                  </label>
                  <select
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
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[#146287] mb-1">
                    Puesto (opcional)
                  </label>
                  <select
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
                <ul className="space-y-2">
                  {rutas.map(ruta => (
                    <li key={ruta.id}>
                      <button
                        type="button"
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

          <section className="lg:col-span-7 bg-white rounded-2xl border border-[#D8E2EE] p-5 space-y-5 shadow-sm">
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
                    disabled={cargando || rutaActiva.pasos.length === 0 || rutaActiva.estado === 'ACTIVA'}
                    className="rounded-xl bg-[#4DC4D3] text-[#092A60] px-4 py-2 text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-opacity"
                  >
                    {rutaActiva.estado === 'ACTIVA' ? 'Ruta Activa' : 'Activar Ruta'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={capacitacionAgregarId}
                    onChange={e => setCapacitacionAgregarId(e.target.value)}
                    className="flex-1 min-w-[220px] rounded-lg border border-[#D8E2EE] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4DC4D3]"
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
                    disabled={!capacitacionAgregarId}
                    className="rounded-xl border border-[#092A60] text-[#092A60] px-4 py-2 text-sm font-semibold hover:bg-[#F3F6FA] disabled:opacity-40"
                  >
                    Añadir Paso
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-[#146287]">
                    Arrastra las tarjetas o usa los botones de orden para definir los prerequisitos (Paso 1 → Paso 2 → Paso 3).
                  </p>

                  {secuenciaIds.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#D8E2EE] bg-[#F9FAFB] p-6 text-center text-sm text-[#146287]">
                      Esta ruta aún no tiene capacitaciones asignadas.
                    </div>
                  ) : (
                    <ol className="space-y-2">
                      {secuenciaIds.map((capId, indice) => {
                        const info = mapaCapacitaciones.get(capId);
                        return (
                          <li
                            key={capId}
                            draggable
                            onDragStart={() => setIndiceArrastrado(indice)}
                            onDragOver={e => e.preventDefault()}
                            onDrop={() => {
                              if (indiceArrastrado !== null) {
                                moverPaso(indiceArrastrado, indice);
                                setIndiceArrastrado(null);
                              }
                            }}
                            className="flex items-center justify-between gap-3 rounded-xl border border-[#D8E2EE] bg-[#F3F6FA] px-4 py-3 cursor-grab active:cursor-grabbing"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#146287"
                                strokeWidth="2"
                                aria-hidden="true"
                              >
                                <circle cx="9" cy="6" r="1" />
                                <circle cx="9" cy="12" r="1" />
                                <circle cx="9" cy="18" r="1" />
                                <circle cx="15" cy="6" r="1" />
                                <circle cx="15" cy="12" r="1" />
                                <circle cx="15" cy="18" r="1" />
                              </svg>
                              <span className="inline-flex items-center justify-center rounded-lg bg-[#092A60] text-white text-xs font-bold px-2.5 py-1">
                                Paso {indice + 1}
                              </span>
                              <span className="font-medium text-sm text-[#092A60] truncate">
                                {info?.titulo || capId}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => moverPaso(indice, indice - 1)}
                                disabled={indice === 0}
                                aria-label="Subir paso"
                                className="rounded-lg border border-[#D8E2EE] bg-white px-2.5 py-1 text-xs font-semibold text-[#092A60] hover:bg-[#F9FAFB] disabled:opacity-40"
                              >
                                Subir
                              </button>
                              <button
                                type="button"
                                onClick={() => moverPaso(indice, indice + 1)}
                                disabled={indice === secuenciaIds.length - 1}
                                aria-label="Bajar paso"
                                className="rounded-lg border border-[#D8E2EE] bg-white px-2.5 py-1 text-xs font-semibold text-[#092A60] hover:bg-[#F9FAFB] disabled:opacity-40"
                              >
                                Bajar
                              </button>
                              <button
                                type="button"
                                onClick={() => quitarPaso(capId)}
                                className="rounded-lg border border-[#FECACA] bg-white px-2.5 py-1 text-xs font-semibold text-[#991B1B] hover:bg-[#FEF2F2]"
                              >
                                Quitar
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={guardarSecuencia}
                    disabled={cargando}
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
