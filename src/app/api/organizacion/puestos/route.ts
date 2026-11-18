import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exigirAdministrador } from '@/lib/permisos';
import {
  MENSAJE_DUPLICADO,
  esErrorUnicidadPrisma,
  esObjectIdOrganizacionValido,
  existeNombreDuplicado,
  validarPuesto,
} from '@/lib/organizacion';

export const dynamic = 'force-dynamic';

/**
 * GET /api/organizacion/puestos
 * Lista los puestos de trabajo registrados (opcionalmente filtrados por `areaId`).
 */
export async function GET(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const areaId = request.nextUrl.searchParams.get('areaId')?.trim();
    if (areaId && !esObjectIdOrganizacionValido(areaId)) {
      return NextResponse.json(
        { ok: false, error: 'El identificador del área no es válido.' },
        { status: 400 }
      );
    }

    const puestos = await prisma.puestoTrabajo.findMany({
      where: areaId ? { areaId } : {},
      orderBy: { nombre: 'asc' },
      include: { area: { select: { id: true, nombre: true, activa: true } } },
    });

    return NextResponse.json(
      { ok: true, total: puestos.length, datos: puestos },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: 'No pudimos obtener los puestos de trabajo.' },
      { status: 503 }
    );
  }
}

/**
 * POST /api/organizacion/puestos
 * Crea un nuevo puesto de trabajo vinculado a un área existente y activa.
 */
export async function POST(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const cuerpo = await request.json().catch(() => null);
    if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) {
      return NextResponse.json(
        { ok: false, error: 'El cuerpo de la solicitud debe ser un objeto JSON válido.' },
        { status: 400 }
      );
    }

    const validacion = validarPuesto(cuerpo as { nombre?: unknown; areaId?: unknown });
    if (!validacion.valido || !validacion.datos) {
      return NextResponse.json(
        { ok: false, error: 'Datos inválidos.', detalles: validacion.errores },
        { status: 400 }
      );
    }

    const { nombre, nombreClave, areaId } = validacion.datos;
    if (!esObjectIdOrganizacionValido(areaId)) {
      return NextResponse.json(
        { ok: false, error: 'El identificador del área no es válido.', detalles: { areaId: 'Selecciona un área válida' } },
        { status: 400 }
      );
    }

    const area = await prisma.area.findUnique({ where: { id: areaId } });
    if (!area) {
      return NextResponse.json(
        { ok: false, error: 'El área seleccionada no existe.' },
        { status: 404 }
      );
    }

    if (!area.activa) {
      return NextResponse.json(
        { ok: false, error: 'No puedes agregar puestos a un área desactivada.' },
        { status: 409 }
      );
    }

    const puestosDelArea = await prisma.puestoTrabajo.findMany({
      where: { areaId },
      select: { id: true, nombre: true, areaId: true },
    });

    if (existeNombreDuplicado(puestosDelArea, nombre, areaId)) {
      return NextResponse.json(
        { ok: false, error: MENSAJE_DUPLICADO, detalles: { nombre: MENSAJE_DUPLICADO } },
        { status: 409 }
      );
    }

    const creado = await prisma.puestoTrabajo.create({
      data: {
        nombre,
        nombreClave,
        areaId,
      },
    });

    return NextResponse.json(
      { ok: true, mensaje: 'Puesto de trabajo creado correctamente.', datos: creado },
      { status: 201 }
    );
  } catch (error) {
    if (esErrorUnicidadPrisma(error)) {
      return NextResponse.json(
        { ok: false, error: MENSAJE_DUPLICADO, detalles: { nombre: MENSAJE_DUPLICADO } },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { ok: false, error: 'No pudimos crear el puesto de trabajo.' },
      { status: 503 }
    );
  }
}
