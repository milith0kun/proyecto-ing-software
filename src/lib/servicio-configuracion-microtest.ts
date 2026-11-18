/**
 * Capa de lógica de negocio (servicio de aplicación) para configurar microtests (HU-013 / CGB-61).
 * Orquesta reglas puras (`configuracion-microtest.ts`) y acceso a datos (`repositorio-configuracion-microtest.ts`) sin acoplamiento a HTTP.
 */
import {
  MENSAJE_MICROTEST_DUPLICADO,
  PreguntaConfigurada,
  calcularPesoPorPregunta,
  esObjectIdMicrotestValido,
  puedeModificarMicrotest,
  validarConfiguracionMicrotest,
} from '@/lib/configuracion-microtest';
import {
  actualizarMicrotestEnRepositorio,
  buscarCapacitacionPorId,
  buscarMicrotestPorCapacitacionId,
  buscarMicrotestPorId,
  crearMicrotestEnRepositorio,
  eliminarMicrotestEnRepositorio,
  esErrorUnicidadMicrotestPrisma,
  listarCapacitacionesParaMicrotest,
  listarMicrotestsConfigurados,
} from '@/lib/repositorio-configuracion-microtest';

export interface EvaluacionResumenUI {
  id: string;
  capacitacionId: string;
  titulo: string;
  notaMinima: number;
  maxIntentos: number;
  tiempoLimiteSeg: number | null;
  preguntas: PreguntaConfigurada[];
  _count?: { intentos: number };
}

export interface CapacitacionConMicrotestUI {
  id: string;
  titulo: string;
  unidad: string;
  ambito: string;
  estado: string;
  evaluacion: EvaluacionResumenUI | null;
}

export class ErrorConfiguracionMicrotest extends Error {
  constructor(
    message: string,
    readonly status: 400 | 404 | 409,
    readonly detalles?: Record<string, string>
  ) {
    super(message);
  }
}

function enriquecerEvaluacion<
  T extends { preguntas: unknown[]; _count?: { intentos: number } }
>(evaluacion: T) {
  const totalPreguntas = evaluacion.preguntas.length;
  const totalIntentos = evaluacion._count?.intentos ?? 0;
  return {
    ...evaluacion,
    totalPreguntas,
    pesoPorPregunta: calcularPesoPorPregunta(totalPreguntas),
    totalIntentos,
    editable: puedeModificarMicrotest(totalIntentos).permitido,
  };
}

export async function obtenerCapacitacionesConMicrotestInicial(): Promise<
  CapacitacionConMicrotestUI[]
> {
  const lista = await listarCapacitacionesParaMicrotest();
  return lista.map((cap) => ({
    id: cap.id,
    titulo: cap.titulo,
    unidad: cap.unidad,
    ambito: cap.ambito,
    estado: cap.estado,
    evaluacion: cap.evaluacion
      ? {
          id: cap.evaluacion.id,
          capacitacionId: cap.evaluacion.capacitacionId,
          titulo: cap.evaluacion.titulo,
          notaMinima: cap.evaluacion.notaMinima,
          maxIntentos: cap.evaluacion.maxIntentos,
          tiempoLimiteSeg: cap.evaluacion.tiempoLimiteSeg,
          preguntas: cap.evaluacion.preguntas.map((p) => ({
            id: p.id,
            enunciado: p.enunciado,
            opciones: p.opciones,
            correcta: p.correcta,
            retroalimentacion: p.retroalimentacion ?? null,
          })),
          _count: { intentos: cap.evaluacion._count.intentos },
        }
      : null,
  }));
}

export async function listarMicrotestsEnServicio(capacitacionId?: string) {
  if (capacitacionId && !esObjectIdMicrotestValido(capacitacionId)) {
    throw new ErrorConfiguracionMicrotest(
      'El identificador de la capacitación no es válido.',
      400
    );
  }
  const evaluaciones = await listarMicrotestsConfigurados(capacitacionId);
  return evaluaciones.map((ev) => enriquecerEvaluacion(ev));
}

export async function registrarMicrotestEnServicio(
  cuerpo: Record<string, unknown>
) {
  const validacion = validarConfiguracionMicrotest(cuerpo);
  if (!validacion.valido || !validacion.datos) {
    throw new ErrorConfiguracionMicrotest(
      'Datos inválidos.',
      400,
      validacion.errores
    );
  }

  const capacitacion = await buscarCapacitacionPorId(
    validacion.datos.capacitacionId
  );
  if (!capacitacion) {
    throw new ErrorConfiguracionMicrotest(
      'La capacitación seleccionada no existe.',
      404
    );
  }

  const existente = await buscarMicrotestPorCapacitacionId(
    validacion.datos.capacitacionId
  );
  if (existente) {
    throw new ErrorConfiguracionMicrotest(MENSAJE_MICROTEST_DUPLICADO, 409);
  }

  try {
    const creado = await crearMicrotestEnRepositorio(validacion.datos);
    return enriquecerEvaluacion(creado);
  } catch (error) {
    if (esErrorUnicidadMicrotestPrisma(error)) {
      throw new ErrorConfiguracionMicrotest(MENSAJE_MICROTEST_DUPLICADO, 409);
    }
    throw error;
  }
}

export async function obtenerMicrotestEnServicio(id: string) {
  if (!esObjectIdMicrotestValido(id)) {
    throw new ErrorConfiguracionMicrotest(
      'El identificador del microtest no es válido.',
      400
    );
  }

  const evaluacion = await buscarMicrotestPorId(id);
  if (!evaluacion) {
    throw new ErrorConfiguracionMicrotest('Microtest no encontrado.', 404);
  }

  return enriquecerEvaluacion(evaluacion);
}

export async function actualizarMicrotestEnServicio(
  id: string,
  cuerpo: Record<string, unknown>
) {
  if (!esObjectIdMicrotestValido(id)) {
    throw new ErrorConfiguracionMicrotest(
      'El identificador del microtest no es válido.',
      400
    );
  }

  const existente = await buscarMicrotestPorId(id);
  if (!existente) {
    throw new ErrorConfiguracionMicrotest('Microtest no encontrado.', 404);
  }

  const permisoEdicion = puedeModificarMicrotest(existente._count.intentos);
  if (!permisoEdicion.permitido) {
    throw new ErrorConfiguracionMicrotest(permisoEdicion.motivo!, 409);
  }

  const validacion = validarConfiguracionMicrotest({
    ...cuerpo,
    capacitacionId: cuerpo.capacitacionId ?? existente.capacitacionId,
  });
  if (!validacion.valido || !validacion.datos) {
    throw new ErrorConfiguracionMicrotest(
      'Datos inválidos.',
      400,
      validacion.errores
    );
  }

  if (validacion.datos.capacitacionId !== existente.capacitacionId) {
    throw new ErrorConfiguracionMicrotest('Datos inválidos.', 400, {
      capacitacionId: 'No se puede cambiar la capacitación asociada al microtest.',
    });
  }

  const actualizado = await actualizarMicrotestEnRepositorio(id, {
    titulo: validacion.datos.titulo,
    notaMinima: validacion.datos.notaMinima,
    maxIntentos: validacion.datos.maxIntentos,
    tiempoLimiteSeg: validacion.datos.tiempoLimiteSeg,
    preguntas: validacion.datos.preguntas,
  });

  return enriquecerEvaluacion(actualizado);
}

export async function eliminarMicrotestEnServicio(id: string) {
  if (!esObjectIdMicrotestValido(id)) {
    throw new ErrorConfiguracionMicrotest(
      'El identificador del microtest no es válido.',
      400
    );
  }

  const existente = await buscarMicrotestPorId(id);
  if (!existente) {
    throw new ErrorConfiguracionMicrotest('Microtest no encontrado.', 404);
  }

  const permisoEliminacion = puedeModificarMicrotest(existente._count.intentos);
  if (!permisoEliminacion.permitido) {
    throw new ErrorConfiguracionMicrotest(permisoEliminacion.motivo!, 409);
  }

  await eliminarMicrotestEnRepositorio(id);
  return { mensaje: 'Microtest eliminado correctamente.' };
}
