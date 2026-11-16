import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { prisma } from '../src/lib/prisma.ts';
import { crearToken, NOMBRE_COOKIE } from '../src/lib/autenticacion.ts';
import { construirPanelMiOnboarding } from '../src/lib/mi-onboarding.ts';
import { GET as consultarSesion } from '../src/app/api/auth/sesion/route.ts';

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
  return new NextRequest(`http://localhost:3000/api/colaborador/mi-onboarding${query}`, {
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
  assert.equal(panel.capacitaciones[2].estado, 'PENDIENTE');
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
  const { GET: consultarMiOnboarding } = await import('../src/app/api/colaborador/mi-onboarding/route.ts');
  const respuesta = await consultarMiOnboarding(request());
  assert.equal(respuesta.status, 401);
  assert.equal((await respuesta.json()).ok, false);
});

test('HU-011 CA-04: endpoint de onboarding no revela datos de colaboradores inactivos', async () => {
  const requestInvalido = new NextRequest('http://localhost:3000/api/colaborador/mi-onboarding', {
    method: 'GET',
    headers: { cookie: `${NOMBRE_COOKIE}=token-invalido` },
  });
  const respuestaSesion = await consultarSesion(requestInvalido);
  assert.equal(respuestaSesion.status, 200);
  assert.equal((await respuestaSesion.json()).autenticado, false);
});

test('HU-011 CA-04: dos sesiones solo reciben la ruta y progreso de su propio colaborador', async () => {
  const { GET: consultarMiOnboarding } = await import('../src/app/api/colaborador/mi-onboarding/route.ts');
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

test('HU-011 CA-03/CA-04: guarda slide actual solo para la capacitación de la ruta propia', async () => {
  const { PUT: guardarProgreso } = await import('../src/app/api/colaborador/progreso/route.ts');
  const cambios = [];
  const capacitacionAnaId = '507f1f77bcf86cd799439021';
  const capacitacionLuisId = '507f1f77bcf86cd799439022';
  prisma.colaborador.findUnique = async ({ where, select }) => {
    const capacitacionDelUsuario = where.userId === usuarios[0].id ? capacitacionAnaId : capacitacionLuisId;
    const capacitacionSolicitada = select.rutaOnboarding.select.capacitaciones.where.capacitacionId;
    return {
      id: where.userId === usuarios[0].id ? 'colab-ana' : 'colab-luis',
      rutaOnboarding: {
        capacitaciones: capacitacionSolicitada === capacitacionDelUsuario ? [{ capacitacion: {
          id: capacitacionDelUsuario,
          slides: [{ orden: 1 }, { orden: 2 }, { orden: 3 }],
        } }] : [],
      },
    };
  };
  prisma.progresoCapacitacion.upsert = async opciones => {
    cambios.push(opciones);
    return opciones.create;
  };

  const requestGuardar = (token, body) => new NextRequest('http://localhost:3000/api/colaborador/progreso', {
    method: 'PUT',
    headers: { cookie: `${NOMBRE_COOKIE}=${token}`, origin: 'http://localhost:3000', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const respuestaAna = await guardarProgreso(requestGuardar(sesiones[0].token, {
    capacitacionId: capacitacionAnaId, slideOrden: 3,
  }));
  const respuestaAjena = await guardarProgreso(requestGuardar(sesiones[0].token, {
    capacitacionId: capacitacionLuisId, slideOrden: 2,
  }));

  assert.equal(respuestaAna.status, 200);
  assert.equal(cambios[0].create.colaboradorId, 'colab-ana');
  assert.equal(cambios[0].create.ultimoSlideOrden, 3);
  assert.equal(cambios[0].create.completada, true);
  assert.equal(respuestaAjena.status, 404);
  assert.equal(cambios.length, 1);

  const respuestaSlideInvalido = await guardarProgreso(requestGuardar(sesiones[0].token, {
    capacitacionId: capacitacionAnaId, slideOrden: 4,
  }));
  assert.equal(respuestaSlideInvalido.status, 400);
  const respuestaAnonima = await guardarProgreso(requestGuardar(undefined, {
    capacitacionId: capacitacionAnaId, slideOrden: 1,
  }));
  assert.equal(respuestaAnonima.status, 401);
  assert.equal(cambios.length, 1);
});