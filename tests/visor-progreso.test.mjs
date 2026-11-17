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
const { default: SlideViewer } = await import('../src/app/capacitaciones/[id]/SlideViewer.tsx');

test.afterEach(() => cleanup());

const slides = [1, 2, 3].map(n => ({
  id: `s${n}`, orden: n, titulo: `Slide ${n}`, contenido: `Contenido ${n}`, tipo: 'TEXT',
  imagenUrl: null, botonTexto: null, botonUrl: null, lista: [],
}));

function montar({ slideInicial, guardar, finalizar, completada = false } = {}) {
  const llamadas = { guardar: [], finalizar: 0 };
  const seguimiento = {
    guardar: guardar ?? (async (slide) => { llamadas.guardar.push(slide); return true; }),
    finalizar: finalizar ?? (async () => { llamadas.finalizar += 1; return true; }),
    completada,
  };
  render(React.createElement(SlideViewer, { slides, slideInicial, seguimiento }));
  return llamadas;
}

test('HU-012 UI Reanudar: abre en el último slide confirmado y sin avance en el primero', async () => {
  montar({ slideInicial: 3 });
  assert.ok(screen.getByRole('heading', { name: 'Slide 3' }));
  cleanup();
  montar({});
  assert.ok(screen.getByRole('heading', { name: 'Slide 1' }));
});

test('HU-012 UI Privacidad: informa que la posición se guarda para reanudar', async () => {
  montar({});
  assert.ok(screen.getByText(/Tu posición se guarda para que puedas reanudar/));
  await waitFor(() => screen.getByText('Avance guardado'));
});

test('HU-012 UI Guardar: cada slide al que se navega se confirma', async () => {
  const llamadas = montar({});
  await waitFor(() => assert.deepEqual(llamadas.guardar, [1]));
  fireEvent.click(screen.getByRole('button', { name: 'Ir a la diapositiva siguiente' }));
  await waitFor(() => assert.deepEqual(llamadas.guardar, [1, 2]));
});

test('HU-012 UI Estados accesibles: muestra error con reintento y se recupera', async () => {
  let ok = false; let intentos = 0;
  montar({ guardar: async () => { intentos += 1; return ok; } });
  await waitFor(() => screen.getByText(/No pudimos guardar tu avance/));
  assert.equal(screen.getByRole('status').getAttribute('role'), 'status');
  ok = true;
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
  await waitFor(() => screen.getByText('Avance guardado'));
  assert.equal(intentos, 2);
});

test('HU-012 UI Finalizar: solo aparece en el último slide, tras guardar, y completa', async () => {
  const llamadas = montar({ slideInicial: 3 });
  assert.equal(screen.queryByRole('link', { name: 'Terminar capacitación' }), null);
  const boton = screen.getByRole('button', { name: 'Finalizar' });
  await waitFor(() => assert.equal(boton.disabled, false));
  fireEvent.click(boton);
  await waitFor(() => screen.getByRole('link', { name: /Capacitación completada/ }));
  assert.equal(llamadas.finalizar, 1);
});

test('HU-012 UI Finalizar: un fallo muestra alerta y permite reintentar', async () => {
  montar({ slideInicial: 3, finalizar: async () => false });
  const boton = screen.getByRole('button', { name: 'Finalizar' });
  await waitFor(() => assert.equal(boton.disabled, false));
  fireEvent.click(boton);
  await waitFor(() => screen.getByRole('alert'));
  assert.equal(screen.getByRole('button', { name: 'Finalizar' }).disabled, false);
});

test('HU-012 UI: una capacitación ya completada muestra el cierre sin Finalizar', async () => {
  montar({ slideInicial: 3, completada: true });
  assert.ok(screen.getByRole('link', { name: /Capacitación completada/ }));
  assert.equal(screen.queryByRole('button', { name: 'Finalizar' }), null);
});
