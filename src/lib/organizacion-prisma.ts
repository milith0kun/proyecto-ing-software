import { prisma } from './prisma';
import { armarEstructura, type AreaEstructura } from './organizacion';

/**
 * Obtiene la jerarquía completa de áreas y puestos para administración.
 * El conteo de colaboradores por puesto queda en 0 hasta integrar CGB-41
 * (relación Colaborador -> PuestoTrabajo.id).
 */
export async function obtenerEstructuraOrganizacional(options?: {
  soloActivas?: boolean;
}): Promise<AreaEstructura[]> {
  const soloActivas = Boolean(options?.soloActivas);

  const [areas, puestos] = await Promise.all([
    prisma.area.findMany({
      where: soloActivas ? { activa: true } : {},
      orderBy: { nombre: 'asc' },
      select: { id: true, nombre: true, activa: true },
    }),
    prisma.puestoTrabajo.findMany({
      orderBy: { nombre: 'asc' },
      select: { id: true, nombre: true, areaId: true },
    }),
  ]);

  return armarEstructura(areas, puestos, {});
}
