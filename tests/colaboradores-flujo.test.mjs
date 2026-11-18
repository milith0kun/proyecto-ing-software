import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { prisma } from '../src/lib/prisma.ts';
import { autenticar, crearToken } from '../src/lib/autenticacion.ts';
import { POST as registrar } from '../src/app/api/colaboradores/route.ts';
import { POST as activar } from '../src/app/api/auth/activar/route.ts';

const secreto = 'clave-de-integracion-hu009-de-32-bytes-o-mas-2026';
const admin = { id: '507f1f77bcf86cd799439011', email: 'admin@example.com', name: 'Admin', role: 'ADMINISTRADOR', activo: true, passwordHash: null };
const tokenAdmin = await crearToken(admin, 'sesion-hu009-flujo', secreto);
const ruta = { id: '507f1f77bcf86cd799439012', nombre: 'Inducción RH', titulo: 'Inducción RH', estado: 'ACTIVA', activa: true, descripcion: 'Ruta de Recursos Humanos.' };
const puesto = { id: '507f1f77bcf86cd799439013', nombre: 'Analista de RR. HH.', rutas: [ruta] };
let cuenta;
let registro;
let enlace;
let fetchOriginal;

test.before(() => {
  process.env.AUTH_SECRET = secreto;
  process.env.APP_URL = 'http://localhost:3000';
  process.env.RESEND_API_KEY = 'test-key';
  process.env.EMAIL_FROM = 'CGB Academy <noreply@example.com>';
  fetchOriginal = globalThis.fetch;
  prisma.sesion.findUnique = async () => ({ usuarioId: admin.id, expiraEn: new Date(Date.now() + 60000), usuario: admin });
  prisma.colaborador.findUnique = async () => registro;
  prisma.user.findUnique = async ({ where }) => cuenta?.email === where.email ? cuenta : null;
  prisma.puestoTrabajo.findUnique = async () => puesto;
  prisma.user.create = async ({ data }) => { cuenta = { id: '507f1f77bcf86cd799439014', ...data }; return cuenta; };
  prisma.colaborador.create = async ({ data }) => {
    registro = { id: '507f1f77bcf86cd799439015', ...data, puesto, rutaOnboarding: ruta };
    return registro;
  };
  prisma.colaborador.findFirst = async ({ where }) => (
    registro?.tokenActivacion === where.tokenActivacion &&
    registro.tokenExpiraEn > where.tokenExpiraEn.gt
  ) ? { ...registro, user: cuenta } : null;
  globalThis.fetch = async (_url, opciones) => {
    const cuerpo = JSON.parse(opciones.body);
    enlace = cuerpo.html.match(/href="([^"]+)"/)?.[1];
    return new Response(null, { status: 200 });
  };
  prisma.$transaction = async ejecutar => ejecutar({
    colaborador: {
      updateMany: async ({ where, data }) => {
        if (registro.tokenActivacion !== where.tokenActivacion || registro.tokenExpiraEn <= where.tokenExpiraEn.gt) return { count: 0 };
        Object.assign(registro, data);
        return { count: 1 };
      },
    },
    user: { update: async ({ data }) => { Object.assign(cuenta, data); return cuenta; } },
  });
});

test.after(() => {
  globalThis.fetch = fetchOriginal;
  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_FROM;
});

test('HU-009 flujo completo: registro, asignación, invitación, activación e inicio de sesión', async () => {
  const registroHttp = new NextRequest('http://localhost:3000/api/colaboradores', {
    method: 'POST',
    headers: { origin: 'http://localhost:3000', 'Content-Type': 'application/json', cookie: `cgb_sesion=${tokenAdmin}` },
    body: JSON.stringify({ nombre: 'Ana Torres', email: 'ana@example.com', dni: '12345678', puestoId: puesto.id }),
  });
  const respuestaRegistro = await registrar(registroHttp);
  assert.equal(respuestaRegistro.status, 201);
  assert.equal(registro.rutaOnboardingId, ruta.id);
  assert.equal(registro.progreso, 0);
  assert.equal(cuenta.activo, false);
  assert.ok(enlace);

  const tokenInvitacion = new URL(enlace).searchParams.get('token');
  const respuestaActivacion = await activar(new NextRequest('http://localhost:3000/api/auth/activar', {
    method: 'POST',
    headers: { origin: 'http://localhost:3000', 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: tokenInvitacion, contrasena: 'ClaveFuerteDePrueba2026!' }),
  }));
  assert.equal(respuestaActivacion.status, 200);
  assert.equal(cuenta.activo, true);
  assert.equal(registro.estado, 'ACTIVO');
  assert.equal(registro.tokenActivacion, null);

  const sesion = await autenticar({ correo: cuenta.email, contrasena: 'ClaveFuerteDePrueba2026!' }, async () => cuenta);
  assert.equal(sesion.role, 'COLABORADOR');
  assert.equal(sesion.email, 'ana@example.com');
});