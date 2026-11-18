import SlideViewer from '@/app/capacitaciones/[id]/SlideViewer';
import type { SlideVisor } from '@/lib/visor-capacitacion';

export interface ContenidoCapacitacion {
  titulo: string;
  descripcion: string;
  unidad: string;
  slides: SlideVisor[];
}

// La vista previa y el recorrido público utilizan exactamente la misma presentación.
export function ExperienciaCapacitacion({
  capacitacion,
  slideInicial,
  onSlideChange,
}: {
  capacitacion: ContenidoCapacitacion;
  slideInicial?: number;
  onSlideChange?: (slideOrden: number) => Promise<void>;
}) {
  return <section className="experiencia-capacitacion">
    <header className="experiencia-capacitacion__cabecera">
      <p className="kicker-cgb">{capacitacion.unidad}</p>
      <h1>{capacitacion.titulo}</h1>
      <p className="experiencia-capacitacion__descripcion">{capacitacion.descripcion}</p>
    </header>
    <SlideViewer
      slides={capacitacion.slides}
      slideInicial={slideInicial}
      seguimiento={onSlideChange ? {
        guardar: async (slide) => {
          await onSlideChange(slide);
          return true;
        },
        finalizar: async () => true,
        completada: false,
      } : undefined}
    />
  </section>;
}
