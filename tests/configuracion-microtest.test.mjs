import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  MENSAJE_MICROTEST_CON_INTENTOS,
  calcularPesoPorPregunta,
  esObjectIdMicrotestValido,
  puedeModificarMicrotest,
  validarConfiguracionMicrotest,
  validarPreguntaMicrotest,
} from '../src/lib/configuracion-microtest.ts';

describe('HU-013 (CGB-61): reglas de dominio para configurar microtest formativo', () => {
  it('CA-01: acepta preguntas con opciones múltiples, alternativa correcta y retroalimentación y calcula el puntaje por pregunta', () => {
    const res = validarPreguntaMicrotest(
      {
        enunciado: '  ¿Cuál es el protocolo ante derrames en laboratorio?  ',
        opciones: [' Reportar de inmediato ', 'Ignorar el incidente', 'Limpiar sin EPP'],
        correcta: 0,
        retroalimentacion: '  Todo derrame debe reportarse y aislarse con EPP.  ',
      },
      0
    );

    assert.equal(res.valido, true);
    assert.deepEqual(res.datos, {
      id: 'p-1',
      enunciado: '¿Cuál es el protocolo ante derrames en laboratorio?',
      opciones: ['Reportar de inmediato', 'Ignorar el incidente', 'Limpiar sin EPP'],
      correcta: 0,
      retroalimentacion: 'Todo derrame debe reportarse y aislarse con EPP.',
    });
    assert.equal(calcularPesoPorPregunta(4), 25);
    assert.equal(calcularPesoPorPregunta(3), 33.33);
  });

  it('CA-01: rechaza preguntas sin enunciado mínimo, con menos de 2 opciones, opciones duplicadas o índice de correcta fuera de rango', () => {
    const sinEnunciado = validarPreguntaMicrotest(
      { enunciado: 'abc', opciones: ['Sí', 'No'], correcta: 0 },
      0
    );
    assert.equal(sinEnunciado.valido, false);
    assert.ok(sinEnunciado.errores['preguntas[0].enunciado']);

    const unaOpcion = validarPreguntaMicrotest(
      { enunciado: '¿Pregunta válida?', opciones: ['Única opción'], correcta: 0 },
      0
    );
    assert.equal(unaOpcion.valido, false);
    assert.ok(unaOpcion.errores['preguntas[0].opciones']);

    const opcionesDuplicadas = validarPreguntaMicrotest(
      { enunciado: '¿Pregunta válida?', opciones: ['Opción A', 'opción a'], correcta: 0 },
      0
    );
    assert.equal(opcionesDuplicadas.valido, false);
    assert.ok(opcionesDuplicadas.errores['preguntas[0].opciones']);

    const correctaFueraDeRango = validarPreguntaMicrotest(
      { enunciado: '¿Pregunta válida?', opciones: ['Opción A', 'Opción B'], correcta: 2 },
      0
    );
    assert.equal(correctaFueraDeRango.valido, false);
    assert.ok(correctaFueraDeRango.errores['preguntas[0].correcta']);
  });

  it('CA-02: valida la nota mínima de aprobación (1-100%), el máximo de intentos (1-10) y el tiempo límite opcional', () => {
    const idCap = '671000000000000000000001';
    const preguntas = [
      {
        enunciado: '¿Cuál es la misión de CGB?',
        opciones: ['Innovación científica', 'Otra actividad'],
        correcta: 0,
      },
    ];

    const valido = validarConfiguracionMicrotest({
      capacitacionId: idCap,
      titulo: 'Evaluación de Inducción',
      notaMinima: 80,
      maxIntentos: 3,
      tiempoLimiteSeg: 300,
      preguntas,
    });
    assert.equal(valido.valido, true);
    assert.equal(valido.datos?.notaMinima, 80);
    assert.equal(valido.datos?.maxIntentos, 3);
    assert.equal(valido.datos?.tiempoLimiteSeg, 300);

    const notaInvalida = validarConfiguracionMicrotest({
      capacitacionId: idCap,
      notaMinima: 120,
      maxIntentos: 3,
      preguntas,
    });
    assert.equal(notaInvalida.valido, false);
    assert.ok(notaInvalida.errores.notaMinima);

    const intentosInvalidos = validarConfiguracionMicrotest({
      capacitacionId: idCap,
      notaMinima: 80,
      maxIntentos: 0,
      preguntas,
    });
    assert.equal(intentosInvalidos.valido, false);
    assert.ok(intentosInvalidos.errores.maxIntentos);
  });

  it('CA-03: exige un identificador de capacitación ObjectId válido y al menos una pregunta', () => {
    assert.equal(esObjectIdMicrotestValido('671000000000000000000001'), true);
    assert.equal(esObjectIdMicrotestValido('invalido'), false);

    const sinCapacitacion = validarConfiguracionMicrotest({
      capacitacionId: 'no-es-objectid',
      preguntas: [
        {
          enunciado: '¿Pregunta válida?',
          opciones: ['Opción 1', 'Opción 2'],
          correcta: 0,
        },
      ],
    });
    assert.equal(sinCapacitacion.valido, false);
    assert.ok(sinCapacitacion.errores.capacitacionId);

    const sinPreguntas = validarConfiguracionMicrotest({
      capacitacionId: '671000000000000000000001',
      preguntas: [],
    });
    assert.equal(sinPreguntas.valido, false);
    assert.ok(sinPreguntas.errores.preguntas);
  });

  it('CA-04: permite editar o eliminar cuando no hay intentos y bloquea si ya fue respondido por alumnos', () => {
    assert.deepEqual(puedeModificarMicrotest(0), { permitido: true });
    assert.deepEqual(puedeModificarMicrotest(2), {
      permitido: false,
      motivo: MENSAJE_MICROTEST_CON_INTENTOS,
    });
  });
});
