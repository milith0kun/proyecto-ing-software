import { NextRequest, NextResponse } from 'next/server';
import { exigirAdministrador } from '@/lib/permisos';
import { crearServicioRutasOnboarding, ErrorRutaOnboarding } from '@/lib/rutas-onboarding';
import { crearRepositorioRutasPrisma } from '@/lib/rutas-onboarding-prisma';

export const dynamic = 'force-dynamic';

const servicioRutas = () => crearServicioRutasOnboarding(crearRepositorioRutasPrisma());

export async function GET(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const estadoFiltro = request.nextUrl.searchParams.get('estado')?.toUpperCase().trim();
    const todas = await servicioRutas().listarRutas();
    const datos = estadoFiltro ? todas.filter(r => r.estado === estadoFiltro) : todas;

    return NextResponse.json(
      { ok: true, total: datos.length, datos },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: 'No pudimos obtener las rutas de onboarding.' },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const cuerpo = await request.json().catch(() => null);
    if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) {
      return NextResponse.json(
        { ok: false, error: 'El cuerpo de la solicitud debe ser un objeto JSON válido.' },
        { status: 400 },
      );
    }

    const creada = await servicioRutas().crearRuta(cuerpo);
    return NextResponse.json(
      { ok: true, mensaje: 'Ruta de onboarding creada en borrador.', datos: creada },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ErrorRutaOnboarding) {
      return NextResponse.json(
        { ok: false, error: error.message, ...(error.detalles ? { detalles: error.detalles } : {}) },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { ok: false, error: 'No pudimos crear la ruta de onboarding.' },
      { status: 503 },
    );
  }
}
