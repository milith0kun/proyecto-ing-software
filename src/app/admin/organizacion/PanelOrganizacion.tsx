'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  MENSAJE_DUPLICADO,
  existeNombreDuplicado,
  validarArea,
  validarPuesto,
  type AreaEstructura,
} from '@/lib/organizacion';

interface PropsPanelOrganizacion {
  areasIniciales: AreaEstructura[];
  errorInicial?: string;
}

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
  if (nombre === 'chevron') return <svg {...props}><path d="m6 9 6 6 6-6" /></svg>;
  if (nombre === 'building') return <svg {...props}><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01" /></svg>;
  if (nombre === 'briefcase') return <svg {...props}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>;
  if (nombre === 'users') return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
  if (nombre === 'check') return <svg {...props}><path d="m5 12 4 4L19 6" /></svg>;
  if (nombre === 'close') return <svg {...props}><path d="m18 6-12 12M6 6l12 12" /></svg>;
  if (nombre === 'pause') return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M10 15V9m4 6V9" /></svg>;
  if (nombre === 'arrow') return <svg {...props}><path d="M5 12h14m-7-7 7 7-7 7" /></svg>;
  return <svg {...props}><circle cx="12" cy="12" r="9" /></svg>;
}

function ErrorCampo({ children, id }: { children?: string; id: string }) {
  if (!children) return null;
  return <p className="campo-error" id={id} role="alert">{children}</p>;
}

export default function PanelOrganizacion({
  areasIniciales,
  errorInicial = '',
}: PropsPanelOrganizacion) {
  const [areas, setAreas] = useState<AreaEstructura[]>(areasIniciales);
  const [abiertas, setAbiertas] = useState<Record<string, boolean>>(() =>
    areasIniciales[0] ? { [areasIniciales[0].id]: true } : {}
  );
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(errorInicial);
  const [mensajeExito, setMensajeExito] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'TODAS' | 'ACTIVAS' | 'INACTIVAS'>('TODAS');

  const [modalArea, setModalArea] = useState(false);
  const [nombreArea, setNombreArea] = useState('');
  const [errorArea, setErrorArea] = useState<Record<string, string>>({});

  const [modalPuesto, setModalPuesto] = useState(false);
  const [nombrePuesto, setNombrePuesto] = useState('');
  const [areaPuestoId, setAreaPuestoId] = useState('');
  const [errorPuesto, setErrorPuesto] = useState<Record<string, string>>({});

  const [areaPorConfirmar, setAreaPorConfirmar] = useState<AreaEstructura | null>(null);

  const recargarEstructura = useCallback(async () => {
    setCargando(true);
    try {
      const respuesta = await fetch('/api/organizacion/areas', { cache: 'no-store' });
      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ok) {
        throw new Error(resultado.error || 'No se pudo cargar la estructura organizacional.');
      }
      setAreas(resultado.datos);
      setError('');
    } catch (errorCarga) {
      setError(errorCarga instanceof Error ? errorCarga.message : 'Error de conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!modalArea && !modalPuesto && !areaPorConfirmar) return;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !guardando) {
        setModalArea(false);
        setModalPuesto(false);
        setAreaPorConfirmar(null);
      }
    };
    window.addEventListener('keydown', cerrarConEscape);
    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener('keydown', cerrarConEscape);
    };
  }, [modalArea, modalPuesto, areaPorConfirmar, guardando]);

  const areasActivas = useMemo(() => areas.filter((a) => a.activa), [areas]);

  const resumen = useMemo(() => ({
    areas: areas.length,
    activas: areas.filter((a) => a.activa).length,
    puestos: areas.reduce((total, a) => total + a.puestos.length, 0),
    colaboradores: areas.reduce((total, a) => total + a.totalColaboradores, 0),
  }), [areas]);

  const areasFiltradas = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase('es');
    return areas.filter((area) => {
      const coincideEstado =
        filtroEstado === 'TODAS' ||
        (filtroEstado === 'ACTIVAS' && area.activa) ||
        (filtroEstado === 'INACTIVAS' && !area.activa);
      if (!coincideEstado) return false;
      if (!consulta) return true;
      const coincideArea = area.nombre.toLocaleLowerCase('es').includes(consulta);
      const coincidePuesto = area.puestos.some((p) =>
        p.nombre.toLocaleLowerCase('es').includes(consulta)
      );
      return coincideArea || coincidePuesto;
    });
  }, [areas, busqueda, filtroEstado]);

  function alternarAcordeon(areaId: string) {
    setAbiertas((prev) => ({ ...prev, [areaId]: !prev[areaId] }));
  }

  function abrirModalArea() {
    setNombreArea('');
    setErrorArea({});
    setError('');
    setModalArea(true);
  }

  function abrirModalPuesto(areaIdPreseleccionada?: string) {
    const defecto = areaIdPreseleccionada || areasActivas[0]?.id || '';
    setNombrePuesto('');
    setAreaPuestoId(defecto);
    setErrorPuesto({});
    setError('');
    setModalPuesto(true);
  }

  async function crearArea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validacion = validarArea({ nombre: nombreArea });
    if (!validacion.valido || !validacion.datos) {
      setErrorArea(validacion.errores);
      return;
    }

    if (existeNombreDuplicado(areas, validacion.datos.nombre)) {
      setErrorArea({ nombre: MENSAJE_DUPLICADO });
      return;
    }

    setGuardando(true);
    setErrorArea({});
    setError('');
    try {
      const respuesta = await fetch('/api/organizacion/areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: validacion.datos.nombre }),
      });
      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ok) {
        if (resultado.detalles) setErrorArea(resultado.detalles);
        else setErrorArea({ general: resultado.error || 'No se pudo registrar el área.' });
        return;
      }

      const nuevaId = resultado.datos?.id as string | undefined;
      setModalArea(false);
      setMensajeExito(`Área “${validacion.datos.nombre}” registrada con código único y estado activo.`);
      await recargarEstructura();
      if (nuevaId) setAbiertas((prev) => ({ ...prev, [nuevaId]: true }));
    } catch {
      setErrorArea({ general: 'No se pudo conectar con el servidor. Inténtalo de nuevo.' });
    } finally {
      setGuardando(false);
    }
  }

  async function crearPuesto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validacion = validarPuesto({ nombre: nombrePuesto, areaId: areaPuestoId });
    if (!validacion.valido || !validacion.datos) {
      setErrorPuesto(validacion.errores);
      return;
    }

    const areaDestino = areas.find((a) => a.id === validacion.datos?.areaId);
    if (areaDestino && existeNombreDuplicado(areaDestino.puestos, validacion.datos.nombre, areaDestino.id)) {
      setErrorPuesto({ nombre: MENSAJE_DUPLICADO });
      return;
    }

    setGuardando(true);
    setErrorPuesto({});
    setError('');
    try {
      const respuesta = await fetch('/api/organizacion/puestos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: validacion.datos.nombre,
          areaId: validacion.datos.areaId,
        }),
      });
      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ok) {
        if (resultado.detalles) setErrorPuesto(resultado.detalles);
        else setErrorPuesto({ general: resultado.error || 'No se pudo registrar el puesto.' });
        return;
      }

      const idArea = validacion.datos.areaId;
      setModalPuesto(false);
      setMensajeExito(`Puesto “${validacion.datos.nombre}” vinculado correctamente al área.`);
      await recargarEstructura();
      setAbiertas((prev) => ({ ...prev, [idArea]: true }));
    } catch {
      setErrorPuesto({ general: 'No se pudo conectar con el servidor. Inténtalo de nuevo.' });
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarEstadoArea(area: AreaEstructura, nuevoEstado: boolean) {
    setGuardando(true);
    setError('');
    try {
      const respuesta = await fetch('/api/organizacion/areas/' + area.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activa: nuevoEstado }),
      });
      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ok) {
        throw new Error(resultado.error || 'No se pudo actualizar el estado del área.');
      }

      setAreaPorConfirmar(null);
      setMensajeExito(
        nuevoEstado
          ? `Área “${area.nombre}” reactivada correctamente.`
          : `Área “${area.nombre}” desactivada. Sus puestos y rutas asociadas permanecen protegidos.`
      );
      await recargarEstructura();
    } catch (errorEstado) {
      setError(errorEstado instanceof Error ? errorEstado.message : 'No se pudo actualizar el área.');
      setAreaPorConfirmar(null);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <>
      <main className="admin-main">
        <section className="admin-hero" aria-labelledby="titulo-organizacion">
          <div className="admin-hero__copy">
            <p className="kicker-cgb">Estructura organizacional · CGB Academy</p>
            <h1 id="titulo-organizacion">Áreas y puestos de trabajo</h1>
            <p className="admin-hero__description">
              Organiza las áreas internas, vincula los puestos de trabajo y consulta su dotación de colaboradores sin riesgo de eliminación en cascada.
            </p>
          </div>
          <button type="button" className="boton-primario" onClick={abrirModalArea}>
            <Icono nombre="plus" />
            <span>Nueva área</span>
          </button>
        </section>

        {mensajeExito && (
          <div className="admin-alerta admin-alerta--exito" role="status">
            <span className="admin-alerta__icono"><Icono nombre="check" /></span>
            <span>{mensajeExito}</span>
            <button
              type="button"
              className="admin-alerta__cerrar"
              onClick={() => setMensajeExito('')}
              aria-label="Cerrar mensaje"
            >
              <Icono nombre="close" size={16} />
            </button>
          </div>
        )}

        {error && (
          <div className="admin-alerta admin-alerta--error" role="alert">
            <strong>No se pudo completar la acción.</strong>
            <span>{error}</span>
            <button
              type="button"
              className="boton-secundario boton-secundario--compacto"
              onClick={() => void recargarEstructura()}
            >
              Reintentar
            </button>
          </div>
        )}

        <section className="admin-resumen" aria-label="Resumen de estructura organizacional">
          <article className="admin-metrica">
            <span className="admin-metrica__icono"><Icono nombre="building" size={20} /></span>
            <div>
              <span className="admin-metrica__label">Áreas ({resumen.activas} activas)</span>
              <strong className="cifra-tabular">{resumen.areas}</strong>
            </div>
          </article>
          <article className="admin-metrica">
            <span className="admin-metrica__icono admin-metrica__icono--borrador">
              <Icono nombre="briefcase" size={20} />
            </span>
            <div>
              <span className="admin-metrica__label">Puestos registrados</span>
              <strong className="cifra-tabular">{resumen.puestos}</strong>
            </div>
          </article>
          <article className="admin-metrica">
            <span className="admin-metrica__icono admin-metrica__icono--publicada">
              <Icono nombre="users" size={20} />
            </span>
            <div>
              <span className="admin-metrica__label">Colaboradores asignados</span>
              <strong className="cifra-tabular">{resumen.colaboradores}</strong>
            </div>
          </article>
        </section>

        <section className="admin-panel" aria-labelledby="titulo-jerarquia">
          <div className="admin-panel__heading">
            <div>
              <p className="kicker-cgb">Jerarquía organizacional</p>
              <h2 id="titulo-jerarquia">Áreas y puestos asociados</h2>
              <p>Despliega cada área para revisar sus puestos de trabajo y la cantidad de colaboradores vinculados.</p>
            </div>
            <div className="org-heading-acciones">
              <span className="admin-panel__count cifra-tabular">
                {areasFiltradas.length} de {areas.length}
              </span>
              <button
                type="button"
                className="boton-secundario boton-secundario--compacto"
                onClick={() => abrirModalPuesto()}
                disabled={areasActivas.length === 0}
              >
                <Icono nombre="plus" size={16} />
                <span>Nuevo puesto</span>
              </button>
            </div>
          </div>

          <div className="org-filtros" role="search" aria-label="Buscar áreas o puestos">
            <label className="admin-busqueda">
              <span className="admin-sr-only">Buscar por área o puesto</span>
              <Icono nombre="search" size={19} />
              <input
                type="search"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar área o puesto de trabajo..."
                className="campo-formulario"
              />
            </label>
            <label className="admin-filtro">
              <span className="admin-sr-only">Filtrar por estado de área</span>
              <select
                className="campo-formulario"
                value={filtroEstado}
                onChange={(event) =>
                  setFiltroEstado(event.target.value as 'TODAS' | 'ACTIVAS' | 'INACTIVAS')
                }
              >
                <option value="TODAS">Todas las áreas</option>
                <option value="ACTIVAS">Solo activas</option>
                <option value="INACTIVAS">Solo inactivas</option>
              </select>
            </label>
          </div>

          {cargando ? (
            <div className="admin-carga" role="status" aria-live="polite">
              <span className="admin-carga__rueda" />
              <span>Actualizando estructura organizacional…</span>
            </div>
          ) : areas.length === 0 ? (
            <div className="admin-vacio">
              <span className="admin-vacio__icono"><Icono nombre="building" size={28} /></span>
              <p className="kicker-cgb">Empieza por la estructura</p>
              <h3>Aún no hay áreas organizacionales</h3>
              <p>Registra la primera área de CGB Academy para comenzar a asociar sus puestos de trabajo.</p>
              <button type="button" className="boton-primario" onClick={abrirModalArea}>
                <Icono nombre="plus" />
                <span>Crear primera área</span>
              </button>
            </div>
          ) : areasFiltradas.length === 0 ? (
            <div className="admin-sin-resultados">
              <span className="admin-sin-resultados__icono"><Icono nombre="search" size={24} /></span>
              <div>
                <strong>No hay áreas o puestos que coincidan.</strong>
                <span>Prueba con otro término o cambia el filtro de estado.</span>
              </div>
              <button
                type="button"
                className="boton-secundario boton-secundario--compacto"
                onClick={() => {
                  setBusqueda('');
                  setFiltroEstado('TODAS');
                }}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="org-acordeon-lista">
              {areasFiltradas.map((area) => {
                const estaAbierta = Boolean(abiertas[area.id]);
                const panelId = 'panel-area-' + area.id;

                return (
                  <article
                    key={area.id}
                    className={'org-acordeon-item' + (estaAbierta ? ' org-acordeon-item--abierta' : '')}
                  >
                    <div className="org-acordeon-cabecera">
                      <button
                        type="button"
                        className="org-acordeon-disparador"
                        aria-expanded={estaAbierta}
                        aria-controls={panelId}
                        onClick={() => alternarAcordeon(area.id)}
                      >
                        <span className="org-acordeon-chevron" aria-hidden="true">
                          <Icono nombre="chevron" size={18} />
                        </span>
                        <span className="org-acordeon-titulo-bloque">
                          <strong>{area.nombre}</strong>
                          <span className="org-acordeon-metadatos">
                            <span className="cifra-tabular">
                              {area.puestos.length} {area.puestos.length === 1 ? 'puesto' : 'puestos'}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="cifra-tabular">
                              {area.totalColaboradores} {area.totalColaboradores === 1 ? 'colaborador' : 'colaboradores'}
                            </span>
                          </span>
                        </span>
                      </button>

                      <div className="org-acordeon-acciones">
                        <span
                          className={
                            'chip-estado ' +
                            (area.activa ? 'chip-estado--completado' : 'chip-estado--pendiente')
                          }
                        >
                          <span className="chip-estado__punto" />
                          {area.activa ? 'Activa' : 'Inactiva'}
                        </span>

                        {area.activa ? (
                          <>
                            <button
                              type="button"
                              className="boton-secundario boton-secundario--compacto"
                              onClick={() => abrirModalPuesto(area.id)}
                            >
                              <Icono nombre="plus" size={16} />
                              <span>Añadir puesto</span>
                            </button>
                            <button
                              type="button"
                              className="boton-peligro boton-peligro--compacto"
                              onClick={() => setAreaPorConfirmar(area)}
                              disabled={guardando}
                            >
                              <Icono nombre="pause" size={16} />
                              <span>Desactivar</span>
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="boton-secundario boton-secundario--compacto"
                            onClick={() => void cambiarEstadoArea(area, true)}
                            disabled={guardando}
                          >
                            <Icono nombre="check" size={16} />
                            <span>Reactivar</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {estaAbierta && (
                      <div id={panelId} className="org-acordeon-cuerpo">
                        {area.puestos.length === 0 ? (
                          <div className="org-puestos-vacio">
                            <p>Esta área aún no tiene puestos de trabajo vinculados.</p>
                            {area.activa && (
                              <button
                                type="button"
                                className="boton-secundario boton-secundario--compacto"
                                onClick={() => abrirModalPuesto(area.id)}
                              >
                                <Icono nombre="plus" size={16} />
                                <span>Registrar primer puesto</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <ul className="org-puestos-lista">
                            {area.puestos.map((puesto) => (
                              <li key={puesto.id} className="org-puesto-fila">
                                <div className="org-puesto-nombre">
                                  <span className="org-puesto-icono">
                                    <Icono nombre="briefcase" size={16} />
                                  </span>
                                  <div>
                                    <strong>{puesto.nombre}</strong>
                                    <span>Código: {puesto.id.slice(-6).toUpperCase()}</span>
                                  </div>
                                </div>
                                <span className="chip-estado chip-estado--general cifra-tabular">
                                  {puesto.colaboradores}{' '}
                                  {puesto.colaboradores === 1 ? 'colaborador' : 'colaboradores'}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {modalArea && (
        <div
          className="admin-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !guardando) setModalArea(false);
          }}
        >
          <section
            className="admin-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal-area"
            aria-describedby="ayuda-modal-area"
          >
            <div className="admin-dialog__encabezado">
              <div>
                <p className="kicker-cgb">Nueva área</p>
                <h2 id="titulo-modal-area">Registrar área organizacional</h2>
                <p id="ayuda-modal-area">
                  Se guardará con código único y estado activo. Los nombres no distinguen tildes ni mayúsculas.
                </p>
              </div>
              <button
                type="button"
                className="admin-dialog__cerrar"
                onClick={() => setModalArea(false)}
                disabled={guardando}
                aria-label="Cerrar formulario de área"
              >
                <Icono nombre="close" />
              </button>
            </div>

            <form className="admin-formulario" onSubmit={crearArea} noValidate>
              <div className="admin-campo admin-campo--ancho">
                <label htmlFor="org-area-nombre">
                  Nombre del área <span aria-hidden="true">*</span>
                </label>
                <input
                  id="org-area-nombre"
                  className="campo-formulario"
                  type="text"
                  autoFocus
                  value={nombreArea}
                  onChange={(event) => {
                    setNombreArea(event.target.value);
                    setErrorArea({});
                  }}
                  placeholder="Ej. Ingeniería de Software"
                  maxLength={80}
                  aria-invalid={Boolean(errorArea.nombre)}
                  aria-describedby={errorArea.nombre ? 'error-org-area-nombre' : undefined}
                />
                <div className="admin-campo__ayuda">
                  <span>Entre 3 y 80 caracteres.</span>
                  <span className="cifra-tabular">{nombreArea.trim().length}/80</span>
                </div>
                <ErrorCampo id="error-org-area-nombre">{errorArea.nombre}</ErrorCampo>
              </div>

              {errorArea.general && (
                <div className="admin-formulario__error" role="alert">
                  {errorArea.general}
                </div>
              )}

              <div className="admin-formulario__acciones admin-campo--ancho">
                <button
                  type="button"
                  className="boton-secundario"
                  onClick={() => setModalArea(false)}
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button type="submit" className="boton-primario" disabled={guardando}>
                  {guardando ? (
                    <>
                      <span className="admin-carga__rueda admin-carga__rueda--pequena" />
                      Guardando…
                    </>
                  ) : (
                    <>
                      <Icono nombre="arrow" />
                      <span>Guardar área</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {modalPuesto && (
        <div
          className="admin-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !guardando) setModalPuesto(false);
          }}
        >
          <section
            className="admin-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal-puesto"
            aria-describedby="ayuda-modal-puesto"
          >
            <div className="admin-dialog__encabezado">
              <div>
                <p className="kicker-cgb">Nuevo puesto</p>
                <h2 id="titulo-modal-puesto">Asociar puesto de trabajo</h2>
                <p id="ayuda-modal-puesto">
                  Selecciona el área correspondiente e ingresa el nombre del puesto.
                </p>
              </div>
              <button
                type="button"
                className="admin-dialog__cerrar"
                onClick={() => setModalPuesto(false)}
                disabled={guardando}
                aria-label="Cerrar formulario de puesto"
              >
                <Icono nombre="close" />
              </button>
            </div>

            <form className="admin-formulario" onSubmit={crearPuesto} noValidate>
              <div className="admin-campo admin-campo--ancho">
                <label htmlFor="org-puesto-area">
                  Área organizacional <span aria-hidden="true">*</span>
                </label>
                <select
                  id="org-puesto-area"
                  className="campo-formulario"
                  value={areaPuestoId}
                  onChange={(event) => {
                    setAreaPuestoId(event.target.value);
                    setErrorPuesto((prev) => ({ ...prev, areaId: '', general: '' }));
                  }}
                  aria-invalid={Boolean(errorPuesto.areaId)}
                  aria-describedby={errorPuesto.areaId ? 'error-org-puesto-area' : undefined}
                >
                  <option value="">Selecciona un área activa…</option>
                  {areasActivas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.nombre}
                    </option>
                  ))}
                </select>
                <ErrorCampo id="error-org-puesto-area">{errorPuesto.areaId}</ErrorCampo>
              </div>

              <div className="admin-campo admin-campo--ancho">
                <label htmlFor="org-puesto-nombre">
                  Nombre del puesto <span aria-hidden="true">*</span>
                </label>
                <input
                  id="org-puesto-nombre"
                  className="campo-formulario"
                  type="text"
                  autoFocus
                  value={nombrePuesto}
                  onChange={(event) => {
                    setNombrePuesto(event.target.value);
                    setErrorPuesto((prev) => ({ ...prev, nombre: '', general: '' }));
                  }}
                  placeholder="Ej. Desarrollador Junior"
                  maxLength={80}
                  aria-invalid={Boolean(errorPuesto.nombre)}
                  aria-describedby={errorPuesto.nombre ? 'error-org-puesto-nombre' : undefined}
                />
                <div className="admin-campo__ayuda">
                  <span>Entre 3 y 80 caracteres. No se permite repetir el mismo puesto en esta área.</span>
                  <span className="cifra-tabular">{nombrePuesto.trim().length}/80</span>
                </div>
                <ErrorCampo id="error-org-puesto-nombre">{errorPuesto.nombre}</ErrorCampo>
              </div>

              {errorPuesto.general && (
                <div className="admin-formulario__error" role="alert">
                  {errorPuesto.general}
                </div>
              )}

              <div className="admin-formulario__acciones admin-campo--ancho">
                <button
                  type="button"
                  className="boton-secundario"
                  onClick={() => setModalPuesto(false)}
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button type="submit" className="boton-primario" disabled={guardando}>
                  {guardando ? (
                    <>
                      <span className="admin-carga__rueda admin-carga__rueda--pequena" />
                      Guardando…
                    </>
                  ) : (
                    <>
                      <Icono nombre="check" />
                      <span>Guardar puesto</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {areaPorConfirmar && (
        <div
          className="admin-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !guardando) setAreaPorConfirmar(null);
          }}
        >
          <section
            className="admin-dialog admin-dialog--confirmacion"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="titulo-desactivar-area"
            aria-describedby="texto-desactivar-area"
          >
            <span className="admin-confirmacion__icono"><Icono nombre="pause" size={22} /></span>
            <p className="kicker-cgb">Desactivar área</p>
            <h2 id="titulo-desactivar-area">¿Desactivar “{areaPorConfirmar.nombre}”?</h2>
            <p id="texto-desactivar-area">
              El área pasará a estado inactivo sin borrar sus puestos de trabajo ni afectar rutas de onboarding o colaboradores existentes. Podrás reactivarla cuando lo necesites.
            </p>
            <div className="admin-formulario__acciones">
              <button
                type="button"
                className="boton-secundario"
                onClick={() => setAreaPorConfirmar(null)}
                disabled={guardando}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="boton-peligro"
                onClick={() => void cambiarEstadoArea(areaPorConfirmar, false)}
                disabled={guardando}
              >
                {guardando ? 'Desactivando…' : 'Confirmar desactivación'}
              </button>
            </div>
          </section>
        </div>
      )}

    </>
  );
}
