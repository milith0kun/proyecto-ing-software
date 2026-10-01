import test from 'node:test';
import assert from 'node:assert/strict';
import { validarCapacitacion, normalizarCapacitacion } from '../src/lib/validaciones-capacitacion.ts';

test('HU-002: TDD Fase RED/GREEN - Validaciones de Creación de Capacitación', async (t) => {
  await t.test('CA-01: Debe rechazar capacitaciones sin título o con título menor a 3 caracteres', () => {
    const resultado = validarCapacitacion({
      titulo: 'AB',
      descripcion: 'Descripción de prueba',
      unidad: 'CIIP',
      ambito: 'PUBLICO'
    });

    assert.equal(resultado.valido, false);
    assert.match(resultado.errores.titulo, /al menos 3 caracteres/i);
  });

  await t.test('CA-01: Debe rechazar capacitaciones sin descripción o menor a 10 caracteres', () => {
    const resultado = validarCapacitacion({
      titulo: 'Inducción General 2026',
      descripcion: 'Corta',
      unidad: 'CIIP',
      ambito: 'PUBLICO'
    });

    assert.equal(resultado.valido, false);
    assert.match(resultado.errores.descripcion, /al menos 10 caracteres/i);
  });

  await t.test('CA-01: Debe validar unidades institucionales permitidas (CIIP, GEOMINA, BIOMEDIC, GENERAL)', () => {
    const resultadoInvalido = validarCapacitacion({
      titulo: 'Inducción de Minería',
      descripcion: 'Curso introductorio de seguridad en minas',
      unidad: 'UNIDAD_NO_EXISTE',
      ambito: 'PUBLICO'
    });

    assert.equal(resultadoInvalido.valido, false);
    assert.match(resultadoInvalido.errores.unidad, /unidad institucional no válida/i);

    const resultadoValido = validarCapacitacion({
      titulo: 'Inducción de Minería',
      descripcion: 'Curso introductorio de seguridad en minas',
      unidad: 'GEOMINA',
      ambito: 'PUBLICO'
    });

    assert.equal(resultadoValido.valido, true);
    assert.deepEqual(resultadoValido.errores, {});
  });

  await t.test('CA-01: Debe asignar valores por defecto correctos (BORRADOR, 30 min, Inducción)', () => {
    const datosNormalizados = normalizarCapacitacion({
      titulo: 'Inducción Biomédica',
      descripcion: 'Protocolos clínicos de laboratorio',
      unidad: 'BIOMEDIC',
      ambito: 'INTERNO'
    });

    assert.equal(datosNormalizados.estado, 'BORRADOR');
    assert.equal(datosNormalizados.duracionMin, 30);
    assert.equal(datosNormalizados.categoria, 'Inducción');
  });

  await t.test('CA-02: Edición debe conservar el ID original sin generar duplicados', () => {
    const originalId = '654321654321654321654321';
    const actualizacion = {
      titulo: 'Inducción Biomédica Actualizada',
      descripcion: 'Protocolos clínicos renovados con normas 2026',
      unidad: 'BIOMEDIC',
      ambito: 'INTERNO'
    };

    const validacion = validarCapacitacion(actualizacion);
    assert.equal(validacion.valido, true);

    const fusionado = {
      id: originalId,
      ...normalizarCapacitacion(actualizacion)
    };

    assert.equal(fusionado.id, originalId);
    assert.equal(fusionado.titulo, 'Inducción Biomédica Actualizada');
  });
});
