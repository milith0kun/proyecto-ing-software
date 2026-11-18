import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { obtenerVisor } from '@/lib/servicio-progreso';
import { sesionActual } from '@/lib/sesion';
import { obtenerMicrotest } from '@/lib/servicio-evaluacion';
import { MarcoCapacitacion } from '@/components/capacitaciones/MarcoCapacitacion';
import { VisorCapacitacionInterna } from '@/components/capacitaciones/VisorCapacitacionInterna';

export const dynamic = 'force-dynamic';

export default async function PaginaCapacitacionInterna({ params }: { params: Promise<{ id: string }> }) {
  const usuario = await sesionActual();
  if (!usuario) redirect('/login');
  const { id } = await params;
  const visor = await obtenerVisor(usuario.id, id);
  if (visor.estado === 'no-encontrada') notFound();
  if (visor.estado === 'bloqueada') {
    return <MarcoCapacitacion>
      <section role="status" className="visor-sin-contenido">
        Completa primero las capacitaciones previas para habilitar esta. <Link href="/colaborador">Volver a mi espacio</Link>
      </section>
    </MarcoCapacitacion>;
  }
  const { capacitacion } = visor;

  const microtest = visor.completada ? null : await obtenerMicrotest(usuario.id, id);

  return (
    <MarcoCapacitacion>
      <section className="experiencia-capacitacion">
        <header className="experiencia-capacitacion__cabecera">
          <p className="kicker-cgb">{capacitacion.unidad}</p>
          <h1>{capacitacion.titulo}</h1>
          <p className="experiencia-capacitacion__descripcion">{capacitacion.descripcion}</p>
        </header>
        <VisorCapacitacionInterna
          capacitacionId={id}
          slides={capacitacion.slides}
          slideInicial={visor.slideInicial}
          completada={visor.completada}
          microtest={microtest}
        />
      </section>
    </MarcoCapacitacion>
  );
}
