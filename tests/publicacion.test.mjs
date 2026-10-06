import test from 'node:test';
import assert from 'node:assert/strict';
import { prepararPublicacion, ErrorPublicacion } from '../src/lib/publicacion.ts';

const ahora = new Date('2026-10-05T18:00:00Z');
const slide = { capacitacionId: 'cap-1', titulo: 'Bienvenida', contenido: 'Bienvenidos al centro de capacitación.', tipo: 'TEXT' };
const capacitacion = { id: 'cap-1', estado: 'BORRADOR', publicadaEn: null, slides: [slide] };

test('HU004 CA02: publica con una diapositiva completa y registra la fecha sin mutar el borrador', () => {
  const original = structuredClone(capacitacion);
  assert.deepEqual(prepararPublicacion(capacitacion, ahora), { estado: 'PUBLICADA', publicadaEn: ahora });
  assert.deepEqual(capacitacion, original);
});

test('HU004 CA03: impide publicar sin contenido con el mensaje acordado', () => {
  assert.throws(() => prepararPublicacion({ ...capacitacion, slides: [] }, ahora), error =>
    error instanceof ErrorPublicacion && error.message === 'Debe agregar al menos una diapositiva antes de publicar');
});

test('HU004 CA02: una diapositiva incompleta o multimedia sin sus campos obligatorios no basta', () => {
  for (const incompleto of [{ ...slide, contenido: '' }, { ...slide, tipo: 'IMAGE', imagenUrl: '' }, { ...slide, tipo: 'INTERACTIVE', botonTexto: 'Abrir', botonUrl: '' }]) {
    assert.throws(() => prepararPublicacion({ ...capacitacion, slides: [incompleto] }, ahora), /diapositiva completa/);
  }
  assert.equal(prepararPublicacion({ ...capacitacion, slides: [{ ...slide, contenido: '' }, slide] }, ahora).estado, 'PUBLICADA');
});

test('HU004 CA02: repetir la publicación conserva su fecha y rechaza estados desconocidos', () => {
  const fecha = new Date('2026-10-01T18:00:00Z');
  assert.equal(prepararPublicacion({ ...capacitacion, estado: 'PUBLICADA', publicadaEn: fecha }, ahora).publicadaEn, fecha);
  assert.throws(() => prepararPublicacion({ ...capacitacion, estado: 'ELIMINADA' }, ahora), /estado/);
});
