// Capa de negocio del avance de capacitación: sin HTTP. Devuelve datos o lanza ErrorProgreso (con su código).
import {
  ErrorProgreso, calcularPorcentajeAvance, prerrequisitosCumplidos,
  puedeFinalizar, registrarConfirmacion, slideDeReanudacion,
} from '@/lib/progreso-capacitacion';
import {
  actualizarProgresoSiNoCambio, buscarCapacitacionInternaPublicada, buscarCapacitacionParaVisor, buscarProgreso, claveDeProgreso,
  crearProgreso, idsCompletadas,
  type CambioProgresoDatos, type CapacitacionInterna as Capacitacion, type ClaveProgreso, type NuevoProgreso,
  type RegistroProgreso as Progreso,
} from '@/lib/repositorio-progreso';
import { buscarEvaluacionPorCapacitacion } from '@/lib/repositorio-evaluacion';

const ID_VALIDO = /^[a-f\d]{24}$/i;

interface Preparado {
  usuarioId: string; id: string; total: number;
  clave: ClaveProgreso;
  capacitacion: Capacitacion; progreso: Progreso | null;
}

export function presentar(progreso: Progreso | null, total: number) {
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

// Valida el identificador y obtiene la capacitación interna publicada con el avance del usuario.
async function preparar(usuarioId: string, id: string): Promise<Preparado> {
  if (!ID_VALIDO.test(id)) throw new ErrorProgreso('El identificador de la capacitación no es válido.', 400);
  const capacitacion = await buscarCapacitacionInternaPublicada(id);
  if (!capacitacion) throw new ErrorProgreso('Capacitación no encontrada.', 404);
  const clave = claveDeProgreso(usuarioId, id);
  const progreso = await buscarProgreso(clave);
  return { usuarioId, id, clave, capacitacion, progreso, total: capacitacion.slides.length };
}

async function exigirPrerrequisitos(usuarioId: string, prerrequisitos: string[]) {
  if (prerrequisitos.length === 0) return true;
  return prerrequisitosCumplidos(prerrequisitos, await idsCompletadas(usuarioId));
}

async function exigirHabilitada(usuarioId: string, prerrequisitos: string[]) {
  if (!(await exigirPrerrequisitos(usuarioId, prerrequisitos))) throw new ErrorProgreso('Completa primero las capacitaciones previas.', 403);
}

export async function consultarProgreso(usuarioId: string, id: string) {
  const { progreso, total } = await preparar(usuarioId, id);
  return presentar(progreso, total);
}

type Cambio = { create: NuevoProgreso; update: CambioProgresoDatos } | null;
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

export async function guardarProgreso(usuarioId: string, id: string, slideConfirmado: unknown) {
  const preparado = await preparar(usuarioId, id);
  const { capacitacion, total } = preparado;
  await exigirHabilitada(usuarioId, capacitacion.prerrequisitos);
  const guardado = await escribirProgreso(preparado, actual => {
    const previos = actual?.slidesConfirmados ?? [];
    const confirmados = registrarConfirmacion(previos, slideConfirmado, total);
    const slide = slideConfirmado as number;
    // Repetir la misma confirmación no escribe ni modifica el avance.
    if (actual && actual.ultimoSlide === slide && confirmados.length === previos.length) return null;
    return {
      create: { usuarioId, capacitacionId: id, ultimoSlide: slide, slidesConfirmados: confirmados, estado: 'EN_CURSO' },
      update: { ultimoSlide: slide, slidesConfirmados: confirmados },
    };
  });
  return presentar(guardado, total);
}

export async function finalizarProgreso(usuarioId: string, id: string) {
  const preparado = await preparar(usuarioId, id);
  const { capacitacion, total } = preparado;
  await exigirHabilitada(usuarioId, capacitacion.prerrequisitos);
  // Con microtest (HU-014), la capacitación se completa solo al aprobarlo.
  if (preparado.progreso?.estado !== 'COMPLETADA' && await buscarEvaluacionPorCapacitacion(id)) {
    throw new ErrorProgreso('Aprueba el microtest para completar esta capacitación.', 409);
  }
  const guardado = await escribirProgreso(preparado, actual => {
    if (actual?.estado === 'COMPLETADA') return null;
    if (!puedeFinalizar(actual, total)) throw new ErrorProgreso('Confirma todos los slides y finaliza desde el último.', 409);
    const completadaEn = new Date();
    return {
      create: { usuarioId, capacitacionId: id, ultimoSlide: total, slidesConfirmados: actual?.slidesConfirmados ?? [], estado: 'COMPLETADA', completadaEn },
      update: { estado: 'COMPLETADA', completadaEn },
    };
  });
  return presentar(guardado, total);
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
