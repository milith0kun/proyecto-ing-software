import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exigirAdministrador } from '@/lib/permisos';
import {
  MENSAJE_DUPLICADO,
  esErrorUnicidadPrisma,
  existeNombreDuplicado,
  validarArea,
} from '@/lib/organizacion';
import { obtenerEstructuraOrganizacional } from '@/lib/organizacion-prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/organizacion/areas
 * Lista las áreas organizacionales con sus puestos de trabajo y conteo de colaboradores.
 */
export async function GET(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const soloActivas = request.nextUrl.searchParams.get('soloActivas') === 'true';
    const datos = await obtenerEstructuraOrganizacional({ soloActivas });

    return NextResponse.json(
      { ok: true, total: datos.length, datos },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: 'No pudimos obtener las áreas organizacionales.' },
      { status: 503 }
    );
  }
}

/**
 * POST /api/organizacion/areas
 * Crea una nueva área organizacional verificando unicidad insensible a tildes y mayúsculas.
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

    const validacion = validarArea(cuerpo as { nombre?: unknown });
    if (!validacion.valido || !validacion.datos) {
      return NextResponse.json(
        { ok: false, error: 'Datos inválidos.', detalles: validacion.errores },
        { status: 400 }
      );
    }

    const existentes = await prisma.area.findMany({
      select: { id: true, nombre: true },
    });

    if (existeNombreDuplicado(existentes, validacion.datos.nombre)) {
      return NextResponse.json(
        { ok: false, error: MENSAJE_DUPLICADO, detalles: { nombre: MENSAJE_DUPLICADO } },
        { status: 409 }
      );
    }

    const creada = await prisma.area.create({
      data: {
        nombre: validacion.datos.nombre,
        nombreClave: validacion.datos.nombreClave,
        activa: true,
      },
    });

    return NextResponse.json(
      { ok: true, mensaje: 'Área organizacional creada correctamente.', datos: creada },
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
      { ok: false, error: 'No pudimos crear el área organizacional.' },
      { status: 503 }
    );
  }
}
