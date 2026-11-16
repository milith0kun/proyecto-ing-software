import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { prisma } from '../src/lib/prisma.ts';
import { crearToken, NOMBRE_COOKIE } from '../src/lib/autenticacion.ts';
import { GET as consultarMiOnboarding } from '../src/app/api/colaborador/onboarding/route.ts';
import { construirPanelMiOnboarding } from '../src/lib/mi-onboarding.ts';

const secreto = 'secreto-de-pruebas-hu011-para-sesiones-2026';
const usuarios = [
  { id: '507f1f77bcf86cd799439011', email: 'ana@example.com', name: 'Ana', role: 'COLABORADOR', activo: true, passwordHash: null },
  { id: '507f1f77bcf86cd799439012', email: 'luis@example.com', name: 'Luis', role: 'COLABORADOR', activo: true, passwordHash: null },
];
const sesiones = usuarios.map((usuario, indice) => ({
  usuario,
  id: `sesion-hu011-${indice + 1}`,
  token: null,
}));
const slides = [
  { id: 'slide-1', orden: 1 },
  { id: 'slide-2', orden: 2 },
  { id: 'slide-3', orden: 3 },
];

for (const sesion of sesiones) {
  sesion.token = await crearToken(sesion.usuario, sesion.id, secreto);
}

function capacitacion(id, orden, titulo = id) {
  return {
    id: `asignacion-${id}`,
    orden,
    capacitacion: {
      id,
      titulo,
      descripcion: `Descripción de ${titulo}`,
      slides,
    },
  };
}

function request(token, query = '') {
  return new NextRequest(`http://localhost:3000/api/colaborador/onboarding${query}`, {
    method: 'GET',
    headers: token ? { cookie: `${NOMBRE_COOKIE}=${token}` } : {},
  });
}

test.beforeEach(() => {
  process.env.AUTH_SECRET = secreto;
  prisma.sesion.findUnique = async ({ where }) => {
    const sesion = sesiones.find(item => item.id === where.id);
    return sesion
      ? { usuarioId: sesion.usuario.id, expiraEn: new Date(Date.now() + 60_000), usuario: sesion.usuario }
      : null;
  };
});

test('HU-011 CA-01/CA-02: ruta vacía muestra 0 %, lista vacía y sin continuación', () => {
  const panel = construirPanelMiOnboarding(null, []);

  assert.deepEqual(panel.ruta, null);
  assert.deepEqual(panel.capacitaciones, []);
  assert.equal(panel.porcentaje, 0);
  assert.equal(panel.completada, false);
  assert.equal(panel.continuar, null);
});

test('HU-011 CA-01/CA-02: ordena la ruta, refleja estados guardados y redondea progreso', () => {
  const ruta = {
    id: 'ruta-1',
    nombre: 'Inducción general',
    descripcion: null,
    capacitaciones: [capacitacion('cap-3', 3), capacitacion('cap-1', 1), capacitacion('cap-2', 2)],
  };
  const panel = construirPanelMiOnboarding(ruta, [
    { capacitacionId: 'cap-1', ultimoSlideOrden: 3, completada: true },
    { capacitacionId: 'cap-2', ultimoSlideOrden: 2, completada: false },
  ]);

  assert.deepEqual(panel.capacitaciones.map(item => item.id), ['cap-1', 'cap-2', 'cap-3']);
  assert.deepEqual(panel.capacitaciones.map(item => item.estado), ['COMPLETADA', 'EN_PROGRESO', 'PENDIENTE']);
  assert.equal(panel.porcentaje, 33);
  assert.equal(panel.completadas, 1);
  assert.equal(panel.total, 3);
  assert.deepEqual(panel.continuar, {
    capacitacionId: 'cap-2',
    titulo: 'cap-2',
    slide: 2,
    href: '/colaborador/capacitaciones/cap-2?slide=2',
  });
});

test('HU-011 CA-03/CA-05: sin progreso continúa en primer slide y ruta completa no ofrece continuación', () => {
  const rutaSinProgreso = {
    id: 'ruta-2',
    nombre: 'Ruta nueva',
    capacitaciones: [capacitacion('cap-inicial', 1)],
  };
  const inicial = construirPanelMiOnboarding(rutaSinProgreso, []);
  assert.equal(inicial.capacitaciones[0].estado, 'PENDIENTE');
  assert.equal(inicial.continuar.slide, 1);

  const completa = construirPanelMiOnboarding(rutaSinProgreso, [
    { capacitacionId: 'cap-inicial', ultimoSlideOrden: 3, completada: true },
  ]);
  assert.equal(completa.porcentaje, 100);
  assert.equal(completa.completada, true);
  assert.equal(completa.continuar, null);
});

test('HU-011 CA-04: no autenticado no obtiene datos de onboarding', async () => {
  const respuesta = await consultarMiOnboarding(request());
  assert.equal(respuesta.status, 401);
  assert.equal((await respuesta.json()).ok, false);
});

test('HU-011 CA-04: dos sesiones solo reciben la ruta y progreso de su propio colaborador', async () => {
  const consultas = [];
  prisma.colaborador.findUnique = async ({ where }) => {
    consultas.push(where);
    const usuario = usuarios.find(item => item.id === where.userId);
    if (usuario.id === usuarios[0].id) {
      return {
        rutaOnboarding: { id: 'ruta-ana', nombre: 'Ruta privada Ana', capacitaciones: [capacitacion('cap-ana', 1)] },
        progresos: [],
      };
    }
    return {
      rutaOnboarding: { id: 'ruta-luis', nombre: 'Ruta privada Luis', capacitaciones: [capacitacion('cap-luis', 1)] },
      progresos: [{ capacitacionId: 'cap-luis', ultimoSlideOrden: 2, completada: false }],
    };
  };

  const respuestaAna = await consultarMiOnboarding(request(sesiones[0].token, '?userId=507f1f77bcf86cd799439012'));
  const respuestaLuis = await consultarMiOnboarding(request(sesiones[1].token, '?userId=507f1f77bcf86cd799439011'));
  const panelAna = await respuestaAna.json();
  const panelLuis = await respuestaLuis.json();

  assert.equal(respuestaAna.status, 200);
  assert.equal(respuestaLuis.status, 200);
  assert.equal(panelAna.ruta.nombre, 'Ruta privada Ana');
  assert.equal(panelAna.capacitaciones[0].id, 'cap-ana');
  assert.equal(panelLuis.ruta.nombre, 'Ruta privada Luis');
  assert.equal(panelLuis.capacitaciones[0].id, 'cap-luis');
  assert.deepEqual(consultas, [{ userId: usuarios[0].id }, { userId: usuarios[1].id }]);
});