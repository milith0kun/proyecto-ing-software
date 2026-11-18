'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  MENSAJE_DUPLICADO,
  existeNombreDuplicado,
  validarArea,
  validarPuesto,
  type AreaEstructura,
} from '@/lib/organizacion';
import {
  cambiarEstadoAreaCliente,
  consultarEstructuraCliente,
  crearAreaCliente,
  crearPuestoCliente,
} from '@/lib/organizacion-cliente';
import {
  IconoOrganizacion as Icono,
  ModalDesactivarArea,
  ModalNuevaArea,
  ModalNuevoPuesto,
} from './ModalesOrganizacion';
import { ListaAcordeonAreas } from './ListaAcordeonAreas';

interface PropsPanelOrganizacion {
  areasIniciales: AreaEstructura[];
  errorInicial?: string;
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
      const datos = await consultarEstructuraCliente();
      setAreas(datos);
      setError('');
    } catch (errorCarga) {
      setError(
        errorCarga instanceof Error
          ? errorCarga.message
          : 'Error de conexión con el servidor.'
      );
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

  const resumen = useMemo(
    () => ({
      areas: areas.length,
      activas: areas.filter((a) => a.activa).length,
      puestos: areas.reduce((total, a) => total + a.puestos.length, 0),
      colaboradores: areas.reduce((total, a) => total + a.totalColaboradores, 0),
    }),
    [areas]
  );

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
      const resultado = await crearAreaCliente(validacion.datos.nombre);
      if (!resultado.ok) {
        if (resultado.detalles) setErrorArea(resultado.detalles);
        else setErrorArea({ general: resultado.error || 'No se pudo registrar el área.' });
        return;
      }

      const nuevaId = resultado.datos?.id;
      setModalArea(false);
      setMensajeExito(
        `Área “${validacion.datos.nombre}” registrada con código único y estado activo.`
      );
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
    if (
      areaDestino &&
      existeNombreDuplicado(areaDestino.puestos, validacion.datos.nombre, areaDestino.id)
    ) {
      setErrorPuesto({ nombre: MENSAJE_DUPLICADO });
      return;
    }

    setGuardando(true);
    setErrorPuesto({});
    setError('');
    try {
      const resultado = await crearPuestoCliente({
        nombre: validacion.datos.nombre,
        areaId: validacion.datos.areaId,
      });
      if (!resultado.ok) {
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
      await cambiarEstadoAreaCliente(area.id, nuevoEstado);
      setAreaPorConfirmar(null);
      setMensajeExito(
        nuevoEstado
          ? `Área “${area.nombre}” reactivada correctamente.`
          : `Área “${area.nombre}” desactivada. Sus puestos y rutas asociadas permanecen protegidos.`
      );
      await recargarEstructura();
    } catch (errorEstado) {
      setError(
        errorEstado instanceof Error ? errorEstado.message : 'No se pudo actualizar el área.'
      );
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
            <ListaAcordeonAreas
              areasFiltradas={areasFiltradas}
              abiertas={abiertas}
              guardando={guardando}
              onAlternarAcordeon={alternarAcordeon}
              onAbrirModalPuesto={(areaId) => abrirModalPuesto(areaId)}
              onSolicitarDesactivar={(area) => setAreaPorConfirmar(area)}
              onReactivarArea={(area) => void cambiarEstadoArea(area, true)}
            />
          )}
        </section>
      </main>

      <ModalNuevaArea
        abierto={modalArea}
        guardando={guardando}
        nombreArea={nombreArea}
        errorArea={errorArea}
        onChangeNombre={(valor) => {
          setNombreArea(valor);
          setErrorArea({});
        }}
        onCerrar={() => setModalArea(false)}
        onSubmit={crearArea}
      />

      <ModalNuevoPuesto
        abierto={modalPuesto}
        guardando={guardando}
        areasActivas={areasActivas}
        areaPuestoId={areaPuestoId}
        nombrePuesto={nombrePuesto}
        errorPuesto={errorPuesto}
        onChangeArea={(id) => {
          setAreaPuestoId(id);
          setErrorPuesto((prev) => ({ ...prev, areaId: '', general: '' }));
        }}
        onChangeNombre={(valor) => {
          setNombrePuesto(valor);
          setErrorPuesto((prev) => ({ ...prev, nombre: '', general: '' }));
        }}
        onCerrar={() => setModalPuesto(false)}
        onSubmit={crearPuesto}
      />

      <ModalDesactivarArea
        area={areaPorConfirmar}
        guardando={guardando}
        onCancelar={() => setAreaPorConfirmar(null)}
        onConfirmar={(area) => void cambiarEstadoArea(area, false)}
      />
    </>
  );
}
