// Reglas puras del microtest formativo (HU-014): no dependen de HTTP ni de la base de datos.

export interface PreguntaMicrotest {
  id: string; enunciado: string; opciones: string[]; correcta: number; retroalimentacion?: string | null;
}
export interface DetallePregunta {
  preguntaId: string; enunciado: string; opciones: string[]; elegida: number; correcta: number;
  esCorrecta: boolean; retroalimentacion: string | null;
}
export interface ResultadoMicrotest { aciertos: number; total: number; puntaje: number; detalle: DetallePregunta[] }

export const SIN_RESPUESTA = -1;

export class ErrorMicrotest extends Error {
  constructor(message: string, readonly status: 400 | 404 | 409) {
    super(message);
  }
}

// Respuesta válida: una por pregunta, entero entre -1 (sin responder) y el último índice de opciones.
export function validarRespuestas(preguntas: PreguntaMicrotest[], respuestas: unknown): number[] {
  if (!Array.isArray(respuestas) || respuestas.length !== preguntas.length) {
    throw new ErrorMicrotest('Debes enviar una respuesta por cada pregunta.', 400);
  }
  respuestas.forEach((r, i) => {
    if (!Number.isInteger(r) || r < SIN_RESPUESTA || r >= preguntas[i].opciones.length) {
      throw new ErrorMicrotest('Hay una respuesta que no es válida.', 400);
    }
  });
  return respuestas as number[];
}

export function calcularResultado(preguntas: PreguntaMicrotest[], respuestas: number[]): ResultadoMicrotest {
  const detalle = preguntas.map((p, i) => ({
    preguntaId: p.id, enunciado: p.enunciado, opciones: p.opciones, elegida: respuestas[i] ?? SIN_RESPUESTA,
    correcta: p.correcta, esCorrecta: respuestas[i] === p.correcta, retroalimentacion: p.retroalimentacion ?? null,
  }));
  const aciertos = detalle.filter(d => d.esCorrecta).length;
  const total = preguntas.length;
  return { aciertos, total, puntaje: total === 0 ? 0 : Math.round((aciertos / total) * 100), detalle };
}

export const apruebaNota = (puntaje: number, notaMinima: number) => puntaje >= notaMinima;

export const intentosRestantes = (maxIntentos: number, usados: number) => Math.max(0, maxIntentos - usados);

// Vista de la evaluación para el navegador: nunca incluye la respuesta correcta ni la retroalimentación.
export function preguntasParaResolver(preguntas: PreguntaMicrotest[]) {
  return preguntas.map(({ id, enunciado, opciones }) => ({ id, enunciado, opciones }));
}
