import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { prisma } from '../src/lib/prisma.ts';
import {
  NOMBRE_COOKIE,
  crearToken,
  obtenerSecretoAuth,
} from '../src/lib/autenticacion.ts';
import {
  GET as getMicrotests,
  POST as postMicrotests,
} from '../src/app/api/microtests/route.ts';
import {
  GET as getMicrotestPorId,
  PUT as putMicrotestPorId,
  DELETE as deleteMicrotestPorId,
} from '../src/app/api/microtests/[id]/route.ts';

process.env.AUTH_SECRET =
  process.env.AUTH_SECRET || 'clave-pruebas-hu013-segura-32-caracteres';

const ID_ADMIN = '671000000000000000000001';
const ID_COLAB = '671000000000000000000002';
const ID_SESION_ADMIN = 'sesion-admin-hu013';
const ID_SESION_COLAB = 'sesion-colab-hu013';
const ID_CAP_BORRADOR = '671000000000000000000010';
const ID_CAP_INEXISTENTE = '671000000000000000000099';

function crearBaseEnMemoria() {
  const usuarios = new Map([
    [
      ID_ADMIN,
      {
        id: ID_ADMIN,
        email: 'admin@cgb.pe',
        name: 'Admin CGB',
        role: 'ADMINISTRADOR',
        activo: true,
      },
    ],
    [
      ID_COLAB,
      {
        id: ID_COLAB,
        email: 'colab@cgb.pe',
        name: 'Colaborador CGB',
        role: 'COLABORADOR',
        activo: true,
      },
    ],
  ]);

  const sesiones = new Map([
    [
      ID_SESION_ADMIN,
      {
        id: ID_SESION_ADMIN,
        usuarioId: ID_ADMIN,
        expiraEn: new Date(Date.now() + 3600_000),
      },
    ],
    [
      ID_SESION_COLAB,
      {
        id: ID_SESION_COLAB,
        usuarioId: ID_COLAB,
        expiraEn: new Date(Date.now() + 3600_000),
      },
    ],
  ]);

  const capacitaciones = new Map([
    [
      ID_CAP_BORRADOR,
      {
        id: ID_CAP_BORRADOR,
        titulo: 'Bioseguridad en Laboratorios',
        unidad: 'BIOMEDIC',
        ambito: 'INTERNO',
        estado: 'BORRADOR',
        createdAt: new Date(),
      },
    ],
  ]);

  const evaluaciones = new Map();
  const intentosPorEvaluacion = new Map();
  let secuencia = 1;
  let forzarP2002 = false;
  let forzarFallo = false;

  prisma.sesion = {
    findUnique: async ({ where }) => {
      const sesion = sesiones.get(where.id);
      if (!sesion) return null;
      return { ...sesion, usuario: usuarios.get(sesion.usuarioId) ?? null };
    },
  };

  prisma.capacitacion = {
    findUnique: async ({ where }) => capacitaciones.get(where.id) ?? null,
    findMany: async () => [...capacitaciones.values()],
  };

  prisma.evaluacion = {
    findMany: async ({ where } = {}) => {
      if (forzarFallo) throw new Error('Error interno Mongo');
      return [...evaluaciones.values()]
        .filter((ev) => (!where?.capacitacionId ? true : ev.capacitacionId === where.capacitacionId))
        .map((ev) => ({
          ...ev,
          capacitacion: capacitaciones.get(ev.capacitacionId) ?? null,
          _count: { intentos: intentosPorEvaluacion.get(ev.id) ?? 0 },
        }));
    },
    findUnique: async ({ where }) => {
      if (forzarFallo) throw new Error('Error interno Mongo');
      let ev = null;
      if (where.id) {
        ev = evaluaciones.get(where.id) ?? null;
      } else if (where.capacitacionId) {
        ev =
          [...evaluaciones.values()].find(
            (item) => item.capacitacionId === where.capacitacionId
          ) ?? null;
      }
      if (!ev) return null;
      return {
        ...ev,
        capacitacion: capacitaciones.get(ev.capacitacionId) ?? null,
        _count: { intentos: intentosPorEvaluacion.get(ev.id) ?? 0 },
      };
    },
    create: async ({ data }) => {
      if (forzarFallo) throw new Error('Error interno Mongo');
      if (forzarP2002) {
        const err = new Error('Unique constraint failed');
        err.code = 'P2002';
        throw err;
      }
      const id = `67100000000000000000020${secuencia++}`;
      const registro = {
        id,
        capacitacionId: data.capacitacionId,
        titulo: data.titulo ?? 'Microtest',
        notaMinima: data.notaMinima ?? 70,
        maxIntentos: data.maxIntentos ?? 3,
        tiempoLimiteSeg: data.tiempoLimiteSeg ?? null,
        preguntas: data.preguntas,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      evaluaciones.set(id, registro);
      return {
        ...registro,
        capacitacion: capacitaciones.get(registro.capacitacionId) ?? null,
        _count: { intentos: 0 },
      };
    },
    update: async ({ where, data }) => {
      if (forzarFallo) throw new Error('Error interno Mongo');
      const actual = evaluaciones.get(where.id);
      if (!actual) throw new Error('Not found');
      const actualizado = {
        ...actual,
        ...data,
        updatedAt: new Date(),
      };
      evaluaciones.set(where.id, actualizado);
      return {
        ...actualizado,
        capacitacion: capacitaciones.get(actualizado.capacitacionId) ?? null,
        _count: { intentos: intentosPorEvaluacion.get(where.id) ?? 0 },
      };
    },
    delete: async ({ where }) => {
      if (forzarFallo) throw new Error('Error interno Mongo');
      const actual = evaluaciones.get(where.id);
      evaluaciones.delete(where.id);
      return actual;
    },
  };

  return {
    evaluaciones,
    setIntentos: (evaluacionId, cantidad) =>
      intentosPorEvaluacion.set(evaluacionId, cantidad),
    activarP2002: () => {
      forzarP2002 = true;
    },
    activarFallo: () => {
      forzarFallo = true;
    },
  };
}

async function tokenAdmin() {
  return crearToken(
    { id: ID_ADMIN, role: 'ADMINISTRADOR' },
    ID_SESION_ADMIN,
    obtenerSecretoAuth()
  );
}

async function tokenColaborador() {
  return crearToken(
    { id: ID_COLAB, role: 'COLABORADOR' },
    ID_SESION_COLAB,
    obtenerSecretoAuth()
  );
}

function construirSolicitud(
  url,
  { metodo = 'GET', token, cuerpo, origen = 'http://localhost:3000' } = {}
) {
  const headers = new Headers();
  if (origen) headers.set('origin', origen);
  if (token) headers.set('cookie', `${NOMBRE_COOKIE}=${token}`);
  let body;
  if (cuerpo !== undefined) {
    headers.set('content-type', 'application/json');
    body = typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo);
  }
  return new NextRequest(url, { method: metodo, headers, body });
}

const PAYLOAD_VALIDO = {
  capacitacionId: ID_CAP_BORRADOR,
  titulo: 'Microtest de Bioseguridad',
  notaMinima: 80,
  maxIntentos: 3,
  tiempoLimiteSeg: 300,
  preguntas: [
    {
      enunciado: '¿Qué equipo es obligatorio al manipular reactivos?',
      opciones: ['Guantes de nitrilo y gafas', 'Ropa casual', 'Ninguno'],
      correcta: 0,
      retroalimentacion: 'El EPP protege ante salpicaduras químicas.',
    },
    {
      enunciado: '¿Dónde se desechan los objetos punzocortantes?',
      opciones: ['Tacho común', 'Contenedor rígido rojo', 'Lavabo'],
      correcta: 1,
      retroalimentacion: 'Los contenedores rígidos previenen accidentes laborales.',
    },
  ],
};

describe('HU-013 (CGB-61) API: CRUD de microtests formativos, validaciones y seguridad', () => {
  let db;

  beforeEach(() => {
    db = crearBaseEnMemoria();
  });

  it('Seguridad: rechaza anónimo (401), colaborador (403) y origen externo (403) sin escribir', async () => {
    const resAnon = await postMicrotests(
      construirSolicitud('http://localhost:3000/api/microtests', {
        metodo: 'POST',
        cuerpo: PAYLOAD_VALIDO,
      })
    );
    assert.equal(resAnon.status, 401);

    const tokColab = await tokenColaborador();
    const resColab = await postMicrotests(
      construirSolicitud('http://localhost:3000/api/microtests', {
        metodo: 'POST',
        token: tokColab,
        cuerpo: PAYLOAD_VALIDO,
      })
    );
    assert.equal(resColab.status, 403);

    const tokAdmin = await tokenAdmin();
    const resCrossOrigin = await postMicrotests(
      construirSolicitud('http://localhost:3000/api/microtests', {
        metodo: 'POST',
        token: tokAdmin,
        origen: 'https://sitio-externo.malicioso',
        cuerpo: PAYLOAD_VALIDO,
      })
    );
    assert.equal(resCrossOrigin.status, 403);
    assert.equal(db.evaluaciones.size, 0);
  });

  it('CA-01, CA-02 y CA-03: POST /api/microtests guarda preguntas, nota mínima, intentos y vincula a la capacitación en Borrador', async () => {
    const tokAdmin = await tokenAdmin();
    const res = await postMicrotests(
      construirSolicitud('http://localhost:3000/api/microtests', {
        metodo: 'POST',
        token: tokAdmin,
        cuerpo: PAYLOAD_VALIDO,
      })
    );
    assert.equal(res.status, 201);
    const json = await res.json();
    assert.equal(json.ok, true);
    assert.equal(json.datos.capacitacionId, ID_CAP_BORRADOR);
    assert.equal(json.datos.notaMinima, 80);
    assert.equal(json.datos.maxIntentos, 3);
    assert.equal(json.datos.totalPreguntas, 2);
    assert.equal(json.datos.pesoPorPregunta, 50);
    assert.equal(json.datos.editable, true);

    const resLista = await getMicrotests(
      construirSolicitud(
        `http://localhost:3000/api/microtests?capacitacionId=${ID_CAP_BORRADOR}`,
        { token: tokAdmin }
      )
    );
    assert.equal(resLista.status, 200);
    const jsonLista = await resLista.json();
    assert.equal(jsonLista.total, 1);
  });

  it('CA-03: impide crear un segundo microtest para la misma capacitación (409) o para capacitación inexistente (404)', async () => {
    const tokAdmin = await tokenAdmin();

    const resNoExiste = await postMicrotests(
      construirSolicitud('http://localhost:3000/api/microtests', {
        metodo: 'POST',
        token: tokAdmin,
        cuerpo: { ...PAYLOAD_VALIDO, capacitacionId: ID_CAP_INEXISTENTE },
      })
    );
    assert.equal(resNoExiste.status, 404);

    await postMicrotests(
      construirSolicitud('http://localhost:3000/api/microtests', {
        metodo: 'POST',
        token: tokAdmin,
        cuerpo: PAYLOAD_VALIDO,
      })
    );

    const resDuplicado = await postMicrotests(
      construirSolicitud('http://localhost:3000/api/microtests', {
        metodo: 'POST',
        token: tokAdmin,
        cuerpo: PAYLOAD_VALIDO,
      })
    );
    assert.equal(resDuplicado.status, 409);

    db.evaluaciones.clear();
    db.activarP2002();
    const resConcurrente = await postMicrotests(
      construirSolicitud('http://localhost:3000/api/microtests', {
        metodo: 'POST',
        token: tokAdmin,
        cuerpo: PAYLOAD_VALIDO,
      })
    );
    assert.equal(resConcurrente.status, 409);
  });

  it('CA-04: PUT y DELETE permiten editar y eliminar mientras no existan intentos de alumnos, y bloquean con 409 si ya fue respondido', async () => {
    const tokAdmin = await tokenAdmin();
    const resCrear = await postMicrotests(
      construirSolicitud('http://localhost:3000/api/microtests', {
        metodo: 'POST',
        token: tokAdmin,
        cuerpo: PAYLOAD_VALIDO,
      })
    );
    const { datos: creado } = await resCrear.json();

    // GET individual
    const resDetalle = await getMicrotestPorId(
      construirSolicitud(`http://localhost:3000/api/microtests/${creado.id}`, {
        token: tokAdmin,
      }),
      { params: Promise.resolve({ id: creado.id }) }
    );
    assert.equal(resDetalle.status, 200);

    // PUT sin intentos -> 200
    const resEditar = await putMicrotestPorId(
      construirSolicitud(`http://localhost:3000/api/microtests/${creado.id}`, {
        metodo: 'PUT',
        token: tokAdmin,
        cuerpo: {
          ...PAYLOAD_VALIDO,
          notaMinima: 90,
          maxIntentos: 2,
        },
      }),
      { params: Promise.resolve({ id: creado.id }) }
    );
    assert.equal(resEditar.status, 200);
    const jsonEditado = await resEditar.json();
    assert.equal(jsonEditado.datos.notaMinima, 90);
    assert.equal(jsonEditado.datos.maxIntentos, 2);

    // Simular intentos registrados por colaboradores -> PUT y DELETE devuelven 409
    db.setIntentos(creado.id, 1);

    const resEditarBloqueado = await putMicrotestPorId(
      construirSolicitud(`http://localhost:3000/api/microtests/${creado.id}`, {
        metodo: 'PUT',
        token: tokAdmin,
        cuerpo: PAYLOAD_VALIDO,
      }),
      { params: Promise.resolve({ id: creado.id }) }
    );
    assert.equal(resEditarBloqueado.status, 409);

    const resBorrarBloqueado = await deleteMicrotestPorId(
      construirSolicitud(`http://localhost:3000/api/microtests/${creado.id}`, {
        metodo: 'DELETE',
        token: tokAdmin,
      }),
      { params: Promise.resolve({ id: creado.id }) }
    );
    assert.equal(resBorrarBloqueado.status, 409);

    // Sin intentos -> DELETE devuelve 200
    db.setIntentos(creado.id, 0);
    const resBorrarOk = await deleteMicrotestPorId(
      construirSolicitud(`http://localhost:3000/api/microtests/${creado.id}`, {
        metodo: 'DELETE',
        token: tokAdmin,
      }),
      { params: Promise.resolve({ id: creado.id }) }
    );
    assert.equal(resBorrarOk.status, 200);
    assert.equal(db.evaluaciones.size, 0);
  });

  it('Fallo del repositorio devuelve 503 genérico sin exponer detalles internos', async () => {
    const tokAdmin = await tokenAdmin();
    db.activarFallo();
    const res = await getMicrotests(
      construirSolicitud('http://localhost:3000/api/microtests', {
        token: tokAdmin,
      })
    );
    assert.equal(res.status, 503);
    const json = await res.json();
    assert.equal(json.ok, false);
    assert.ok(!json.error.includes('Mongo'));
  });
});
