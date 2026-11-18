'use client';

import type { FormEvent } from 'react';
import type { AreaEstructura } from '@/lib/organizacion';

export function IconoOrganizacion({
  nombre,
  size = 18,
}: {
  nombre: string;
  size?: number;
}) {
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
  return (
    <p className="campo-error" id={id} role="alert">
      {children}
    </p>
  );
}

export function ModalNuevaArea({
  abierto,
  guardando,
  nombreArea,
  errorArea,
  onChangeNombre,
  onCerrar,
  onSubmit,
}: {
  abierto: boolean;
  guardando: boolean;
  nombreArea: string;
  errorArea: Record<string, string>;
  onChangeNombre: (valor: string) => void;
  onCerrar: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  if (!abierto) return null;

  return (
    <div
      className="admin-dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !guardando) onCerrar();
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
            onClick={onCerrar}
            disabled={guardando}
            aria-label="Cerrar formulario de área"
          >
            <IconoOrganizacion nombre="close" />
          </button>
        </div>

        <form className="admin-formulario" onSubmit={onSubmit} noValidate>
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
              onChange={(event) => onChangeNombre(event.target.value)}
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
              onClick={onCerrar}
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
                  <IconoOrganizacion nombre="arrow" />
                  <span>Guardar área</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export function ModalNuevoPuesto({
  abierto,
  guardando,
  areasActivas,
  areaPuestoId,
  nombrePuesto,
  errorPuesto,
  onChangeArea,
  onChangeNombre,
  onCerrar,
  onSubmit,
}: {
  abierto: boolean;
  guardando: boolean;
  areasActivas: AreaEstructura[];
  areaPuestoId: string;
  nombrePuesto: string;
  errorPuesto: Record<string, string>;
  onChangeArea: (areaId: string) => void;
  onChangeNombre: (valor: string) => void;
  onCerrar: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  if (!abierto) return null;

  return (
    <div
      className="admin-dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !guardando) onCerrar();
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
            onClick={onCerrar}
            disabled={guardando}
            aria-label="Cerrar formulario de puesto"
          >
            <IconoOrganizacion nombre="close" />
          </button>
        </div>

        <form className="admin-formulario" onSubmit={onSubmit} noValidate>
          <div className="admin-campo admin-campo--ancho">
            <label htmlFor="org-puesto-area">
              Área organizacional <span aria-hidden="true">*</span>
            </label>
            <select
              id="org-puesto-area"
              className="campo-formulario"
              value={areaPuestoId}
              onChange={(event) => onChangeArea(event.target.value)}
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
              onChange={(event) => onChangeNombre(event.target.value)}
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
              onClick={onCerrar}
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
                  <IconoOrganizacion nombre="check" />
                  <span>Guardar puesto</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export function ModalDesactivarArea({
  area,
  guardando,
  onCancelar,
  onConfirmar,
}: {
  area: AreaEstructura | null;
  guardando: boolean;
  onCancelar: () => void;
  onConfirmar: (area: AreaEstructura) => void;
}) {
  if (!area) return null;

  return (
    <div
      className="admin-dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !guardando) onCancelar();
      }}
    >
      <section
        className="admin-dialog admin-dialog--confirmacion"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="titulo-desactivar-area"
        aria-describedby="texto-desactivar-area"
      >
        <span className="admin-confirmacion__icono">
          <IconoOrganizacion nombre="pause" size={22} />
        </span>
        <p className="kicker-cgb">Desactivar área</p>
        <h2 id="titulo-desactivar-area">¿Desactivar “{area.nombre}”?</h2>
        <p id="texto-desactivar-area">
          El área pasará a estado inactivo sin borrar sus puestos de trabajo ni afectar rutas de onboarding o colaboradores existentes. Podrás reactivarla cuando lo necesites.
        </p>
        <div className="admin-formulario__acciones">
          <button
            type="button"
            className="boton-secundario"
            onClick={onCancelar}
            disabled={guardando}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="boton-peligro"
            onClick={() => onConfirmar(area)}
            disabled={guardando}
          >
            {guardando ? 'Desactivando…' : 'Confirmar desactivación'}
          </button>
        </div>
      </section>
    </div>
  );
}
