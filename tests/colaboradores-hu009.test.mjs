import test from 'node:test';
import assert from 'node:assert/strict';

import {
  construirRegistroColaborador,
  asignarRutaOnboarding,
  ESTADOS_COLABORADOR,
} from '../src/lib/colaboradores.ts';
import { crearIdentificadorColaborador, crearInvitacionColaborador } from '../src/lib/invitacion-colaborador.ts';

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
    puestoId: puestoAnalista.id,
  });

  const asignado = asignarRutaOnboarding(registro, puestoAnalista, rutaOnboarding);

  assert.equal(asignado.rutaAsignada?.id, 'ruta-rh-001');
  assert.equal(asignado.rutaAsignada?.nombre, 'Inducción RH');
  assert.equal(asignado.progreso, 0);
  assert.equal(asignado.estado, 'PENDIENTE_ACTIVACION');
});

test('HU-009: CA-03 Generación de token seguro de invitación', () => {
  const registro = construirRegistroColaborador({
    nombre: 'Lucía Silva',
    email: 'lucia.silva@cgb.latam',
    puestoId: puestoAnalista.id,
  });

  const invitacion = crearInvitacionColaborador(registro, 'https://app.cgb.latam');

  assert.ok(invitacion.token.length > 20);
  assert.match(invitacion.enlaceActivacion, /^https:\/\/app\.cgb\.latam\/login\/activar\?/);
  assert.ok(invitacion.expiraEn instanceof Date);
  assert.equal(invitacion.expiraEn.getTime() - Date.now() > 47 * 60 * 60 * 1000, true);
});

test('HU-009: TDD BDD - Registro completo con ruta e invitación', () => {
  const base = construirRegistroColaborador({
    id: crearIdentificadorColaborador(),
    nombre: 'Esteban Ruiz',
    email: 'esteban.ruiz@cgb.latam',
    puestoId: puestoAnalista.id,
  });
  const registro = asignarRutaOnboarding(base, puestoAnalista, rutaOnboarding);
  const invitacion = crearInvitacionColaborador(registro, 'https://app.cgb.latam');

  assert.equal(registro.estado, 'PENDIENTE_ACTIVACION');
  assert.equal(registro.rutaAsignada?.id, 'ruta-rh-001');
  assert.equal(registro.progreso, 0);
  assert.ok(invitacion.tokenActivacion.length > 20);
  assert.match(invitacion.enlaceActivacion, /^https:\/\/app\.cgb\.latam\/login\/activar\?/);
});
