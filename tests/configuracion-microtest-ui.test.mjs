import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';

const dom = new Window({ url: 'http://localhost:3000/admin/microtests' });
for (const nombre of [
  'window',
  'self',
  'document',
  'navigator',
  'HTMLElement',
  'HTMLInputElement',
  'HTMLSelectElement',
  'Node',
  'Event',
  'MouseEvent',
  'KeyboardEvent',
  'MutationObserver',
]) {
  Object.defineProperty(globalThis, nombre, {
    configurable: true,
    value:
      nombre === 'window' || nombre === 'self'
        ? dom
        : nombre === 'document'
          ? dom.document
          : dom[nombre],
  });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const React = await import('react');
const { render, fireEvent, cleanup } = await import('@testing-library/react');
const { ConstructorMicrotest } = await import(
  '../src/app/admin/microtests/ConstructorMicrotest.tsx'
);

const CAPACITACIONES_MOCK = [
  {
    id: '671000000000000000000010',
    titulo: 'Bioseguridad en Laboratorios',
    unidad: 'BIOMEDIC',
    ambito: 'INTERNO',
    estado: 'BORRADOR',
    evaluacion: null,
  },
  {
    id: '671000000000000000000020',
    titulo: 'Seguridad en Perforación Minera',
    unidad: 'GEOMINA',
    ambito: 'INTERNO',
    estado: 'PUBLICADA',
    evaluacion: {
      id: '671000000000000000000201',
      capacitacionId: '671000000000000000000020',
      titulo: 'Evaluación Geomina',
      notaMinima: 80,
      maxIntentos: 3,
      tiempoLimiteSeg: 300,
      preguntas: [
        {
          id: 'p-1',
          enunciado: '¿Cuál es la distancia mínima de seguridad?',
          opciones: ['5 metros', '15 metros'],
          correcta: 1,
          retroalimentacion: 'Se exige un radio de 15 metros.',
        },
      ],
      _count: { intentos: 4 },
    },
  },
];

describe('HU-013 (CGB-61) UI: constructor visual dinámico de microtests formativos', () => {
  afterEach(() => {
    cleanup();
  });

  it('CA-01, CA-02 y CA-03: permite añadir preguntas y alternativas dinámicamente y recalcula el puntaje por pregunta', () => {
    const vista = render(
      React.createElement(ConstructorMicrotest, {
        capacitacionesIniciales: CAPACITACIONES_MOCK,
      })
    );

    assert.ok(vista.getByText('Estado: BORRADOR'));
    assert.ok(vista.getByText('Sin microtest'));
    assert.ok(vista.getByText('Valor: 100 pts'));

    // Añadir una segunda pregunta -> puntaje pasa a 50 pts por pregunta
    fireEvent.click(vista.getByText('+ Añadir pregunta'));
    assert.equal(vista.getAllByText('Valor: 50 pts').length, 2);

    // Añadir una tercera alternativa en la Pregunta 1
    const botonesAlternativa = vista.getAllByText('+ Añadir alternativa');
    fireEvent.click(botonesAlternativa[0]);
    assert.ok(vista.getByLabelText('Alternativa 3 de pregunta 1'));
  });

  it('CA-04: bloquea la edición y eliminación en la interfaz cuando el microtest ya tiene intentos registrados', () => {
    const vista = render(
      React.createElement(ConstructorMicrotest, {
        capacitacionesIniciales: CAPACITACIONES_MOCK,
        capacitacionInicialId: '671000000000000000000020',
      })
    );

    assert.ok(vista.getByText('Edición y eliminación bloqueadas (CA-04)'));
    const botonActualizar = vista.getByText('Actualizar microtest');
    const botonEliminar = vista.getByText('Eliminar microtest');
    assert.equal(botonActualizar.disabled, true);
    assert.equal(botonEliminar.disabled, true);
  });
});
