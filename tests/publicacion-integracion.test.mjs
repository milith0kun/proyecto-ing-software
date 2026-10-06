import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { prisma } from '../src/lib/prisma.ts';
import { crearToken } from '../src/lib/autenticacion.ts';
import { POST as publicar } from '../src/app/api/capacitaciones/[id]/publicar/route.ts';
import { PUT as editar } from '../src/app/api/capacitaciones/[id]/route.ts';
import { POST as crear, GET as consultar } from '../src/app/api/capacitaciones/route.ts';

process.env.AUTH_SECRET = 'clave-exclusiva-de-pruebas-de-publicacion-2026';
process.env.APP_URL = 'http://localhost:3000';
const id = '507f1f77bcf86cd799439011';
const usuario = { id: '507f1f77bcf86cd799439012', email: 'admin@example.com', name: 'Prueba', role: 'ADMINISTRADOR', activo: true, passwordHash: null };
const token = await crearToken(usuario, 'sesion-prueba-hu004', process.env.AUTH_SECRET);
const base = { id, titulo: 'Inducción de prueba', descripcion: 'Contenido de inducción de prueba.', unidad: 'CIIP', ambito: 'PUBLICO', estado: 'BORRADOR', publicadaEn: null, categoria: 'Inducción', duracionMin: 30, icono: 'book-open', slides: [{ id: 'slide-1', capacitacionId: id, titulo: 'Bienvenida', contenido: 'Bienvenidos al centro de capacitación.', tipo: 'TEXT', orden: 1, lista: [] }] };
let registro;
let cambios;
let rol;
let filtroPublico;

test.beforeEach(() => {
  registro = structuredClone(base); cambios = []; rol = 'ADMINISTRADOR'; filtroPublico = null;
  prisma.sesion.findUnique = async () => ({ usuarioId: usuario.id, expiraEn: new Date(Date.now() + 60000), usuario: { ...usuario, role: rol } });
  prisma.capacitacion.findUnique = async () => registro ? structuredClone(registro) : null;
  prisma.capacitacion.update = async ({ data }) => { cambios.push(data); registro = { ...registro, ...data }; return structuredClone(registro); };
  prisma.capacitacion.create = async ({ data }) => { cambios.push(data); return { id, ...data }; };
  prisma.capacitacion.findMany = async ({ where }) => { filtroPublico = where; return registro && registro.estado === where.estado && registro.ambito === where.ambito ? [registro] : []; };
  prisma.$transaction = async ejecutar => ejecutar(prisma);
});

function solicitud(ruta, method, datos, autenticar = true, origen = 'http://localhost:3000') {
  return new NextRequest('http://localhost:3000' + ruta, { method, headers: { origin: origen, 'Content-Type': 'application/json', ...(autenticar ? { cookie: `cgb_sesion=${token}` } : {}) }, ...(datos === undefined ? {} : { body: JSON.stringify(datos) }) });
}
const contexto = { params: Promise.resolve({ id }) };

test('HU004 CA02/CA04: POST publica, persiste fecha y la consulta anónima incluye el resultado', async () => {
  const respuesta = await publicar(solicitud(`/api/capacitaciones/${id}/publicar`, 'POST'), contexto);
  assert.equal(respuesta.status, 200);
  assert.equal(registro.estado, 'PUBLICADA');
  assert.ok(registro.publicadaEn instanceof Date);
  const fecha = registro.publicadaEn.getTime();
  await publicar(solicitud(`/api/capacitaciones/${id}/publicar`, 'POST'), contexto);
  assert.equal(registro.publicadaEn.getTime(), fecha);
  const catalogo = await consultar(solicitud('/api/capacitaciones', 'GET', undefined, false));
  assert.deepEqual(filtroPublico, { ambito: 'PUBLICO', estado: 'PUBLICADA' });
  assert.equal((await catalogo.json()).total, 1);
});

test('HU004 CA03: POST y PUT rechazan cero diapositivas sin escribir estado ni fecha', async () => {
  registro.slides = [];
  for (const respuesta of [await publicar(solicitud(`/api/capacitaciones/${id}/publicar`, 'POST'), contexto), await editar(solicitud(`/api/capacitaciones/${id}`, 'PUT', { estado: 'PUBLICADA' }), contexto)]) {
    assert.equal(respuesta.status, 400);
    assert.equal((await respuesta.json()).error, 'Debe agregar al menos una diapositiva antes de publicar');
  }
  assert.equal(cambios.length, 0);
  assert.equal(registro.estado, 'BORRADOR');
  assert.equal(registro.publicadaEn, null);
});

test('HU004 CA02: PUT compatible publica validando contenido y guardando fecha', async () => {
  assert.equal((await editar(solicitud(`/api/capacitaciones/${id}`, 'PUT', { estado: 'PUBLICADA' }), contexto)).status, 200);
  assert.equal(registro.estado, 'PUBLICADA');
  assert.ok(registro.publicadaEn instanceof Date);
});

test('HU004 CA04: publicar contenido interno no lo incluye en el catálogo anónimo', async () => {
  registro.ambito = 'INTERNO';
  assert.equal((await publicar(solicitud(`/api/capacitaciones/${id}/publicar`, 'POST'), contexto)).status, 200);
  const catalogo = await consultar(solicitud('/api/capacitaciones', 'GET', undefined, false));
  assert.equal((await catalogo.json()).total, 0);
});

test('HU004: creación directa con PUBLICADA sigue creando BORRADOR', async () => {
  const respuesta = await crear(solicitud('/api/capacitaciones', 'POST', { ...base, estado: 'PUBLICADA' }));
  assert.equal(respuesta.status, 201);
  assert.equal(cambios[0].estado, 'BORRADOR');
});

test('HU004: anónimo, colaborador y origen ajeno no publican ni escriben', async () => {
  assert.equal((await publicar(solicitud(`/api/capacitaciones/${id}/publicar`, 'POST', undefined, false), contexto)).status, 401);
  rol = 'COLABORADOR';
  assert.equal((await publicar(solicitud(`/api/capacitaciones/${id}/publicar`, 'POST'), contexto)).status, 403);
  rol = 'ADMINISTRADOR';
  assert.equal((await publicar(solicitud(`/api/capacitaciones/${id}/publicar`, 'POST', undefined, true, 'https://otro.example'), contexto)).status, 403);
  assert.equal(cambios.length, 0);
});

test('HU004: identificador inválido y capacitación inexistente producen 400/404 sin escribir', async () => {
  assert.equal((await publicar(solicitud('/api/capacitaciones/invalido/publicar', 'POST'), { params: Promise.resolve({ id: 'invalido' }) })).status, 400);
  registro = null;
  assert.equal((await publicar(solicitud(`/api/capacitaciones/${id}/publicar`, 'POST'), contexto)).status, 404);
  assert.equal(cambios.length, 0);
});

test('HU004: fallo del repositorio devuelve error genérico y no expone datos internos', async () => {
  prisma.$transaction = async () => { throw new Error('detalle privado del servidor'); };
  const respuesta = await publicar(solicitud(`/api/capacitaciones/${id}/publicar`, 'POST'), contexto);
  assert.equal(respuesta.status, 503);
  assert.ok(!JSON.stringify(await respuesta.json()).includes('detalle privado'));
});
