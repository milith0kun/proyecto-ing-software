import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validarCapacitacion, normalizarCapacitacion } from '@/lib/validaciones-capacitacion';

export const dynamic = 'force-dynamic';

/**
 * GET /api/capacitaciones/[id]
 * Devuelve los datos de una capacitación específica por su ID.
 * Útil para cargar datos en el formulario de edición.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const capacitacion = await prisma.capacitacion.findUnique({
      where: { id },
      include: { slides: { orderBy: { orden: 'asc' } } },
    });

    if (!capacitacion) {
      return NextResponse.json(
        { ok: false, error: 'Capacitación no encontrada.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, datos: capacitacion });
  } catch (error: unknown) {
    const mensaje =
      error instanceof Error ? error.message : 'Error al obtener la capacitación.';
    return NextResponse.json({ ok: false, error: mensaje }, { status: 500 });
  }
}

/**
 * PUT /api/capacitaciones/[id]
 * Actualiza los datos generales de una capacitación existente SIN crear una copia.
 *
 * Criterio de Aceptación CA-02 de HU-002:
 *   Dado que existe una capacitación previamente creada,
 *   Cuando el Administrador modifica su información general,
 *   Entonces el sistema debe conservar los cambios sobre la misma capacitación
 *   sin generar una copia.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cuerpo = await request.json();

    // 1. Verificar que la capacitación existe antes de editar (CA-02)
    const existente = await prisma.capacitacion.findUnique({ where: { id } });
    if (!existente) {
      return NextResponse.json(
        { ok: false, error: 'Capacitación no encontrada para editar.' },
        { status: 404 }
      );
    }

    // 2. Validar los nuevos datos con el módulo de validaciones
    const { valido, errores } = validarCapacitacion(cuerpo);
    if (!valido) {
      return NextResponse.json(
        { ok: false, error: 'Datos inválidos.', detalles: errores },
        { status: 400 }
      );
    }

    // 3. Normalizar y actualizar SOBRE el mismo registro (mismo ID, sin duplicados)
    const datosNormalizados = normalizarCapacitacion(cuerpo);

    const capacitacionActualizada = await prisma.capacitacion.update({
      where: { id },
      data: datosNormalizados,
    });

    return NextResponse.json({
      ok: true,
      mensaje: 'Capacitación actualizada correctamente.',
      datos: capacitacionActualizada,
    });
  } catch (error: unknown) {
    const mensaje =
      error instanceof Error ? error.message : 'Error al actualizar la capacitación.';
    return NextResponse.json({ ok: false, error: mensaje }, { status: 500 });
  }
}

/**
 * DELETE /api/capacitaciones/[id]
 * Elimina una capacitación y todos sus slides asociados (onDelete: Cascade en Prisma).
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existente = await prisma.capacitacion.findUnique({ where: { id } });
    if (!existente) {
      return NextResponse.json(
        { ok: false, error: 'Capacitación no encontrada para eliminar.' },
        { status: 404 }
      );
    }

    await prisma.capacitacion.delete({ where: { id } });

    return NextResponse.json({
      ok: true,
      mensaje: 'Capacitación eliminada correctamente.',
    });
  } catch (error: unknown) {
    const mensaje =
      error instanceof Error ? error.message : 'Error al eliminar la capacitación.';
    return NextResponse.json({ ok: false, error: mensaje }, { status: 500 });
  }
}
