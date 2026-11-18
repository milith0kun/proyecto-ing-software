'use client';

import type { AreaEstructura } from '@/lib/organizacion';
import { IconoOrganizacion as Icono } from './ModalesOrganizacion';

export function ListaAcordeonAreas({
  areasFiltradas,
  abiertas,
  guardando,
  onAlternarAcordeon,
  onAbrirModalPuesto,
  onSolicitarDesactivar,
  onReactivarArea,
}: {
  areasFiltradas: AreaEstructura[];
  abiertas: Record<string, boolean>;
  guardando: boolean;
  onAlternarAcordeon: (areaId: string) => void;
  onAbrirModalPuesto: (areaId: string) => void;
  onSolicitarDesactivar: (area: AreaEstructura) => void;
  onReactivarArea: (area: AreaEstructura) => void;
}) {
  return (
    <div className="org-acordeon-lista">
      {areasFiltradas.map((area) => {
        const estaAbierta = Boolean(abiertas[area.id]);
        const panelId = 'panel-area-' + area.id;

        return (
          <article
            key={area.id}
            className={
              'org-acordeon-item' + (estaAbierta ? ' org-acordeon-item--abierta' : '')
            }
          >
            <div className="org-acordeon-cabecera">
              <button
                type="button"
                className="org-acordeon-disparador"
                aria-expanded={estaAbierta}
                aria-controls={panelId}
                onClick={() => onAlternarAcordeon(area.id)}
              >
                <span className="org-acordeon-chevron" aria-hidden="true">
                  <Icono nombre="chevron" size={18} />
                </span>
                <span className="org-acordeon-titulo-bloque">
                  <strong>{area.nombre}</strong>
                  <span className="org-acordeon-metadatos">
                    <span className="cifra-tabular">
                      {area.puestos.length}{' '}
                      {area.puestos.length === 1 ? 'puesto' : 'puestos'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="cifra-tabular">
                      {area.totalColaboradores}{' '}
                      {area.totalColaboradores === 1
                        ? 'colaborador'
                        : 'colaboradores'}
                    </span>
                  </span>
                </span>
              </button>

              <div className="org-acordeon-acciones">
                <span
                  className={
                    'chip-estado ' +
                    (area.activa
                      ? 'chip-estado--completado'
                      : 'chip-estado--pendiente')
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
                      onClick={() => onAbrirModalPuesto(area.id)}
                    >
                      <Icono nombre="plus" size={16} />
                      <span>Añadir puesto</span>
                    </button>
                    <button
                      type="button"
                      className="boton-peligro boton-peligro--compacto"
                      onClick={() => onSolicitarDesactivar(area)}
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
                    onClick={() => onReactivarArea(area)}
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
                        onClick={() => onAbrirModalPuesto(area.id)}
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
                          {puesto.colaboradores === 1
                            ? 'colaborador'
                            : 'colaboradores'}
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
  );
}
