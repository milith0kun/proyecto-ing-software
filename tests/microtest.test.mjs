import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { prisma } from '../src/lib/prisma.ts';
import { crearToken } from '../src/lib/autenticacion.ts';
import { POST as evaluar } from '../src/app/api/evaluaciones/evaluar/route.ts';
import { calcularResultado, intentosRestantes } from '../src/lib/microtest.ts';

// HU-014 / CGB-66 (RED): criterios de aceptación como pruebas BDD sobre /api/evaluaciones/evaluar.
process.env.AUTH_SECRET = 'clave-exclusiva-de-pruebas-de-microtest-2026';
process.env.APP_URL = 'http://localhost:3000';

const capacitacionId = '507f1f77bcf86cd799439011';
const evaluacionId = '507f1f77bcf86cd799439031';
const ana = { id: '507f1f77bcf86cd799439021', email: 'ana@example.com', name: 'Ana', role: 'COLABORADOR', activo: true, passwordHash: null };
const beto = { id: '507f1f77bcf86cd799439022', email: 'beto@example.com', name: 'Beto', role: 'COLABORADOR', activo: true, passwordHash: null };
const tokenAna = await crearToken(ana, 'sesion-ana', process.env.AUTH_SECRET);
const tokenBeto = await crearToken(beto, 'sesion-beto', process.env.AUTH_SECRET);
const sesiones = { 'sesion-ana': ana, 'sesion-beto': beto };

const evaluacion = {
  id: evaluacionId, capacitacionId, notaMinima: 70, maxIntentos: 2, tiempoLimiteSeg: null,
  preguntas: [
    { id: 'p1', enunciado: '¿Uno?', opciones: ['a', 'b'], correcta: 0, retroalimentacion: 'Es la a.' },
    { id: 'p2', enunciado: '¿Dos?', opciones: ['a', 'b', 'c'], correcta: 2, retroalimentacion: 'Es la c.' },
    { id: 'p3', enunciado: '¿Tres?', opciones: ['a', 'b'], correcta: 1, retroalimentacion: null },
    { id: 'p4', enunciado: '¿Cuatro?', opciones: ['a', 'b'], correcta: 1, retroalimentacion: 'Es la b.' },
  ],
};
const correctas = [0, 2, 1, 1];
let intentos, progresos, escrituras;

test.beforeEach(() => {
  intentos = []; escrituras = 0;
  progresos = new Map([[`${ana.id}:${capacitacionId}`, { usuarioId: ana.id, capacitacionId, ultimoSlide: 3, slidesConfirmados: [1, 2, 3], estado: 'EN_CURSO', updatedAt: new Date() }],
    [`${beto.id}:${capacitacionId}`, { usuarioId: beto.id, capacitacionId, ultimoSlide: 1, slidesConfirmados: [1], estado: 'EN_CURSO', updatedAt: new Date() }]]);
  prisma.sesion.findUnique = async ({ where }) => {
    const usuario = sesiones[where.id];
    return usuario ? { usuarioId: usuario.id, expiraEn: new Date(Date.now() + 60000), usuario } : null;
  };
  prisma.evaluacion.findUnique = async ({ where }) => where.capacitacionId === capacitacionId ? structuredClone(evaluacion) : null;
  prisma.capacitacion.findFirst = async ({ where }) =>
    where.id === capacitacionId && where.estado === 'PUBLICADA' && where.ambito === 'INTERNO' ? { id: capacitacionId, prerrequisitos: [], slides: [{ id: 's1' }, { id: 's2' }, { id: 's3' }] } : null;
  prisma.progresoCapacitacion.findUnique = async ({ where }) => {
    const { usuarioId, capacitacionId: cap } = where.usuarioId_capacitacionId;
    return structuredClone(progresos.get(`${usuarioId}:${cap}`) ?? null);
  };
  prisma.progresoCapacitacion.updateMany = async ({ where, data }) => {
    const actual = progresos.get(`${where.usuarioId}:${where.capacitacionId}`);
    if (!actual) return { count: 0 };
    progresos.set(`${where.usuarioId}:${where.capacitacionId}`, { ...actual, ...data });
    return { count: 1 };
  };
  prisma.intentoEvaluacion.findMany = async ({ where }) =>
    intentos.filter(i => i.usuarioId === where.usuarioId && i.evaluacionId === where.evaluacionId).map(i => structuredClone(i));
  prisma.intentoEvaluacion.create = async ({ data }) => {
    if (intentos.some(i => i.usuarioId === data.usuarioId && i.evaluacionId === data.evaluacionId && i.numero === data.numero)) {
      throw Object.assign(new Error('Unique constraint'), { code: 'P2002' });
    }
    escrituras += 1;
    intentos.push({ ...data, id: `i${intentos.length + 1}`, enviadoEn: new Date() });
    return structuredClone(intentos.at(-1));
  };
});

function solicitud(datos, token = tokenAna, origen = 'http://localhost:3000') {
  return new NextRequest('http://localhost:3000/api/evaluaciones/evaluar', {
    method: 'POST',
    headers: { origin: origen, 'Content-Type': 'application/json', ...(token ? { cookie: `cgb_sesion=${token}` } : {}) },
    body: JSON.stringify(datos),
  });
}
const enviar = (respuestas, token) => evaluar(solicitud({ capacitacionId, respuestas }, token));

test('HU-014 CA-02 Calificación: calcula el puntaje y muestra correctas con retroalimentación', async () => {
  const respuesta = await enviar([0, 2, 0, 1]);
  assert.equal(respuesta.status, 200);
  const { datos } = await respuesta.json();
  assert.equal(datos.puntaje, 75);
  assert.equal(datos.aciertos, 3);
  assert.equal(datos.detalle.length, 4);
  assert.deepEqual(datos.detalle.map(d => d.esCorrecta), [true, true, false, true]);
  assert.equal(datos.detalle[2].correcta, 1);
  assert.equal(datos.detalle[0].retroalimentacion, 'Es la a.');
});

test('HU-014 CA-02 Calificación: el motor puro califica sin base de datos', () => {
  const r = calcularResultado(evaluacion.preguntas, correctas);
  assert.equal(r.puntaje, 100);
  assert.equal(calcularResultado(evaluacion.preguntas, [-1, -1, -1, -1]).puntaje, 0);
  assert.equal(calcularResultado(evaluacion.preguntas, [0, 0, 0, 0]).puntaje, 25);
});

test('HU-014 CA-03 Aprobación: con la nota mínima aprueba y completa la capacitación', async () => {
  const { datos } = await (await enviar(correctas)).json();
  assert.equal(datos.aprobado, true);
  assert.equal(datos.capacitacionCompletada, true);
  assert.equal(progresos.get(`${ana.id}:${capacitacionId}`).estado, 'COMPLETADA');
  assert.ok(progresos.get(`${ana.id}:${capacitacionId}`).completadaEn instanceof Date);
  assert.equal(intentos[0].aprobado, true);
  assert.equal(intentos[0].puntaje, 100);
});

test('HU-014 CA-03 Aprobación: exactamente la nota mínima también aprueba', async () => {
  const { datos } = await (await enviar([0, 2, 0, 1])).json(); // 75 >= 70
  assert.equal(datos.aprobado, true);
});

test('HU-014 CA-04 Reintento: reprobar con intentos disponibles permite otro intento y no completa', async () => {
  const { datos } = await (await enviar([1, 1, 0, 0])).json();
  assert.equal(datos.aprobado, false);
  assert.equal(datos.capacitacionCompletada, false);
  assert.equal(datos.intentosRestantes, 1);
  assert.equal(datos.puedeReintentar, true);
  assert.equal(progresos.get(`${ana.id}:${capacitacionId}`).estado, 'EN_CURSO');
  const segundo = await (await enviar(correctas)).json();
  assert.equal(segundo.datos.aprobado, true);
  assert.equal(intentos.map(i => i.numero).join(), '1,2');
});

test('HU-014 CA-04 Reintento: agotados los intentos se rechaza el siguiente', async () => {
  await enviar([1, 1, 0, 0]);
  const ultimo = await (await enviar([1, 1, 0, 0])).json();
  assert.equal(ultimo.datos.puedeReintentar, false);
  const extra = await enviar(correctas);
  assert.equal(extra.status, 409);
  assert.equal(intentos.length, 2);
  assert.equal(intentosRestantes(2, 2), 0);
  assert.equal(intentosRestantes(3, 1), 2);
});

test('HU-014 CA-04 Reintento: una capacitación ya aprobada no admite más intentos', async () => {
  await enviar(correctas);
  const otra = await enviar(correctas);
  assert.equal(otra.status, 409);
  assert.equal(intentos.length, 1);
});

test('HU-014 Integridad: dos envíos simultáneos no superan el límite de intentos', async () => {
  const resultados = await Promise.all([1, 2, 3, 4].map(() => enviar([1, 1, 0, 0])));
  assert.ok(resultados.filter(r => r.status === 200).length <= 2);
  assert.ok(intentos.length <= 2);
});

test('HU-014 CA-01 Precondición: sin concluir las diapositivas no se puede evaluar', async () => {
  const respuesta = await enviar(correctas, tokenBeto);
  assert.equal(respuesta.status, 409);
  assert.equal(intentos.length, 0);
});

test('HU-014 Seguridad: sin sesión 401, origen ajeno 403, y el intento es siempre de la sesión', async () => {
  assert.equal((await enviar(correctas, null)).status, 401);
  assert.equal((await evaluar(solicitud({ capacitacionId, respuestas: correctas }, tokenAna, 'https://malo.example'))).status, 403);
  await evaluar(solicitud({ capacitacionId, respuestas: correctas, usuarioId: beto.id }));
  assert.equal(intentos[0].usuarioId, ana.id);
});

test('HU-014 Validación: respuestas inválidas o capacitación inexistente se rechazan sin escribir', async () => {
  for (const respuestas of [[0, 2, 1], [0, 2, 1, 1, 1], [0, 2, 1, 9], [0, 2, 1, 1.5], 'x', [0, 2, 1, '1']]) {
    assert.equal((await enviar(respuestas)).status, 400, JSON.stringify(respuestas));
  }
  assert.equal((await evaluar(solicitud({ capacitacionId: 'no-valido', respuestas: correctas }))).status, 400);
  assert.equal((await evaluar(solicitud({ capacitacionId: '507f1f77bcf86cd799439099', respuestas: correctas }))).status, 404);
  assert.equal(escrituras, 0);
});

test('HU-014 Privacidad: un fallo del repositorio devuelve un error genérico', async () => {
  prisma.evaluacion.findUnique = async () => { throw new Error('mongodb://secreto'); };
  const respuesta = await enviar(correctas);
  assert.equal(respuesta.status, 503);
  assert.ok(!(await respuesta.text()).includes('secreto'));
});

// Arquitectura (DIS / ARQ): cada capa solo conoce a la inferior y cada módulo escribe en sus propios datos.
import { readFileSync } from 'node:fs';
const fuente = ruta => readFileSync(new URL(`../src/lib/${ruta}`, import.meta.url), 'utf8');

test('HU-014 Arquitectura: el servicio de evaluación no importa HTTP ni Prisma', () => {
  const servicio = fuente('servicio-evaluacion.ts');
  assert.doesNotMatch(servicio, /next\/server|NextRequest|NextResponse|@\/lib\/prisma|repositorio-progreso/);
});

test('HU-014 Arquitectura: el repositorio de evaluación no escribe en el avance de CGB-56', () => {
  assert.doesNotMatch(fuente('repositorio-evaluacion.ts'), /progresoCapacitacion/);
  assert.doesNotMatch(fuente('servicio-progreso.ts'), /repositorio-evaluacion|servicio-evaluacion/);
});
