import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validarCapacitacion, normalizarCapacitacion } from '@/lib/validaciones-capacitacion';

export const dynamic = 'force-dynamic';

/**
 * GET /api/capacitaciones
 * Devuelve la lista de todas las capacitaciones almacenadas en MongoDB Atlas.
 * Utilizada por el panel de gestión del Administrador (HU-002) y el
 * catálogo público (HU-005).
 */
export async function GET() {
  try {
    const capacitaciones = await prisma.capacitacion.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { slides: true } },
      },
    });

    return NextResponse.json({
      ok: true,
      total: capacitaciones.length,
      datos: capacitaciones,
    });
  } catch (error: unknown) {
    const mensaje =
      error instanceof Error ? error.message : 'Error al obtener las capacitaciones.';
    return NextResponse.json({ ok: false, error: mensaje }, { status: 500 });
  }
}

/**
 * POST /api/capacitaciones
 * Recibe los datos del formulario, los valida con el módulo de validaciones
 * y crea un nuevo registro en la colección "capacitaciones" de MongoDB Atlas.
 *
 * Criterio de Aceptación CA-01 de HU-002:
 *   Dado que el Administrador registra la información básica de una nueva capacitación,
 *   Entonces el sistema debe crearla y permitir continuar con la construcción de su contenido.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Leer el cuerpo JSON enviado desde el formulario
    const cuerpo = await request.json();

    // 2. Validar los datos con nuestro módulo de validaciones (HU-002 CA-01)
    const { valido, errores } = validarCapacitacion(cuerpo);
    if (!valido) {
      return NextResponse.json(
        { ok: false, error: 'Datos inválidos.', detalles: errores },
        { status: 400 }
      );
    }

    // 3. Normalizar y aplicar valores por defecto antes de guardar
    const datosNormalizados = normalizarCapacitacion(cuerpo);

    // 4. Guardar la nueva capacitación en MongoDB Atlas a través de Prisma
    const nuevaCapacitacion = await prisma.capacitacion.create({
      data: datosNormalizados,
    });

    // 5. Responder con la capacitación creada y código HTTP 201 (Created)
    return NextResponse.json(
      { ok: true, mensaje: 'Capacitación creada correctamente.', datos: nuevaCapacitacion },
      { status: 201 }
    );
  } catch (error: unknown) {
    const mensaje =
      error instanceof Error ? error.message : 'Error al crear la capacitación.';
    return NextResponse.json({ ok: false, error: mensaje }, { status: 500 });
  }
}
