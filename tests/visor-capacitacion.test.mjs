import test from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';

// Prepara un DOM para montar el visor real dentro de las pruebas de integración.
const dom = new Window({ url: 'http://localhost/' });
for (const nombre of ['window', 'self', 'document', 'navigator', 'HTMLElement', 'Node', 'Event', 'MouseEvent', 'KeyboardEvent', 'MutationObserver']) {
  Object.defineProperty(globalThis, nombre, {
    configurable: true,
    value: nombre === 'window' || nombre === 'self' ? dom : nombre === 'document' ? dom.document : dom[nombre],
  });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const React = await import('react');
const { render, screen, fireEvent, cleanup } = await import('@testing-library/react');
const { default: SlideViewer } = await import('../src/app/capacitaciones/[id]/SlideViewer.tsx');
const { default: PaginaCapacitacionPublica } = await import('../src/app/capacitaciones/[id]/page.tsx');
const { consultarCapacitacionPublica } = await import('../src/lib/consultar-capacitacion-publica.ts');

const cargarVisor = () => import('../src/lib/visor-capacitacion.ts');

// Cada caso comienza con un visor limpio, evitando que el estado del DOM se filtre entre pruebas.
test.afterEach(() => cleanup());

const slidesIntegracion = [
  {
    id: 'slide-1', orden: 1, titulo: 'Introducción', contenido: 'Contenido inicial de prueba.',
    tipo: 'TEXT', imagenUrl: null, botonTexto: null, botonUrl: null, lista: [],
  },
  {
    id: 'slide-2', orden: 2, titulo: 'Recurso', contenido: 'Contenido del recurso interactivo.',
    tipo: 'INTERACTIVE', imagenUrl: null, botonTexto: 'Abrir recurso',
    botonUrl: 'https://example.com/recurso', lista: [],
  },
  {
    id: 'slide-3', orden: 3, titulo: 'Cierre', contenido: 'Contenido final de prueba.',
    tipo: 'TEXT', imagenUrl: null, botonTexto: null, botonUrl: null, lista: [],
  },
];

test('HU-006: Contratos BDD del visor de capacitaciones', async (t) => {
  await t.test('CA-01: Siguiente y anterior recorren la secuencia sin exceder sus límites', async () => {
    const { obtenerSiguienteSlide, obtenerSlideAnterior } = await cargarVisor();

    assert.equal(obtenerSiguienteSlide(1, 4), 2);
    assert.equal(obtenerSiguienteSlide(4, 4), 4);
    assert.equal(obtenerSlideAnterior(3, 4), 2);
    assert.equal(obtenerSlideAnterior(1, 4), 1);
    assert.equal(obtenerSiguienteSlide(1, 0), 0);
  });

  await t.test('CA-01: Las teclas de navegación cambian el slide y las demás no lo alteran', async () => {
    const { navegarPorTeclado } = await cargarVisor();

    assert.equal(navegarPorTeclado('ArrowRight', 1, 3), 2);
    assert.equal(navegarPorTeclado('ArrowLeft', 2, 3), 1);
    assert.equal(navegarPorTeclado('ArrowRight', 3, 3), 3);
    assert.equal(navegarPorTeclado('Escape', 2, 3), 2);
  });

  await t.test('CA-02: Un slide interactivo expone su texto y enlace de acción', async () => {
    const { obtenerAccionSlide } = await cargarVisor();
    const slide = {
      tipo: 'INTERACTIVE',
      botonTexto: 'Abrir recurso',
      botonUrl: 'https://example.com/recurso',
    };

    assert.deepEqual(obtenerAccionSlide(slide), {
      texto: 'Abrir recurso',
      url: 'https://example.com/recurso',
    });
    assert.equal(obtenerAccionSlide({ ...slide, botonUrl: '' }), null);
  });

  await t.test('CA-03: El progreso refleja la diapositiva actual sobre el total', async () => {
    const { calcularProgresoLectura } = await cargarVisor();

    assert.equal(calcularProgresoLectura(3, 10), 30);
    assert.equal(calcularProgresoLectura(1, 3), 33);
    assert.equal(calcularProgresoLectura(0, 0), 0);
    assert.equal(calcularProgresoLectura(12, 10), 100);
  });

  await t.test('CA-04: Solo capacitaciones publicadas y públicas están disponibles', async () => {
    const { capacitacionDisponible } = await cargarVisor();

    assert.equal(capacitacionDisponible({ estado: 'PUBLICADA', ambito: 'PUBLICO' }), true);
    assert.equal(capacitacionDisponible({ estado: 'BORRADOR', ambito: 'PUBLICO' }), false);
    assert.equal(capacitacionDisponible({ estado: 'PUBLICADA', ambito: 'INTERNO' }), false);
    assert.equal(capacitacionDisponible(null), false);
  });

  await t.test('T3: El swipe horizontal cambia de dirección solo al superar el umbral', async () => {
    const { obtenerDireccionDeslizamiento } = await cargarVisor();

    assert.equal(obtenerDireccionDeslizamiento(240, 150), 'siguiente');
    assert.equal(obtenerDireccionDeslizamiento(150, 240), 'anterior');
    assert.equal(obtenerDireccionDeslizamiento(200, 170), null);
  });

  await t.test('Integración CA-01/CA-03: los controles y teclado actualizan el slide y su progreso', async () => {
    render(React.createElement(SlideViewer, { slides: slidesIntegracion }));

    assert.ok(screen.getByRole('heading', { name: 'Introducción' }));
    assert.equal(screen.getByRole('progressbar').getAttribute('aria-valuenow'), '33');

    fireEvent.click(screen.getByRole('button', { name: 'Ir a la diapositiva siguiente' }));
    assert.ok(screen.getByRole('heading', { name: 'Recurso' }));
    assert.equal(screen.getByRole('progressbar').getAttribute('aria-valuenow'), '67');

    fireEvent.keyDown(document.body, { key: 'ArrowRight' });
    assert.ok(screen.getByRole('heading', { name: 'Cierre' }));
    const terminar = screen.getByRole('link', { name: 'Terminar capacitación' });
    assert.equal(terminar.getAttribute('href'), '/capacitaciones');
    assert.equal(screen.queryByRole('button', { name: 'Ir a la diapositiva siguiente' }), null);
  });

  await t.test('Integración: el título y el contenido largo se ajustan dentro del slide', async () => {
    const slideConTextoLargo = [{
      ...slidesIntegracion[0],
      titulo: 'Titulo'.repeat(20),
      contenido: 'Contenido'.repeat(40),
    }];
    render(React.createElement(SlideViewer, { slides: slideConTextoLargo }));

    assert.equal(screen.getByRole('heading').style.overflowWrap, 'anywhere');
    assert.equal(screen.getByText('Contenido'.repeat(40)).style.overflowWrap, 'anywhere');
  });

  await t.test('Integración CA-02: el slide interactivo renderiza su enlace de recurso', async () => {
    render(React.createElement(SlideViewer, { slides: slidesIntegracion }));
    fireEvent.click(screen.getByRole('button', { name: 'Ir a la diapositiva siguiente' }));

    const enlace = screen.getByRole('link', { name: 'Abrir recurso' });
    assert.equal(enlace.getAttribute('href'), 'https://example.com/recurso');
    assert.equal(enlace.getAttribute('target'), '_blank');
    assert.match(enlace.getAttribute('rel'), /noopener/);
  });

  await t.test('Integración CA-04: consulta capacitaciones públicas publicadas y rechaza las demás', async () => {
    const idPublico = 'aaaaaaaaaaaaaaaaaaaaaaaa';
    const idBorrador = 'bbbbbbbbbbbbbbbbbbbbbbbb';
    const idInterno = 'cccccccccccccccccccccccc';
    const idInexistente = 'dddddddddddddddddddddddd';
    const capacitaciones = [
      { id: idPublico, titulo: 'Capacitación pública', descripcion: 'Descripción pública', unidad: 'CIIP', estado: 'PUBLICADA', ambito: 'PUBLICO', slides: slidesIntegracion },
      { id: idBorrador, titulo: 'Borrador', descripcion: 'Descripción privada', unidad: 'CIIP', estado: 'BORRADOR', ambito: 'PUBLICO', slides: [] },
      { id: idInterno, titulo: 'Capacitación interna', descripcion: 'Descripción interna', unidad: 'CIIP', estado: 'PUBLICADA', ambito: 'INTERNO', slides: [] },
    ];
    const consultas = [];
    const buscar = async (filtros) => {
      consultas.push(filtros);
      return capacitaciones.find((capacitacion) =>
        capacitacion.id === filtros.id &&
        capacitacion.estado === filtros.estado &&
        capacitacion.ambito === filtros.ambito
      ) ?? null;
    };

    const disponible = await consultarCapacitacionPublica(idPublico, buscar);
    assert.equal(disponible.titulo, 'Capacitación pública');
    assert.deepEqual(consultas[0], { id: idPublico, estado: 'PUBLICADA', ambito: 'PUBLICO' });
    assert.equal(await consultarCapacitacionPublica(idBorrador, buscar), null);
    assert.equal(await consultarCapacitacionPublica(idInterno, buscar), null);
    assert.equal(await consultarCapacitacionPublica(idInexistente, buscar), null);
    assert.equal(await consultarCapacitacionPublica('id-invalido', buscar), null);

    await assert.rejects(
      PaginaCapacitacionPublica({ params: Promise.resolve({ id: 'id-invalido' }) }),
      (error) => error?.digest === 'NEXT_HTTP_ERROR_FALLBACK;404'
    );
  });
});
