import { validarSlide, type SlideEntrada } from './slides.ts';

export interface CapacitacionPublicable {
  id: string;
  estado: string;
  publicadaEn: Date | null;
  slides: SlideEntrada[];
}

export class ErrorPublicacion extends Error {}

export function prepararPublicacion(capacitacion: CapacitacionPublicable, ahora = new Date()): { estado: 'PUBLICADA'; publicadaEn: Date } {
  if (!['BORRADOR', 'PUBLICADA'].includes(capacitacion.estado)) throw new ErrorPublicacion('El estado de la capacitación no permite publicarla');
  if (capacitacion.slides.length === 0) throw new ErrorPublicacion('Debe agregar al menos una diapositiva antes de publicar');
  if (!capacitacion.slides.some(slide => validarSlide({ ...slide, capacitacionId: capacitacion.id }).valido)) {
    throw new ErrorPublicacion('Debe agregar al menos una diapositiva completa antes de publicar');
  }
  return { estado: 'PUBLICADA', publicadaEn: capacitacion.estado === 'PUBLICADA' && capacitacion.publicadaEn ? capacitacion.publicadaEn : ahora };
}
