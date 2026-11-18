'use client';

import { useEffect, useState } from 'react';

interface RutaResumen {
  id: string;
  nombre: string;
  descripcion: string | null;
  activa: boolean;
  totalCapacitaciones: number;
}

interface CapacitacionResumen {
  id: string;
  titulo: string;
  descripcion: string;
  unidad: string;
  ambito: string;
  estado: string;
  orden: number | null;
}

interface DetalleAsignacion {
  ruta: RutaResumen;
  asignadas: CapacitacionResumen[];
  disponibles: CapacitacionResumen[];
}

export default function PanelAsignacionRutas() {
  const [rutas, setRutas] = useState<RutaResumen[]>([]);
  const [rutaId, setRutaId] = useState('');
  const [detalle, setDetalle] = useState<DetalleAsignacion | null>(null);
  const [asignadas, setAsignadas] = useState<CapacitacionResumen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  async function cargarRutas() {
    try {
      const respuesta = await fetch('/api/admin/rutas', { cache: 'no-store' });
      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ok) throw new Error(resultado.error || 'No se pudieron cargar las rutas.');
      setRutas(resultado.datos || []);
      setRutaId(actual => actual || resultado.datos?.[0]?.id || '');
    } catch (errorCarga) {
      setError(errorCarga instanceof Error ? errorCarga.message : 'No se pudieron cargar las rutas.');
    } finally {
      setCargando(false);
    }
  }

  async function cargarDetalle(id: string) {
    if (!id) return;
    setCargando(true);
    setError('');
    setExito('');
    try {
      const respuesta = await fetch(`/api/admin/rutas/${id}/capacitaciones`, { cache: 'no-store' });
      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ok) throw new Error(resultado.error || 'No se pudo cargar la ruta.');
      setDetalle(resultado.datos);
      setAsignadas(resultado.datos.asignadas.map((item: CapacitacionResumen, indice: number) => ({ ...item, orden: indice + 1 })));
    } catch (errorDetalle) {
      setDetalle(null);
      setAsignadas([]);
      setError(errorDetalle instanceof Error ? errorDetalle.message : 'No se pudo cargar la ruta.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    const temporizador = window.setTimeout(() => { void cargarRutas(); }, 0);
    return () => window.clearTimeout(temporizador);
  }, []);
  useEffect(() => {
    const temporizador = window.setTimeout(() => { void cargarDetalle(rutaId); }, 0);
    return () => window.clearTimeout(temporizador);
  }, [rutaId]);

  function agregar(capacitacion: CapacitacionResumen) {
    setAsignadas(actuales => [...actuales, { ...capacitacion, orden: actuales.length + 1 }]);
  }

  function quitar(id: string) {
    setAsignadas(actuales => actuales
      .filter(item => item.id !== id)
      .map((item, indice) => ({ ...item, orden: indice + 1 })));
  }

  function mover(id: string, destino: number) {
    setAsignadas(actuales => {
      const origen = actuales.findIndex(item => item.id === id);
      if (origen < 0 || destino < 0 || destino >= actuales.length) return actuales;
      const copia = [...actuales];
      const [movida] = copia.splice(origen, 1);
      copia.splice(destino, 0, movida);
      return copia.map((item, indice) => ({ ...item, orden: indice + 1 }));
    });
  }

  async function guardar() {
    if (!rutaId) return;
    setGuardando(true);
    setError('');
    setExito('');
    try {
      const respuesta = await fetch(`/api/admin/rutas/${rutaId}/capacitaciones`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capacitaciones: asignadas.map(item => ({ id: item.id, orden: item.orden })) }),
      });
      const resultado = await respuesta.json();
      if (!respuesta.ok || !resultado.ok) throw new Error(resultado.error || 'No se pudo guardar la asignación.');
      setExito(resultado.mensaje);
      await cargarDetalle(rutaId);
    } catch (errorGuardado) {
      setError(errorGuardado instanceof Error ? errorGuardado.message : 'No se pudo guardar la asignación.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="rutas-asignacion">
      <section className="tarjeta-cgb rutas-asignacion__encabezado">
        <div>
          <p className="eyebrow">Configuración</p>
          <h1>Capacitaciones por ruta</h1>
          <p>Asigna únicamente capacitaciones existentes y publicadas en el catálogo institucional.</p>
        </div>
        <div className="admin-campo">
          <label htmlFor="ruta-onboarding"><span>Ruta</span></label>
          <select id="ruta-onboarding" className="campo-formulario" value={rutaId} onChange={evento => setRutaId(evento.target.value)}>
            <option value="">Selecciona una ruta</option>
            {rutas.map(ruta => <option key={ruta.id} value={ruta.id}>{ruta.nombre}</option>)}
          </select>
        </div>
      </section>

      {error && <p className="admin-alerta admin-alerta--error" role="alert">{error}</p>}
      {exito && <p className="admin-alerta admin-alerta--exito" role="status">{exito}</p>}

      {cargando ? (
        <p role="status">Cargando rutas y capacitaciones reales…</p>
      ) : detalle ? (
        <div className="rutas-asignacion__grid">
          <section className="tarjeta-cgb">
            <div className="panel-admin__header"><div><p className="eyebrow">Asignadas</p><h2>Orden de aprendizaje</h2></div></div>
            {asignadas.length === 0 ? (
              <p className="rutas-asignacion__vacio">Esta ruta todavía no tiene capacitaciones asignadas.</p>
            ) : (
              <ol className="rutas-asignacion__lista">
                {asignadas.map((capacitacion, indice) => (
                  <li key={capacitacion.id}>
                    <span className="rutas-asignacion__orden">{indice + 1}</span>
                    <div><strong>{capacitacion.titulo}</strong><span>{capacitacion.unidad} · {capacitacion.ambito}</span></div>
                    <div className="rutas-asignacion__acciones">
                      <button type="button" className="boton-secundario" disabled={indice === 0} onClick={() => mover(capacitacion.id, indice - 1)} aria-label={`Subir ${capacitacion.titulo}`}>↑</button>
                      <button type="button" className="boton-secundario" disabled={indice === asignadas.length - 1} onClick={() => mover(capacitacion.id, indice + 1)} aria-label={`Bajar ${capacitacion.titulo}`}>↓</button>
                      <button type="button" className="boton-secundario" onClick={() => quitar(capacitacion.id)} aria-label={`Quitar ${capacitacion.titulo}`}>Quitar</button>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="tarjeta-cgb">
            <div className="panel-admin__header"><div><p className="eyebrow">Catálogo</p><h2>Capacitaciones disponibles</h2></div></div>
            {detalle.disponibles.length === 0 ? (
              <p className="rutas-asignacion__vacio">No quedan capacitaciones publicadas por asignar.</p>
            ) : (
              <div className="rutas-asignacion__disponibles">
                {detalle.disponibles.map(capacitacion => (
                  <article key={capacitacion.id}>
                    <div><strong>{capacitacion.titulo}</strong><span>{capacitacion.unidad}</span></div>
                    <button type="button" className="boton-secundario" onClick={() => agregar(capacitacion)}>Agregar</button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <div className="rutas-asignacion__guardar">
            <button type="button" className="boton-primario" disabled={guardando || !rutaId} onClick={guardar}>{guardando ? 'Guardando…' : 'Guardar asignaciones'}</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
