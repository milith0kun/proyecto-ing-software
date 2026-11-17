import test from 'node:test';
import assert from 'node:assert/strict';
import {
  crearServicioRutasOnboarding,
  ErrorRutaOnboarding,
  validarDatosRuta,
  construirPasosSecuenciales,
  puedeIniciarPaso,
} from '../src/lib/rutas-onboarding.ts';

function crearRepositorioEnMemoria({
  areas = [{ id: 'area-ti', nombre: 'Tecnología', activa: true }],
  puestos = [{ id: 'puesto-backend', nombre: 'Backend Node.js', areaId: 'area-ti' }],
  capacitaciones = [
    { id: 'cap-1', titulo: 'Cultura CGB', estado: 'PUBLICADA' },
    { id: 'cap-2', titulo: 'Arquitectura Node.js', estado: 'PUBLICADA' },
    { id: 'cap-3', titulo: 'Seguridad y Pruebas', estado: 'PUBLICADA' },
    { id: 'cap-borrador', titulo: 'Curso en Borrador', estado: 'BORRADOR' },
  ],
} = {}) {
  const rutas = [];
  let seq = 1;

  return {
    rutas,
    async buscarAreaPorId(id) {
      return areas.find(a => a.id === id) ?? null;
    },
    async buscarPuestoPorId(id) {
      return puestos.find(p => p.id === id) ?? null;
    },
    async buscarCapacitacionesPorIds(ids) {
      return capacitaciones.filter(c => ids.includes(c.id));
    },
    async crearRuta(datos) {
      const nueva = {
        id: `ruta-${seq++}`,
        titulo: datos.titulo,
        objetivo: datos.objetivo,
        estado: datos.estado,
        areaId: datos.areaId,
        puestoId: datos.puestoId ?? null,
        activadaEn: null,
        pasos: [],
      };
      rutas.push(nueva);
      return structuredClone(nueva);
    },
    async buscarRutaPorId(id) {
      const ruta = rutas.find(r => r.id === id);
      return ruta ? structuredClone(ruta) : null;
    },
    async guardarPasosRuta(rutaId, pasos) {
      const ruta = rutas.find(r => r.id === rutaId);
      if (!ruta) return null;
      ruta.pasos = pasos.map((p, idx) => ({
        id: `paso-${rutaId}-${idx + 1}`,
        rutaId,
        capacitacionId: p.capacitacionId,
        orden: p.orden,
        obligatorio: p.obligatorio ?? true,
      }));
      return structuredClone(ruta);
    },
    async actualizarEstadoRuta(rutaId, estado, activadaEn) {
      const ruta = rutas.find(r => r.id === rutaId);
      if (!ruta) return null;
      ruta.estado = estado;
      ruta.activadaEn = activadaEn;
      return structuredClone(ruta);
    },
    async listarRutas() {
      return structuredClone(rutas);
    },
  };
}

test('HU-008 CA-01: registra una nueva ruta en estado BORRADOR vinculada al área y puesto de trabajo', async () => {
  const repo = crearRepositorioEnMemoria();
  const servicio = crearServicioRutasOnboarding(repo);

  const ruta = await servicio.crearRuta({
    titulo: 'Onboarding Backend Node.js',
    objetivo: 'Preparar al desarrollador en estándares, arquitectura y despliegue de CGB.',
    areaId: 'area-ti',
    puestoId: 'puesto-backend',
  });

  assert.equal(ruta.titulo, 'Onboarding Backend Node.js');
  assert.equal(ruta.estado, 'BORRADOR');
  assert.equal(ruta.areaId, 'area-ti');
  assert.equal(ruta.puestoId, 'puesto-backend');
  assert.deepEqual(ruta.pasos, []);
});

test('HU-008 CA-01: rechaza rutas con título/objetivo inválidos o área/puesto inexistente', async () => {
  const validacion = validarDatosRuta({ titulo: 'AB', objetivo: 'Corto', areaId: '' });
  assert.equal(validacion.valido, false);
  assert.ok(validacion.errores.titulo);
  assert.ok(validacion.errores.objetivo);
  assert.ok(validacion.errores.areaId);

  const repo = crearRepositorioEnMemoria();
  const servicio = crearServicioRutasOnboarding(repo);

  await assert.rejects(
    () =>
      servicio.crearRuta({
        titulo: 'Onboarding Backend Node.js',
        objetivo: 'Objetivo completo de al menos diez caracteres.',
        areaId: 'area-inexistente',
      }),
    error => error instanceof ErrorRutaOnboarding && /área/i.test(error.message),
  );
});

test('HU-008 CA-02: secuencia capacitaciones publicadas en orden correlativo (Paso 1, Paso 2, Paso 3)', async () => {
  const repo = crearRepositorioEnMemoria();
  const servicio = crearServicioRutasOnboarding(repo);

  const ruta = await servicio.crearRuta({
    titulo: 'Onboarding Backend Node.js',
    objetivo: 'Secuencia técnica inicial para nuevos integrantes backend.',
    areaId: 'area-ti',
    puestoId: 'puesto-backend',
  });

  const actualizada = await servicio.secuenciarCapacitaciones(ruta.id, ['cap-1', 'cap-2', 'cap-3']);
  assert.deepEqual(
    actualizada.pasos.map(p => ({ capacitacionId: p.capacitacionId, orden: p.orden })),
    [
      { capacitacionId: 'cap-1', orden: 1 },
      { capacitacionId: 'cap-2', orden: 2 },
      { capacitacionId: 'cap-3', orden: 3 },
    ],
  );
});

test('HU-008 CA-02: impide secuenciar capacitaciones en BORRADOR o repetidas en la misma ruta', async () => {
  assert.throws(
    () => construirPasosSecuenciales(['cap-1', 'cap-1']),
    error => error instanceof ErrorRutaOnboarding && /repetid|duplicad/i.test(error.message),
  );

  const repo = crearRepositorioEnMemoria();
  const servicio = crearServicioRutasOnboarding(repo);
  const ruta = await servicio.crearRuta({
    titulo: 'Onboarding Backend Node.js',
    objetivo: 'Secuencia técnica inicial para nuevos integrantes backend.',
    areaId: 'area-ti',
  });

  await assert.rejects(
    () => servicio.secuenciarCapacitaciones(ruta.id, ['cap-1', 'cap-borrador']),
    error => error instanceof ErrorRutaOnboarding && /publicad/i.test(error.message),
  );
});

test('HU-008 CA-03: bloquea el Paso 2 hasta completar el Paso 1 (correlatividad de prerequisitos)', () => {
  const pasos = [
    { orden: 1, capacitacionId: 'cap-1' },
    { orden: 2, capacitacionId: 'cap-2' },
    { orden: 3, capacitacionId: 'cap-3' },
  ];

  // Sin avances: solo Paso 1 habilitado
  assert.equal(puedeIniciarPaso(pasos, 1, []).permitido, true);
  const intentoPaso2 = puedeIniciarPaso(pasos, 2, []);
  assert.equal(intentoPaso2.permitido, false);
  assert.equal(intentoPaso2.prerequisitoPendiente, 'cap-1');

  // Con Paso 1 completado: Paso 2 habilitado, Paso 3 bloqueado
  assert.equal(puedeIniciarPaso(pasos, 2, ['cap-1']).permitido, true);
  assert.equal(puedeIniciarPaso(pasos, 3, ['cap-1']).permitido, false);

  // Con Paso 1 y 2 completados: Paso 3 habilitado
  assert.equal(puedeIniciarPaso(pasos, 3, ['cap-1', 'cap-2']).permitido, true);
});

test('HU-008 CA-04: activa una ruta solo si tiene al menos una capacitación asociada', async () => {
  const repo = crearRepositorioEnMemoria();
  const servicio = crearServicioRutasOnboarding(repo);

  const rutaVacia = await servicio.crearRuta({
    titulo: 'Ruta Vacía de Prueba',
    objetivo: 'Verificar que no se pueda activar sin capacitaciones.',
    areaId: 'area-ti',
  });

  await assert.rejects(
    () => servicio.activarRuta(rutaVacia.id),
    error => error instanceof ErrorRutaOnboarding && /al menos una capacitación/i.test(error.message),
  );

  await servicio.secuenciarCapacitaciones(rutaVacia.id, ['cap-1']);
  const ahora = new Date('2026-11-16T22:00:00Z');
  const rutaActiva = await servicio.activarRuta(rutaVacia.id, ahora);

  assert.equal(rutaActiva.estado, 'ACTIVA');
  assert.deepEqual(rutaActiva.activadaEn, ahora);
});
