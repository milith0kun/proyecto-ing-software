'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ItemCapacitacionPublica } from '@/lib/catalogo-publico';

// ---------------------------------------------------------------------------
// Constantes de Filtros del Catálogo
// ---------------------------------------------------------------------------
const UNIDADES = ['TODAS', 'CIIP', 'GEOMINA', 'BIOMEDIC', 'GENERAL'] as const;
const CATEGORIAS = ['TODAS', 'Estudiantes', 'Docentes', 'Inducción'] as const;

// ---------------------------------------------------------------------------
// Mapas de Estilo y Chips por Unidad Institucional
// ---------------------------------------------------------------------------
function obtenerClaseChipUnidad(unidad: string) {
  const mapa: Record<string, string> = {
    CIIP: 'chip-estado chip-estado--completado',
    GEOMINA: 'chip-estado chip-estado--en-curso',
    BIOMEDIC: 'chip-estado chip-estado--pendiente',
    GENERAL: 'chip-estado',
  };
  return mapa[unidad.toUpperCase()] ?? 'chip-estado';
}

// ---------------------------------------------------------------------------
// Iconos SVG Vectoriales Oficiales (Sin emojis)
// ---------------------------------------------------------------------------
function IconoBuscar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconoReloj() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconoDiapositivas() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function IconoFlechaDerecha() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function IconoVolver() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function IconoLimpiar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Componente Principal: Catálogo de Capacitaciones Públicas (HU-005)
// ---------------------------------------------------------------------------
export default function CatalogoPublicoPage() {
  const [capacitaciones, setCapacitaciones] = useState<ItemCapacitacionPublica[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtrosInicializados, setFiltrosInicializados] = useState(false);

  // Filtros reactivos
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<string>('TODAS');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('TODAS');
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const unidad = params.get('unidad')?.toUpperCase();
      const categoria = params.get('categoria');
      const busqueda = params.get('q');

      if (unidad && UNIDADES.includes(unidad as (typeof UNIDADES)[number])) {
        setUnidadSeleccionada(unidad);
      }
      if (categoria && CATEGORIAS.includes(categoria as (typeof CATEGORIAS)[number])) {
        setCategoriaSeleccionada(categoria);
      }
      if (busqueda) setTerminoBusqueda(busqueda);

      setFiltrosInicializados(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // Carga de datos desde el endpoint público
  const cargarCapacitaciones = useCallback(() => {
    setCargando(true);
    setError('');

    const params = new URLSearchParams();
    if (unidadSeleccionada !== 'TODAS') params.append('unidad', unidadSeleccionada);
    if (categoriaSeleccionada !== 'TODAS') params.append('categoria', categoriaSeleccionada);
    if (terminoBusqueda.trim()) params.append('q', terminoBusqueda.trim());

    const url = `/api/public/capacitaciones?${params.toString()}`;

    fetch(url)
      .then((res) => res.json())
      .then((datos) => {
        setCargando(false);
        if (datos.ok) {
          setCapacitaciones(datos.datos);
        } else {
          setError(datos.error || 'Error al cargar el catálogo de capacitaciones.');
        }
      })
      .catch(() => {
        setCargando(false);
        setError('No se pudo conectar con el servidor.');
      });
  }, [unidadSeleccionada, categoriaSeleccionada, terminoBusqueda]);

  useEffect(() => {
    if (!filtrosInicializados) return;

    const handler = setTimeout(() => {
      cargarCapacitaciones();
    }, 150); // Pequeño debounce para optimizar peticiones al escribir

    return () => clearTimeout(handler);
  }, [cargarCapacitaciones, filtrosInicializados]);

  // Función para resetear todos los filtros
  function limpiarFiltros() {
    setUnidadSeleccionada('TODAS');
    setCategoriaSeleccionada('TODAS');
    setTerminoBusqueda('');
  }

  // Comprobar si hay algún filtro activo
  const hayFiltrosActivos = useMemo(() => {
    return unidadSeleccionada !== 'TODAS' || categoriaSeleccionada !== 'TODAS' || terminoBusqueda.trim() !== '';
  }, [unidadSeleccionada, categoriaSeleccionada, terminoBusqueda]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>

      {/* ── 1. Encabezado Institucional Fijo ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--borde-sutil)',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
          height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo y Kicker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <div style={{ position: 'relative', height: '44px', width: '130px' }}>
                <Image
                  src="/logos/cgb-logo.png"
                  alt="CGB Academy"
                  fill
                  sizes="130px"
                  style={{ objectFit: 'contain', objectPosition: 'left' }}
                  priority
                />
              </div>
            </Link>
            <span style={{ height: '24px', width: '1px', backgroundColor: 'var(--borde-sutil)' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-navy)', fontFamily: 'var(--font-heading)' }}>
              Catálogo Abierto
            </span>
          </div>

          {/* Navegación y Botón Volver */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" className="boton-secundario text-xs" style={{ minHeight: '38px', padding: '8px 18px' }}>
              <IconoVolver />
              <span>Volver a Inicio</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* ── 2. Hero Section del Catálogo (#F9FAFB) ── */}
      <section style={{
        padding: '48px 24px 32px',
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--borde-divisor)',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: 'var(--radius-full)', backgroundColor: 'rgba(20, 98, 135, 0.08)', marginBottom: '16px' }}>
            <span className="kicker-cgb">Orientación Pública y Abierta</span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--brand-navy)', margin: '0 0 12px', lineHeight: 1.2 }}>
            Explora las Capacitaciones de <span style={{ color: 'var(--brand-blue)' }}>CGB Academy</span>
          </h1>

          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            Acceso libre para estudiantes, docentes y postulantes a las inducciones introductorias de CIIP, GEOMINA y BIOMEDIC. Consulta contenidos sin requerir inicio de sesión.
          </p>

          {/* ── Barra de Búsqueda Integrada ── */}
          <div style={{
            maxWidth: '640px', margin: '0 auto', position: 'relative',
            display: 'flex', alignItems: 'center',
          }}>
            <div style={{ position: 'absolute', left: '18px', color: 'var(--brand-blue)', display: 'flex', alignItems: 'center' }}>
              <IconoBuscar />
            </div>
            <input
              id="buscador-catalogo"
              type="text"
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              placeholder="Buscar por título, tema o unidad (ej: Minería, Investigación, Salud)..."
              className="campo-formulario"
              style={{
                width: '100%', height: '52px', paddingLeft: '48px', paddingRight: terminoBusqueda ? '44px' : '18px',
                fontSize: '14px', borderRadius: 'var(--radius-full)', backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(9, 42, 96, 0.06)',
              }}
            />
            {terminoBusqueda && (
              <button
                onClick={() => setTerminoBusqueda('')}
                style={{
                  position: 'absolute', right: '14px', background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--text-muted)', padding: '6px',
                }}
                title="Limpiar búsqueda"
              >
                <IconoLimpiar />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── 3. Panel de Filtros y Segmentación (CA-02) ── */}
      <section style={{
        backgroundColor: 'var(--bg-surface-alt)',
        padding: '24px',
        borderBottom: '1px solid var(--borde-divisor)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>

          {/* Selector de Unidades Institucionales */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--brand-navy)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '4px' }}>
              Unidad:
            </span>
            {UNIDADES.map((u) => {
              const estaActivo = unidadSeleccionada === u;
              return (
                <button
                  key={u}
                  onClick={() => setUnidadSeleccionada(u)}
                  style={{
                    padding: '6px 16px', borderRadius: 'var(--radius-full)',
                    fontSize: '12px', fontWeight: estaActivo ? 800 : 600,
                    fontFamily: 'var(--font-heading)',
                    border: estaActivo ? '1.5px solid var(--brand-navy)' : '1px solid var(--borde-sutil)',
                    backgroundColor: estaActivo ? 'var(--brand-navy)' : '#FFFFFF',
                    color: estaActivo ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all var(--dur-fast)',
                  }}
                >
                  {u}
                </button>
              );
            })}
          </div>

          {/* Selector de Categorías (Estudiantes, Docentes, Inducción) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--brand-navy)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '4px' }}>
              Público:
            </span>
            {CATEGORIAS.map((cat) => {
              const estaActivo = categoriaSeleccionada === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoriaSeleccionada(cat)}
                  style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-full)',
                    fontSize: '12px', fontWeight: estaActivo ? 800 : 600,
                    fontFamily: 'var(--font-heading)',
                    border: estaActivo ? '1.5px solid var(--brand-blue)' : '1px solid var(--borde-sutil)',
                    backgroundColor: estaActivo ? 'rgba(20, 98, 135, 0.12)' : '#FFFFFF',
                    color: estaActivo ? 'var(--brand-navy)' : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all var(--dur-fast)',
                  }}
                >
                  {cat}
                </button>
              );
            })}

            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '6px 12px', borderRadius: 'var(--radius-full)',
                  fontSize: '11px', fontWeight: 700, color: '#8B2020',
                  background: 'none', border: '1px dashed rgba(200, 50, 50, 0.35)',
                  cursor: 'pointer',
                }}
              >
                <IconoLimpiar />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── 4. Rejilla de Tarjetas de Capacitaciones Públicas (CA-01 y CA-02) ── */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', flex: 1, width: '100%' }}>

        {/* Mensaje de Error */}
        {error && (
          <div style={{
            marginBottom: '24px', padding: '16px 20px', borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(200, 50, 50, 0.08)', border: '1px solid rgba(200, 50, 50, 0.25)',
            color: '#8B2020', fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        {/* Estado de Carga */}
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '15px' }}>
              Cargando capacitaciones públicas...
            </p>
          </div>
        ) : capacitaciones.length === 0 ? (
          // Estado Vacío
          <div className="tarjeta-cgb" style={{ textAlign: 'center', padding: '60px 32px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ color: 'var(--brand-blue)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <IconoDiapositivas />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-navy)', marginBottom: '8px' }}>
              No se encontraron capacitaciones públicas
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.5 }}>
              {hayFiltrosActivos
                ? 'No hay contenidos que coincidan con los filtros seleccionados. Intenta restablecer los filtros para ver todo el catálogo.'
                : 'Actualmente no hay capacitaciones marcadas como públicas y publicadas.'}
            </p>
            {hayFiltrosActivos && (
              <button className="boton-primario" onClick={limpiarFiltros}>
                <span>Restablecer Filtros</span>
              </button>
            )}
          </div>
        ) : (
          // Rejilla de Capacitaciones
          <div>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                Mostrando <span className="cifra-tabular" style={{ fontWeight: 800, color: 'var(--brand-navy)' }}>{capacitaciones.length}</span> capacitación{capacitaciones.length !== 1 ? 'es' : ''} disponible{capacitaciones.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}>
              {capacitaciones.map((cap) => (
                <div
                  key={cap.id}
                  className="tarjeta-cgb"
                  style={{
                    display: 'flex', flexDirection: 'column',
                    transition: 'transform var(--dur-fast), box-shadow var(--dur-fast)',
                  }}
                >
                  {/* Fila superior: Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span className={obtenerClaseChipUnidad(cap.unidad)}>
                      {cap.unidad}
                    </span>
                    {cap.categoria && (
                      <span style={{
                        fontSize: '11px', fontWeight: 700, padding: '3px 10px',
                        borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-surface-alt)',
                        color: 'var(--brand-blue)', fontFamily: 'var(--font-heading)',
                      }}>
                        {cap.categoria}
                      </span>
                    )}
                  </div>

                  {/* Título y Descripción */}
                  <h3 style={{
                    fontSize: '18px', fontWeight: 800, color: 'var(--brand-navy)',
                    margin: '0 0 8px', lineHeight: 1.3,
                  }}>
                    {cap.titulo}
                  </h3>

                  <p style={{
                    fontSize: '13px', color: 'var(--text-secondary)',
                    margin: '0 0 20px', lineHeight: 1.6, flex: 1,
                  }}>
                    {cap.descripcion}
                  </p>

                  {/* Metadatos: Duración y Slides */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '12px 0', borderTop: '1px solid var(--borde-divisor)',
                    borderBottom: '1px solid var(--borde-divisor)',
                    marginBottom: '16px', fontSize: '12px', color: 'var(--text-muted)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IconoReloj />
                      <span className="cifra-tabular">{cap.duracionMin ?? 30} min</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IconoDiapositivas />
                      <span className="cifra-tabular">{cap.slidesCount ?? 0} slides</span>
                    </div>
                  </div>

                  {/* Botón de Acción (Preparado para HU-006) */}
                  <Link
                    href={`/capacitaciones/${cap.id}`}
                    className="boton-primario"
                    style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
                  >
                    <span>Ver Capacitación</span>
                    <IconoFlechaDerecha />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── 5. Pie de Página Institucional ── */}
      <footer style={{
        backgroundColor: 'var(--brand-navy-hondo)',
        color: '#FFFFFF',
        padding: '32px 24px',
        marginTop: 'auto',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
        }}>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', fontFamily: 'var(--font-heading)' }}>
              CGB Academy — Centro de Capacitación e Inducción
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'rgba(255, 255, 255, 0.72)' }}>
              Universidad Nacional de San Antonio Abad del Cusco (UNSAAC) | Semestre 2026-I
            </p>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255, 255, 255, 0.60)' }}>
            CIIP LATAM • GEOMINA LATAM • BIOMEDIC LATAM
          </p>
        </div>
      </footer>
    </div>
  );
}
