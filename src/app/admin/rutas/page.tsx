import { prisma } from '@/lib/prisma';
import ConstructorRutas from './ConstructorRutas';

export const dynamic = 'force-dynamic';

export default async function PaginaRutasOnboarding() {
  const [areas, capacitaciones, rutas] = await Promise.all([
    prisma.area.findMany({
      where: { activa: true },
      orderBy: { nombre: 'asc' },
      include: { puestos: { orderBy: { nombre: 'asc' } } },
    }),
    prisma.capacitacion.findMany({
      where: { estado: 'PUBLICADA' },
      orderBy: { titulo: 'asc' },
      select: { id: true, titulo: true, unidad: true, duracionMin: true },
    }),
    prisma.rutaOnboarding.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        pasos: {
          orderBy: { orden: 'asc' },
          include: { capacitacion: { select: { titulo: true } } },
        },
      },
    }),
  ]);

  const rutasIniciales = rutas.map(r => ({
    id: r.id,
    titulo: r.titulo,
    objetivo: r.objetivo,
    estado: r.estado,
    areaId: r.areaId,
    puestoId: r.puestoId,
    activadaEn: r.activadaEn ? r.activadaEn.toISOString() : null,
    pasos: r.pasos.map(p => ({
      id: p.id,
      rutaId: p.rutaId,
      capacitacionId: p.capacitacionId,
      orden: p.orden,
      obligatorio: p.obligatorio,
      capacitacionTitulo: p.capacitacion?.titulo,
    })),
  }));

  return (
    <ConstructorRutas
      areas={areas.map(a => ({
        id: a.id,
        nombre: a.nombre,
        puestos: a.puestos.map(p => ({ id: p.id, nombre: p.nombre, areaId: p.areaId })),
      }))}
      capacitaciones={capacitaciones}
      rutasIniciales={rutasIniciales}
    />
  );
}
