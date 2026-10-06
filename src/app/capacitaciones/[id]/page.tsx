import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { consultarCapacitacionPublica } from '@/lib/consultar-capacitacion-publica';
import { ExperienciaCapacitacion } from '@/components/capacitaciones/ExperienciaCapacitacion';
import { MarcoCapacitacion } from '@/components/capacitaciones/MarcoCapacitacion';

export const dynamic = 'force-dynamic';

type ContextoPagina = { params: Promise<{ id: string }> };

export default async function PaginaCapacitacionPublica({ params }: ContextoPagina) {
  const { id } = await params;

  const capacitacion = await consultarCapacitacionPublica(id, (where) =>
    prisma.capacitacion.findFirst({
      where,
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        unidad: true,
        estado: true,
        ambito: true,
        slides: {
          orderBy: { orden: 'asc' },
          select: {
            id: true,
            orden: true,
            titulo: true,
            contenido: true,
            tipo: true,
            imagenUrl: true,
            botonTexto: true,
            botonUrl: true,
            lista: true,
          },
        },
      },
    }),
  );

  if (!capacitacion) notFound();

  return (
    <MarcoCapacitacion>
      <ExperienciaCapacitacion capacitacion={capacitacion} />
    </MarcoCapacitacion>
  );
}
