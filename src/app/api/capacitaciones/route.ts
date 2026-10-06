import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validarCapacitacion, normalizarCapacitacion } from '@/lib/validaciones-capacitacion';
import { exigirAdministrador, esAdministrador } from '@/lib/permisos';

export const dynamic = 'force-dynamic';

/**
 * GET /api/capacitaciones
 * Devuelve la lista de todas las capacitaciones almacenadas en MongoDB Atlas.
 * Utilizada por el panel de gestión del Administrador (HU-002) y el
 * catálogo público (HU-005).
 */
export async function GET(request: NextRequest) {
  try {
    const administrador = await esAdministrador(request);
    const capacitaciones = await prisma.capacitacion.findMany({
      where: administrador ? {} : { ambito: 'PUBLICO', estado: 'PUBLICADA' },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { slides: true } },
      },
    });

    return NextResponse.json({
      ok: true,
      total: capacitaciones.length,
      datos: capacitaciones,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ ok: false, error: 'No pudimos obtener las capacitaciones.' }, { status: 503 });
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

    // 2. Validar los datos con nuestro módulo de validaciones (HU-002 CA-01)
    const { valido, errores } = validarCapacitacion(cuerpo);
    if (!valido) {
      return NextResponse.json(
        { ok: false, error: 'Datos inválidos.', detalles: errores },
        { status: 400 }
      );
    }

    // 3. Las nuevas capacitaciones siempre comienzan como borrador.
    const datosNormalizados = normalizarCapacitacion({ ...cuerpo, estado: 'BORRADOR' });

    // 4. Guardar la nueva capacitación en MongoDB Atlas a través de Prisma
    const nuevaCapacitacion = await prisma.capacitacion.create({
      data: datosNormalizados,
    });

    // 5. Responder con la capacitación creada y código HTTP 201 (Created)
    return NextResponse.json(
      { ok: true, mensaje: 'Capacitación creada correctamente.', datos: nuevaCapacitacion },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ ok: false, error: 'No pudimos crear la capacitación.' }, { status: 503 });
  }
}
