import test from 'node:test';
import assert from 'node:assert/strict';

const cargarVisor = () => import('../src/lib/visor-capacitacion.ts');

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
});
