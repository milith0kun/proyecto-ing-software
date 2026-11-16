export interface ProgresoCapacitacionResumen {
  capacitacionId: string;
  ultimoSlideOrden: number;
  completada: boolean;
}

interface CapacitacionRutaResumen {
  id: string;
  titulo: string;
  descripcion: string;
  slides: Array<{ id: string; orden: number }>;
}

interface AsignacionCapacitacionResumen {
  orden: number;
  capacitacion: CapacitacionRutaResumen;
}

interface RutaOnboardingResumen {
  id: string;
  nombre: string;
  descripcion?: string | null;
  capacitaciones: AsignacionCapacitacionResumen[];
}

export function construirPanelMiOnboarding(
  ruta: RutaOnboardingResumen | null | undefined,
  progresos: ProgresoCapacitacionResumen[],
) {
  const progresoPorCapacitacion = new Map(progresos.map(progreso => [progreso.capacitacionId, progreso]));
  const capacitaciones = [...(ruta?.capacitaciones ?? [])]
    .sort((primera, segunda) => primera.orden - segunda.orden)
    .map(({ capacitacion }) => {
      const progreso = progresoPorCapacitacion.get(capacitacion.id);
      const totalSlides = capacitacion.slides.length;
      const completada = Boolean(progreso?.completada);
      const ultimoSlideOrden = Math.max(0, Math.min(progreso?.ultimoSlideOrden ?? 0, totalSlides));

      return {
        id: capacitacion.id,
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

  return {
    ruta: ruta ? { id: ruta.id, nombre: ruta.nombre, descripcion: ruta.descripcion ?? null } : null,
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