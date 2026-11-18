import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exigirAdministrador } from '@/lib/permisos';
import {
  MENSAJE_DUPLICADO,
  esErrorUnicidadPrisma,
  esObjectIdOrganizacionValido,
  existeNombreDuplicado,
  validarArea,
} from '@/lib/organizacion';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/organizacion/areas/[id]
 * Permite renombrar un área o cambiar su estado (activa: true/false) sin borrar en cascada.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const { id } = await params;
    if (!esObjectIdOrganizacionValido(id)) {
      return NextResponse.json(
        { ok: false, error: 'El identificador del área no es válido.' },
        { status: 400 }
      );
    }

    const cuerpo = await request.json().catch(() => null);
    if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) {
      return NextResponse.json(
        { ok: false, error: 'El cuerpo de la solicitud debe ser un objeto JSON válido.' },
        { status: 400 }
      );
    }

    const existente = await prisma.area.findUnique({ where: { id } });
    if (!existente) {
      return NextResponse.json(
        { ok: false, error: 'Área organizacional no encontrada.' },
        { status: 404 }
      );
    }

    const payload = cuerpo as { nombre?: unknown; activa?: unknown };
    const cambios: { nombre?: string; nombreClave?: string; activa?: boolean } = {};

    if (payload.nombre !== undefined) {
      const validacion = validarArea({ nombre: payload.nombre });
      if (!validacion.valido || !validacion.datos) {
        return NextResponse.json(
          { ok: false, error: 'Datos inválidos.', detalles: validacion.errores },
          { status: 400 }
        );
      }
      const otras = await prisma.area.findMany({
        where: { id: { not: id } },
        select: { id: true, nombre: true },
      });
      if (existeNombreDuplicado(otras, validacion.datos.nombre)) {
        return NextResponse.json(
          { ok: false, error: MENSAJE_DUPLICADO, detalles: { nombre: MENSAJE_DUPLICADO } },
          { status: 409 }
        );
      }
      cambios.nombre = validacion.datos.nombre;
      cambios.nombreClave = validacion.datos.nombreClave;
    }

    if (payload.activa !== undefined) {
      if (typeof payload.activa !== 'boolean') {
        return NextResponse.json(
          { ok: false, error: 'El estado del área debe ser booleano.' },
          { status: 400 }
        );
      }
      cambios.activa = payload.activa;
    }

    if (Object.keys(cambios).length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Indica al menos un cambio válido para actualizar el área.' },
        { status: 400 }
      );
    }

    const actualizada = await prisma.area.update({
      where: { id },
      data: cambios,
    });

    return NextResponse.json({
      ok: true,
      mensaje:
        cambios.activa === false
          ? 'Área desactivada correctamente. Sus puestos e historial se conservan.'
          : 'Área organizacional actualizada correctamente.',
      datos: actualizada,
    });
  } catch (error) {
    if (esErrorUnicidadPrisma(error)) {
      return NextResponse.json(
        { ok: false, error: MENSAJE_DUPLICADO, detalles: { nombre: MENSAJE_DUPLICADO } },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { ok: false, error: 'No pudimos actualizar el área organizacional.' },
      { status: 503 }
    );
  }
}

/**
 * DELETE /api/organizacion/areas/[id]
 * Protege la integridad referencial (RNF-010): bloquea el borrado si existen puestos
 * asociados y recomienda desactivar el área mediante PATCH (activa: false).
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const { id } = await params;
    if (!esObjectIdOrganizacionValido(id)) {
      return NextResponse.json(
        { ok: false, error: 'El identificador del área no es válido.' },
        { status: 400 }
      );
    }

    const existente = await prisma.area.findUnique({
      where: { id },
      include: { _count: { select: { puestos: true } } },
    });

    if (!existente) {
      return NextResponse.json(
        { ok: false, error: 'Área organizacional no encontrada.' },
        { status: 404 }
      );
    }

    if (existente._count.puestos > 0) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'No se puede eliminar un área con puestos asociados; desactívala para conservar la integridad de rutas y colaboradores.',
        },
        { status: 409 }
      );
    }

    await prisma.area.delete({ where: { id } });

    return NextResponse.json({
      ok: true,
      mensaje: 'Área eliminada correctamente.',
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'No pudimos eliminar el área organizacional.' },
      { status: 503 }
    );
  }
}
