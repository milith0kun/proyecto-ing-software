/**
 * Módulo de validación y normalización tipado para HU-002: Crear una capacitación
 * Criterios de Aceptación CA-01 y CA-02
 */

export const UNIDADES_VALIDAS = ['CIIP', 'GEOMINA', 'BIOMEDIC', 'GENERAL'] as const;
export type UnidadInstitucional = (typeof UNIDADES_VALIDAS)[number];

export const AMBITOS_VALIDOS = ['PUBLICO', 'INTERNO'] as const;
export type AmbitoCapacitacion = (typeof AMBITOS_VALIDOS)[number];

export const ESTADOS_VALIDOS = ['BORRADOR', 'PUBLICADA'] as const;
export type EstadoCapacitacion = (typeof ESTADOS_VALIDOS)[number];

export interface DatosCapacitacionEntrada {
  id?: string;
  titulo?: string;
  descripcion?: string;
  unidad?: string;
  ambito?: string;
  estado?: string;
  categoria?: string;
  duracionMin?: number | string;
  icono?: string;
}

export interface ResultadoValidacion {
  valido: boolean;
  errores: Record<string, string>;
}

export interface CapacitacionNormalizada {
  titulo: string;
  descripcion: string;
  unidad: string;
  ambito: string;
  estado: string;
  categoria: string;
  duracionMin: number;
  icono: string;
}

/**
 * Valida los datos requeridos para registrar o editar una capacitación.
 */
export function validarCapacitacion(datos: DatosCapacitacionEntrada = {}): ResultadoValidacion {
  const errores: Record<string, string> = {};

  // Validación de título (CA-01)
  const titulo = typeof datos.titulo === 'string' ? datos.titulo.trim() : '';
  if (!titulo || titulo.length < 3) {
    errores.titulo = 'El título es obligatorio y debe tener al menos 3 caracteres.';
  }

  // Validación de descripción (CA-01)
  const descripcion = typeof datos.descripcion === 'string' ? datos.descripcion.trim() : '';
  if (!descripcion || descripcion.length < 10) {
    errores.descripcion = 'La descripción es obligatoria y debe tener al menos 10 caracteres.';
  }

  // Validación de unidad institucional (CIIP, GEOMINA, BIOMEDIC, GENERAL)
  const unidad = typeof datos.unidad === 'string' ? datos.unidad.toUpperCase().trim() : '';
  if (!UNIDADES_VALIDAS.includes(unidad as UnidadInstitucional)) {
    errores.unidad = `Unidad institucional no válida. Debe ser una de: ${UNIDADES_VALIDAS.join(', ')}.`;
  }

  // El ámbito tiene un valor por defecto al crear, pero si se envía debe ser válido.
  if (datos.ambito !== undefined) {
    const ambito = String(datos.ambito).toUpperCase().trim();
    if (!AMBITOS_VALIDOS.includes(ambito as AmbitoCapacitacion)) {
      errores.ambito = `El ámbito debe ser: ${AMBITOS_VALIDOS.join(' o ')}.`;
    }
  }

  if (datos.categoria !== undefined) {
    if (typeof datos.categoria !== 'string') {
      errores.categoria = 'La categoría debe ser texto.';
    } else if (datos.categoria.trim().length > 60) {
      errores.categoria = 'La categoría no puede superar los 60 caracteres.';
    }
  }

  if (datos.duracionMin !== undefined) {
    const duracion = Number(datos.duracionMin);
    if (!Number.isInteger(duracion) || duracion < 1 || duracion > 480) {
      errores.duracionMin = 'La duración debe ser un número entero entre 1 y 480 minutos.';
    }
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores,
  };
}

/**
 * Normaliza y aplica valores por defecto para persistencia en MongoDB / Prisma.
 */
export function normalizarCapacitacion(
  datos: DatosCapacitacionEntrada = {},
  valoresPreservados: { estado?: string; icono?: string } = {}
): CapacitacionNormalizada {
  return {
    titulo: String(datos.titulo || '').trim(),
    descripcion: String(datos.descripcion || '').trim(),
    unidad: (datos.unidad || 'CIIP').toUpperCase().trim(),
    ambito: (datos.ambito || 'PUBLICO').toUpperCase().trim(),
    // El estado solo cambia desde el flujo de publicación (HU-004).
    estado: (valoresPreservados.estado || 'BORRADOR').toUpperCase().trim(),
    categoria: (datos.categoria || 'Inducción').trim(),
    duracionMin: datos.duracionMin === undefined ? 30 : Number(datos.duracionMin),
    icono: valoresPreservados.icono || 'book-open',
  };
}
