import test from 'node:test';
import assert from 'node:assert/strict';

import {
  construirRegistroColaborador,
  asignarRutaOnboarding,
  crearInvitacionColaborador,
  filtrarColaboradoresPorEstado,
  registrarColaboradorConRuta,
  ESTADOS_COLABORADOR,
} from '../src/lib/colaboradores.ts';

const puestoAnalista = {
  id: 'puesto-analista-rh',
  nombre: 'Analista de RR. HH.',
  rutaOnboardingId: 'ruta-rh-001',
};

const rutaOnboarding = {
  id: 'ruta-rh-001',
  nombre: 'Inducción RH',
  activa: true,
  descripcion: 'Ruta obligatoria para nuevos colaboradores de RR. HH.',
};

test('HU-009: CA-01 Registro individual crea el colaborador en estado PENDIENTE_ACTIVACION', () => {
  const colaborador = construirRegistroColaborador({
    nombre: 'María López',
    email: 'maria.lopez@cgb.latam',
    dni: '01234567',
    puestoId: puestoAnalista.id,
  });

  assert.equal(colaborador.estado, 'PENDIENTE_ACTIVACION');
  assert.equal(colaborador.nombre, 'María López');
  assert.equal(colaborador.email, 'maria.lopez@cgb.latam');
  assert.equal(colaborador.puestoId, puestoAnalista.id);
  assert.ok(ESTADOS_COLABORADOR.includes(colaborador.estado));
});

test('HU-009: CA-02 Asignación automática de ruta según puesto', () => {
  const registro = construirRegistroColaborador({
    nombre: 'Carlos Díaz',
    email: 'carlos.diaz@cgb.latam',
    dni: '76543210',
    puestoId: puestoAnalista.id,
  });

  const asignado = asignarRutaOnboarding(registro, puestoAnalista, rutaOnboarding);

  assert.equal(asignado.rutaAsignada?.id, 'ruta-rh-001');
  assert.equal(asignado.rutaAsignada?.nombre, 'Inducción RH');
  assert.equal(asignado.progreso, 0);
  assert.equal(asignado.estado, 'PENDIENTE_ACTIVACION');
});

test('HU-009: CA-03 Generación de token y enlace de activación', () => {
  const registro = construirRegistroColaborador({
    nombre: 'Lucía Silva',
    email: 'lucia.silva@cgb.latam',
    dni: '19876543',
    puestoId: puestoAnalista.id,
  });

  const invitacion = crearInvitacionColaborador(registro, 'https://app.cgb.latam');

  assert.ok(invitacion.token.length > 20);
  assert.match(invitacion.enlaceActivacion, /^https:\/\/app\.cgb\.latam\/login\/activar\?/);
  assert.ok(invitacion.expiraEn instanceof Date);
  assert.ok(invitacion.expiraEn.getTime() > Date.now());
});

test('HU-009: CA-04 Panel de monitoreo filtra por estado y ruta asignada', () => {
  const colaboradores = [
    { id: 'c1', nombre: 'A', email: 'a@cgb.latam', estado: 'PENDIENTE_ACTIVACION', rutaAsignada: { id: 'ruta-1', nombre: 'Inducción RH' } },
    { id: 'c2', nombre: 'B', email: 'b@cgb.latam', estado: 'ACTIVO', rutaAsignada: { id: 'ruta-2', nombre: 'Inducción Operaciones' } },
    { id: 'c3', nombre: 'C', email: 'c@cgb.latam', estado: 'EN_PROGRESO', rutaAsignada: { id: 'ruta-1', nombre: 'Inducción RH' } },
  ];

  const enProgreso = filtrarColaboradoresPorEstado(colaboradores, 'EN_PROGRESO');
  const rh = filtrarColaboradoresPorEstado(colaboradores, 'PENDIENTE_ACTIVACION', 'ruta-1');

  assert.equal(enProgreso.length, 1);
  assert.equal(enProgreso[0].id, 'c3');
  assert.equal(rh.length, 1);
  assert.equal(rh[0].email, 'a@cgb.latam');
});

test('HU-009: TDD BDD - Registro completo con ruta y activación', () => {
  const registro = registrarColaboradorConRuta({
    nombre: 'Esteban Ruiz',
    email: 'esteban.ruiz@cgb.latam',
    dni: '11009988',
    puestoId: puestoAnalista.id,
    puesto: puestoAnalista,
    ruta: rutaOnboarding,
    baseUrl: 'https://app.cgb.latam',
  });

  assert.equal(registro.estado, 'PENDIENTE_ACTIVACION');
  assert.equal(registro.rutaAsignada?.id, 'ruta-rh-001');
  assert.equal(registro.progreso, 0);
  assert.ok(registro.tokenActivacion.length > 20);
  assert.match(registro.enlaceActivacion, /^https:\/\/app\.cgb\.latam\/login\/activar\?/);
});
