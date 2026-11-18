import { prisma } from '@/lib/prisma';

export function listarRutasAdministracion() {
  return prisma.rutaOnboarding.findMany({
    orderBy: { nombre: 'asc' },
    select: {
      id: true,
      nombre: true,
      descripcion: true,
      objetivo: true,
      activa: true,
      estado: true,
      _count: { select: { pasos: true, usuarios: true } },
    },
  });
}

export function buscarRutaAsignaciones(id: string) {
  return prisma.rutaOnboarding.findUnique({
    where: { id },
    select: { id: true, nombre: true, descripcion: true, activa: true },
  });
}

export function listarPasosRuta(rutaId: string) {
  return prisma.pasoRuta.findMany({
    where: { rutaId },
    orderBy: { orden: 'asc' },
    select: {
      orden: true,
      capacitacion: {
        select: { id: true, titulo: true, descripcion: true, unidad: true, ambito: true, estado: true },
      },
    },
  });
}

export function listarCapacitacionesPublicadas() {
  return prisma.capacitacion.findMany({
    where: { estado: 'PUBLICADA' },
    orderBy: { titulo: 'asc' },
    select: { id: true, titulo: true, descripcion: true, unidad: true, ambito: true, estado: true },
  });
}

export function buscarCapacitacionesPublicadas(ids: string[]) {
  if (ids.length === 0) return Promise.resolve([]);
  return prisma.capacitacion.findMany({
    where: { id: { in: ids }, estado: 'PUBLICADA' },
    select: { id: true },
  });
}

export function reemplazarPasosRuta(rutaId: string, asignaciones: Array<{ capacitacionId: string; orden: number }>) {
  return prisma.$transaction(async transaccion => {
    await transaccion.pasoRuta.deleteMany({ where: { rutaId } });
    if (asignaciones.length > 0) {
      await transaccion.pasoRuta.createMany({
        data: asignaciones.map(asignacion => ({
          rutaId,
          capacitacionId: asignacion.capacitacionId,
          orden: asignacion.orden,
          obligatorio: true,
        })),
      });
    }
  });
}