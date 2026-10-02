export interface SlideVisor {
  id: string;
  orden: number;
  titulo: string;
  contenido: string;
  tipo: string;
  imagenUrl: string | null;
  botonTexto: string | null;
  botonUrl: string | null;
  lista: string[];
}

interface CapacitacionPublica {
  estado: string;
  ambito: string;
}

interface AccionSlide {
  tipo: string;
  botonTexto?: string | null;
  botonUrl?: string | null;
}

export function obtenerSiguienteSlide(slideActual: number, totalSlides: number): number {
  const total = Math.max(0, Math.floor(totalSlides));
  if (total === 0) return 0;

  const actual = Math.min(Math.max(Math.floor(slideActual), 1), total);
  return Math.min(actual + 1, total);
}

export function obtenerSlideAnterior(slideActual: number, totalSlides: number): number {
  const total = Math.max(0, Math.floor(totalSlides));
  if (total === 0) return 0;

  const actual = Math.min(Math.max(Math.floor(slideActual), 1), total);
  return Math.max(actual - 1, 1);
}

export function navegarPorTeclado(tecla: string, slideActual: number, totalSlides: number): number {
  if (tecla === 'ArrowRight' || tecla === 'PageDown') {
    return obtenerSiguienteSlide(slideActual, totalSlides);
  }
  if (tecla === 'ArrowLeft' || tecla === 'PageUp') {
    return obtenerSlideAnterior(slideActual, totalSlides);
  }
  return slideActual;
}

export function obtenerAccionSlide(slide: AccionSlide): { texto: string; url: string } | null {
  if (slide.tipo !== 'INTERACTIVE') return null;

  const texto = slide.botonTexto?.trim() ?? '';
  const url = slide.botonUrl?.trim() ?? '';
  if (!texto || !url) return null;

  try {
    const destino = new URL(url);
    if (destino.protocol !== 'https:' && destino.protocol !== 'http:') return null;
  } catch {
    return null;
  }

  return { texto, url };
}

export function calcularProgresoLectura(slideActual: number, totalSlides: number): number {
  const total = Math.max(0, Math.floor(totalSlides));
  if (total === 0) return 0;

  const actual = Math.min(Math.max(Math.floor(slideActual), 0), total);
  return Math.round((actual / total) * 100);
}

export function capacitacionDisponible(capacitacion: CapacitacionPublica | null | undefined): boolean {
  return capacitacion?.estado === 'PUBLICADA' && capacitacion.ambito === 'PUBLICO';
}
