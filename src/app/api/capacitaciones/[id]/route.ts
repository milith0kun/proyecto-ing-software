import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validarCapacitacion, normalizarCapacitacion } from '@/lib/validaciones-capacitacion';
import { exigirAdministrador, esAdministrador } from '@/lib/permisos';
import { prepararPublicacion, ErrorPublicacion } from '@/lib/publicacion';

export const dynamic = 'force-dynamic';

/**
 * GET /api/capacitaciones/[id]
 * Devuelve los datos de una capacitación específica por su ID.
 * Útil para cargar datos en el formulario de edición.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json(
        { ok: false, error: 'El identificador de la capacitación no es válido.' },
        { status: 400 }
      );
    }

    const capacitacion = await prisma.capacitacion.findUnique({
      where: { id },
      include: { slides: { orderBy: { orden: 'asc' } } },
    });

    const administrador = await esAdministrador(request);
    if (!capacitacion || (!administrador && (capacitacion.ambito !== 'PUBLICO' || capacitacion.estado !== 'PUBLICADA'))) {
      return NextResponse.json(
        { ok: false, error: 'Capacitación no encontrada.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, datos: capacitacion }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ ok: false, error: 'No pudimos obtener la capacitación.' }, { status: 503 });
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
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;
  try {
    const { id } = await params;
    if (!/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json(
        { ok: false, error: 'El identificador de la capacitación no es válido.' },
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

    // 1. Verificar que la capacitación existe antes de editar (CA-02)
    const existente = await prisma.capacitacion.findUnique({ where: { id }, include: { slides: true } });
    if (!existente) {
      return NextResponse.json(
        { ok: false, error: 'Capacitación no encontrada para editar.' },
        { status: 404 }
      );
    }

    // Permitir actualizaciones parciales sin borrar valores que el formulario no envíe.
    const estadoSolicitado = cuerpo.estado !== undefined ? String(cuerpo.estado).toUpperCase().trim() : existente.estado;

    const datosParaActualizar = {
      ...cuerpo,
      titulo: cuerpo.titulo ?? existente.titulo,
      descripcion: cuerpo.descripcion ?? existente.descripcion,
      unidad: cuerpo.unidad ?? existente.unidad,
      ambito: cuerpo.ambito ?? existente.ambito,
      estado: estadoSolicitado,
      categoria: cuerpo.categoria ?? existente.categoria ?? 'Inducción',
      duracionMin: cuerpo.duracionMin ?? existente.duracionMin ?? 30,
    };

    // 2. Validar los nuevos datos con el módulo de validaciones
    const { valido, errores } = validarCapacitacion(datosParaActualizar);
    if (!valido) {
      return NextResponse.json(
        { ok: false, error: 'Datos inválidos.', detalles: errores },
        { status: 400 }
      );
    }

    // El formulario puede actualizar el estado de la publicación cuando el administrador la publica.
    const datosNormalizados = normalizarCapacitacion(datosParaActualizar, {
      estado: estadoSolicitado,
      icono: existente.icono ?? undefined,
    });

    const capacitacionActualizada = await prisma.capacitacion.update({
      where: { id },
      data: {
        ...datosNormalizados,
        ...(estadoSolicitado === 'PUBLICADA' ? prepararPublicacion(existente) : { publicadaEn: null }),
      },
    });

    return NextResponse.json({
      ok: true,
      mensaje: 'Capacitación actualizada correctamente.',
      datos: capacitacionActualizada,
    });
  } catch (error) {
    if (error instanceof ErrorPublicacion) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    return NextResponse.json({ ok: false, error: 'No pudimos actualizar la capacitación.' }, { status: 503 });
  }
}

/**
 * DELETE /api/capacitaciones/[id]
 * Elimina una capacitación y todos sus slides asociados (onDelete: Cascade en Prisma).
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;
  try {
    const { id } = await params;

    if (!/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json(
        { ok: false, error: 'El identificador de la capacitación no es válido.' },
        { status: 400 }
      );
    }

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
  } catch {
    return NextResponse.json({ ok: false, error: 'No pudimos eliminar la capacitación.' }, { status: 503 });
  }
}
