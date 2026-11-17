// Reglas puras del avance de capacitaciones internas (HU-012).

export type EstadoProgreso = 'EN_CURSO' | 'COMPLETADA';

export class ErrorProgreso extends Error {
  constructor(message: string, readonly status: 400 | 409) {
    super(message);
  }
}

export function calcularPorcentajeAvance(slidesConfirmados: number[], totalSlides: number): number {
  const total = Math.max(0, Math.floor(totalSlides));
  if (total === 0) return 0;
  const unicos = new Set(slidesConfirmados.filter(n => Number.isInteger(n) && n >= 1 && n <= total));
  return Math.min(100, Math.round((unicos.size / total) * 100));
}

export function slideDeReanudacion(progreso: { ultimoSlide: number } | null | undefined, totalSlides: number): number {
  if (!progreso || totalSlides < 1) return 1;
  return Math.min(Math.max(Math.floor(progreso.ultimoSlide), 1), totalSlides);
}

export function prerrequisitosCumplidos(prerrequisitos: string[], completadas: string[]): boolean {
  const hechas = new Set(completadas);
  return prerrequisitos.every(id => hechas.has(id));
}

// Devuelve el conjunto ordenado de slides confirmados tras confirmar `slide`.
// No se permite saltar slides: solo se confirma hasta el siguiente al máximo ya confirmado.
export function registrarConfirmacion(previos: number[], slide: unknown, totalSlides: number): number[] {
  if (!Number.isInteger(slide) || (slide as number) < 1 || (slide as number) > totalSlides) {
    throw new ErrorProgreso('El slide indicado no es válido.', 400);
  }
  const numero = slide as number;
  const maximo = previos.reduce((mayor, n) => Math.max(mayor, n), 0);
  if (numero > maximo + 1) throw new ErrorProgreso('Debes confirmar los slides anteriores primero.', 409);
  return [...new Set([...previos, numero])].sort((a, b) => a - b);
}

export function puedeFinalizar(progreso: { slidesConfirmados: number[]; ultimoSlide: number } | null | undefined, totalSlides: number): boolean {
  return !!progreso && totalSlides > 0 && progreso.ultimoSlide === totalSlides &&
    calcularPorcentajeAvance(progreso.slidesConfirmados, totalSlides) === 100;
}
