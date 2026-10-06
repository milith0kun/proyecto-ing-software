'use client';

import Link from 'next/link';
import { CabeceraAdminCgb } from '@/components/institucional/CabeceraAdminCgb';
import { PieCgb } from '@/components/institucional/PieCgb';
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { validarCapacitacion } from '@/lib/validaciones-capacitacion';

interface Capacitacion {
  id: string;
  titulo: string;
  descripcion: string;
  unidad: string;
  ambito: string;
  estado: string;
  categoria: string | null;
  duracionMin: number | null;
  icono: string | null;
  _count?: { slides: number };
  createdAt: string;
}

interface FormularioData {
  titulo: string;
  descripcion: string;
  unidad: string;
  ambito: string;
  estado: string;
  categoria: string;
  duracionMin: string;
}

const FORMULARIO_INICIAL: FormularioData = {
  titulo: '',
  descripcion: '',
  unidad: 'CIIP',
  ambito: 'PUBLICO',
  estado: 'BORRADOR',
  categoria: 'Inducción',
  duracionMin: '30',
};

const UNIDADES = ['CIIP', 'GEOMINA', 'BIOMEDIC', 'GENERAL'];

function Icono({ nombre, size = 18 }: { nombre: string; size?: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };

  if (nombre === 'plus') return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>;
  if (nombre === 'search') return <svg {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
  if (nombre === 'edit') return <svg {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></svg>;
  if (nombre === 'trash') return <svg {...props}><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" /></svg>;
  if (nombre === 'book') return <svg {...props}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z" /><path d="M4 5.5V22m5-14h7m-7 4h7" /></svg>;
  if (nombre === 'layers') return <svg {...props}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></svg>;
  if (nombre === 'clock') return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
  if (nombre === 'arrow') return <svg {...props}><path d="M5 12h14m-7-7 7 7-7 7" /></svg>;
  if (nombre === 'close') return <svg {...props}><path d="m18 6-12 12M6 6l12 12" /></svg>;
  if (nombre === 'check') return <svg {...props}><path d="m5 12 4 4L19 6" /></svg>;
  return <svg {...props}><circle cx="12" cy="12" r="9" /></svg>;
}

function claseUnidad(unidad: string) {
  if (unidad === 'GEOMINA') return 'chip-estado chip-estado--en-curso';
  if (unidad === 'BIOMEDIC') return 'chip-estado chip-estado--pendiente';
  if (unidad === 'CIIP') return 'chip-estado chip-estado--completado';
  return 'chip-estado chip-estado--general';
}

function Estado({ estado }: { estado: string }) {
  const publicada = estado === 'PUBLICADA';
  return (
    <span className={'chip-estado ' + (publicada ? 'chip-estado--completado' : 'chip-estado--pendiente')}>
      <span className="chip-estado__punto" />
      {publicada ? 'Publicada' : 'Borrador'}
    </span>
  );
}

function ErrorCampo({ children, id }: { children?: string; id: string }) {
  if (!children) return null;
  return <p className="campo-error" id={id} role="alert">{children}</p>;
}

export default function PanelCapacitaciones() {
  const router = useRouter();
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroUnidad, setFiltroUnidad] = useState('TODAS');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [formulario, setFormulario] = useState<FormularioData>(FORMULARIO_INICIAL);
  const [erroresFormulario, setErroresFormulario] = useState<Record<string, string>>({});
  const [objetivoEliminacion, setObjetivoEliminacion] = useState<Capacitacion | null>(null);

  const cargarCapacitaciones = useCallback(async () => {
    try {
      const respuesta = await fetch('/api/capacitaciones', { cache: 'no-store' });
      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ok) throw new Error(resultado.error || 'No se pudo cargar el contenido.');
      setError('');
      setCapacitaciones(resultado.datos);
    } catch (errorCarga) {
      setError(errorCarga instanceof Error ? errorCarga.message : 'Error de conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const solicitud = window.setTimeout(() => { void cargarCapacitaciones(); }, 0);
    return () => window.clearTimeout(solicitud);
  }, [cargarCapacitaciones]);

  useEffect(() => {
    if (!modalAbierto && !objetivoEliminacion) return;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !guardando) {
        setModalAbierto(false);
        setObjetivoEliminacion(null);
      }
    };
    window.addEventListener('keydown', cerrarConEscape);
    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener('keydown', cerrarConEscape);
    };
  }, [modalAbierto, objetivoEliminacion, guardando]);

  const resumen = useMemo(() => ({
    total: capacitaciones.length,
    borradores: capacitaciones.filter((item) => item.estado !== 'PUBLICADA').length,
    publicadas: capacitaciones.filter((item) => item.estado === 'PUBLICADA').length,
  }), [capacitaciones]);

  const capacitacionesFiltradas = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase('es');
    return capacitaciones.filter((item) => {
      const coincideTexto = !consulta || (item.titulo + ' ' + item.descripcion).toLocaleLowerCase('es').includes(consulta);
      const coincideUnidad = filtroUnidad === 'TODAS' || item.unidad === filtroUnidad;
      const coincideEstado = filtroEstado === 'TODOS' || item.estado === filtroEstado;
      return coincideTexto && coincideUnidad && coincideEstado;
    });
  }, [busqueda, capacitaciones, filtroEstado, filtroUnidad]);

  function abrirCrear() {
    setEditandoId(null);
    setFormulario(FORMULARIO_INICIAL);
    setErroresFormulario({});
    setError('');
    setModalAbierto(true);
  }

  function abrirEditar(capacitacion: Capacitacion) {
    setEditandoId(capacitacion.id);
    setFormulario({
      titulo: capacitacion.titulo,
      descripcion: capacitacion.descripcion,
      unidad: capacitacion.unidad,
      ambito: capacitacion.ambito,
      estado: capacitacion.estado,
      categoria: capacitacion.categoria || 'Inducción',
      duracionMin: String(capacitacion.duracionMin || 30),
    });
    setErroresFormulario({});
    setError('');
    setModalAbierto(true);
  }

  function actualizarCampo(campo: keyof FormularioData, valor: string) {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
    setErroresFormulario((anterior) => {
      if (!(campo in anterior)) return anterior;
      const actualizado = { ...anterior };
      delete actualizado[campo];
      return actualizado;
    });
  }

  async function enviarFormulario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const datos = { ...formulario, duracionMin: Number(formulario.duracionMin) };
    const validacion = validarCapacitacion(datos);
    if (!validacion.valido) {
      setErroresFormulario(validacion.errores);
      return;
    }

    setGuardando(true);
    setErroresFormulario({});
    setError('');
    try {
      const respuesta = await fetch(editandoId ? '/api/capacitaciones/' + editandoId : '/api/capacitaciones', {
        method: editandoId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ok) {
        if (resultado.detalles) setErroresFormulario(resultado.detalles);
        else setError(resultado.error || 'No se pudieron guardar los cambios.');
        return;
      }

      setModalAbierto(false);
      if (!editandoId && resultado.datos?.id) {
        router.push('/admin/capacitaciones/' + resultado.datos.id + '/contenido');
        return;
      }

      setMensajeExito('Los datos de la capacitación se actualizaron correctamente.');
      await cargarCapacitaciones();
    } catch {
      setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarCapacitacion() {
    if (!objetivoEliminacion) return;
    setGuardando(true);
    setError('');
    try {
      const respuesta = await fetch('/api/capacitaciones/' + objetivoEliminacion.id, { method: 'DELETE' });
      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ok) throw new Error(resultado.error || 'No se pudo eliminar la capacitación.');
      setObjetivoEliminacion(null);
      setMensajeExito('La capacitación se eliminó correctamente.');
      await cargarCapacitaciones();
    } catch (errorEliminacion) {
      setError(errorEliminacion instanceof Error ? errorEliminacion.message : 'No se pudo eliminar la capacitación.');
      setObjetivoEliminacion(null);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="admin-shell">
      <CabeceraAdminCgb>
        <div className="admin-header__context">
          <span className="indicador-operativo" />
          <span>Administración de contenidos</span>
        </div>
      </CabeceraAdminCgb>

      <main className="admin-main">
        <section className="admin-hero" aria-labelledby="titulo-panel">
          <div className="admin-hero__copy">
            <p className="kicker-cgb">Gestión académica · CGB Academy</p>
            <h1 id="titulo-panel">Capacitaciones</h1>
            <p className="admin-hero__description">
              Organiza la información de tus programas y continúa con la creación de sus contenidos.
            </p>
          </div>
          <button type="button" className="boton-primario" onClick={abrirCrear}>
            <Icono nombre="plus" />
            <span>Nueva capacitación</span>
          </button>
        </section>

        {mensajeExito && (
          <div className="admin-alerta admin-alerta--exito" role="status">
            <span className="admin-alerta__icono"><Icono nombre="check" /></span>
            <span>{mensajeExito}</span>
            <button type="button" className="admin-alerta__cerrar" onClick={() => setMensajeExito('')} aria-label="Cerrar mensaje">
              <Icono nombre="close" size={16} />
            </button>
          </div>
        )}

        {error && (
          <div className="admin-alerta admin-alerta--error" role="alert">
            <strong>No se pudo completar la acción.</strong>
            <span>{error}</span>
            <button type="button" className="boton-secundario boton-secundario--compacto" onClick={() => { setCargando(true); setError(''); void cargarCapacitaciones(); }}>
              Reintentar
            </button>
          </div>
        )}

        <section className="admin-resumen" aria-label="Resumen de capacitaciones">
          <article className="admin-metrica">
            <span className="admin-metrica__icono"><Icono nombre="book" size={20} /></span>
            <div><span className="admin-metrica__label">Total registradas</span><strong className="cifra-tabular">{resumen.total}</strong></div>
          </article>
          <article className="admin-metrica">
            <span className="admin-metrica__icono admin-metrica__icono--borrador"><Icono nombre="edit" size={20} /></span>
            <div><span className="admin-metrica__label">En preparación</span><strong className="cifra-tabular">{resumen.borradores}</strong></div>
          </article>
          <article className="admin-metrica">
            <span className="admin-metrica__icono admin-metrica__icono--publicada"><Icono nombre="check" size={20} /></span>
            <div><span className="admin-metrica__label">Publicadas</span><strong className="cifra-tabular">{resumen.publicadas}</strong></div>
          </article>
        </section>

        <section className="admin-panel" aria-labelledby="titulo-listado">
          <div className="admin-panel__heading">
            <div>
              <p className="kicker-cgb">Biblioteca de aprendizaje</p>
              <h2 id="titulo-listado">Contenido disponible</h2>
              <p>Administra la información general y abre cada capacitación para preparar sus slides.</p>
            </div>
            <span className="admin-panel__count cifra-tabular">
              {capacitacionesFiltradas.length} de {capacitaciones.length}
            </span>
          </div>

          <div className="admin-filtros" role="search" aria-label="Buscar y filtrar capacitaciones">
            <label className="admin-busqueda">
              <span className="admin-sr-only">Buscar por nombre o descripción</span>
              <Icono nombre="search" size={19} />
              <input
                type="search"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar una capacitación..."
                className="campo-formulario"
              />
            </label>
            <label className="admin-filtro">
              <span className="admin-sr-only">Filtrar por unidad</span>
              <select className="campo-formulario" value={filtroUnidad} onChange={(event) => setFiltroUnidad(event.target.value)}>
                <option value="TODAS">Todas las unidades</option>
                {UNIDADES.map((unidad) => <option key={unidad} value={unidad}>{unidad}</option>)}
              </select>
            </label>
            <label className="admin-filtro">
              <span className="admin-sr-only">Filtrar por estado</span>
              <select className="campo-formulario" value={filtroEstado} onChange={(event) => setFiltroEstado(event.target.value)}>
                <option value="TODOS">Todos los estados</option>
                <option value="BORRADOR">Borrador</option>
                <option value="PUBLICADA">Publicada</option>
              </select>
            </label>
          </div>

          {cargando ? (
            <div className="admin-carga" role="status" aria-live="polite">
              <span className="admin-carga__rueda" />
              <span>Cargando capacitaciones…</span>
            </div>
          ) : capacitaciones.length === 0 ? (
            <div className="admin-vacio">
              <span className="admin-vacio__icono"><Icono nombre="book" size={28} /></span>
              <p className="kicker-cgb">Empieza por el contenido</p>
              <h3>Aún no hay capacitaciones</h3>
              <p>Registra la primera capacitación y continúa con la estructura de sus slides.</p>
              <button type="button" className="boton-primario" onClick={abrirCrear}>
                <Icono nombre="plus" /><span>Crear primera capacitación</span>
              </button>
            </div>
          ) : capacitacionesFiltradas.length === 0 ? (
            <div className="admin-sin-resultados">
              <span className="admin-sin-resultados__icono"><Icono nombre="search" size={24} /></span>
              <div><strong>No hay resultados con estos filtros.</strong><span>Prueba con otro nombre o cambia la unidad y el estado.</span></div>
              <button type="button" className="boton-secundario boton-secundario--compacto" onClick={() => { setBusqueda(''); setFiltroUnidad('TODAS'); setFiltroEstado('TODOS'); }}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="admin-tabla-contenedor">
                <table className="admin-tabla">
                  <thead><tr><th scope="col">Capacitación</th><th scope="col">Unidad</th><th scope="col">Ámbito</th><th scope="col">Estado</th><th scope="col">Slides</th><th scope="col">Duración</th><th scope="col"><span className="admin-sr-only">Acciones</span></th></tr></thead>
                  <tbody>
                    {capacitacionesFiltradas.map((capacitacion) => (
                      <tr key={capacitacion.id}>
                        <td className="admin-tabla__nombre">
                          <strong>{capacitacion.titulo}</strong>
                          <span>{capacitacion.descripcion}</span>
                        </td>
                        <td><span className={claseUnidad(capacitacion.unidad)}>{capacitacion.unidad}</span></td>
                        <td>{capacitacion.ambito === 'INTERNO' ? 'Interno' : 'Público'}</td>
                        <td><Estado estado={capacitacion.estado} /></td>
                        <td><span className="admin-tabla__dato"><Icono nombre="layers" size={16} />{capacitacion._count?.slides ?? 0}</span></td>
                        <td><span className="admin-tabla__dato"><Icono nombre="clock" size={16} />{capacitacion.duracionMin ?? 30} min</span></td>
                        <td>
                          <div className="admin-acciones">
                            <Link className="boton-secundario boton-secundario--compacto" href={'/admin/capacitaciones/' + capacitacion.id + '/vista-previa'}>Vista previa</Link>
                            <Link className="boton-secundario boton-secundario--compacto" href={'/admin/capacitaciones/' + capacitacion.id + '/contenido'}>
                              <Icono nombre="layers" size={16} /><span>Contenido</span>
                            </Link>
                            <button type="button" className="boton-secundario boton-secundario--compacto" onClick={() => abrirEditar(capacitacion)}>
                              <Icono nombre="edit" size={16} /><span>Editar</span>
                            </button>
                            <button type="button" className="boton-peligro boton-peligro--compacto" onClick={() => setObjetivoEliminacion(capacitacion)} aria-label={'Eliminar ' + capacitacion.titulo}>
                              <Icono nombre="trash" size={16} /><span>Eliminar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-tarjetas-moviles">
                {capacitacionesFiltradas.map((capacitacion) => (
                  <article className="admin-capacitacion-card" key={capacitacion.id}>
                    <div className="admin-capacitacion-card__heading">
                      <span className={claseUnidad(capacitacion.unidad)}>{capacitacion.unidad}</span>
                      <Estado estado={capacitacion.estado} />
                    </div>
                    <h3>{capacitacion.titulo}</h3>
                    <p>{capacitacion.descripcion}</p>
                    <div className="admin-capacitacion-card__datos">
                      <span><Icono nombre="layers" size={16} />{capacitacion._count?.slides ?? 0} slides</span>
                      <span><Icono nombre="clock" size={16} />{capacitacion.duracionMin ?? 30} min</span>
                      <span>{capacitacion.ambito === 'INTERNO' ? 'Interno' : 'Público'}</span>
                    </div>
                    <div className="admin-capacitacion-card__acciones">
                      <Link className="boton-secundario boton-secundario--compacto" href={'/admin/capacitaciones/' + capacitacion.id + '/vista-previa'}>Vista previa</Link>
                      <Link className="boton-primario boton-primario--compacto" href={'/admin/capacitaciones/' + capacitacion.id + '/contenido'}>
                        <Icono nombre="layers" size={16} /><span>Continuar contenido</span>
                      </Link>
                      <button type="button" className="boton-secundario boton-secundario--compacto" onClick={() => abrirEditar(capacitacion)}>
                        <Icono nombre="edit" size={16} /><span>Editar</span>
                      </button>
                      <button type="button" className="boton-peligro boton-peligro--compacto" onClick={() => setObjetivoEliminacion(capacitacion)} aria-label={'Eliminar ' + capacitacion.titulo}>
                        <Icono nombre="trash" size={16} /><span>Eliminar</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      {modalAbierto && (
        <div className="admin-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !guardando) setModalAbierto(false); }}>
          <section className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="titulo-dialogo" aria-describedby="ayuda-dialogo">
            <div className="admin-dialog__encabezado">
              <div>
                <p className="kicker-cgb">{editandoId ? 'Datos generales' : 'Nueva capacitación'}</p>
                <h2 id="titulo-dialogo">{editandoId ? 'Editar capacitación' : 'Crea una capacitación'}</h2>
                <p id="ayuda-dialogo">Completa la información principal. Luego podrás preparar el contenido de sus slides.</p>
              </div>
              <button type="button" className="admin-dialog__cerrar" onClick={() => setModalAbierto(false)} disabled={guardando} aria-label="Cerrar formulario">
                <Icono nombre="close" />
              </button>
            </div>

            <form className="admin-formulario" onSubmit={enviarFormulario} noValidate>
              <div className="admin-campo admin-campo--ancho">
                <label htmlFor="cap-titulo">Título <span aria-hidden="true">*</span></label>
                <input id="cap-titulo" className="campo-formulario" type="text" autoFocus value={formulario.titulo} onChange={(event) => actualizarCampo('titulo', event.target.value)} placeholder="Ej. Inducción general CIIP" maxLength={120} aria-invalid={Boolean(erroresFormulario.titulo)} aria-describedby={erroresFormulario.titulo ? 'error-cap-titulo' : undefined} />
                <ErrorCampo id="error-cap-titulo">{erroresFormulario.titulo}</ErrorCampo>
              </div>

              <div className="admin-campo admin-campo--ancho">
                <label htmlFor="cap-descripcion">Descripción <span aria-hidden="true">*</span></label>
                <textarea id="cap-descripcion" className="campo-formulario campo-formulario--area" value={formulario.descripcion} onChange={(event) => actualizarCampo('descripcion', event.target.value)} placeholder="Resume el objetivo y el contenido de la capacitación" rows={4} maxLength={500} aria-invalid={Boolean(erroresFormulario.descripcion)} aria-describedby={erroresFormulario.descripcion ? 'error-cap-descripcion' : undefined} />
                <div className="admin-campo__ayuda"><span>Al menos 10 caracteres.</span><span className="cifra-tabular">{formulario.descripcion.length}/500</span></div>
                <ErrorCampo id="error-cap-descripcion">{erroresFormulario.descripcion}</ErrorCampo>
              </div>

              <div className="admin-campo">
                <label htmlFor="cap-unidad">Unidad <span aria-hidden="true">*</span></label>
                <select id="cap-unidad" className="campo-formulario" value={formulario.unidad} onChange={(event) => actualizarCampo('unidad', event.target.value)} aria-invalid={Boolean(erroresFormulario.unidad)} aria-describedby={erroresFormulario.unidad ? 'error-cap-unidad' : undefined}>
                  {UNIDADES.map((unidad) => <option key={unidad} value={unidad}>{unidad}</option>)}
                </select>
                <ErrorCampo id="error-cap-unidad">{erroresFormulario.unidad}</ErrorCampo>
              </div>

              <div className="admin-campo">
                <label htmlFor="cap-ambito">Ámbito</label>
                <select id="cap-ambito" className="campo-formulario" value={formulario.ambito} onChange={(event) => actualizarCampo('ambito', event.target.value)} aria-invalid={Boolean(erroresFormulario.ambito)} aria-describedby={erroresFormulario.ambito ? 'error-cap-ambito' : undefined}>
                  <option value="PUBLICO">Público</option>
                  <option value="INTERNO">Interno</option>
                </select>
                <ErrorCampo id="error-cap-ambito">{erroresFormulario.ambito}</ErrorCampo>
              </div>

              <div className="admin-campo">
                <span>Estado</span>
                <Estado estado={formulario.estado} />
                <p>La publicación se confirma desde Vista previa.</p>
              </div>

              <div className="admin-campo">
                <label htmlFor="cap-categoria">Categoría</label>
                <input id="cap-categoria" className="campo-formulario" type="text" value={formulario.categoria} onChange={(event) => actualizarCampo('categoria', event.target.value)} placeholder="Inducción" maxLength={60} aria-invalid={Boolean(erroresFormulario.categoria)} aria-describedby={erroresFormulario.categoria ? 'error-cap-categoria' : undefined} />
                <ErrorCampo id="error-cap-categoria">{erroresFormulario.categoria}</ErrorCampo>
              </div>

              <div className="admin-campo">
                <label htmlFor="cap-duracion">Duración estimada</label>
                <div className="admin-campo__sufijo">
                  <input id="cap-duracion" className="campo-formulario cifra-tabular" type="number" min={1} max={480} step={1} value={formulario.duracionMin} onChange={(event) => actualizarCampo('duracionMin', event.target.value)} aria-invalid={Boolean(erroresFormulario.duracionMin)} aria-describedby={erroresFormulario.duracionMin ? 'error-cap-duracion' : 'ayuda-cap-duracion'} />
                  <span>min</span>
                </div>
                <ErrorCampo id="error-cap-duracion">{erroresFormulario.duracionMin}</ErrorCampo>
                {!erroresFormulario.duracionMin && <span className="admin-sr-only" id="ayuda-cap-duracion">Ingresa un número entero entre 1 y 480 minutos.</span>}
              </div>

              {!editandoId && (
                <div className="admin-borrador-nota admin-campo--ancho">
                  <span className="chip-estado chip-estado--pendiente">Borrador</span>
                  <p>La capacitación se guardará como borrador. La publicación se realiza después de revisar el contenido.</p>
                </div>
              )}

              {error && <div className="admin-formulario__error" role="alert">{error}</div>}

              <div className="admin-formulario__acciones admin-campo--ancho">
                <button type="button" className="boton-secundario" onClick={() => setModalAbierto(false)} disabled={guardando}>Cancelar</button>
                <button type="submit" className="boton-primario" disabled={guardando}>
                  {guardando ? <><span className="admin-carga__rueda admin-carga__rueda--pequena" />Guardando…</> : <><Icono nombre={editandoId ? 'check' : 'arrow'} /><span>{editandoId ? 'Guardar cambios' : 'Crear y continuar'}</span></>}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {objetivoEliminacion && (
        <div className="admin-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !guardando) setObjetivoEliminacion(null); }}>
          <section className="admin-dialog admin-dialog--confirmacion" role="alertdialog" aria-modal="true" aria-labelledby="titulo-eliminar" aria-describedby="texto-eliminar">
            <span className="admin-confirmacion__icono"><Icono nombre="trash" size={22} /></span>
            <p className="kicker-cgb">Confirmar eliminación</p>
            <h2 id="titulo-eliminar">¿Eliminar esta capacitación?</h2>
            <p id="texto-eliminar">Se eliminará “{objetivoEliminacion.titulo}” y sus slides asociados. Esta acción no se puede deshacer.</p>
            <div className="admin-formulario__acciones">
              <button type="button" className="boton-secundario" onClick={() => setObjetivoEliminacion(null)} disabled={guardando}>Cancelar</button>
              <button type="button" className="boton-peligro" onClick={() => void eliminarCapacitacion()} disabled={guardando}>
                {guardando ? 'Eliminando…' : 'Eliminar capacitación'}
              </button>
            </div>
          </section>
        </div>
      )}
      <PieCgb />
    </div>
  );
}
