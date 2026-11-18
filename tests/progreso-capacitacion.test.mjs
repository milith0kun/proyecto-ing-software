import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { prisma } from '../src/lib/prisma.ts';
import { crearToken } from '../src/lib/autenticacion.ts';
import { GET as consultar, PUT as guardar } from '../src/app/api/colaborador/capacitaciones/[id]/progreso/route.ts';
import { POST as finalizar } from '../src/app/api/colaborador/capacitaciones/[id]/progreso/finalizar/route.ts';
import {
  calcularPorcentajeAvance,
  prerrequisitosCumplidos,
  slideDeReanudacion,
} from '../src/lib/progreso-capacitacion.ts';

// HU-012 / CGB-57 (RED): criterios de aceptación como pruebas BDD.
process.env.AUTH_SECRET = 'clave-exclusiva-de-pruebas-de-progreso-2026';
process.env.APP_URL = 'http://localhost:3000';

const capacitacionId = '507f1f77bcf86cd799439011';
const ana = { id: '507f1f77bcf86cd799439021', email: 'ana@example.com', name: 'Ana', role: 'COLABORADOR', activo: true, passwordHash: null };
const beto = { id: '507f1f77bcf86cd799439022', email: 'beto@example.com', name: 'Beto', role: 'COLABORADOR', activo: true, passwordHash: null };
const tokenAna = await crearToken(ana, 'sesion-ana', process.env.AUTH_SECRET);
const tokenBeto = await crearToken(beto, 'sesion-beto', process.env.AUTH_SECRET);
const sesiones = { 'sesion-ana': ana, 'sesion-beto': beto };

const capacitacion = {
  id: capacitacionId, estado: 'PUBLICADA', ambito: 'INTERNO', prerrequisitos: [],
  slides: [{ id: 's1' }, { id: 's2' }, { id: 's3' }, { id: 's4' }],
};
let progresos;
let escrituras;
let antesDeActualizar;
let conMicrotest;

test.beforeEach(() => {
  progresos = new Map(); escrituras = 0; antesDeActualizar = null; conMicrotest = false;
  prisma.sesion.findUnique = async ({ where }) => {
    const usuario = sesiones[where.id];
    return usuario ? { usuarioId: usuario.id, expiraEn: new Date(Date.now() + 60000), usuario } : null;
  };
  prisma.capacitacion.findFirst = async ({ where }) =>
    where.id === capacitacionId && where.estado === 'PUBLICADA' && where.ambito === 'INTERNO' ? structuredClone(capacitacion) : null;
  prisma.evaluacion.findUnique = async () => (conMicrotest ? { id: 'e1' } : null);
  prisma.progresoCapacitacion.findUnique = async ({ where }) => {
    const { usuarioId, capacitacionId: cap } = where.usuarioId_capacitacionId;
    return structuredClone(progresos.get(`${usuarioId}:${cap}`) ?? null);
  };
  prisma.progresoCapacitacion.findMany = async ({ where }) =>
    [...progresos.values()].filter(p => p.usuarioId === where.usuarioId && p.estado === where.estado).map(p => structuredClone(p));
  let reloj = Date.now();
  const marca = () => new Date(++reloj);
  prisma.progresoCapacitacion.create = async ({ data }) => {
    const clave = `${data.usuarioId}:${data.capacitacionId}`;
    if (progresos.has(clave)) throw Object.assign(new Error('Unique constraint'), { code: 'P2002' });
    escrituras += 1;
    progresos.set(clave, { ...data, updatedAt: marca() });
    return structuredClone(progresos.get(clave));
  };
  prisma.progresoCapacitacion.updateMany = async ({ where, data }) => {
    await antesDeActualizar?.();
    const clave = `${where.usuarioId}:${where.capacitacionId}`;
    const actual = progresos.get(clave);
    if (!actual || actual.updatedAt.getTime() !== where.updatedAt.getTime()) return { count: 0 };
    escrituras += 1;
    progresos.set(clave, { ...actual, ...data, updatedAt: marca() });
    return { count: 1 };
  };
});

function solicitud(ruta, method, datos, token = tokenAna, origen = 'http://localhost:3000') {
  return new NextRequest('http://localhost:3000' + ruta, {
    method,
    headers: { origin: origen, 'Content-Type': 'application/json', ...(token ? { cookie: `cgb_sesion=${token}` } : {}) },
    ...(datos === undefined ? {} : { body: JSON.stringify(datos) }),
  });
}
const ruta = `/api/colaborador/capacitaciones/${capacitacionId}/progreso`;
const contexto = { params: Promise.resolve({ id: capacitacionId }) };
const confirmar = (slide, token) => guardar(solicitud(ruta, 'PUT', { slide }, token), contexto);
const terminar = token => finalizar(solicitud(`${ruta}/finalizar`, 'POST', undefined, token), contexto);

test('HU-012 CA-01 Guardar avance: confirmar un slide guarda capacitación, slide y fecha', async () => {
  await confirmar(1);
  const respuesta = await confirmar(2);
  assert.equal(respuesta.status, 200);
  const cuerpo = await respuesta.json();
  assert.equal(cuerpo.datos.ultimoSlide, 2);
  const guardado = progresos.get(`${ana.id}:${capacitacionId}`);
  assert.equal(guardado.capacitacionId, capacitacionId);
  assert.equal(guardado.usuarioId, ana.id);
  assert.equal(guardado.ultimoSlide, 2);
  assert.ok(guardado.updatedAt instanceof Date);
});

test('HU-012 CA-02 Reanudar: con avance abre el último slide confirmado y sin avance el primero', async () => {
  const vacio = await (await consultar(solicitud(ruta, 'GET'), contexto)).json();
  assert.equal(vacio.datos.slideInicial, 1);
  await confirmar(1); await confirmar(2); await confirmar(3);
  const retomado = await (await consultar(solicitud(ruta, 'GET'), contexto)).json();
  assert.equal(retomado.datos.slideInicial, 3);
  assert.equal(slideDeReanudacion(null, 4), 1);
  assert.equal(slideDeReanudacion({ ultimoSlide: 3 }, 4), 3);
  assert.equal(slideDeReanudacion({ ultimoSlide: 9 }, 4), 4);
});

test('HU-012 CA-03 Finalización: solo con todos los slides confirmados y desde el último', async () => {
  await confirmar(1); await confirmar(2);
  const temprana = await terminar();
  assert.equal(temprana.status, 409);
  assert.notEqual(progresos.get(`${ana.id}:${capacitacionId}`).estado, 'COMPLETADA');

  await confirmar(3); await confirmar(4);
  const final = await terminar();
  assert.equal(final.status, 200);
  const guardado = progresos.get(`${ana.id}:${capacitacionId}`);
  assert.equal(guardado.estado, 'COMPLETADA');
  assert.ok(guardado.completadaEn instanceof Date);
});

test('HU-012 CA-03 Finalización: no se puede saltar slides para completar', async () => {
  assert.equal((await confirmar(4)).status, 409);
  assert.equal(progresos.size, 0);
});

test('HU-012 CA-03 Prerrequisitos: la siguiente se habilita solo con prerrequisitos completados', () => {
  assert.equal(prerrequisitosCumplidos([], []), true);
  assert.equal(prerrequisitosCumplidos(['a', 'b'], ['a']), false);
  assert.equal(prerrequisitosCumplidos(['a', 'b'], ['b', 'a', 'c']), true);
});

test('HU-012 CA-03 Prerrequisitos: guardar avance de una capacitación bloqueada se rechaza', async () => {
  capacitacion.prerrequisitos = ['507f1f77bcf86cd799439099'];
  try {
    assert.equal((await confirmar(1)).status, 403);
    assert.equal(escrituras, 0);
  } finally { capacitacion.prerrequisitos = []; }
});

test('HU-012 CA-04 Privacidad: sin sesión no se guarda ni se consulta avance', async () => {
  assert.equal((await confirmar(1, null)).status, 401);
  assert.equal((await consultar(solicitud(ruta, 'GET', undefined, null), contexto)).status, 401);
  assert.equal((await terminar(null)).status, 401);
  assert.equal(escrituras, 0);
});

test('HU-012 CA-04 Privacidad: dos cuentas no leen ni modifican el avance de la otra', async () => {
  await confirmar(1, tokenAna); await confirmar(2, tokenAna);
  const deBeto = await (await consultar(solicitud(ruta, 'GET', undefined, tokenBeto), contexto)).json();
  assert.equal(deBeto.datos.slideInicial, 1);
  await confirmar(1, tokenBeto);
  assert.equal(progresos.get(`${ana.id}:${capacitacionId}`).ultimoSlide, 2);
  assert.equal(progresos.get(`${beto.id}:${capacitacionId}`).ultimoSlide, 1);
  // El usuario nunca se toma del cuerpo de la solicitud.
  await guardar(solicitud(ruta, 'PUT', { slide: 2, usuarioId: ana.id }, tokenBeto), contexto);
  assert.equal(progresos.get(`${ana.id}:${capacitacionId}`).ultimoSlide, 2);
});

test('HU-012 CA-04 Privacidad: origen ajeno no escribe', async () => {
  const respuesta = await guardar(solicitud(ruta, 'PUT', { slide: 1 }, tokenAna, 'https://otro.example'), contexto);
  assert.equal(respuesta.status, 403);
  assert.equal(escrituras, 0);
});

test('HU-012 CA-05 Integridad: repetir la confirmación no duplica registros ni suma avance', async () => {
  await confirmar(1);
  await confirmar(1);
  await confirmar(1);
  assert.equal(progresos.size, 1);
  const guardado = progresos.get(`${ana.id}:${capacitacionId}`);
  assert.deepEqual(guardado.slidesConfirmados, [1]);
  assert.equal(calcularPorcentajeAvance(guardado.slidesConfirmados, 4), 25);
});

test('HU-012 CA-05 Integridad: el porcentaje nunca supera 100 %', () => {
  assert.equal(calcularPorcentajeAvance([1, 2, 3, 4, 5, 6], 4), 100);
  assert.equal(calcularPorcentajeAvance([1, 1, 1], 3), 33);
  assert.equal(calcularPorcentajeAvance([], 0), 0);
});

test('HU-012: entradas inválidas y capacitaciones inexistentes se rechazan sin escribir', async () => {
  for (const slide of [0, 5, -1, 1.5, 'uno', null]) {
    assert.equal((await confirmar(slide)).status, 400, `slide ${slide}`);
  }
  const otra = { params: Promise.resolve({ id: '507f1f77bcf86cd799439055' }) };
  assert.equal((await guardar(solicitud(ruta, 'PUT', { slide: 1 }), otra)).status, 404);
  assert.equal((await guardar(solicitud(ruta, 'PUT', { slide: 1 }), { params: Promise.resolve({ id: 'invalido' }) })).status, 400);
  assert.equal(escrituras, 0);
});

test('HU-012: un fallo del repositorio devuelve error genérico', async () => {
  prisma.progresoCapacitacion.create = async () => { throw new Error('detalle privado del servidor'); };
  const respuesta = await confirmar(1);
  assert.equal(respuesta.status, 503);
  assert.ok(!JSON.stringify(await respuesta.json()).includes('detalle privado'));
});

test('HU-012 CA-05 Integridad: una confirmación concurrente no pierde el avance de la otra', async () => {
  await confirmar(1);
  await confirmar(2);
  // Mientras Ana confirma el slide 3, otra pestaña reenvía el 2 con datos ya leídos y se adelanta en escribir.
  let rival = true;
  antesDeActualizar = async () => {
    if (!rival) return;
    rival = false;
    const clave = `${ana.id}:${capacitacionId}`;
    progresos.set(clave, { ...progresos.get(clave), slidesConfirmados: [1, 2], ultimoSlide: 2, updatedAt: new Date(Date.now() + 5000) });
  };
  const respuesta = await confirmar(3);
  assert.equal(respuesta.status, 200);
  assert.deepEqual(progresos.get(`${ana.id}:${capacitacionId}`).slidesConfirmados, [1, 2, 3]);
  assert.equal((await respuesta.json()).datos.porcentaje, 75);
});

test('HU-012 CA-05 Integridad: confirmaciones simultáneas se aplican todas sin duplicar registros', async () => {
  await confirmar(1);
  const respuestas = await Promise.all([confirmar(2), confirmar(2), confirmar(2)]);
  assert.ok(respuestas.every(r => r.status === 200));
  const siguiente = await Promise.all([confirmar(3), confirmar(3)]);
  assert.ok(siguiente.every(r => r.status === 200));
  assert.equal(progresos.size, 1);
  assert.deepEqual(progresos.get(`${ana.id}:${capacitacionId}`).slidesConfirmados, [1, 2, 3]);
});

test('HU-012 CA-05 Integridad: si el registro cambia sin parar, responde 409 en vez de perder datos', async () => {
  await confirmar(1);
  antesDeActualizar = async () => {
    const clave = `${ana.id}:${capacitacionId}`;
    progresos.set(clave, { ...progresos.get(clave), updatedAt: new Date(Math.random() * 1e12 + 2e12) });
  };
  assert.equal((await confirmar(2)).status, 409);
});

test('HU-012 CA-03 Finalización concurrente: completar dos veces deja una sola finalización', async () => {
  for (const n of [1, 2, 3, 4]) await confirmar(n);
  const [a, b] = await Promise.all([terminar(), terminar()]);
  assert.deepEqual([a.status, b.status], [200, 200]);
  assert.equal(progresos.size, 1);
  assert.equal(progresos.get(`${ana.id}:${capacitacionId}`).estado, 'COMPLETADA');
});

test('HU-014 Integración: con microtest, Finalizar no completa la capacitación', async () => {
  conMicrotest = true;
  await confirmar(1); await confirmar(2); await confirmar(3); await confirmar(4);
  const respuesta = await terminar();
  assert.equal(respuesta.status, 409);
  assert.notEqual(progresos.get(`${ana.id}:${capacitacionId}`).estado, 'COMPLETADA');
});
