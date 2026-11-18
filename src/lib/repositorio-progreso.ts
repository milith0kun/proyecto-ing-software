// Capa de acceso a datos del avance de capacitaciones (HU-012).
// Único módulo del flujo de progreso que conoce Prisma; el servicio depende de estas funciones.
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export interface CapacitacionInterna { prerrequisitos: string[]; slides: { id: string }[] }
export interface RegistroProgreso {
  ultimoSlide: number; slidesConfirmados: number[]; estado: string; completadaEn?: Date | null; updatedAt?: Date;
}
export interface ClaveProgreso { usuarioId_capacitacionId: { usuarioId: string; capacitacionId: string } }

export const claveDeProgreso = (usuarioId: string, capacitacionId: string): ClaveProgreso =>
  ({ usuarioId_capacitacionId: { usuarioId, capacitacionId } });

export function buscarCapacitacionInternaPublicada(id: string): Promise<CapacitacionInterna | null> {
  return prisma.capacitacion.findFirst({
    where: { id, estado: 'PUBLICADA', ambito: 'INTERNO' },
    select: { id: true, prerrequisitos: true, slides: { select: { id: true } } },
  });
}

export function buscarProgreso(clave: ClaveProgreso): Promise<RegistroProgreso | null> {
  return prisma.progresoCapacitacion.findUnique({ where: clave });
}

export async function idsCompletadas(usuarioId: string): Promise<string[]> {
  const hechas: { capacitacionId: string }[] = await prisma.progresoCapacitacion.findMany({
    where: { usuarioId, estado: 'COMPLETADA' }, select: { capacitacionId: true },
  });
  return hechas.map(p => p.capacitacionId);
}

export function crearProgreso(data: Prisma.ProgresoCapacitacionUncheckedCreateInput): Promise<RegistroProgreso> {
  return prisma.progresoCapacitacion.create({ data });
}

// Actualiza solo si `updatedAt` no cambió desde la lectura (control optimista).
export function actualizarProgresoSiNoCambio(
  usuarioId: string, capacitacionId: string, updatedAt: Date | undefined,
  data: Prisma.ProgresoCapacitacionUncheckedUpdateManyInput,
): Promise<{ count: number }> {
  return prisma.progresoCapacitacion.updateMany({ where: { usuarioId, capacitacionId, updatedAt }, data });
}

// Datos que necesita la página del visor: la capacitación interna publicada con sus slides ordenados.
export function buscarCapacitacionParaVisor(id: string) {
  return prisma.capacitacion.findFirst({
    where: { id, estado: 'PUBLICADA', ambito: 'INTERNO' },
    select: {
      id: true, titulo: true, descripcion: true, unidad: true, prerrequisitos: true,
      slides: { orderBy: { orden: 'asc' }, select: { id: true, orden: true, titulo: true, contenido: true, tipo: true, imagenUrl: true, botonTexto: true, botonUrl: true, lista: true } },
    },
  });
}
