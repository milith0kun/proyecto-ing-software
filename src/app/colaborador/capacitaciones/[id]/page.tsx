import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { buscarCapacitacionParaVisor, buscarProgreso, claveDeProgreso, idsCompletadas } from '@/lib/repositorio-progreso';
import { sesionActual } from '@/lib/sesion';
import { prerrequisitosCumplidos, slideDeReanudacion } from '@/lib/progreso-capacitacion';
import { MarcoCapacitacion } from '@/components/capacitaciones/MarcoCapacitacion';
import { VisorCapacitacionInterna } from '@/components/capacitaciones/VisorCapacitacionInterna';

export const dynamic = 'force-dynamic';

export default async function PaginaCapacitacionInterna({ params }: { params: Promise<{ id: string }> }) {
  const usuario = await sesionActual();
  if (!usuario) redirect('/login');
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) notFound();

  const capacitacion = await buscarCapacitacionParaVisor(id);
  if (!capacitacion) notFound();

  if (!prerrequisitosCumplidos(capacitacion.prerrequisitos, await idsCompletadas(usuario.id))) {
    return <MarcoCapacitacion>
      <section role="status" className="visor-sin-contenido">
        Completa primero las capacitaciones previas para habilitar esta. <Link href="/colaborador">Volver a mi espacio</Link>
      </section>
    </MarcoCapacitacion>;
  }

  const progreso = await buscarProgreso(claveDeProgreso(usuario.id, id));

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
          slideInicial={slideDeReanudacion(progreso, capacitacion.slides.length)}
          completada={progreso?.estado === 'COMPLETADA'}
        />
      </section>
    </MarcoCapacitacion>
  );
}
