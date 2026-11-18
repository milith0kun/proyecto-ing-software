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
        objetivo: true,
        activa: true,
        estado: true,
        _count: { select: { pasos: true, usuarios: true } },
      },
    });

    return NextResponse.json({
      ok: true,
      datos: rutas.map(ruta => ({
        id: ruta.id,
        nombre: ruta.nombre ?? 'Ruta sin nombre',
        descripcion: ruta.descripcion ?? ruta.objetivo,
        activa: ruta.activa ?? ruta.estado === 'ACTIVA',
        totalCapacitaciones: ruta._count.pasos,
        totalColaboradores: ruta._count.usuarios,
      })),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ ok: false, error: 'No pudimos consultar las rutas.' }, { status: 503 });
  }
}
