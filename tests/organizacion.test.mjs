import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validarArea,
  validarPuesto,
  existeNombreDuplicado,
  armarEstructura,
  MENSAJE_DUPLICADO
} from '../src/lib/organizacion.ts';

test('HU-007 (CGB-31): estructura organizacional - áreas y puestos', async (t) => {
  await t.test('CA-01: rechaza un área sin nombre o con menos de 3 caracteres', () => {
    assert.equal(validarArea({ nombre: '' }).valido, false);
    const r = validarArea({ nombre: 'RH' });
    assert.equal(r.valido, false);
    assert.match(r.errores.nombre, /al menos 3 caracteres/i);
  });

  await t.test('CA-01: acepta un área válida y la normaliza con estado activo', () => {
    const r = validarArea({ nombre: '  Ingeniería de Software  ' });
    assert.equal(r.valido, true);
    assert.equal(r.datos.nombre, 'Ingeniería de Software');
    assert.equal(r.datos.activa, true);
  });

  await t.test('CA-02: un puesto exige el identificador de su área', () => {
    const r = validarPuesto({ nombre: 'Analista de QA', areaId: '' });
    assert.equal(r.valido, false);
    assert.match(r.errores.areaId, /área/i);
  });

  await t.test('CA-02: acepta un puesto vinculado a un área', () => {
    const r = validarPuesto({ nombre: 'Desarrollador Junior', areaId: 'area-1' });
    assert.equal(r.valido, true);
    assert.equal(r.datos.areaId, 'area-1');
  });

  await t.test('CA-03: detecta nombres duplicados sin distinguir mayúsculas, tildes ni espacios', () => {
    const existentes = [{ nombre: 'Recursos Humanos' }];
    assert.equal(existeNombreDuplicado(existentes, '  recursos   humanos '), true);
    assert.equal(existeNombreDuplicado(existentes, 'Recursos Humanos'), true);
    assert.equal(existeNombreDuplicado(existentes, 'Calidad'), false);
    assert.equal(MENSAJE_DUPLICADO, 'El área o puesto ya existe en la organización');
  });

  await t.test('CA-03: un puesto solo es duplicado dentro de su misma área', () => {
    const puestos = [{ nombre: 'Analista', areaId: 'a1' }];
    assert.equal(existeNombreDuplicado(puestos, 'Analista', 'a1'), true);
    assert.equal(existeNombreDuplicado(puestos, 'Analista', 'a2'), false);
  });

  await t.test('CA-04: arma la jerarquía con puestos y número de colaboradores por área', () => {
    const areas = [
      { id: 'a1', nombre: 'Calidad' },
      { id: 'a2', nombre: 'Software' }
    ];
    const puestos = [
      { id: 'p1', nombre: 'Analista de QA', areaId: 'a1' },
      { id: 'p2', nombre: 'Desarrollador Junior', areaId: 'a2' },
      { id: 'p3', nombre: 'Desarrollador Senior', areaId: 'a2' }
    ];
    const conteoPorPuesto = { p2: 2, p3: 1 };
    const estructura = armarEstructura(areas, puestos, conteoPorPuesto);
    const software = estructura.find((a) => a.id === 'a2');
    assert.equal(software.puestos.length, 2);
    assert.equal(software.totalColaboradores, 3);
    assert.equal(estructura.find((a) => a.id === 'a1').totalColaboradores, 0);
  });
});
