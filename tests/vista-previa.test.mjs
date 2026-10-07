import test from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';
import { consultarVistaPrevia } from '../src/lib/consultar-vista-previa.ts';

const dom = new Window({ url: 'http://localhost/' });
for (const nombre of ['window', 'self', 'document', 'navigator', 'HTMLElement', 'Node', 'Event', 'MouseEvent', 'KeyboardEvent', 'MutationObserver']) {
  Object.defineProperty(globalThis, nombre, { configurable: true, value: nombre === 'window' || nombre === 'self' ? dom : nombre === 'document' ? dom.document : dom[nombre] });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const React = await import('react');
const { render, screen, fireEvent, cleanup } = await import('@testing-library/react');
const { ExperienciaCapacitacion } = await import('../src/components/capacitaciones/ExperienciaCapacitacion.tsx');
test.afterEach(() => cleanup());

test('HU004 CA01: consultar un borrador interno para vista previa conserva estado, ámbito y fecha', async () => {
  const id = '507f1f77bcf86cd799439011';
  const registro = { id, estado: 'BORRADOR', ambito: 'INTERNO', publicadaEn: null, slides: [] };
  const original = structuredClone(registro);
  assert.equal(await consultarVistaPrevia(id, async consultado => consultado === id ? registro : null), registro);
  assert.deepEqual(registro, original);
  let consultas = 0;
  assert.equal(await consultarVistaPrevia('invalido', async () => { consultas++; return registro; }), null);
  assert.equal(consultas, 0);
  assert.equal(await consultarVistaPrevia(id, async () => null), null);
});

test('HU004 CA01: la experiencia compartida presenta título y permite recorrer el visor final', () => {
  const originalFetch = globalThis.fetch;
  let escrituras = 0;
  globalThis.fetch = async () => { escrituras++; throw new Error('La vista previa no debe escribir'); };
  try {
    render(React.createElement(ExperienciaCapacitacion, { capacitacion: {
      titulo: 'Inducción de prueba', descripcion: 'Descripción del recorrido.', unidad: 'CIIP',
      slides: [
        { id: 's1', orden: 1, titulo: 'Bienvenida', contenido: 'Contenido inicial.', tipo: 'TEXT', imagenUrl: null, botonTexto: null, botonUrl: null, lista: [] },
        { id: 's2', orden: 2, titulo: 'Recurso final', contenido: 'Contenido del recurso.', tipo: 'INTERACTIVE', imagenUrl: null, botonTexto: 'Abrir recurso', botonUrl: 'https://example.com/recurso', lista: ['Primera instrucción'] },
      ],
    } }));
    assert.ok(screen.getByRole('heading', { name: 'Inducción de prueba' }));
    assert.ok(screen.getByText('Bienvenida'));
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));
    assert.ok(screen.getByText('Recurso final'));
    assert.equal(screen.getByRole('link', { name: 'Abrir recurso' }).getAttribute('href'), 'https://example.com/recurso');
    assert.ok(screen.getByText('Primera instrucción'));
    assert.equal(escrituras, 0);
  } finally { globalThis.fetch = originalFetch; }
});
