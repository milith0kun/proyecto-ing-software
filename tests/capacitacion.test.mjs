import test from 'node:test';
import assert from 'node:assert/strict';
import { validarCapacitacion, normalizarCapacitacion } from '../src/lib/validaciones-capacitacion.ts';
import {
  crearSlide,
  reordenarSlides,
  eliminarSlideYReindexar,
  validarSlide
} from '../src/lib/slides.ts';

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

test('HU-002: T4 - Validación BDD e Integración de Criterios de Aceptación', async (t) => {
  await t.test('Escenario BDD 1: Registro exitoso de capacitación (Dado/Cuando/Entonces)', () => {
    // DADO que un usuario administrador ingresa al formulario de creación
    const entradaFormulario = {
      titulo: 'Capacitación en Ciberseguridad Institucional',
      descripcion: 'Lineamientos de seguridad informática y buenas prácticas de contraseñas.',
      unidad: 'CIIP',
      ambito: 'PUBLICO'
    };

    // CUANDO valida los datos e invoca la normalización del sistema
    const validacion = validarCapacitacion(entradaFormulario);
    const datosNormalizados = normalizarCapacitacion(entradaFormulario);

    // ENTONCES el resultado es válido, sin errores, y contiene estado BORRADOR y 30 minutos
    assert.equal(validacion.valido, true);
    assert.deepEqual(validacion.errores, {});
    assert.equal(datosNormalizados.estado, 'BORRADOR');
    assert.equal(datosNormalizados.duracionMin, 30);
    assert.equal(datosNormalizados.unidad, 'CIIP');
  });

  await t.test('Escenario BDD 2: Modificación de capacitación existente (Dado/Cuando/Entonces)', () => {
    // DADO una capacitación existente con ID persistido
    const capacitacionPrevia = {
      id: 'cap_001_ciip',
      titulo: 'Capacitación Inicial',
      descripcion: 'Descripción previa de inducción general',
      unidad: 'GENERAL',
      ambito: 'INTERNO',
      estado: 'BORRADOR',
      duracionMin: 30
    };

    // CUANDO se actualizan el título, descripción y unidad institucional
    const cambios = {
      titulo: 'Capacitación Avanzada 2026',
      descripcion: 'Descripción renovada con estándares internacionales',
      unidad: 'GEOMINA',
      ambito: 'PUBLICO'
    };

    const validacionCambios = validarCapacitacion({ ...capacitacionPrevia, ...cambios });
    const datosActualizados = {
      ...capacitacionPrevia,
      ...normalizarCapacitacion(cambios)
    };

    // ENTONCES se conserva el ID original y se actualizan los campos solicitados
    assert.equal(validacionCambios.valido, true);
    assert.equal(datosActualizados.id, capacitacionPrevia.id);
    assert.equal(datosActualizados.titulo, 'Capacitación Avanzada 2026');
    assert.equal(datosActualizados.unidad, 'GEOMINA');
    assert.equal(datosActualizados.ambito, 'PUBLICO');
  });

  await t.test('Escenario BDD 3: Rechazo de inserción ante campos inválidos (Dado/Cuando/Entonces)', () => {
    // DADO datos incompletos o erróneos
    const entradaErronea = {
      titulo: 'X',
      descripcion: 'Corto',
      unidad: 'INVALIDA',
      ambito: 'NO_VALIDO'
    };

    // CUANDO se evalúa la regla de negocio
    const validacion = validarCapacitacion(entradaErronea);

    // ENTONCES se rechaza la operación y se detallan los errores en cada campo
    assert.equal(validacion.valido, false);
    assert.ok(validacion.errores.titulo);
    assert.ok(validacion.errores.descripcion);
    assert.ok(validacion.errores.unidad);
    assert.ok(validacion.errores.ambito);
  });
});

test('HU-003: T1 - RED - Gestión de slides dentro de una capacitación', async (t) => {
  await t.test('CA-01: Debe crear un slide asociado a una capacitación con contenido válido', () => {
    const resultado = crearSlide({
      capacitacionId: 'cap_123',
      titulo: 'Bienvenida institucional',
      contenido: 'Texto de bienvenida con enlaces e instrucciones.',
      tipo: 'TEXT',
      orden: 1
    });

    assert.equal(resultado.valido, true);
    assert.equal(resultado.slide.capacitacionId, 'cap_123');
    assert.equal(resultado.slide.orden, 1);
    assert.equal(resultado.slide.titulo, 'Bienvenida institucional');
  });

  await t.test('CA-01: Debe rechazar un slide sin título o contenido mínimo', () => {
    const resultado = validarSlide({
      capacitacionId: 'cap_123',
      titulo: '',
      contenido: 'corto',
      tipo: 'TEXT',
      orden: 1
    });

    assert.equal(resultado.valido, false);
    assert.ok(resultado.errores.titulo);
    assert.ok(resultado.errores.contenido);
  });

  await t.test('CA-02: Debe reordenar slides de forma correlativa', () => {
    const slides = [
      { id: 's1', capacitacionId: 'cap_123', orden: 1, titulo: 'Intro', contenido: 'A', tipo: 'TEXT' },
      { id: 's2', capacitacionId: 'cap_123', orden: 2, titulo: 'Tema', contenido: 'B', tipo: 'TEXT' },
      { id: 's3', capacitacionId: 'cap_123', orden: 3, titulo: 'Cierre', contenido: 'C', tipo: 'TEXT' }
    ];

    const reordenados = reordenarSlides(slides, 's3', 1);

    assert.deepEqual(reordenados.map((slide) => slide.orden), [1, 2, 3]);
    assert.equal(reordenados[0].id, 's3');
  });

  await t.test('CA-04: Debe eliminar un slide y reajustar la secuencia de los restantes', () => {
    const slides = [
      { id: 's1', capacitacionId: 'cap_123', orden: 1, titulo: 'Intro', contenido: 'A', tipo: 'TEXT' },
      { id: 's2', capacitacionId: 'cap_123', orden: 2, titulo: 'Tema', contenido: 'B', tipo: 'TEXT' },
      { id: 's3', capacitacionId: 'cap_123', orden: 3, titulo: 'Cierre', contenido: 'C', tipo: 'TEXT' }
    ];

    const resultado = eliminarSlideYReindexar(slides, 's2');

    assert.deepEqual(resultado.map((slide) => slide.orden), [1, 2]);
    assert.equal(resultado[1].titulo, 'Cierre');
  });
});

