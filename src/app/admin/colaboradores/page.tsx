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
  puestoId: 'puesto-rh-001',
};

const OPCIONES_PUESTOS = [
  { id: 'puesto-rh-001', nombre: 'Analista de RR. HH.' },
  { id: 'puesto-op-002', nombre: 'Operador de Seguridad' },
  { id: 'puesto-fin-003', nombre: 'Analista Financiero' },
  { id: 'puesto-it-004', nombre: 'Especialista de TI' },
];

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
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroRuta, setFiltroRuta] = useState('TODAS');
  const [formulario, setFormulario] = useState<FormularioColaborador>(FORMULARIO_INICIAL);

  const cargarColaboradores = async () => {
    try {
      const respuesta = await fetch('/api/colaboradores', { cache: 'no-store' });
      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ok) throw new Error(resultado.error || 'No se pudo cargar la lista de colaboradores.');
      setColaboradores(resultado.datos || []);
      setError('');
    } catch (errorCarga) {
      setError(errorCarga instanceof Error ? errorCarga.message : 'No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargarColaboradores();
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
        body: JSON.stringify(formulario),
      });
      const resultado = await respuesta.json();

      if (!respuesta.ok || !resultado.ok) {
        throw new Error(resultado.error || 'No se pudo registrar al colaborador.');
      }

      setFormulario(FORMULARIO_INICIAL);
      setExito('Colaborador registrado y ruta de onboarding asignada correctamente.');
      await cargarColaboradores();
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
        <section className="tarjeta-cgb" style={{ gap: '18px' }}>
          <div className="panel-admin__header" style={{ alignItems: 'center' }}>
            <div>
              <p className="eyebrow">Registro</p>
              <h1 style={{ margin: 0 }}>Nuevo colaborador</h1>
            </div>
          </div>

          <form onSubmit={enviarFormulario} className="formulario-admin" style={{ display: 'grid', gap: '16px' }}>
            <div className="formulario-admin__grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <label className="campo">
                <span>Nombre completo</span>
                <input
                  required
                  value={formulario.nombre}
                  onChange={(e) => setFormulario((anterior) => ({ ...anterior, nombre: e.target.value }))}
                  placeholder="Ej. Ana Torres"
                />
              </label>

              <label className="campo">
                <span>Correo institucional</span>
                <input
                  required
                  type="email"
                  value={formulario.email}
                  onChange={(e) => setFormulario((anterior) => ({ ...anterior, email: e.target.value }))}
                  placeholder="ana@cgb.latam"
                />
              </label>

              <label className="campo">
                <span>DNI</span>
                <input
                  required
                  value={formulario.dni}
                  onChange={(e) => setFormulario((anterior) => ({ ...anterior, dni: e.target.value }))}
                  placeholder="12345678"
                />
              </label>

              <label className="campo">
                <span>Puesto</span>
                <select
                  value={formulario.puestoId}
                  onChange={(e) => setFormulario((anterior) => ({ ...anterior, puestoId: e.target.value }))}
                >
                  {OPCIONES_PUESTOS.map((puesto) => (
                    <option key={puesto.id} value={puesto.id}>{puesto.nombre}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="acciones" style={{ justifyContent: 'flex-end' }}>
              <button type="submit" className="boton-primario" disabled={guardando}>
                {guardando ? 'Registrando...' : 'Registrar colaborador'}
              </button>
            </div>
          </form>

          {error ? <div className="alerta alerta--error">{error}</div> : null}
          {exito ? <div className="alerta alerta--ok">{exito}</div> : null}
        </section>

        <section className="tarjeta-cgb" style={{ gap: '18px' }}>
          <div className="panel-admin__header" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="eyebrow">Monitoreo</p>
              <h2 style={{ margin: 0 }}>Colaboradores incorporados</h2>
            </div>
          </div>

          <div className="filtros" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <label className="campo campo--inline">
              <span>Estado</span>
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>{estado === 'TODOS' ? 'Todos' : etiquetaEstado(estado)}</option>
                ))}
              </select>
            </label>

            <label className="campo campo--inline">
              <span>Ruta</span>
              <select value={filtroRuta} onChange={(e) => setFiltroRuta(e.target.value)}>
                <option value="TODAS">Todas</option>
                {rutasDisponibles.map((ruta) => (
                  <option key={ruta} value={ruta}>{ruta}</option>
                ))}
              </select>
            </label>
          </div>

          {cargando ? (
            <p>Cargando colaboradores...</p>
          ) : (
            <div className="tabla-admin" style={{ overflowX: 'auto' }}>
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
