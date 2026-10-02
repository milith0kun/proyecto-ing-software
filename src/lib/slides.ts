/**
 * Utilidades de dominio para gestionar slides dentro de una capacitación.
 * Cumple el ciclo TDD de HU-003: creación, reordenamiento y eliminación.
 */

export const TIPOS_DE_SLIDE_VALIDOS = ['TEXT', 'IMAGE', 'INTERACTIVE', 'INFO', 'EVALUACION'] as const;

export type TipoSlide = (typeof TIPOS_DE_SLIDE_VALIDOS)[number];

export interface SlideEntrada {
  id?: string;
  capacitacionId: string;
  titulo?: string;
  contenido?: string;
  tipo?: string;
  orden?: number;
}

export interface SlideNormalizado {
  id: string;
  capacitacionId: string;
  titulo: string;
  contenido: string;
  tipo: string;
  orden: number;
}

export interface ResultadoValidacionSlide {
  valido: boolean;
  errores: Record<string, string>;
}

export function validarSlide(datos: SlideEntrada): ResultadoValidacionSlide {
  const errores: Record<string, string> = {};

  const titulo = typeof datos.titulo === 'string' ? datos.titulo.trim() : '';
  if (!titulo || titulo.length < 3) {
    errores.titulo = 'El título del slide es obligatorio y debe tener al menos 3 caracteres.';
  }

  const contenido = typeof datos.contenido === 'string' ? datos.contenido.trim() : '';
  if (!contenido || contenido.length < 10) {
    errores.contenido = 'El contenido del slide es obligatorio y debe tener al menos 10 caracteres.';
  }

  const tipo = typeof datos.tipo === 'string' ? datos.tipo.toUpperCase().trim() : 'TEXT';
  if (!TIPOS_DE_SLIDE_VALIDOS.includes(tipo as TipoSlide)) {
    errores.tipo = 'El tipo de slide no es válido. Usa TEXT, IMAGE, INTERACTIVE, INFO o EVALUACION.';
  }

  if (!datos.capacitacionId || String(datos.capacitacionId).trim().length === 0) {
    errores.capacitacionId = 'La capacitación asociada es obligatoria.';
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores
  };
}

export function crearSlide(datos: SlideEntrada): { valido: boolean; errores: Record<string, string>; slide: SlideNormalizado } {
  const resultado = validarSlide(datos);

  if (!resultado.valido) {
    return {
      valido: false,
      errores: resultado.errores,
      slide: {
        id: '',
        capacitacionId: String(datos.capacitacionId || '').trim(),
        titulo: String(datos.titulo || '').trim(),
        contenido: String(datos.contenido || '').trim(),
        tipo: String(datos.tipo || 'TEXT').toUpperCase().trim(),
        orden: Number(datos.orden) || 1
      }
    };
  }

  const slide: SlideNormalizado = {
    id: datos.id || `slide_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    capacitacionId: String(datos.capacitacionId).trim(),
    titulo: String(datos.titulo).trim(),
    contenido: String(datos.contenido).trim(),
    tipo: String(datos.tipo || 'TEXT').toUpperCase().trim(),
    orden: Number(datos.orden) || 1
  };

  return {
    valido: true,
    errores: {},
    slide
  };
}

export function reordenarSlides<T extends { id: string; orden: number }>(slides: T[], slideId: string, nuevoOrden: number): T[] {
  if (!slideId) {
    return [...slides];
  }

  const slidesCopia = slides.map((slide) => ({ ...slide }));
  const indiceActual = slidesCopia.findIndex((slide) => slide.id === slideId);
  if (indiceActual === -1) {
    return slidesCopia;
  }

  const [slideMovido] = slidesCopia.splice(indiceActual, 1);
  const ordenObjetivo = Math.max(1, Math.min(nuevoOrden, slidesCopia.length + 1));
  slidesCopia.splice(ordenObjetivo - 1, 0, slideMovido);

  const resultado = slidesCopia.map((slide, index) => ({
    ...slide,
    orden: index + 1
  }));

  return resultado;
}

export function eliminarSlideYReindexar<T extends { id: string; orden: number }>(slides: T[], slideId: string): T[] {
  const slidesRestantes = slides.filter((slide) => slide.id !== slideId);

  return slidesRestantes.map((slide, index) => ({
    ...slide,
    orden: index + 1
  }));
}
