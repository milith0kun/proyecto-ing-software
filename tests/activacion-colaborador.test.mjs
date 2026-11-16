import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { prisma } from '../src/lib/prisma.ts';
import { hashTokenActivacion } from '../src/lib/colaboradores.ts';
import { POST as activar } from '../src/app/api/auth/activar/route.ts';

const token = 'token-privado-de-prueba-que-no-se-expone';
const usuario = { id: '507f1f77bcf86cd799439011', activo: false };
const colaborador = { id: '507f1f77bcf86cd799439012', userId: usuario.id, user: usuario };
let consulta;
let cambios;

test.beforeEach(() => {
  consulta = { ...colaborador };
  cambios = [];
  prisma.colaborador.findFirst = async consultaToken => {
    cambios.push({ consultaToken });
    return consulta;
  };
  prisma.$transaction = async ejecutar => ejecutar({
    colaborador: { updateMany: async datos => { cambios.push({ colaborador: datos }); return { count: 1 }; } },
    user: { update: async datos => cambios.push({ user: datos }) },
  });
});

function solicitud(datos, origen = 'http://localhost:3000') {
  return new NextRequest('http://localhost:3000/api/auth/activar', {
    method: 'POST',
    headers: { origin: origen, 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
}

test('activa cuenta, marca colaborador activo y consume el token', async () => {
  const respuesta = await activar(solicitud({ token, contrasena: 'UnaClaveSegura2026!' }));
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 200);
  assert.equal(cuerpo.ok, true);
  assert.equal(cambios[0].consultaToken.where.tokenActivacion, hashTokenActivacion(token));
  assert.equal(cambios[1].colaborador.data.estado, 'ACTIVO');
  assert.equal(cambios[1].colaborador.data.tokenActivacion, null);
  assert.equal(cambios[2].user.data.activo, true);
  assert.ok(cambios[2].user.data.passwordHash);
  assert.equal(JSON.stringify(cuerpo).includes(token), false);
});

test('solo una solicitud simultánea puede consumir una invitación', async () => {
  prisma.$transaction = async ejecutar => ejecutar({
    colaborador: { updateMany: async () => ({ count: 0 }) },
    user: { update: async datos => cambios.push({ user: datos }) },
  });
  const respuesta = await activar(solicitud({ token, contrasena: 'UnaClaveSegura2026!' }));
  assert.equal(respuesta.status, 400);
  assert.equal(cambios.some(cambio => cambio.user), false);
});

test('rechaza enlace vencido, contraseña débil y origen ajeno sin modificar cuentas', async () => {
  consulta = null;
  assert.equal((await activar(solicitud({ token, contrasena: 'UnaClaveSegura2026!' }))).status, 400);
  assert.equal((await activar(solicitud({ token, contrasena: 'corta' }))).status, 400);
  assert.equal((await activar(solicitud({ token, contrasena: 'UnaClaveSegura2026!' }, 'https://otro.example'))).status, 403);
  assert.equal(cambios.filter(cambio => cambio.user || cambio.colaborador).length, 0);
});