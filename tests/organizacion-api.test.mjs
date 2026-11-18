import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { prisma } from '../src/lib/prisma.ts';
import { crearToken } from '../src/lib/autenticacion.ts';
import { MENSAJE_DUPLICADO } from '../src/lib/organizacion.ts';
import { GET as listarAreas, POST as crearArea } from '../src/app/api/organizacion/areas/route.ts';
import {
  PATCH as actualizarArea,
  DELETE as eliminarArea,
} from '../src/app/api/organizacion/areas/[id]/route.ts';
import { GET as listarPuestos, POST as crearPuesto } from '../src/app/api/organizacion/puestos/route.ts';

process.env.AUTH_SECRET = 'clave-exclusiva-de-pruebas-de-organizacion-2026';
process.env.APP_URL = 'http://localhost:3000';

const areaId = '507f1f77bcf86cd799439021';
const otraAreaId = '507f1f77bcf86cd799439022';
const puestoId = '507f1f77bcf86cd799439031';
const usuario = {
  id: '507f1f77bcf86cd799439012',
  email: 'admin@example.com',
  name: 'Admin CGB',
  role: 'ADMINISTRADOR',
  activo: true,
  passwordHash: null,
};
const token = await crearToken(usuario, 'sesion-prueba-hu007', process.env.AUTH_SECRET);
const tokenColaborador = await crearToken({ ...usuario, role: 'COLABORADOR' }, 'sesion-prueba-hu007-colaborador', process.env.AUTH_SECRET);

let rol;
let areasDb;
let puestosDb;
let escrituras;

test.beforeEach(() => {
  rol = 'ADMINISTRADOR';
  escrituras = 0;
  areasDb = [
    {
      id: areaId,
      nombre: 'Ingeniería de Software',
      nombreClave: 'ingenieria de software',
      activa: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  puestosDb = [
    {
      id: puestoId,
      nombre: 'Desarrollador Junior',
      nombreClave: 'desarrollador junior',
      areaId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  prisma.sesion.findUnique = async ({ where }) => ({
    usuarioId: usuario.id,
    expiraEn: new Date(Date.now() + 60000),
    usuario: {
      ...usuario,
      role: where.id === 'sesion-prueba-hu007-colaborador' ? 'COLABORADOR' : rol,
    },
  });

  prisma.area.findMany = async ({ where } = {}) => {
    let resultado = areasDb;
    if (where?.activa !== undefined) {
      resultado = resultado.filter((a) => a.activa === where.activa);
    }
    if (where?.id?.not) {
      resultado = resultado.filter((a) => a.id !== where.id.not);
    }
    return resultado.map((a) => structuredClone(a));
  };

  prisma.area.findUnique = async ({ where, include } = {}) => {
    const encontrada = areasDb.find((a) => a.id === where?.id);
    if (!encontrada) return null;
    const copia = structuredClone(encontrada);
    if (include?._count?.select?.puestos) {
      copia._count = { puestos: puestosDb.filter((p) => p.areaId === encontrada.id).length };
    }
    return copia;
  };

  prisma.area.create = async ({ data }) => {
    escrituras += 1;
    if (areasDb.some((a) => a.nombreClave === data.nombreClave)) {
      const err = new Error('Unique constraint failed');
      err.code = 'P2002';
      throw err;
    }
    const nueva = {
      id: '507f1f77bcf86cd799439099',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    areasDb.push(nueva);
    return structuredClone(nueva);
  };

  prisma.area.update = async ({ where, data }) => {
    escrituras += 1;
    const indice = areasDb.findIndex((a) => a.id === where.id);
    areasDb[indice] = { ...areasDb[indice], ...data, updatedAt: new Date() };
    return structuredClone(areasDb[indice]);
  };

  prisma.area.delete = async ({ where }) => {
    escrituras += 1;
    areasDb = areasDb.filter((a) => a.id !== where.id);
    return { id: where.id };
  };

  prisma.puestoTrabajo.findMany = async ({ where, include } = {}) => {
    let resultado = puestosDb;
    if (where?.areaId) {
      resultado = resultado.filter((p) => p.areaId === where.areaId);
    }
    return resultado.map((p) => {
      const copia = structuredClone(p);
      if (include?.area) {
        const area = areasDb.find((a) => a.id === p.areaId);
        copia.area = area ? { id: area.id, nombre: area.nombre, activa: area.activa } : null;
      }
      return copia;
    });
  };

  prisma.puestoTrabajo.create = async ({ data }) => {
    escrituras += 1;
    if (puestosDb.some((p) => p.areaId === data.areaId && p.nombreClave === data.nombreClave)) {
      const err = new Error('Unique constraint failed');
      err.code = 'P2002';
      throw err;
    }
    const nuevo = {
      id: '507f1f77bcf86cd799439088',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    puestosDb.push(nuevo);
    return structuredClone(nuevo);
  };
});

function solicitud(ruta, method, datos, autenticar = true, origen = 'http://localhost:3000') {
  return new NextRequest('http://localhost:3000' + ruta, {
    method,
    headers: {
      origin: origen,
      'Content-Type': 'application/json',
      ...(autenticar ? { cookie: `cgb_sesion=${rol === 'COLABORADOR' ? tokenColaborador : token}` } : {}),
    },
    ...(datos === undefined ? {} : { body: JSON.stringify(datos) }),
  });
}

test('HU-007 (CGB-31) API: áreas, puestos, unicidad, integridad y control de acceso', async (t) => {
  await t.test('Seguridad: rechaza anónimo (401), colaborador (403) y origen ajeno (403) sin escribir', async () => {
    assert.equal((await listarAreas(solicitud('/api/organizacion/areas', 'GET', undefined, false))).status, 401);
    assert.equal((await crearArea(solicitud('/api/organizacion/areas', 'POST', { nombre: 'Finanzas' }, false))).status, 401);

    rol = 'COLABORADOR';
    assert.equal((await listarAreas(solicitud('/api/organizacion/areas', 'GET'))).status, 403);
    assert.equal((await crearPuesto(solicitud('/api/organizacion/puestos', 'POST', { nombre: 'QA', areaId }))).status, 403);

    rol = 'ADMINISTRADOR';
    assert.equal(
      (await crearArea(solicitud('/api/organizacion/areas', 'POST', { nombre: 'Finanzas' }, true, 'https://externo.example'))).status,
      403
    );
    assert.equal(escrituras, 0);
  });

  await t.test('CA-01: POST /api/organizacion/areas crea área activa con nombreClave normalizado', async () => {
    const respuesta = await crearArea(solicitud('/api/organizacion/areas', 'POST', { nombre: '  Recursos   Humanos ' }));
    assert.equal(respuesta.status, 201);
    const json = await respuesta.json();
    assert.equal(json.ok, true);
    assert.equal(json.datos.nombre, 'Recursos Humanos');
    assert.equal(json.datos.nombreClave, 'recursos humanos');
    assert.equal(json.datos.activa, true);
  });

  await t.test('CA-03: POST /api/organizacion/areas rechaza duplicados sin tildes ni mayúsculas y ante P2002 concurrente', async () => {
    const duplicada = await crearArea(
      solicitud('/api/organizacion/areas', 'POST', { nombre: 'ingenieria de software' })
    );
    assert.equal(duplicada.status, 409);
    assert.equal((await duplicada.json()).error, MENSAJE_DUPLICADO);

    // Simula condición de carrera donde findMany aún no ve el registro pero MongoDB dispara P2002 sobre nombreClave.
    prisma.area.findMany = async () => [];
    const carrera = await crearArea(
      solicitud('/api/organizacion/areas', 'POST', { nombre: 'INGENIERÍA DE SOFTWARE' })
    );
    assert.equal(carrera.status, 409);
    assert.equal((await carrera.json()).error, MENSAJE_DUPLICADO);
  });

  await t.test('CA-02 y CA-03: POST /api/organizacion/puestos vincula al área y bloquea duplicados en la misma área', async () => {
    const creado = await crearPuesto(
      solicitud('/api/organizacion/puestos', 'POST', { nombre: 'Analista de QA', areaId })
    );
    assert.equal(creado.status, 201);
    const json = await creado.json();
    assert.equal(json.datos.areaId, areaId);
    assert.equal(json.datos.nombreClave, 'analista de qa');

    const duplicado = await crearPuesto(
      solicitud('/api/organizacion/puestos', 'POST', { nombre: '  desarrollador junior ', areaId })
    );
    assert.equal(duplicado.status, 409);
    assert.equal((await duplicado.json()).error, MENSAJE_DUPLICADO);

    // Mismo puesto en otra área sí está permitido.
    areasDb.push({
      id: otraAreaId,
      nombre: 'Calidad',
      nombreClave: 'calidad',
      activa: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const otra = await crearPuesto(
      solicitud('/api/organizacion/puestos', 'POST', { nombre: 'Desarrollador Junior', areaId: otraAreaId })
    );
    assert.equal(otra.status, 201);
  });

  await t.test('CA-02: rechaza puesto en área inexistente (404) o inactiva (409)', async () => {
    const noExiste = await crearPuesto(
      solicitud('/api/organizacion/puestos', 'POST', { nombre: 'Soporte', areaId: '507f1f77bcf86cd799439090' })
    );
    assert.equal(noExiste.status, 404);

    areasDb[0].activa = false;
    const inactiva = await crearPuesto(
      solicitud('/api/organizacion/puestos', 'POST', { nombre: 'Soporte', areaId })
    );
    assert.equal(inactiva.status, 409);
  });

  await t.test('CA-04: GET /api/organizacion/areas y /puestos devuelven jerarquía y conteos', async () => {
    const respAreas = await listarAreas(solicitud('/api/organizacion/areas', 'GET'));
    assert.equal(respAreas.status, 200);
    const jsonAreas = await respAreas.json();
    assert.equal(jsonAreas.total, 1);
    assert.equal(jsonAreas.datos[0].puestos.length, 1);
    assert.equal(jsonAreas.datos[0].puestos[0].colaboradores, 0);
    assert.equal(jsonAreas.datos[0].totalColaboradores, 0);

    const respPuestos = await listarPuestos(solicitud(`/api/organizacion/puestos?areaId=${areaId}`, 'GET'));
    assert.equal(respPuestos.status, 200);
    assert.equal((await respPuestos.json()).total, 1);
  });

  await t.test('Integridad referencial: PATCH desactiva sin cascada y DELETE bloquea si tiene puestos', async () => {
    const contexto = { params: Promise.resolve({ id: areaId }) };

    const rechazoDelete = await eliminarArea(solicitud(`/api/organizacion/areas/${areaId}`, 'DELETE'), contexto);
    assert.equal(rechazoDelete.status, 409);
    assert.equal(puestosDb.length, 1);

    const desactivada = await actualizarArea(
      solicitud(`/api/organizacion/areas/${areaId}`, 'PATCH', { activa: false }),
      contexto
    );
    assert.equal(desactivada.status, 200);
    assert.equal(areasDb[0].activa, false);
    assert.equal(puestosDb.length, 1);

    const soloActivas = await listarAreas(solicitud('/api/organizacion/areas?soloActivas=true', 'GET'));
    assert.equal((await soloActivas.json()).total, 0);
  });

  await t.test('Fallo del repositorio devuelve 503 genérico sin filtrar detalles internos', async () => {
    prisma.area.findMany = async () => {
      throw new Error('conexion atlas secreta');
    };
    const resp = await listarAreas(solicitud('/api/organizacion/areas', 'GET'));
    assert.equal(resp.status, 503);
    assert.ok(!JSON.stringify(await resp.json()).includes('atlas secreta'));
  });
});
