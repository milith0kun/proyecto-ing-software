'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { CabeceraAdminCgb } from '@/components/institucional/CabeceraAdminCgb';
import { PieCgb } from '@/components/institucional/PieCgb';

interface RutaAsignada {
  id: string;
  nombre: string;
}

interface PuestoResumen {
  id: string;
  nombre: string;
}

interface OpcionPuesto extends PuestoResumen {
  rutaActiva: boolean;
}

interface Colaborador {
  id: string;
  nombre: string;
  email: string;
  dni: string | null;
  estado: string;
  progreso: number;
  puesto: PuestoResumen | null;
  rutaAsignada: RutaAsignada | null;
  enlaceActivacion?: string | null;
}

interface FormularioColaborador {
  nombre: string;
  email: string;
  dni: string;
  puestoId: string;
}

const FORMULARIO_INICIAL: FormularioColaborador = {
  nombre: '',
  email: '',
  dni: '',
  puestoId: '',
};

const ESTADOS = ['TODOS', 'PENDIENTE_ACTIVACION', 'ACTIVO', 'EN_PROGRESO'];

function estadoClase(estado: string) {
  const base = 'chip-estado';
  if (estado === 'ACTIVO') return `${base} chip-estado--completado`;
  if (estado === 'EN_PROGRESO') return `${base} chip-estado--en-curso`;
  return `${base} chip-estado--pendiente`;
}

function etiquetaEstado(estado: string) {
  if (estado === 'ACTIVO') return 'Activo';
  if (estado === 'EN_PROGRESO') return 'En Progreso';
  return 'Pendiente';
}

export default function PaginaColaboradores() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [puestos, setPuestos] = useState<OpcionPuesto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroRuta, setFiltroRuta] = useState('TODAS');
  const [formularios, setFormularios] = useState<FormularioColaborador[]>([FORMULARIO_INICIAL]);

  const cargarColaboradores = async () => {
    try {
      const respuesta = await fetch('/api/colaboradores', { cache: 'no-store' });
      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ok) throw new Error(resultado.error || 'No se pudo cargar la lista de colaboradores.');
      setColaboradores(resultado.datos || []);
      setPuestos(resultado.puestos || []);
      setError('');
    } catch (errorCarga) {
      setError(errorCarga instanceof Error ? errorCarga.message : 'No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const carga = window.setTimeout(() => { void cargarColaboradores(); }, 0);
    return () => window.clearTimeout(carga);
  }, []);

  const rutasDisponibles = useMemo(
    () => Array.from(new Set(colaboradores.map((colaborador) => colaborador.rutaAsignada?.nombre).filter(Boolean))) as string[],
    [colaboradores]
  );

  const colaboradoresFiltrados = useMemo(() => {
    return colaboradores.filter((colaborador) => {
      const coincideEstado = filtroEstado === 'TODOS' || colaborador.estado === filtroEstado;
      const coincideRuta = filtroRuta === 'TODAS' || colaborador.rutaAsignada?.nombre === filtroRuta;
      return coincideEstado && coincideRuta;
    });
  }, [colaboradores, filtroEstado, filtroRuta]);

  async function enviarFormulario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGuardando(true);
    setError('');
    setExito('');

    try {
      const respuesta = await fetch('/api/colaboradores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ colaboradores: formularios }),
      });
      const resultado = await respuesta.json();

      if (!Array.isArray(resultado.resultados)) {
        throw new Error(resultado.error || 'No se pudo registrar al colaborador.');
      }
      const fallidos = resultado.resultados
        .map((registro: { ok: boolean; error?: string }, indice: number) => ({ registro, formulario: formularios[indice] }))
        .filter((resultado: { registro: { ok: boolean }; formulario: FormularioColaborador }) => !resultado.registro.ok);
      const exitosos = resultado.resultados.length - fallidos.length;
      setExito(exitosos ? `${exitosos} colaborador(es) registrado(s) e invitado(s).` : '');
      setError(fallidos.map((resultado: { registro: { error?: string }; formulario: FormularioColaborador }) => `${resultado.formulario.email}: ${resultado.registro.error}`).join(' '));
      setFormularios(fallidos.length ? fallidos.map((resultado: { formulario: FormularioColaborador }) => resultado.formulario) : [FORMULARIO_INICIAL]);
      await cargarColaboradores();
      if (fallidos.length) {
        setError(fallidos.map((resultado: { registro: { error?: string }; formulario: FormularioColaborador }) => `${resultado.formulario.email}: ${resultado.registro.error}`).join(' '));
      }
    } catch (errorEnvio) {
      setError(errorEnvio instanceof Error ? errorEnvio.message : 'No se pudo registrar el colaborador.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="admin-shell">
      <CabeceraAdminCgb>
        <div className="admin-header__context">
          <span className="indicador-operativo" />
          <span>Colaboradores y rutas de onboarding</span>
        </div>
      </CabeceraAdminCgb>

      <main className="panel-admin panel-admin--compact" aria-label="Gestión de colaboradores">
        <section className="tarjeta-cgb">
          <div className="panel-admin__header">
            <div>
              <p className="eyebrow">Registro</p>
              <h1>Nuevo colaborador</h1>
            </div>
          </div>

          <form onSubmit={enviarFormulario} className="admin-formulario admin-formulario--colaboradores">
            {formularios.map((formulario, indice) => (
              <div className="admin-formulario__fila" key={indice}>
                <div className="admin-campo">
                  <label htmlFor={`colaborador-nombre-${indice}`}><span>Nombre completo</span></label>
                  <input id={`colaborador-nombre-${indice}`} className="campo-formulario" required value={formulario.nombre} onChange={evento => setFormularios(actuales => actuales.map((fila, posicion) => posicion === indice ? { ...fila, nombre: evento.target.value } : fila))} placeholder="Ej. Ana Torres" />
                </div>
                <div className="admin-campo">
                  <label htmlFor={`colaborador-email-${indice}`}><span>Correo institucional</span></label>
                  <input id={`colaborador-email-${indice}`} className="campo-formulario" required type="email" value={formulario.email} onChange={evento => setFormularios(actuales => actuales.map((fila, posicion) => posicion === indice ? { ...fila, email: evento.target.value } : fila))} placeholder="ana@cgb.latam" />
                </div>
                <div className="admin-campo">
                  <label htmlFor={`colaborador-dni-${indice}`}><span>DNI</span></label>
                  <input id={`colaborador-dni-${indice}`} className="campo-formulario" required value={formulario.dni} onChange={evento => setFormularios(actuales => actuales.map((fila, posicion) => posicion === indice ? { ...fila, dni: evento.target.value } : fila))} placeholder="12345678" />
                </div>
                <div className="admin-campo">
                  <label htmlFor={`colaborador-puesto-${indice}`}><span>Puesto</span></label>
                  <select id={`colaborador-puesto-${indice}`} className="campo-formulario" required value={formulario.puestoId} onChange={evento => setFormularios(actuales => actuales.map((fila, posicion) => posicion === indice ? { ...fila, puestoId: evento.target.value } : fila))}>
                    <option value="">Selecciona un puesto</option>
                    {puestos.map(puesto => <option key={puesto.id} value={puesto.id}>{puesto.nombre}{puesto.rutaActiva ? '' : ' (sin ruta activa)'}</option>)}
                  </select>
                </div>
                {formularios.length > 1 && <button type="button" className="boton-secundario admin-formulario__quitar" onClick={() => setFormularios(actuales => actuales.filter((_, posicion) => posicion !== indice))} aria-label={`Quitar registro ${indice + 1}`}>Quitar</button>}
              </div>
            ))}

            <div className="admin-formulario__acciones admin-formulario__acciones--final">
              <button type="button" className="boton-secundario" onClick={() => setFormularios(actuales => [...actuales, FORMULARIO_INICIAL])} disabled={formularios.length >= 100}>Agregar otro</button>
              <button type="submit" className="boton-primario" disabled={guardando}>
                {guardando ? 'Registrando...' : formularios.length > 1 ? `Registrar ${formularios.length} colaboradores` : 'Registrar colaborador'}
              </button>
            </div>
          </form>

          {error ? <div className="admin-alerta admin-alerta--error">{error}</div> : null}
          {exito ? <div className="admin-alerta admin-alerta--exito">{exito}</div> : null}
        </section>

        <section className="tarjeta-cgb">
          <div className="panel-admin__header panel-admin__header--between">
            <div>
              <p className="eyebrow">Monitoreo</p>
              <h2>Colaboradores incorporados</h2>
            </div>
          </div>

          <div className="admin-filtros">
            <div className="admin-campo">
              <label htmlFor="filtro-estado">
                <span>Estado</span>
              </label>
              <select id="filtro-estado" className="campo-formulario" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>{estado === 'TODOS' ? 'Todos' : etiquetaEstado(estado)}</option>
                ))}
              </select>
            </div>

            <div className="admin-campo">
              <label htmlFor="filtro-ruta">
                <span>Ruta</span>
              </label>
              <select id="filtro-ruta" className="campo-formulario" value={filtroRuta} onChange={(e) => setFiltroRuta(e.target.value)}>
                <option value="TODAS">Todas</option>
                {rutasDisponibles.map((ruta) => (
                  <option key={ruta} value={ruta}>{ruta}</option>
                ))}
              </select>
            </div>
          </div>

          {cargando ? (
            <p>Cargando colaboradores...</p>
          ) : (
            <div className="tabla-admin tabla-admin--compact">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Puesto</th>
                    <th>Ruta</th>
                    <th>Estado</th>
                    <th>Progreso</th>
                  </tr>
                </thead>
                <tbody>
                  {colaboradoresFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={6}>No hay colaboradores para mostrar con este filtro.</td>
                    </tr>
                  ) : (
                    colaboradoresFiltrados.map((colaborador) => (
                      <tr key={colaborador.id}>
                        <td>{colaborador.nombre}</td>
                        <td>{colaborador.email}</td>
                        <td>{colaborador.puesto?.nombre || 'Sin puesto'}</td>
                        <td>{colaborador.rutaAsignada?.nombre || 'Sin ruta'}</td>
                        <td>
                          <span className={estadoClase(colaborador.estado)}>{etiquetaEstado(colaborador.estado)}</span>
                        </td>
                        <td>{colaborador.progreso}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <PieCgb />
    </div>
  );
}
