import { notFound, redirect } from 'next/navigation';
import { ExperienciaCapacitacion } from '@/components/capacitaciones/ExperienciaCapacitacion';
import { MarcoCapacitacion } from '@/components/capacitaciones/MarcoCapacitacion';
import { prisma } from '@/lib/prisma';
import { sesionActual } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

export default async function PaginaCapacitacionOnboarding({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ slide?: string | string[] }>;
}) {
  const usuario = await sesionActual();
  if (!usuario || usuario.role !== 'COLABORADOR') redirect('/login');

  const [{ id }, query] = await Promise.all([params, searchParams]);
  if (!/^[a-f\d]{24}$/i.test(id)) notFound();

  const asignacion = await prisma.colaborador.findUnique({
    where: { userId: usuario.id },
    select: {
      rutaOnboarding: {
        select: {
          capacitaciones: {
            where: { capacitacionId: id },
            select: { id: true },
          },
        },
      },
    },
  });
  if (!asignacion?.rutaOnboarding?.capacitaciones.length) notFound();

  const capacitacion = await prisma.capacitacion.findFirst({
    where: { id, ambito: 'INTERNO' },
    select: {
      id: true,
      titulo: true,
      descripcion: true,
      unidad: true,
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
  });
  if (!capacitacion) notFound();

  const valorSlide = Array.isArray(query.slide) ? query.slide[0] : query.slide;
  const slideInicial = valorSlide && /^\d+$/.test(valorSlide) ? Number(valorSlide) : 1;

  return (
    <MarcoCapacitacion>
      <ExperienciaCapacitacion capacitacion={capacitacion} slideInicial={slideInicial} />
    </MarcoCapacitacion>
  );
}