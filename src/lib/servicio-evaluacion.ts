// Capa de negocio del microtest (HU-014): sin HTTP. Devuelve datos o lanza ErrorMicrotest / ErrorProgreso (con su código).
// El avance de la capacitación pertenece a servicio-progreso (CGB-56): aquí solo se le pide cerrarlo al aprobar.
import {
  ErrorMicrotest, apruebaNota, calcularResultado, intentosRestantes, preguntasParaResolver, validarRespuestas,
} from '@/lib/microtest';
import { completarPorMicrotest, exigirListoParaMicrotest } from '@/lib/servicio-progreso';
import { buscarEvaluacionPorCapacitacion, crearIntento, listarIntentos } from '@/lib/repositorio-evaluacion';

const ID_VALIDO = /^[a-f\d]{24}$/i;

// ¿La capacitación exige microtest? Lo consulta el controlador del avance para no completar con «Finalizar».
export async function tieneMicrotest(capacitacionId: string) {
  return ID_VALIDO.test(capacitacionId) && (await buscarEvaluacionPorCapacitacion(capacitacionId)) !== null;
}

// Califica un intento del colaborador. El intento siempre pertenece a la sesión (usuarioId), nunca al cuerpo.
export async function evaluarMicrotest(usuarioId: string, capacitacionId: unknown, cuerpoRespuestas: unknown) {
  if (typeof capacitacionId !== 'string' || !ID_VALIDO.test(capacitacionId)) {
    throw new ErrorMicrotest('El identificador de la capacitación no es válido.', 400);
  }
  const evaluacion = await buscarEvaluacionPorCapacitacion(capacitacionId);
  if (!evaluacion) throw new ErrorMicrotest('Evaluación no encontrada.', 404);
  const respuestas = validarRespuestas(evaluacion.preguntas, cuerpoRespuestas);

  await exigirListoParaMicrotest(usuarioId, capacitacionId); // 404, 403 o 409 si no puede resolverlo todavía
  const previos = await listarIntentos(usuarioId, evaluacion.id);
  if (previos.some(i => i.aprobado)) {
    await completarPorMicrotest(usuarioId, capacitacionId); // repara un cierre interrumpido
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
  if (aprobado) await completarPorMicrotest(usuarioId, capacitacionId);

  const restantes = intentosRestantes(evaluacion.maxIntentos, numero);
  return {
    ...resultado, aprobado, notaMinima: evaluacion.notaMinima, intentoNumero: numero,
    intentosRestantes: restantes, puedeReintentar: !aprobado && restantes > 0, capacitacionCompletada: aprobado,
  };
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
