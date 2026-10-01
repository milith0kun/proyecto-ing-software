'use client';

import { useState, useEffect, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Tipos de datos para la interfaz (HU-002)
// ---------------------------------------------------------------------------
interface Capacitacion {
  id: string;
  titulo: string;
  descripcion: string;
  unidad: string;
  ambito: string;
  estado: string;
  categoria: string;
  duracionMin: number;
  icono: string;
  _count?: { slides: number };
  createdAt: string;
}

interface FormularioData {
  titulo: string;
  descripcion: string;
  unidad: string;
  ambito: string;
  categoria: string;
  duracionMin: string;
}

const UNIDADES = ['CIIP', 'GEOMINA', 'BIOMEDIC', 'GENERAL'];
const AMBITOS = ['PUBLICO', 'INTERNO'];

const FORMULARIO_INICIAL: FormularioData = {
  titulo: '',
  descripcion: '',
  unidad: 'CIIP',
  ambito: 'PUBLICO',
  categoria: 'Inducción',
  duracionMin: '30',
};

// ---------------------------------------------------------------------------
// Mapa de colores por unidad institucional
// ---------------------------------------------------------------------------
function chipUnidad(unidad: string) {
  const mapa: Record<string, string> = {
    CIIP: 'chip-estado chip-estado--completado',
    GEOMINA: 'chip-estado chip-estado--en-curso',
    BIOMEDIC: 'chip-estado chip-estado--pendiente',
    GENERAL: 'chip-estado',
  };
  return mapa[unidad] ?? 'chip-estado';
}

function chipEstado(estado: string) {
  return estado === 'PUBLICADA'
    ? 'chip-estado chip-estado--completado'
    : 'chip-estado chip-estado--pendiente';
}

// ---------------------------------------------------------------------------
// Iconos SVG inline (sin emojis — norma del Manual de Marca)
// ---------------------------------------------------------------------------
function IconoMas() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconoEditar() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconoEliminar() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function IconoCerrar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconoLibro() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Componente principal: Panel de Gestión de Capacitaciones (HU-002)
// ---------------------------------------------------------------------------
export default function PanelCapacitaciones() {
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [formulario, setFormulario] = useState<FormularioData>(FORMULARIO_INICIAL);
  const [erroresFormulario, setErroresFormulario] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  // ── Carga de capacitaciones desde la API (GET /api/capacitaciones) ──
  const cargarCapacitaciones = useCallback(() => {
    fetch('/api/capacitaciones')
      .then((r) => r.json())
      .then((datos) => {
        setCargando(false);
        if (datos.ok) {
          setCapacitaciones(datos.datos);
        } else {
          setError('No se pudieron cargar las capacitaciones.');
        }
      })
      .catch(() => {
        setCargando(false);
        setError('Error de conexión con el servidor.');
      });
  }, []);

  // Carga inicial al montar el componente
  useEffect(() => {
    const timer = setTimeout(() => {
      setCargando(true);
      setError('');
      cargarCapacitaciones();
    }, 0);
    return () => clearTimeout(timer);
  }, [cargarCapacitaciones]);

  // ── Apertura del formulario en modo CREAR ──
  function abrirModalCrear() {
    setEditandoId(null);
    setFormulario(FORMULARIO_INICIAL);
    setErroresFormulario({});
    setMensajeExito('');
    setModalAbierto(true);
  }

  // ── Apertura del formulario en modo EDITAR (CA-02) ──
  function abrirModalEditar(cap: Capacitacion) {
    setEditandoId(cap.id);
    setFormulario({
      titulo: cap.titulo,
      descripcion: cap.descripcion,
      unidad: cap.unidad,
      ambito: cap.ambito,
      categoria: cap.categoria,
      duracionMin: String(cap.duracionMin),
    });
    setErroresFormulario({});
    setMensajeExito('');
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setEditandoId(null);
    setErroresFormulario({});
  }

  // ── Actualización de campos del formulario ──
  function actualizarCampo(campo: keyof FormularioData, valor: string) {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
    if (erroresFormulario[campo]) {
      setErroresFormulario((prev) => {
        const nuevo = { ...prev };
        delete nuevo[campo];
        return nuevo;
      });
    }
  }

  // ── Envío del formulario: CREAR o EDITAR (CA-01 y CA-02) ──
  async function enviarFormulario(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setErroresFormulario({});

    const url = editandoId ? `/api/capacitaciones/${editandoId}` : '/api/capacitaciones';
    const metodo = editandoId ? 'PUT' : 'POST';

    try {
      const respuesta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formulario, duracionMin: Number(formulario.duracionMin) }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        // Mostrar errores de validación del servidor en los campos del formulario
        if (datos.detalles) {
          setErroresFormulario(datos.detalles);
        } else {
          setError(datos.error ?? 'Error al guardar.');
        }
        return;
      }

      setMensajeExito(editandoId ? 'Capacitación actualizada.' : 'Capacitación creada correctamente.');
      cerrarModal();
      await cargarCapacitaciones();
    } catch {
      setError('Error de conexión al guardar.');
    } finally {
      setGuardando(false);
    }
  }

  // ── Eliminación de una capacitación ──
  async function eliminarCapacitacion(id: string, titulo: string) {
    if (!confirm(`¿Eliminar la capacitación "${titulo}"? Esta acción no se puede deshacer.`)) return;

    try {
      const respuesta = await fetch(`/api/capacitaciones/${id}`, { method: 'DELETE' });
      const datos = await respuesta.json();
      if (datos.ok) {
        setMensajeExito('Capacitación eliminada.');
        await cargarCapacitaciones();
      } else {
        setError(datos.error ?? 'Error al eliminar.');
      }
    } catch {
      setError('Error de conexión al eliminar.');
    }
  }

  // ---------------------------------------------------------------------------
  // Renderizado
  // ---------------------------------------------------------------------------
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', padding: '0' }}>

      {/* ── Cabecera del panel ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        backgroundColor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--borde-sutil)',
        padding: '0 32px',
        height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: 'var(--brand-cyan)' }}><IconoLibro /></div>
          <div>
            <p className="kicker-cgb" style={{ marginBottom: '2px' }}>Gestión de Contenidos</p>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-navy)', margin: 0 }}>
              Panel de Capacitaciones
            </h1>
          </div>
        </div>
        <button className="boton-primario" onClick={abrirModalCrear} style={{ gap: '8px' }}>
          <IconoMas />
          <span>Nueva Capacitación</span>
        </button>
      </header>

      {/* ── Área de contenido ── */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px' }}>

        {/* Mensaje de éxito */}
        {mensajeExito && (
          <div style={{
            marginBottom: '20px', padding: '14px 20px', borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(77, 196, 211, 0.12)',
            border: '1px solid rgba(77, 196, 211, 0.40)',
            color: 'var(--brand-navy)', fontSize: '14px', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span className="indicador-operativo" />
            {mensajeExito}
          </div>
        )}

        {/* Mensaje de error global */}
        {error && (
          <div style={{
            marginBottom: '20px', padding: '14px 20px', borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(200, 50, 50, 0.08)',
            border: '1px solid rgba(200, 50, 50, 0.25)',
            color: '#8B2020', fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        {/* Estado de carga */}
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>Cargando capacitaciones...</p>
          </div>
        ) : capacitaciones.length === 0 ? (
          // Estado vacío
          <div className="tarjeta-cgb" style={{ textAlign: 'center', padding: '60px 32px' }}>
            <div style={{ color: 'var(--brand-cyan)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <IconoLibro />
            </div>
            <h2 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--brand-navy)' }}>
              Sin capacitaciones aún
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
              Crea la primera capacitación para comenzar a estructurar el contenido de inducción.
            </p>
            <button className="boton-primario" onClick={abrirModalCrear}>
              <IconoMas />
              <span>Crear primera capacitación</span>
            </button>
          </div>
        ) : (
          // ── Tabla de capacitaciones ──
          <div className="tarjeta-cgb" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Encabezado de tabla */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--borde-divisor)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <p className="kicker-cgb" style={{ marginBottom: '2px' }}>Contenido disponible</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                  {capacitaciones.length} capacitación{capacitaciones.length !== 1 ? 'es' : ''} registradas
                </p>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-surface-alt)' }}>
                    {['Título', 'Unidad', 'Ámbito', 'Estado', 'Slides', 'Duración', 'Acciones'].map((col) => (
                      <th key={col} style={{
                        padding: '12px 20px', textAlign: 'left',
                        fontFamily: 'var(--font-heading)', fontSize: '11px',
                        fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em',
                        color: 'var(--text-muted)', borderBottom: '1px solid var(--borde-divisor)',
                      }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {capacitaciones.map((cap, idx) => (
                    <tr key={cap.id} style={{
                      backgroundColor: idx % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-primary)',
                      transition: 'background-color var(--dur-micro)',
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(77, 196, 211, 0.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-primary)')}
                    >
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid var(--borde-divisor)' }}>
                        <p style={{ fontWeight: 700, color: 'var(--brand-navy)', margin: 0, fontSize: '14px' }}>
                          {cap.titulo}
                        </p>
                        <p style={{ color: 'var(--text-muted)', margin: '2px 0 0', fontSize: '12px' }}>
                          {cap.descripcion.length > 60 ? cap.descripcion.slice(0, 60) + '…' : cap.descripcion}
                        </p>
                      </td>
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid var(--borde-divisor)' }}>
                        <span className={chipUnidad(cap.unidad)}>{cap.unidad}</span>
                      </td>
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid var(--borde-divisor)' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {cap.ambito === 'PUBLICO' ? 'Público' : 'Interno'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid var(--borde-divisor)' }}>
                        <span className={chipEstado(cap.estado)}>
                          {cap.estado === 'PUBLICADA' ? 'Publicada' : 'Borrador'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid var(--borde-divisor)', textAlign: 'center' }}>
                        <span className="cifra-tabular" style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {cap._count?.slides ?? 0}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid var(--borde-divisor)' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          {cap.duracionMin} min
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', borderBottom: '1px solid var(--borde-divisor)' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => abrirModalEditar(cap)}
                            title="Editar capacitación"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              padding: '7px 14px', borderRadius: 'var(--radius-full)',
                              border: '1.5px solid rgba(9, 42, 96, 0.20)',
                              backgroundColor: 'transparent', color: 'var(--brand-navy)',
                              fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-heading)',
                              cursor: 'pointer', transition: 'all var(--dur-fast)',
                              textTransform: 'uppercase', letterSpacing: '0.04em',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--brand-navy)'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--brand-navy)'; }}
                          >
                            <IconoEditar /> Editar
                          </button>
                          <button
                            onClick={() => eliminarCapacitacion(cap.id, cap.titulo)}
                            title="Eliminar capacitación"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              padding: '7px 14px', borderRadius: 'var(--radius-full)',
                              border: '1.5px solid rgba(200, 50, 50, 0.25)',
                              backgroundColor: 'transparent', color: '#8B2020',
                              fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-heading)',
                              cursor: 'pointer', transition: 'all var(--dur-fast)',
                              textTransform: 'uppercase', letterSpacing: '0.04em',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#8B2020'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8B2020'; }}
                          >
                            <IconoEliminar /> Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ── Modal: Formulario de Creación / Edición (CA-01 y CA-02) ── */}
      {modalAbierto && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          backgroundColor: 'rgba(9, 42, 96, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px',
        }}>
          <div className="tarjeta-cgb" style={{
            width: '100%', maxWidth: '560px',
            maxHeight: '90vh', overflowY: 'auto',
            padding: '32px', boxShadow: 'var(--sombra-elevada)',
          }}>
            {/* Cabecera del modal */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <p className="kicker-cgb" style={{ marginBottom: '4px' }}>
                  {editandoId ? 'Editar contenido' : 'Nuevo contenido'}
                </p>
                <h2 style={{ margin: 0, fontSize: '22px', color: 'var(--brand-navy)' }}>
                  {editandoId ? 'Editar capacitación' : 'Crear capacitación'}
                </h2>
              </div>
              <button
                onClick={cerrarModal}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', padding: '4px',
                  borderRadius: 'var(--radius-sm)', transition: 'color var(--dur-fast)',
                }}
              >
                <IconoCerrar />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={enviarFormulario} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Campo: Título */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Título *
                </label>
                <input
                  id="campo-titulo"
                  type="text"
                  className="campo-formulario"
                  value={formulario.titulo}
                  onChange={(e) => actualizarCampo('titulo', e.target.value)}
                  placeholder="Ej: Inducción General CIIP 2026"
                  maxLength={120}
                />
                {erroresFormulario.titulo && (
                  <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#8B2020' }}>{erroresFormulario.titulo}</p>
                )}
              </div>

              {/* Campo: Descripción */}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Descripción *
                </label>
                <textarea
                  id="campo-descripcion"
                  className="campo-formulario"
                  value={formulario.descripcion}
                  onChange={(e) => actualizarCampo('descripcion', e.target.value)}
                  placeholder="Resumen breve del contenido y objetivo de la capacitación"
                  rows={3}
                  style={{ height: 'auto', padding: '12px 16px', resize: 'vertical' }}
                />
                {erroresFormulario.descripcion && (
                  <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#8B2020' }}>{erroresFormulario.descripcion}</p>
                )}
              </div>

              {/* Fila: Unidad + Ámbito */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Unidad *
                  </label>
                  <select
                    id="campo-unidad"
                    className="campo-formulario"
                    value={formulario.unidad}
                    onChange={(e) => actualizarCampo('unidad', e.target.value)}
                    style={{ cursor: 'pointer' }}
                  >
                    {UNIDADES.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                  {erroresFormulario.unidad && (
                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#8B2020' }}>{erroresFormulario.unidad}</p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Ámbito *
                  </label>
                  <select
                    id="campo-ambito"
                    className="campo-formulario"
                    value={formulario.ambito}
                    onChange={(e) => actualizarCampo('ambito', e.target.value)}
                    style={{ cursor: 'pointer' }}
                  >
                    {AMBITOS.map((a) => (
                      <option key={a} value={a}>{a === 'PUBLICO' ? 'Público' : 'Interno'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fila: Categoría + Duración */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Categoría
                  </label>
                  <input
                    id="campo-categoria"
                    type="text"
                    className="campo-formulario"
                    value={formulario.categoria}
                    onChange={(e) => actualizarCampo('categoria', e.target.value)}
                    placeholder="Inducción"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--brand-navy)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Duración (min)
                  </label>
                  <input
                    id="campo-duracion"
                    type="number"
                    className="campo-formulario cifra-tabular"
                    value={formulario.duracionMin}
                    onChange={(e) => actualizarCampo('duracionMin', e.target.value)}
                    min={1}
                    max={480}
                    placeholder="30"
                  />
                </div>
              </div>

              {/* Botones de acción del formulario */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" className="boton-secundario" onClick={cerrarModal} style={{ minHeight: '42px', padding: '10px 22px' }}>
                  Cancelar
                </button>
                <button type="submit" className="boton-primario" disabled={guardando} style={{ minHeight: '42px', padding: '10px 22px' }}>
                  {guardando ? 'Guardando...' : editandoId ? 'Guardar cambios' : 'Crear capacitación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
