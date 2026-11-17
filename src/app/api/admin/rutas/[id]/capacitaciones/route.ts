import { NextRequest, NextResponse } from 'next/server';
import { exigirAdministrador } from '@/lib/permisos';
import { prisma } from '@/lib/prisma';

type ContextoRuta = { params: Promise<{ id: string }> };

function objectIdValido(id: unknown): id is string {
  return typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);
}

export async function GET(_request: NextRequest, { params }: ContextoRuta) {
  const rechazo = await exigirAdministrador(_request);
  if (rechazo) return rechazo;

  try {
    const { id } = await params;
    if (!objectIdValido(id)) {
      return NextResponse.json({ ok: false, error: 'Ruta no válida.' }, { status: 400 });
    }

    const ruta = await prisma.rutaOnboarding.findUnique({
      where: { id },
      select: { id: true, nombre: true, descripcion: true, activa: true },
    });
    if (!ruta) {
      return NextResponse.json({ ok: false, error: 'Ruta no encontrada.' }, { status: 404 });
    }

    const [asignadas, disponibles] = await Promise.all([
      prisma.rutaCapacitacion.findMany({
        where: { rutaId: id },
        orderBy: { orden: 'asc' },
        select: {
          orden: true,
          capacitacion: {
            select: { id: true, titulo: true, descripcion: true, unidad: true, ambito: true, estado: true },
          },
        },
      }),
      prisma.capacitacion.findMany({
        where: { estado: 'PUBLICADA' },
        orderBy: { titulo: 'asc' },
        select: { id: true, titulo: true, descripcion: true, unidad: true, ambito: true, estado: true },
      }),
    ]);

    const idsAsignados = new Set(asignadas.map(item => item.capacitacion.id));

    return NextResponse.json({
      ok: true,
      datos: {
        ruta,
        asignadas: asignadas.map(item => ({ ...item.capacitacion, orden: item.orden })),
        disponibles: disponibles
          .filter(item => !idsAsignados.has(item.id))
          .map(item => ({ ...item, orden: null })),
      },
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ ok: false, error: 'No pudimos consultar las asignaciones.' }, { status: 503 });
  }
}

export async function PUT(request: NextRequest, { params }: ContextoRuta) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const { id } = await params;
    if (!objectIdValido(id)) {
      return NextResponse.json({ ok: false, error: 'Ruta no válida.' }, { status: 400 });
    }

    const ruta = await prisma.rutaOnboarding.findUnique({
      where: { id },
      select: { id: true, nombre: true, activa: true },
    });
    if (!ruta) {
      return NextResponse.json({ ok: false, error: 'Ruta no encontrada.' }, { status: 404 });
    }

    const cuerpo = await request.json().catch(() => null);
    const solicitudes = Array.isArray(cuerpo?.capacitaciones) ? cuerpo.capacitaciones : null;
    if (!solicitudes || solicitudes.length > 100) {
      return NextResponse.json({ ok: false, error: 'Debes enviar una lista válida de hasta 100 capacitaciones.' }, { status: 400 });
    }

    const normalizadas = solicitudes.map((item: unknown) => {
      if (!item || typeof item !== 'object') return null;
      const dato = item as { id?: unknown; orden?: unknown };
      const orden = Number(dato.orden);
      return objectIdValido(dato.id) && Number.isInteger(orden) && orden >= 1
        ? { capacitacionId: dato.id, orden }
        : null;
    });
    if (normalizadas.some((item: { capacitacionId: string; orden: number } | null) => item === null)) {
      return NextResponse.json({ ok: false, error: 'Cada asignación debe tener ID válido y orden positivo.' }, { status: 400 });
    }

    const asignaciones = normalizadas as Array<{ capacitacionId: string; orden: number }>;
    const ids = asignaciones.map(item => item.capacitacionId);
    if (new Set(ids).size !== ids.length) {
      return NextResponse.json({ ok: false, error: 'Una capacitación no puede asignarse dos veces.' }, { status: 400 });
    }
    const ordenes = asignaciones.map(item => item.orden).sort((a, b) => a - b);
    if (ordenes.some((orden, indice) => orden !== indice + 1)) {
      return NextResponse.json({ ok: false, error: 'El orden debe ser consecutivo desde 1.' }, { status: 400 });
    }

    const existentes = await prisma.capacitacion.findMany({
      where: { id: { in: ids }, estado: 'PUBLICADA' },
      select: { id: true },
    });
    if (existentes.length !== ids.length) {
      return NextResponse.json({ ok: false, error: 'Todas las capacitaciones deben existir y estar publicadas.' }, { status: 400 });
    }

    await prisma.$transaction(async transaction => {
      await transaction.rutaCapacitacion.deleteMany({ where: { rutaId: id } });
      if (asignaciones.length > 0) {
        await transaction.rutaCapacitacion.createMany({
          data: asignaciones.map(item => ({
            rutaId: id,
            capacitacionId: item.capacitacionId,
            orden: item.orden,
          })),
        });
      }
    });

    return NextResponse.json({
      ok: true,
      mensaje: 'Asignaciones de la ruta actualizadas.',
      total: asignaciones.length,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ ok: false, error: 'No pudimos actualizar las asignaciones.' }, { status: 503 });
  }
}
