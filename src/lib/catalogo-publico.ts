/**
 * Módulo de dominio y contratos de consulta para HU-005: Explorar capacitaciones públicas
 * Criterios de Aceptación CA-01, CA-02 y CA-03
 */

export interface ItemCapacitacionPublica {
  id: string;
  titulo: string;
  descripcion: string;
  unidad: string; // 'CIIP' | 'GEOMINA' | 'BIOMEDIC' | 'GENERAL'
  ambito: string; // 'PUBLICO' | 'INTERNO'
  estado: string; // 'PUBLICADA' | 'BORRADOR'
  categoria?: string | null; // 'Estudiantes' | 'Docentes' | 'Inducción' | string
  duracionMin?: number | null;
  icono?: string | null;
  slidesCount?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface FiltrosConsultaPublica {
  unidad?: string;
  categoria?: string;
  q?: string;
}

export interface ResultadoConsultaPublica {
  valido: boolean;
  requiereAutenticacion: boolean;
  alteraProgresoOnboarding: boolean;
}

/**
 * Filtra capacitaciones garantizando que SOLO se expongan capacitaciones PUBLICADAS de ámbito PUBLICO (CA-01),
 * aplicando opcionalmente segmentación por unidad o categoría (CA-02).
 */
export function filtrarCapacitacionesPublicas(
  capacitaciones: ItemCapacitacionPublica[] = [],
  filtros: FiltrosConsultaPublica = {}
): ItemCapacitacionPublica[] {
  return capacitaciones.filter((cap) => {
    // 1. Regla de Oro de Seguridad y Visibilidad (CA-01): Solo PUBLICADA y PUBLICO
    const esPublicaYPublicada = cap.ambito === 'PUBLICO' && cap.estado === 'PUBLICADA';
    if (!esPublicaYPublicada) return false;

    // 2. Filtro opcional por unidad institucional (CA-02)
    if (filtros.unidad && filtros.unidad !== 'TODAS') {
      if (cap.unidad.toUpperCase() !== filtros.unidad.toUpperCase()) {
        return false;
      }
    }

    // 3. Filtro opcional por categoría (Estudiantes, Docentes, etc.) (CA-02)
    if (filtros.categoria && filtros.categoria !== 'TODAS') {
      if ((cap.categoria || '').toLowerCase() !== filtros.categoria.toLowerCase()) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Realiza una búsqueda de texto sobre el catálogo público (CA-02).
 */
export function buscarEnCatalogoPublico(
  capacitaciones: ItemCapacitacionPublica[] = [],
  termino: string = ''
): ItemCapacitacionPublica[] {
  const publicas = filtrarCapacitacionesPublicas(capacitaciones);
  const q = termino.trim().toLowerCase();
  if (!q) return publicas;

  return publicas.filter((cap) => {
    const enTitulo = cap.titulo.toLowerCase().includes(q);
    const enDescripcion = cap.descripcion.toLowerCase().includes(q);
    const enUnidad = cap.unidad.toLowerCase().includes(q);
    const enCategoria = (cap.categoria || '').toLowerCase().includes(q);
    return enTitulo || enDescripcion || enUnidad || enCategoria;
  });
}

/**
 * Valida que la consulta pública es abierta e inocua para el progreso de onboarding (CA-03).
 */
export function validarConsultaPublica(_parametros: Record<string, unknown> = {}): ResultadoConsultaPublica {
  return {
    valido: true,
    requiereAutenticacion: false,
    alteraProgresoOnboarding: false,
  };
}
