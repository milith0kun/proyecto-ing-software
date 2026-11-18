import { NextRequest, NextResponse } from 'next/server';
import { exigirSesionInterna } from '@/lib/permisos';
import { puedeFinalizar } from '@/lib/progreso-capacitacion';
import {
  ErrorMicrotest, apruebaNota, calcularResultado, intentosRestantes, preguntasParaResolver, validarRespuestas,
} from '@/lib/microtest';
import {
  buscarCapacitacionInternaPublicada, buscarProgreso, claveDeProgreso,
} from '@/lib/repositorio-progreso';
import {
  buscarEvaluacionPorCapacitacion, crearIntento, listarIntentos, marcarCapacitacionCompletada,
} from '@/lib/repositorio-evaluacion';

const SIN_CACHE = { 'Cache-Control': 'no-store' };
const ID_VALIDO = /^[a-f\d]{24}$/i;
const falla = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status, headers: SIN_CACHE });

// POST /api/evaluaciones/evaluar: califica un intento del microtest del colaborador autenticado.
export async function evaluarMicrotest(solicitud: NextRequest) {
  try {
    const sesion = await exigirSesionInterna(solicitud);
    if ('respuesta' in sesion) return sesion.respuesta;
    const usuarioId = sesion.usuario.id; // el intento siempre pertenece a la sesión, nunca al cuerpo
    const cuerpo = await solicitud.json().catch(() => null);
    const capacitacionId = cuerpo?.capacitacionId;
    if (typeof capacitacionId !== 'string' || !ID_VALIDO.test(capacitacionId)) {
      throw new ErrorMicrotest('El identificador de la capacitación no es válido.', 400);
    }

    const capacitacion = await buscarCapacitacionInternaPublicada(capacitacionId);
    const evaluacion = capacitacion && await buscarEvaluacionPorCapacitacion(capacitacionId);
    if (!capacitacion || !evaluacion) throw new ErrorMicrotest('Evaluación no encontrada.', 404);
    const respuestas = validarRespuestas(evaluacion.preguntas, cuerpo.respuestas);

    const progreso = await buscarProgreso(claveDeProgreso(usuarioId, capacitacionId));
    if (!puedeFinalizar(progreso, capacitacion.slides.length)) {
      throw new ErrorMicrotest('Concluye todas las diapositivas antes de resolver el microtest.', 409);
    }
    const previos = await listarIntentos(usuarioId, evaluacion.id);
    if (previos.some(i => i.aprobado)) {
      await marcarCapacitacionCompletada(usuarioId, capacitacionId); // repara un cierre interrumpido
      throw new ErrorMicrotest('Ya aprobaste este microtest.', 409);
    }
    if (intentosRestantes(evaluacion.maxIntentos, previos.length) === 0) {
      throw new ErrorMicrotest('Agotaste los intentos disponibles.', 409);
    }

    const resultado = calcularResultado(evaluacion.preguntas, respuestas);
    const aprobado = apruebaNota(resultado.puntaje, evaluacion.notaMinima);
    const numero = previos.length + 1;
    try {
      await crearIntento({
        evaluacionId: evaluacion.id, usuarioId, numero, respuestas,
        aciertos: resultado.aciertos, puntaje: resultado.puntaje, aprobado,
      });
    } catch (error) {
      if ((error as { code?: string })?.code === 'P2002') throw new ErrorMicrotest('Tu intento ya se estaba registrando. Inténtalo nuevamente.', 409);
      throw error;
    }
    if (aprobado) await marcarCapacitacionCompletada(usuarioId, capacitacionId);

    const restantes = intentosRestantes(evaluacion.maxIntentos, numero);
    return NextResponse.json({
      ok: true,
      datos: {
        ...resultado, aprobado, notaMinima: evaluacion.notaMinima, intentoNumero: numero,
        intentosRestantes: restantes, puedeReintentar: !aprobado && restantes > 0, capacitacionCompletada: aprobado,
      },
    }, { headers: SIN_CACHE });
  } catch (error) {
    if (error instanceof ErrorMicrotest) return falla(error.message, error.status);
    return falla('No pudimos procesar tu evaluación. Inténtalo nuevamente.', 503);
  }
}

// Configuración del microtest para la página del visor (sin respuestas correctas). null si no hay microtest.
export async function obtenerMicrotest(usuarioId: string, capacitacionId: string) {
  const evaluacion = await buscarEvaluacionPorCapacitacion(capacitacionId);
  if (!evaluacion) return null;
  const intentos = await listarIntentos(usuarioId, evaluacion.id);
  return {
    preguntas: preguntasParaResolver(evaluacion.preguntas), notaMinima: evaluacion.notaMinima,
    intentosRestantes: intentosRestantes(evaluacion.maxIntentos, intentos.length), tiempoLimiteSeg: evaluacion.tiempoLimiteSeg,
  };
}
