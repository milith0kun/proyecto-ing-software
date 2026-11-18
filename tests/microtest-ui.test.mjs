import test from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';

const dom = new Window({ url: 'http://localhost/' });
for (const nombre of ['window', 'self', 'document', 'navigator', 'HTMLElement', 'Node', 'Event', 'MouseEvent', 'KeyboardEvent', 'MutationObserver']) {
  Object.defineProperty(globalThis, nombre, {
    configurable: true,
    value: nombre === 'window' || nombre === 'self' ? dom : nombre === 'document' ? dom.document : dom[nombre],
  });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const React = await import('react');
const { render, screen, fireEvent, cleanup, waitFor } = await import('@testing-library/react');
const { MicrotestInterno, formatearTiempo } = await import('../src/components/capacitaciones/MicrotestInterno.tsx');
const { default: SlideViewer } = await import('../src/app/capacitaciones/[id]/SlideViewer.tsx');

test.afterEach(() => { cleanup(); delete globalThis.fetch; });

const preguntas = [
  { id: 'p1', enunciado: '¿Uno?', opciones: ['Sí', 'No'] },
  { id: 'p2', enunciado: '¿Dos?', opciones: ['A', 'B', 'C'] },
];
const detalle = (e1, e2) => [
  { preguntaId: 'p1', enunciado: '¿Uno?', opciones: ['Sí', 'No'], elegida: e1, correcta: 0, esCorrecta: e1 === 0, retroalimentacion: 'Es Sí.' },
  { preguntaId: 'p2', enunciado: '¿Dos?', opciones: ['A', 'B', 'C'], elegida: e2, correcta: 2, esCorrecta: e2 === 2, retroalimentacion: null },
];
function responderApi(datos) {
  const llamadas = [];
  globalThis.fetch = async (url, init) => { llamadas.push({ url, cuerpo: JSON.parse(init.body) }); return { ok: true, json: async () => ({ ok: true, datos }) }; };
  return llamadas;
}
function montar(extra = {}) {
  const eventos = { aprobado: 0, revisar: 0 };
  render(React.createElement(MicrotestInterno, {
    capacitacionId: '507f1f77bcf86cd799439011', preguntas, notaMinima: 70, intentosRestantes: 2, tiempoLimiteSeg: null,
    alAprobar: () => { eventos.aprobado += 1; }, alRevisarMaterial: () => { eventos.revisar += 1; }, ...extra,
  }));
  return eventos;
}

test('HU-014 CA-01 muestra preguntas de opción múltiple y exige responder todas para enviar', () => {
  montar();
  assert.equal(screen.getAllByRole('radio').length, 5);
  assert.ok(screen.getByText(/Nota mínima 70%/));
  const enviar = screen.getByRole('button', { name: 'Enviar respuestas' });
  assert.equal(enviar.disabled, true);
  fireEvent.click(screen.getByLabelText('Sí'));
  assert.equal(enviar.disabled, true);
  fireEvent.click(screen.getByLabelText('C'));
  assert.equal(enviar.disabled, false);
});

test('HU-014 CA-01 muestra el temporizador cuando la evaluación lo define', () => {
  montar({ tiempoLimiteSeg: 90 });
  assert.equal(screen.getByRole('timer').textContent, 'Tiempo restante: 01:30');
  assert.equal(formatearTiempo(5), '00:05');
  cleanup();
  montar();
  assert.equal(screen.queryByRole('timer'), null);
});

test('HU-014 CA-02/CA-03 envía las respuestas, muestra correctas con retroalimentación y avisa la aprobación', async () => {
  const llamadas = responderApi({ puntaje: 100, aciertos: 2, total: 2, aprobado: true, notaMinima: 70, intentosRestantes: 1, puedeReintentar: false, detalle: detalle(0, 2) });
  const eventos = montar();
  fireEvent.click(screen.getByLabelText('Sí')); fireEvent.click(screen.getByLabelText('C'));
  fireEvent.click(screen.getByRole('button', { name: 'Enviar respuestas' }));
  await waitFor(() => screen.getByText(/¡Aprobado!/));
  assert.equal(llamadas[0].url, '/api/evaluaciones/evaluar');
  assert.deepEqual(llamadas[0].cuerpo, { capacitacionId: '507f1f77bcf86cd799439011', respuestas: [0, 2] });
  assert.ok(screen.getByText('Es Sí.'));
  assert.equal(eventos.aprobado, 1);
  assert.ok(screen.getByRole('link', { name: /Volver a mi espacio/ }));
});

test('HU-014 CA-04 al reprobar con intentos muestra la respuesta correcta y permite revisar o reintentar', async () => {
  responderApi({ puntaje: 0, aciertos: 0, total: 2, aprobado: false, notaMinima: 70, intentosRestantes: 1, puedeReintentar: true, detalle: detalle(1, 0) });
  const eventos = montar();
  fireEvent.click(screen.getByLabelText('No')); fireEvent.click(screen.getByLabelText('A'));
  fireEvent.click(screen.getByRole('button', { name: 'Enviar respuestas' }));
  await waitFor(() => screen.getByText(/No aprobado/));
  assert.ok(screen.getByText(/Respuesta correcta: Sí/));
  assert.ok(screen.getByText(/Te quedan 1 intento\./));
  assert.equal(eventos.aprobado, 0);
  fireEvent.click(screen.getByRole('button', { name: 'Revisar el material' }));
  assert.equal(eventos.revisar, 1);
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar ahora' }));
  assert.equal(screen.getAllByRole('radio').filter(r => r.checked).length, 0);
});

test('HU-014 CA-04 sin intentos no se muestra el formulario', () => {
  montar({ intentosRestantes: 0 });
  assert.equal(screen.queryAllByRole('radio').length, 0);
  assert.ok(screen.getByText(/Agotaste los intentos/));
});

test('HU-014 un error de la API se informa y permite volver a enviar', async () => {
  globalThis.fetch = async () => ({ ok: false, json: async () => ({ ok: false, error: 'Concluye todas las diapositivas.' }) });
  montar();
  fireEvent.click(screen.getByLabelText('Sí')); fireEvent.click(screen.getByLabelText('C'));
  fireEvent.click(screen.getByRole('button', { name: 'Enviar respuestas' }));
  await waitFor(() => screen.getByRole('alert'));
  assert.match(screen.getByRole('alert').textContent, /Concluye todas/);
  assert.equal(screen.getByRole('button', { name: 'Enviar respuestas' }).disabled, false);
});

test('HU-014 CA-01 en el último slide el visor ofrece iniciar el microtest en lugar de Finalizar', async () => {
  const slides = [1, 2].map(n => ({ id: `s${n}`, orden: n, titulo: `Slide ${n}`, contenido: 'c', tipo: 'TEXT', imagenUrl: null, botonTexto: null, botonUrl: null, lista: [] }));
  const seguimiento = {
    guardar: async () => true, finalizar: async () => true, completada: false,
    microtest: () => React.createElement('p', null, 'AQUI-MICROTEST'),
  };
  render(React.createElement(SlideViewer, { slides, slideInicial: 2, seguimiento }));
  assert.equal(screen.queryByRole('button', { name: 'Finalizar' }), null);
  const iniciar = screen.getByRole('button', { name: 'Iniciar microtest' });
  await waitFor(() => assert.equal(iniciar.disabled, false));
  fireEvent.click(iniciar);
  assert.ok(screen.getByText('AQUI-MICROTEST'));
});
