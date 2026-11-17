import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
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

  const capacitacion = await prisma.capacitacion.findFirst({
    where: { id, estado: 'PUBLICADA', ambito: 'INTERNO' },
    select: {
      id: true, titulo: true, descripcion: true, unidad: true, prerrequisitos: true,
      slides: { orderBy: { orden: 'asc' }, select: { id: true, orden: true, titulo: true, contenido: true, tipo: true, imagenUrl: true, botonTexto: true, botonUrl: true, lista: true } },
    },
  });
  if (!capacitacion) notFound();

  const completadas = await prisma.progresoCapacitacion.findMany({
    where: { usuarioId: usuario.id, estado: 'COMPLETADA' }, select: { capacitacionId: true },
  });
  if (!prerrequisitosCumplidos(capacitacion.prerrequisitos, completadas.map(p => p.capacitacionId))) {
    return <MarcoCapacitacion>
      <section role="status" className="visor-sin-contenido">
        Completa primero las capacitaciones previas para habilitar esta. <Link href="/colaborador">Volver a mi espacio</Link>
      </section>
    </MarcoCapacitacion>;
  }

  const progreso = await prisma.progresoCapacitacion.findUnique({
    where: { usuarioId_capacitacionId: { usuarioId: usuario.id, capacitacionId: id } },
  });

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
