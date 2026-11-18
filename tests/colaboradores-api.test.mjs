import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { prisma } from '../src/lib/prisma.ts';
import { crearToken } from '../src/lib/autenticacion.ts';
import { POST as registrar } from '../src/app/api/colaboradores/route.ts';

const secreto = 'clave-de-prueba-hu009-para-autenticacion-32-bytes-minimo';
const admin = { id: '507f1f77bcf86cd799439011', email: 'admin@example.com', name: 'Admin', role: 'ADMINISTRADOR', activo: true, passwordHash: null };
const especialistaRrhh = { id: '507f1f77bcf86cd799439016', email: 'rrhh@example.com', name: 'Especialista RR. HH.', role: 'ESPECIALISTA_RRHH', activo: true, passwordHash: null };
const sesionId = 'sesion-hu009-api';
const tokenAdmin = await crearToken(admin, sesionId, secreto);
const tokenRrhh = await crearToken(especialistaRrhh, sesionId, secreto);
const ruta = { id: '507f1f77bcf86cd799439012', nombre: 'Inducción RH', activa: true, descripcion: 'Ruta de RR. HH.' };
const puesto = { id: '507f1f77bcf86cd799439013', nombre: 'Analista de RR. HH.', rutaOnboardingId: ruta.id, rutaOnboarding: ruta };
let cuentas;
let colaboradores;
let enviados;
let fetchOriginal;
let usuarioSesion;

test.beforeEach(() => {
  process.env.AUTH_SECRET = secreto;
  process.env.APP_URL = 'http://localhost:3000';
  process.env.RESEND_API_KEY = 'test-key';
  process.env.EMAIL_FROM = 'CGB Academy <noreply@example.com>';
  cuentas = [];
  colaboradores = [];
  enviados = [];
  usuarioSesion = admin;
  fetchOriginal = globalThis.fetch;
  globalThis.fetch = async (url, opciones) => {
    enviados.push({ url, opciones: JSON.parse(opciones.body) });
    return new Response(null, { status: 200 });
  };
  prisma.sesion.findUnique = async () => ({ usuarioId: usuarioSesion.id, expiraEn: new Date(Date.now() + 60000), usuario: usuarioSesion });
  prisma.colaborador.findUnique = async ({ where }) => colaboradores.find(registro => registro.email === where.email) || null;
  prisma.user.findUnique = async ({ where }) => cuentas.find(cuenta => cuenta.email === where.email) || null;
  prisma.puestoTrabajo.findUnique = async () => puesto;
  prisma.user.create = async ({ data }) => {
    const cuenta = { id: `507f1f77bcf86cd7994390${cuentas.length + 20}`, ...data };
    cuentas.push(cuenta);
    return cuenta;
  };
  prisma.colaborador.create = async ({ data, include }) => {
    const registro = {
      id: `507f1f77bcf86cd7994390${colaboradores.length + 40}`,
      ...data,
      puesto: include.puesto ? { id: puesto.id, nombre: puesto.nombre } : null,
      rutaOnboarding: include.rutaOnboarding ? ruta : null,
    };
    colaboradores.push(registro);
    return registro;
  };
  prisma.colaborador.deleteMany = async ({ where }) => {
    colaboradores = colaboradores.filter(registro => registro.userId !== where.userId);
  };
  prisma.user.deleteMany = async ({ where }) => {
    cuentas = cuentas.filter(cuenta => cuenta.id !== where.id);
  };
});

test.afterEach(() => {
  globalThis.fetch = fetchOriginal;
  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_FROM;
});

function solicitud(datos, token = tokenAdmin) {
  return new NextRequest('http://localhost:3000/api/colaboradores', {
    method: 'POST',
    headers: { origin: 'http://localhost:3000', 'Content-Type': 'application/json', cookie: `cgb_sesion=${token}` },
    body: JSON.stringify(datos),
  });
}

test('registra una cuenta vinculada, asigna la ruta y envía la invitación sin divulgar el token', async () => {
  const respuesta = await registrar(solicitud({ nombre: 'Ana Torres', email: 'ana@example.com', dni: '12345678', puestoId: puesto.id }));
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 201);
  assert.equal(cuerpo.resultados[0].datos.estado, 'PENDIENTE_ACTIVACION');
  assert.equal(cuerpo.resultados[0].datos.rutaAsignada.id, ruta.id);
  assert.equal(colaboradores[0].progreso, 0);
  assert.equal(colaboradores[0].userId, cuentas[0].id);
  assert.equal(cuentas[0].activo, false);
  assert.ok(colaboradores[0].tokenExpiraEn instanceof Date);
  assert.notEqual(colaboradores[0].tokenActivacion, new URL(enviados[0].opciones.html.match(/href="([^"]+)/)[1]).searchParams.get('token'));
  assert.equal(enviados.length, 1);
  assert.equal(JSON.stringify(cuerpo).includes('token'), false);
  assert.equal(Object.hasOwn(colaboradores[0], 'enlaceActivacion'), false);
});

test('acepta registro masivo y revierte cuenta si falla el correo', async () => {
  const lote = [
    { nombre: 'Ana Torres', email: 'ana@example.com', dni: '12345678', puestoId: puesto.id },
    { nombre: 'Luis Rojas', email: 'luis@example.com', dni: '87654321', puestoId: puesto.id },
  ];
  const respuesta = await registrar(solicitud({ colaboradores: lote }));
  assert.equal(respuesta.status, 201);
  assert.equal(colaboradores.length, 2);
  assert.equal(enviados.length, 2);

  globalThis.fetch = async () => new Response(null, { status: 503 });
  const fallida = await registrar(solicitud({ nombre: 'Eva Paz', email: 'eva@example.com', dni: '55555555', puestoId: puesto.id }));
  assert.equal(fallida.status, 400);
  assert.equal(cuentas.some(cuenta => cuenta.email === 'eva@example.com'), false);
  assert.equal(colaboradores.some(registro => registro.email === 'eva@example.com'), false);
});

test('el rol de Recursos Humanos puede registrar colaboradores', async () => {
  usuarioSesion = especialistaRrhh;
  const respuesta = await registrar(solicitud({
    nombre: 'María Flores', email: 'maria@example.com', dni: '99887766', puestoId: puesto.id,
  }, tokenRrhh));

  assert.equal(respuesta.status, 201);
  assert.equal(colaboradores[0].email, 'maria@example.com');
});