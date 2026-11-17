import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { prisma } from '../src/lib/prisma.ts';
import { crearToken, NOMBRE_COOKIE } from '../src/lib/autenticacion.ts';

import { GET as consultarAsignaciones, PUT as reemplazarAsignaciones } from '../src/app/api/admin/rutas/[id]/capacitaciones/route.ts';

const secreto = 'secreto-exclusivo-asignaciones-rutas-hu011-2026';
process.env.AUTH_SECRET = secreto;

const admin = {
  id: '507f1f77bcf86cd799439101',
  email: 'admin@example.com',
  name: 'Administrador',
  role: 'ADMINISTRADOR',
  activo: true,
  passwordHash: null,
};
const colaborador = {
  id: '507f1f77bcf86cd799439102',
  email: 'colaborador@example.com',
  name: 'Colaborador',
  role: 'COLABORADOR',
  activo: true,
  passwordHash: null,
};
const tokenAdmin = await crearToken(admin, 'sesion-admin-rutas', secreto);
const tokenColaborador = await crearToken(colaborador, 'sesion-colaborador-rutas', secreto);

function solicitud(ruta, metodo = 'GET', datos, token = tokenAdmin) {
  return new NextRequest(`http://localhost:3000${ruta}`, {
    method: metodo,
    headers: {
      origin: 'http://localhost:3000',
      'Content-Type': 'application/json',
      cookie: `${NOMBRE_COOKIE}=${token}`,
    },
    body: datos === undefined ? undefined : JSON.stringify(datos),
  });
}

const rutaId = '507f1f77bcf86cd799439103';
const cursosIds = [
  '507f1f77bcf86cd799439104',
  '507f1f77bcf86cd799439105',
];

test.beforeEach(() => {
  prisma.sesion.findUnique = async ({ where }) => {
    if (where.id === 'sesion-admin-rutas') {
      return { usuarioId: admin.id, expiraEn: new Date(Date.now() + 60_000), usuario: admin };
    }
    if (where.id === 'sesion-colaborador-rutas') {
      return { usuarioId: colaborador.id, expiraEn: new Date(Date.now() + 60_000), usuario: colaborador };
    }
    return null;
  };
});

test('CGB-54 RED: consulta solo rutas y capacitaciones reales de MongoDB', async () => {
  prisma.rutaOnboarding.findUnique = async () => ({
    id: rutaId,
    nombre: 'Inducción real',
    descripcion: 'Ruta existente',
    activa: true,
  });
  prisma.rutaCapacitacion.findMany = async () => [];
  prisma.capacitacion.findMany = async () => [];

  const contexto = { params: Promise.resolve({ id: rutaId }) };
  const respuesta = await consultarAsignaciones(solicitud('/api/admin/rutas/real/capacitaciones'), contexto);

  assert.equal(respuesta.status, 200);
  const cuerpo = await respuesta.json();
  assert.equal(cuerpo.ok, true);
  assert.equal(cuerpo.datos.ruta.id, rutaId);
  assert.deepEqual(cuerpo.datos.asignadas, []);
  assert.deepEqual(cuerpo.datos.disponibles, []);
});

test('CGB-54 RED: rechaza participantes no administradores y IDs inexistentes', async () => {
  prisma.rutaOnboarding.findUnique = async () => null;

  const contexto = { params: Promise.resolve({ id: rutaId }) };
  const respuestaColaborador = await reemplazarAsignaciones(
    solicitud(`/api/admin/rutas/${rutaId}/capacitaciones`, 'PUT', { capacitaciones: cursosIds }, tokenColaborador),
    contexto,
  );
  assert.equal(respuestaColaborador.status, 403);

  const respuestaRutaInexistente = await reemplazarAsignaciones(
    solicitud(`/api/admin/rutas/${rutaId}/capacitaciones`, 'PUT', { capacitaciones: cursosIds }),
    contexto,
  );
  assert.equal(respuestaRutaInexistente.status, 404);
});

test('CGB-54 RED: reemplaza asignaciones por orden real y elimina las anteriores', async () => {
  const operaciones = [];
  prisma.rutaOnboarding.findUnique = async () => ({ id: rutaId, nombre: 'Inducción real', activa: true });
  prisma.capacitacion.findMany = async () => cursosIds.map((id, indice) => ({
    id,
    titulo: `Capacitación real ${indice + 1}`,
    estado: 'PUBLICADA',
  }));
  prisma.$transaction = async ejecutar => ejecutar(prisma);
  prisma.rutaCapacitacion.deleteMany = async datos => operaciones.push({ operacion: 'delete', datos });
  prisma.rutaCapacitacion.createMany = async datos => operaciones.push({ operacion: 'create', datos });

  const contexto = { params: Promise.resolve({ id: rutaId }) };
  const respuesta = await reemplazarAsignaciones(
    solicitud(`/api/admin/rutas/${rutaId}/capacitaciones`, 'PUT', {
      capacitaciones: [{ id: cursosIds[1], orden: 1 }, { id: cursosIds[0], orden: 2 }],
    }),
    contexto,
  );

  assert.equal(respuesta.status, 200);
  assert.equal(operaciones[0].operacion, 'delete');
  assert.deepEqual(operaciones[1].datos.data.map(item => [item.capacitacionId, item.orden]), [
    [cursosIds[1], 1],
    [cursosIds[0], 2],
  ]);
});
