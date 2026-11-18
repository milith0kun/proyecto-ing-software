import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { exigirSesionInterna } from '@/lib/permisos';
import {
  ErrorProgreso, calcularPorcentajeAvance, prerrequisitosCumplidos,
  puedeFinalizar, registrarConfirmacion, slideDeReanudacion,
} from '@/lib/progreso-capacitacion';
import {
  actualizarProgresoSiNoCambio, buscarCapacitacionInternaPublicada, buscarCapacitacionParaVisor, buscarProgreso, claveDeProgreso,
  crearProgreso, idsCompletadas,
  type CapacitacionInterna as Capacitacion, type ClaveProgreso, type RegistroProgreso as Progreso,
} from '@/lib/repositorio-progreso';

const SIN_CACHE = { 'Cache-Control': 'no-store' };
const ID_VALIDO = /^[a-f\d]{24}$/i;

type Contexto = { params: Promise<{ id: string }> };

interface Preparado {
  usuarioId: string; id: string; total: number;
  clave: ClaveProgreso;
  capacitacion: Capacitacion; progreso: Progreso | null;
}

const falla = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status, headers: SIN_CACHE });

function presentar(progreso: Progreso | null, total: number) {
  return {
    slideInicial: slideDeReanudacion(progreso, total),
    ultimoSlide: progreso?.ultimoSlide ?? null,
    porcentaje: calcularPorcentajeAvance(progreso?.slidesConfirmados ?? [], total),
    estado: progreso?.estado ?? 'EN_CURSO',
    actualizadoEn: progreso?.updatedAt ?? null,
    completadaEn: progreso?.completadaEn ?? null,
    totalSlides: total,
  };
}

// Autentica, valida el identificador y obtiene la capacitación interna publicada con su avance.
async function prepararSolicitud(solicitud: NextRequest, { params }: Contexto): Promise<Preparado | NextResponse> {
  const sesion = await exigirSesionInterna(solicitud);
  if ('respuesta' in sesion) return sesion.respuesta;
  const { id } = await params;
  if (!ID_VALIDO.test(id)) return falla('El identificador de la capacitación no es válido.', 400);
  const capacitacion = await buscarCapacitacionInternaPublicada(id);
  if (!capacitacion) return falla('Capacitación no encontrada.', 404);
  const usuarioId = sesion.usuario.id;
  const clave = claveDeProgreso(usuarioId, id);
  const progreso = await buscarProgreso(clave);
  return { usuarioId, id, clave, capacitacion, progreso, total: capacitacion.slides.length };
}

async function exigirPrerrequisitos(usuarioId: string, prerrequisitos: string[]) {
  if (prerrequisitos.length === 0) return true;
  return prerrequisitosCumplidos(prerrequisitos, await idsCompletadas(usuarioId));
}

async function ejecutar(solicitud: NextRequest, contexto: Contexto, accion: (p: Preparado) => Promise<NextResponse>) {
  try {
    const preparado = await prepararSolicitud(solicitud, contexto);
    if (preparado instanceof NextResponse) return preparado;
    return await accion(preparado);
  } catch (error) {
    if (error instanceof ErrorProgreso) return falla(error.message, error.status);
    return falla('No pudimos procesar tu avance. Inténtalo nuevamente.', 503);
  }
}

export function consultarProgreso(solicitud: NextRequest, contexto: Contexto) {
  return ejecutar(solicitud, contexto, async ({ progreso, total }) =>
    NextResponse.json({ ok: true, datos: presentar(progreso, total) }, { headers: SIN_CACHE }));
}

type Cambio = { create: Prisma.ProgresoCapacitacionUncheckedCreateInput; update: Prisma.ProgresoCapacitacionUncheckedUpdateManyInput } | null;
const INTENTOS_MAXIMOS = 5;

// Escritura con control optimista: solo actualiza si nadie modificó el registro desde que se leyó.
// Si otra solicitud se adelantó, relee y recalcula, de modo que ninguna confirmación se pierde.
async function escribirProgreso({ usuarioId, id, clave, progreso }: Preparado, calcular: (actual: Progreso | null) => Cambio): Promise<Progreso | null> {
  let actual = progreso;
  for (let intento = 0; intento < INTENTOS_MAXIMOS; intento += 1) {
    if (intento > 0) actual = await buscarProgreso(clave);
    const cambio = calcular(actual);
    if (!cambio) return actual;
    if (!actual) {
      try {
        return await crearProgreso(cambio.create);
      } catch (error) {
        if ((error as { code?: string })?.code === 'P2002') continue; // otra solicitud creó el registro primero
        throw error;
      }
    }
    const { count } = await actualizarProgresoSiNoCambio(usuarioId, id, actual.updatedAt, cambio.update);
    if (count === 1) return await buscarProgreso(clave);
  }
  throw new ErrorProgreso('Tu avance cambió mientras se guardaba. Inténtalo nuevamente.', 409);
}

export function guardarProgreso(solicitud: NextRequest, contexto: Contexto) {
  return ejecutar(solicitud, contexto, async preparado => {
    const { usuarioId, id, capacitacion, total } = preparado;
    const cuerpo = await solicitud.json().catch(() => null);
    if (!(await exigirPrerrequisitos(usuarioId, capacitacion.prerrequisitos))) return falla('Completa primero las capacitaciones previas.', 403);
    const guardado = await escribirProgreso(preparado, actual => {
      const previos = actual?.slidesConfirmados ?? [];
      const confirmados = registrarConfirmacion(previos, cuerpo?.slide, total);
      const slide = cuerpo.slide as number;
      // Repetir la misma confirmación no escribe ni modifica el avance.
      if (actual && actual.ultimoSlide === slide && confirmados.length === previos.length) return null;
      return {
        create: { usuarioId, capacitacionId: id, ultimoSlide: slide, slidesConfirmados: confirmados, estado: 'EN_CURSO' },
        update: { ultimoSlide: slide, slidesConfirmados: confirmados },
      };
    });
    return NextResponse.json({ ok: true, datos: presentar(guardado, total) }, { headers: SIN_CACHE });
  });
}

export function finalizarProgreso(solicitud: NextRequest, contexto: Contexto) {
  return ejecutar(solicitud, contexto, async preparado => {
    const { usuarioId, id, capacitacion, total } = preparado;
    if (!(await exigirPrerrequisitos(usuarioId, capacitacion.prerrequisitos))) return falla('Completa primero las capacitaciones previas.', 403);
    const guardado = await escribirProgreso(preparado, actual => {
      if (actual?.estado === 'COMPLETADA') return null;
      if (!puedeFinalizar(actual, total)) throw new ErrorProgreso('Confirma todos los slides y finaliza desde el último.', 409);
      const completadaEn = new Date();
      return {
        create: { usuarioId, capacitacionId: id, ultimoSlide: total, slidesConfirmados: actual?.slidesConfirmados ?? [], estado: 'COMPLETADA', completadaEn },
        update: { estado: 'COMPLETADA', completadaEn },
      };
    });
    return NextResponse.json({ ok: true, datos: presentar(guardado, total) }, { headers: SIN_CACHE });
  });
}

// Caso de uso de la página del visor: la presentación consume el servicio y no el repositorio.
export type VisorCapacitacion =
  | { estado: 'no-encontrada' }
  | { estado: 'bloqueada' }
  | { estado: 'disponible'; capacitacion: NonNullable<Awaited<ReturnType<typeof buscarCapacitacionParaVisor>>>; slideInicial: number; completada: boolean };

export async function obtenerVisor(usuarioId: string, id: string): Promise<VisorCapacitacion> {
  if (!ID_VALIDO.test(id)) return { estado: 'no-encontrada' };
  const capacitacion = await buscarCapacitacionParaVisor(id);
  if (!capacitacion) return { estado: 'no-encontrada' };
  if (!(await exigirPrerrequisitos(usuarioId, capacitacion.prerrequisitos))) return { estado: 'bloqueada' };
  const progreso = await buscarProgreso(claveDeProgreso(usuarioId, id));
  return {
    estado: 'disponible', capacitacion,
    slideInicial: slideDeReanudacion(progreso, capacitacion.slides.length),
    completada: progreso?.estado === 'COMPLETADA',
  };
}
