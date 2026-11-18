// Capa de acceso a datos del microtest (HU-014). Aísla Prisma del servicio y de las páginas.
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { PreguntaMicrotest } from '@/lib/microtest';

export interface EvaluacionGuardada {
  id: string; capacitacionId: string; notaMinima: number; maxIntentos: number;
  tiempoLimiteSeg: number | null; preguntas: PreguntaMicrotest[];
}
export interface IntentoGuardado { numero: number; aprobado: boolean; puntaje: number }

export function buscarEvaluacionPorCapacitacion(capacitacionId: string): Promise<EvaluacionGuardada | null> {
  return prisma.evaluacion.findUnique({ where: { capacitacionId } });
}

export function listarIntentos(usuarioId: string, evaluacionId: string): Promise<IntentoGuardado[]> {
  return prisma.intentoEvaluacion.findMany({ where: { usuarioId, evaluacionId }, orderBy: { numero: 'asc' } });
}

export function crearIntento(data: Prisma.IntentoEvaluacionUncheckedCreateInput): Promise<IntentoGuardado> {
  return prisma.intentoEvaluacion.create({ data });
}

// Idempotente: solo cambia un avance que todavía está en curso.
export function marcarCapacitacionCompletada(usuarioId: string, capacitacionId: string) {
  return prisma.progresoCapacitacion.updateMany({
    where: { usuarioId, capacitacionId, estado: 'EN_CURSO' },
    data: { estado: 'COMPLETADA', completadaEn: new Date() },
  });
}
