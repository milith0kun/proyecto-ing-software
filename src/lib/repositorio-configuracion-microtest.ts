/**
 * Capa de acceso a datos para configuración de microtests formativos (HU-013 / CGB-61).
 * Único módulo del flujo HU-013 que importa Prisma directamente.
 */
import { prisma } from '@/lib/prisma';
import type { ConfiguracionMicrotestNormalizada } from '@/lib/configuracion-microtest';

export function esErrorUnicidadMicrotestPrisma(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  return (error as { code?: unknown }).code === 'P2002';
}

export async function listarCapacitacionesParaMicrotest() {
  return prisma.capacitacion.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      titulo: true,
      unidad: true,
      ambito: true,
      estado: true,
      evaluacion: {
        include: {
          _count: { select: { intentos: true } },
        },
      },
    },
  });
}

export async function listarMicrotestsConfigurados(capacitacionId?: string) {
  return prisma.evaluacion.findMany({
    where: capacitacionId ? { capacitacionId } : {},
    orderBy: { updatedAt: 'desc' },
    include: {
      capacitacion: {
        select: { id: true, titulo: true, unidad: true, ambito: true, estado: true },
      },
      _count: { select: { intentos: true } },
    },
  });
}

export async function buscarCapacitacionPorId(id: string) {
  return prisma.capacitacion.findUnique({
    where: { id },
    select: { id: true, titulo: true, estado: true, ambito: true, unidad: true },
  });
}

export async function buscarMicrotestPorCapacitacionId(capacitacionId: string) {
  return prisma.evaluacion.findUnique({
    where: { capacitacionId },
    include: {
      _count: { select: { intentos: true } },
    },
  });
}

export async function buscarMicrotestPorId(id: string) {
  return prisma.evaluacion.findUnique({
    where: { id },
    include: {
      capacitacion: {
        select: { id: true, titulo: true, unidad: true, ambito: true, estado: true },
      },
      _count: { select: { intentos: true } },
    },
  });
}

export async function crearMicrotestEnRepositorio(
  datos: ConfiguracionMicrotestNormalizada
) {
  return prisma.evaluacion.create({
    data: {
      capacitacionId: datos.capacitacionId,
      titulo: datos.titulo,
      notaMinima: datos.notaMinima,
      maxIntentos: datos.maxIntentos,
      tiempoLimiteSeg: datos.tiempoLimiteSeg,
      preguntas: datos.preguntas,
    },
    include: {
      capacitacion: {
        select: { id: true, titulo: true, unidad: true, ambito: true, estado: true },
      },
      _count: { select: { intentos: true } },
    },
  });
}

export async function actualizarMicrotestEnRepositorio(
  id: string,
  datos: Omit<ConfiguracionMicrotestNormalizada, 'capacitacionId'>
) {
  return prisma.evaluacion.update({
    where: { id },
    data: {
      titulo: datos.titulo,
      notaMinima: datos.notaMinima,
      maxIntentos: datos.maxIntentos,
      tiempoLimiteSeg: datos.tiempoLimiteSeg,
      preguntas: datos.preguntas,
    },
    include: {
      capacitacion: {
        select: { id: true, titulo: true, unidad: true, ambito: true, estado: true },
      },
      _count: { select: { intentos: true } },
    },
  });
}

export async function eliminarMicrotestEnRepositorio(id: string) {
  return prisma.evaluacion.delete({
    where: { id },
  });
}
