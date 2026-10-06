import SlideViewer from '@/app/capacitaciones/[id]/SlideViewer';
import type { SlideVisor } from '@/lib/visor-capacitacion';

export interface ContenidoCapacitacion {
  titulo: string;
  descripcion: string;
  unidad: string;
  slides: SlideVisor[];
}

// La vista previa y el recorrido público utilizan exactamente la misma presentación.
export function ExperienciaCapacitacion({ capacitacion }: { capacitacion: ContenidoCapacitacion }) {
  return <section className="experiencia-capacitacion">
    <header style={{ marginBottom: '28px' }}>
      <p style={{ margin: '0 0 8px', color: 'var(--brand-blue)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>{capacitacion.unidad}</p>
      <h1 style={{ margin: '0 0 12px', color: 'var(--brand-navy)', fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 5vw, 42px)', lineHeight: 1.15 }}>{capacitacion.titulo}</h1>
      <p style={{ maxWidth: '760px', margin: 0, color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.7 }}>{capacitacion.descripcion}</p>
    </header>
    <SlideViewer slides={capacitacion.slides} />
  </section>;
}
