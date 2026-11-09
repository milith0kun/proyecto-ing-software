/**
 * Reglas de la estructura organizacional (HU-007 / CGB-31):
 * áreas, puestos de trabajo, duplicados y jerarquía con conteo de colaboradores.
 */

export const MENSAJE_DUPLICADO = 'El área o puesto ya existe en la organización';

const LONGITUD_MINIMA = 3;
const LONGITUD_MAXIMA = 80;

export interface ResultadoValidacion<T> {
  valido: boolean;
  errores: Record<string, string>;
  datos?: T;
}

export interface DatosArea {
  nombre: string;
  activa: boolean;
}

export interface DatosPuesto {
  nombre: string;
  areaId: string;
}

export function limpiarNombre(valor: unknown): string {
  return typeof valor === 'string' ? valor.trim().replace(/\s+/g, ' ') : '';
}

/** Clave de comparación: sin tildes, en minúsculas y con espacios normalizados. */
export function claveNombre(valor: unknown): string {
  return limpiarNombre(valor).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

function validarNombre(valor: unknown, errores: Record<string, string>) {
  const nombre = limpiarNombre(valor);
  if (nombre.length < LONGITUD_MINIMA) {
    errores.nombre = `El nombre debe tener al menos ${LONGITUD_MINIMA} caracteres`;
  } else if (nombre.length > LONGITUD_MAXIMA) {
    errores.nombre = `El nombre no puede superar ${LONGITUD_MAXIMA} caracteres`;
  }
  return nombre;
}

export function validarArea(entrada: { nombre?: unknown }): ResultadoValidacion<DatosArea> {
  const errores: Record<string, string> = {};
  const nombre = validarNombre(entrada?.nombre, errores);
  if (Object.keys(errores).length > 0) return { valido: false, errores };
  return { valido: true, errores, datos: { nombre, activa: true } };
}

export function validarPuesto(entrada: { nombre?: unknown; areaId?: unknown }): ResultadoValidacion<DatosPuesto> {
  const errores: Record<string, string> = {};
  const nombre = validarNombre(entrada?.nombre, errores);
  const areaId = typeof entrada?.areaId === 'string' ? entrada.areaId.trim() : '';
  if (!areaId) errores.areaId = 'Selecciona el área a la que pertenece el puesto';
  if (Object.keys(errores).length > 0) return { valido: false, errores };
  return { valido: true, errores, datos: { nombre, areaId } };
}

/** Un nombre se repite entre áreas, o entre los puestos de una misma área si se indica `areaId`. */
export function existeNombreDuplicado(
  existentes: Array<{ nombre: string; areaId?: string }>,
  nombre: string,
  areaId?: string
): boolean {
  const clave = claveNombre(nombre);
  return existentes.some(
    (e) => claveNombre(e.nombre) === clave && (areaId === undefined || e.areaId === areaId)
  );
}

export interface PuestoEstructura {
  id: string;
  nombre: string;
  areaId: string;
  colaboradores: number;
}

export interface AreaEstructura {
  id: string;
  nombre: string;
  puestos: PuestoEstructura[];
  totalColaboradores: number;
}

export function armarEstructura(
  areas: Array<{ id: string; nombre: string }>,
  puestos: Array<{ id: string; nombre: string; areaId: string }>,
  conteoPorPuesto: Record<string, number> = {}
): AreaEstructura[] {
  return areas.map((area) => {
    const delArea = puestos
      .filter((p) => p.areaId === area.id)
      .map((p) => ({ ...p, colaboradores: conteoPorPuesto[p.id] ?? 0 }));
    return {
      id: area.id,
      nombre: area.nombre,
      puestos: delArea,
      totalColaboradores: delArea.reduce((suma, p) => suma + p.colaboradores, 0)
    };
  });
}
