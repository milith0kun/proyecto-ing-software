/**
 * Reglas de dominio puras para configuración de microtests formativos (HU-013 / CGB-61).
 * Sin acoplamiento a HTTP ni a Prisma.
 */

export const MIN_PREGUNTAS = 1;
export const MAX_PREGUNTAS = 50;
export const MIN_OPCIONES = 2;
export const MAX_OPCIONES = 6;
export const NOTA_MINIMA_DEFECTO = 70;
export const MAX_INTENTOS_DEFECTO = 3;

export const MENSAJE_MICROTEST_DUPLICADO =
  'Esta capacitación ya cuenta con un microtest configurado.';
export const MENSAJE_MICROTEST_CON_INTENTOS =
  'No se puede modificar ni eliminar un microtest que ya fue respondido por colaboradores.';

const PATRON_OBJECT_ID = /^[0-9a-fA-F]{24}$/;

export interface PreguntaConfigurada {
  id: string;
  enunciado: string;
  opciones: string[];
  correcta: number;
  retroalimentacion: string | null;
}

export interface ConfiguracionMicrotestNormalizada {
  capacitacionId: string;
  titulo: string;
  notaMinima: number;
  maxIntentos: number;
  tiempoLimiteSeg: number | null;
  preguntas: PreguntaConfigurada[];
}

export interface ResultadoValidacionMicrotest<T> {
  valido: boolean;
  errores: Record<string, string>;
  datos?: T;
}

export function esObjectIdMicrotestValido(id: unknown): id is string {
  return typeof id === 'string' && PATRON_OBJECT_ID.test(id.trim());
}

function normalizarTexto(valor: unknown): string {
  return typeof valor === 'string' ? valor.trim().replace(/\s+/g, ' ') : '';
}

function claveTexto(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * CA-01: Calcula el puntaje porcentual asignado a cada pregunta del microtest.
 */
export function calcularPesoPorPregunta(totalPreguntas: number): number {
  if (!Number.isInteger(totalPreguntas) || totalPreguntas <= 0) return 0;
  return Math.round((100 / totalPreguntas) * 100) / 100;
}

/**
 * CA-04: Solo permite editar o eliminar un microtest cuando aún no tiene intentos registrados.
 */
export function puedeModificarMicrotest(totalIntentos: number): {
  permitido: boolean;
  motivo?: string;
} {
  if (totalIntentos > 0) {
    return { permitido: false, motivo: MENSAJE_MICROTEST_CON_INTENTOS };
  }
  return { permitido: true };
}

/**
 * CA-01: Valida una pregunta individual con opciones, respuesta correcta y retroalimentación opcional.
 */
export function validarPreguntaMicrotest(
  entrada: unknown,
  indice: number
): ResultadoValidacionMicrotest<PreguntaConfigurada> {
  const prefijo = `preguntas[${indice}]`;
  if (!entrada || typeof entrada !== 'object' || Array.isArray(entrada)) {
    return {
      valido: false,
      errores: { [prefijo]: 'La pregunta debe ser un objeto válido.' },
    };
  }

  const obj = entrada as {
    id?: unknown;
    enunciado?: unknown;
    opciones?: unknown;
    correcta?: unknown;
    retroalimentacion?: unknown;
  };

  const errores: Record<string, string> = {};
  const idNormalizado = normalizarTexto(obj.id) || `p-${indice + 1}`;
  const enunciado = normalizarTexto(obj.enunciado);

  if (enunciado.length < 5) {
    errores[`${prefijo}.enunciado`] = 'El enunciado debe tener al menos 5 caracteres.';
  } else if (enunciado.length > 500) {
    errores[`${prefijo}.enunciado`] = 'El enunciado no puede exceder 500 caracteres.';
  }

  const opcionesLimpias: string[] = [];
  if (!Array.isArray(obj.opciones)) {
    errores[`${prefijo}.opciones`] = `Debe incluir al menos ${MIN_OPCIONES} alternativas.`;
  } else if (obj.opciones.length < MIN_OPCIONES || obj.opciones.length > MAX_OPCIONES) {
    errores[`${prefijo}.opciones`] =
      `Cada pregunta debe tener entre ${MIN_OPCIONES} y ${MAX_OPCIONES} alternativas.`;
  } else {
    const vistas = new Set<string>();
    obj.opciones.forEach((op, idxOp) => {
      const texto = normalizarTexto(op);
      if (texto.length < 1) {
        errores[`${prefijo}.opciones` ] =
          `La alternativa ${idxOp + 1} no puede estar vacía.`;
      } else if (texto.length > 300) {
        errores[`${prefijo}.opciones`] =
          `La alternativa ${idxOp + 1} no puede exceder 300 caracteres.`;
      } else {
        const clave = claveTexto(texto);
        if (vistas.has(clave)) {
          errores[`${prefijo}.opciones`] =
            'Las alternativas de una misma pregunta no pueden repetirse.';
        }
        vistas.add(clave);
        opcionesLimpias.push(texto);
      }
    });
  }

  const correcta = obj.correcta;
  if (
    typeof correcta !== 'number' ||
    !Number.isInteger(correcta) ||
    correcta < 0 ||
    (Array.isArray(obj.opciones) && correcta >= obj.opciones.length)
  ) {
    errores[`${prefijo}.correcta`] =
      'Debe indicar un índice válido para la alternativa correcta.';
  }

  let retroalimentacion: string | null = null;
  if (obj.retroalimentacion !== undefined && obj.retroalimentacion !== null) {
    const textoRetro = normalizarTexto(obj.retroalimentacion);
    if (textoRetro.length > 500) {
      errores[`${prefijo}.retroalimentacion`] =
        'La retroalimentación no puede exceder 500 caracteres.';
    } else if (textoRetro.length > 0) {
      retroalimentacion = textoRetro;
    }
  }

  if (Object.keys(errores).length > 0) {
    return { valido: false, errores };
  }

  return {
    valido: true,
    errores: {},
    datos: {
      id: idNormalizado,
      enunciado,
      opciones: opcionesLimpias,
      correcta: correcta as number,
      retroalimentacion,
    },
  };
}

/**
 * CA-01, CA-02, CA-03: Valida la configuración integral de un microtest formativo.
 */
export function validarConfiguracionMicrotest(
  entrada: unknown
): ResultadoValidacionMicrotest<ConfiguracionMicrotestNormalizada> {
  if (!entrada || typeof entrada !== 'object' || Array.isArray(entrada)) {
    return {
      valido: false,
      errores: { general: 'Los datos del microtest no son válidos.' },
    };
  }

  const obj = entrada as {
    capacitacionId?: unknown;
    titulo?: unknown;
    notaMinima?: unknown;
    maxIntentos?: unknown;
    tiempoLimiteSeg?: unknown;
    preguntas?: unknown;
  };

  const errores: Record<string, string> = {};

  const capacitacionId = normalizarTexto(obj.capacitacionId);
  if (!esObjectIdMicrotestValido(capacitacionId)) {
    errores.capacitacionId = 'Debe vincular el microtest a una capacitación válida.';
  }

  const tituloRaw = normalizarTexto(obj.titulo);
  const titulo = tituloRaw.length > 0 ? tituloRaw : 'Microtest';
  if (titulo.length < 3) {
    errores.titulo = 'El título del microtest debe tener al menos 3 caracteres.';
  } else if (titulo.length > 150) {
    errores.titulo = 'El título del microtest no puede exceder 150 caracteres.';
  }

  const notaMinima =
    obj.notaMinima === undefined ? NOTA_MINIMA_DEFECTO : obj.notaMinima;
  if (
    typeof notaMinima !== 'number' ||
    !Number.isInteger(notaMinima) ||
    notaMinima < 1 ||
    notaMinima > 100
  ) {
    errores.notaMinima =
      'La nota mínima de aprobación debe ser un entero entre 1% y 100%.';
  }

  const maxIntentos =
    obj.maxIntentos === undefined ? MAX_INTENTOS_DEFECTO : obj.maxIntentos;
  if (
    typeof maxIntentos !== 'number' ||
    !Number.isInteger(maxIntentos) ||
    maxIntentos < 1 ||
    maxIntentos > 10
  ) {
    errores.maxIntentos =
      'El número máximo de intentos debe ser un entero entre 1 y 10.';
  }

  let tiempoLimiteSeg: number | null = null;
  if (obj.tiempoLimiteSeg !== undefined && obj.tiempoLimiteSeg !== null && obj.tiempoLimiteSeg !== '') {
    if (
      typeof obj.tiempoLimiteSeg !== 'number' ||
      !Number.isInteger(obj.tiempoLimiteSeg) ||
      obj.tiempoLimiteSeg < 30 ||
      obj.tiempoLimiteSeg > 7200
    ) {
      errores.tiempoLimiteSeg =
        'El tiempo límite opcional debe estar entre 30 y 7200 segundos.';
    } else {
      tiempoLimiteSeg = obj.tiempoLimiteSeg;
    }
  }

  const preguntasNormalizadas: PreguntaConfigurada[] = [];
  if (!Array.isArray(obj.preguntas) || obj.preguntas.length < MIN_PREGUNTAS) {
    errores.preguntas = 'El microtest debe contener al menos una pregunta.';
  } else if (obj.preguntas.length > MAX_PREGUNTAS) {
    errores.preguntas = `El microtest no puede exceder ${MAX_PREGUNTAS} preguntas.`;
  } else {
    const enunciadosVistos = new Set<string>();
    obj.preguntas.forEach((preguntaRaw, idx) => {
      const res = validarPreguntaMicrotest(preguntaRaw, idx);
      if (!res.valido || !res.datos) {
        Object.assign(errores, res.errores);
      } else {
        const claveEnunciado = claveTexto(res.datos.enunciado);
        if (enunciadosVistos.has(claveEnunciado)) {
          errores[`preguntas[${idx}].enunciado`] =
            'No se permiten preguntas con el mismo enunciado en el microtest.';
        }
        enunciadosVistos.add(claveEnunciado);
        preguntasNormalizadas.push(res.datos);
      }
    });
  }

  if (Object.keys(errores).length > 0) {
    return { valido: false, errores };
  }

  return {
    valido: true,
    errores: {},
    datos: {
      capacitacionId,
      titulo,
      notaMinima: notaMinima as number,
      maxIntentos: maxIntentos as number,
      tiempoLimiteSeg,
      preguntas: preguntasNormalizadas,
    },
  };
}
