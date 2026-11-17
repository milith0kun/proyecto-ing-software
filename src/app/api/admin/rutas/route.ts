import { NextRequest, NextResponse } from 'next/server';
import { exigirAdministrador } from '@/lib/permisos';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const rutas = await prisma.rutaOnboarding.findMany({
      orderBy: { nombre: 'asc' },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        activa: true,
        _count: { select: { capacitaciones: true } },
      },
    });

    return NextResponse.json({
      ok: true,
      datos: rutas.map(ruta => ({
        id: ruta.id,
        nombre: ruta.nombre,
        descripcion: ruta.descripcion,
        activa: ruta.activa,
        totalCapacitaciones: ruta._count.capacitaciones,
      })),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ ok: false, error: 'No pudimos consultar las rutas.' }, { status: 503 });
  }
}
