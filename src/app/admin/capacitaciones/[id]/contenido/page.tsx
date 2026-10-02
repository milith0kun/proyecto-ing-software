import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import EditorContenido from './EditorContenido';

export const dynamic = 'force-dynamic';

export default async function PaginaContenido({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) notFound();

  const capacitacion = await prisma.capacitacion.findUnique({
    where: { id },
    include: { slides: { orderBy: { orden: 'asc' } } },
  });
  if (!capacitacion) notFound();

  return (
    <EditorContenido
      inicial={{
        id: capacitacion.id,
        titulo: capacitacion.titulo,
        descripcion: capacitacion.descripcion,
        unidad: capacitacion.unidad,
        ambito: capacitacion.ambito,
        estado: capacitacion.estado,
        categoria: capacitacion.categoria,
        duracionMin: capacitacion.duracionMin,
        slides: capacitacion.slides.map((slide) => ({
          id: slide.id,
          orden: slide.orden,
          titulo: slide.titulo,
          contenido: slide.contenido,
          tipo: slide.tipo,
        })),
      }}
    />
  );
}
