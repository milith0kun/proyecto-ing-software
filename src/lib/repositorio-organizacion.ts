// Capa de acceso a datos de la estructura organizacional (HU-007 / CGB-31).
// Único módulo del flujo de áreas y puestos que conoce Prisma/MongoDB.
import { prisma } from '@/lib/prisma';
import { armarEstructura, type AreaEstructura } from '@/lib/organizacion';

export interface AreaRegistro {
  id: string;
  nombre: string;
  nombreClave?: string;
  activa: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PuestoRegistro {
  id: string;
  nombre: string;
  nombreClave?: string;
  areaId: string;
  area?: { id: string; nombre: string; activa: boolean } | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export function listarAreasRepositorio(options?: { soloActivas?: boolean }): Promise<AreaRegistro[]> {
  const soloActivas = Boolean(options?.soloActivas);
  return prisma.area.findMany({
    where: soloActivas ? { activa: true } : {},
    orderBy: { nombre: 'asc' },
    select: { id: true, nombre: true, activa: true },
  });
}

export function listarAreasExceptoId(id: string): Promise<Array<{ id: string; nombre: string }>> {
  return prisma.area.findMany({
    where: { id: { not: id } },
    select: { id: true, nombre: true },
  });
}

export function buscarAreaPorId(id: string): Promise<AreaRegistro | null> {
  return prisma.area.findUnique({ where: { id } });
}

export function buscarAreaConConteoPuestos(
  id: string
): Promise<(AreaRegistro & { _count: { puestos: number } }) | null> {
  return prisma.area.findUnique({
    where: { id },
    include: { _count: { select: { puestos: true } } },
  });
}

export function guardarArea(datos: {
  nombre: string;
  nombreClave: string;
  activa: boolean;
}): Promise<AreaRegistro> {
  return prisma.area.create({ data: datos });
}

export function modificarArea(
  id: string,
  cambios: { nombre?: string; nombreClave?: string; activa?: boolean }
): Promise<AreaRegistro> {
  return prisma.area.update({ where: { id }, data: cambios });
}

export function borrarAreaPorId(id: string) {
  return prisma.area.delete({ where: { id } });
}

export function listarPuestosRepositorio(areaId?: string): Promise<PuestoRegistro[]> {
  return prisma.puestoTrabajo.findMany({
    where: areaId ? { areaId } : {},
    orderBy: { nombre: 'asc' },
    include: { area: { select: { id: true, nombre: true, activa: true } } },
  });
}

export function listarPuestosBasicos(areaId?: string): Promise<Array<{ id: string; nombre: string; areaId: string }>> {
  return prisma.puestoTrabajo.findMany({
    where: areaId ? { areaId } : {},
    orderBy: { nombre: 'asc' },
    select: { id: true, nombre: true, areaId: true },
  });
}

export function guardarPuesto(datos: {
  nombre: string;
  nombreClave: string;
  areaId: string;
}): Promise<PuestoRegistro> {
  return prisma.puestoTrabajo.create({ data: datos });
}

/**
 * Obtiene la jerarquía completa de áreas y puestos para administración.
 * El conteo de colaboradores por puesto queda en 0 hasta integrar CGB-41
 * (relación Colaborador -> PuestoTrabajo.id).
 */
export async function obtenerEstructuraOrganizacional(options?: {
  soloActivas?: boolean;
}): Promise<AreaEstructura[]> {
  const [areas, puestos] = await Promise.all([
    listarAreasRepositorio(options),
    listarPuestosBasicos(),
  ]);

  return armarEstructura(areas, puestos, {});
}
