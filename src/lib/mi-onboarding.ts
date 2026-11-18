export interface ProgresoCapacitacionResumen {
  capacitacionId: string;
  ultimoSlideOrden?: number;
  ultimoSlide?: number;
  completada?: boolean;
  estado?: string;
}

interface CapacitacionRutaResumen {
  id: string;
  titulo: string;
  descripcion: string;
  slides: Array<{ id: string; orden: number }>;
}

interface PasoRutaResumen {
  orden: number;
  capacitacion: CapacitacionRutaResumen;
}

interface RutaOnboardingResumen {
  id: string;
  nombre?: string | null;
  titulo?: string | null;
  descripcion?: string | null;
  objetivo?: string | null;
  pasos?: PasoRutaResumen[];
  capacitaciones?: Array<PasoRutaResumen & { pasoId?: string }>;
}

export function construirPanelMiOnboarding(
  ruta: RutaOnboardingResumen | null | undefined,
  progresos: ProgresoCapacitacionResumen[],
) {
  const progresoPorCapacitacion = new Map(progresos.map(progreso => [progreso.capacitacionId, progreso]));
  const asignaciones = ruta?.pasos ?? ruta?.capacitaciones ?? [];
  const capacitaciones = [...asignaciones]
    .sort((primera, segunda) => primera.orden - segunda.orden)
    .map(({ capacitacion, orden }) => {
      const progreso = progresoPorCapacitacion.get(capacitacion.id);
      const totalSlides = capacitacion.slides.length;
      const completada = progreso?.completada === true || progreso?.estado === 'COMPLETADA';
      const ultimoGuardado = progreso?.ultimoSlideOrden ?? progreso?.ultimoSlide ?? 0;
      const ultimoSlideOrden = Math.max(0, Math.min(ultimoGuardado, totalSlides));

      return {
        id: capacitacion.id,
        orden,
        titulo: capacitacion.titulo,
        descripcion: capacitacion.descripcion,
        totalSlides,
        ultimoSlideOrden,
        estado: completada ? 'COMPLETADA' as const : ultimoSlideOrden > 0 ? 'EN_PROGRESO' as const : 'PENDIENTE' as const,
      };
    });

  const total = capacitaciones.length;
  const completadas = capacitaciones.filter(capacitacion => capacitacion.estado === 'COMPLETADA').length;
  const siguiente = capacitaciones.find(capacitacion => capacitacion.estado !== 'COMPLETADA');
  const slide = siguiente ? Math.max(1, siguiente.ultimoSlideOrden || 1) : null;
  const nombre = ruta?.nombre ?? ruta?.titulo ?? null;
  const descripcion = ruta?.descripcion ?? ruta?.objetivo ?? null;

  return {
    ruta: ruta ? { id: ruta.id, nombre: nombre ?? 'Mi Onboarding', descripcion } : null,
    capacitaciones,
    total,
    completadas,
    porcentaje: total === 0 ? 0 : Math.round((100 * completadas) / total),
    completada: total > 0 && completadas === total,
    continuar: siguiente && slide !== null
      ? {
          capacitacionId: siguiente.id,
          titulo: siguiente.titulo,
          slide,
          href: `/colaborador/capacitaciones/${siguiente.id}?slide=${slide}`,
        }
      : null,
    transparencia: 'Tu avance es personal y se guarda para que puedas continuar cuando vuelvas.',
  };
}