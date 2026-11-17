import { NextRequest, NextResponse } from 'next/server';
import { exigirAdministrador } from '@/lib/permisos';
import { crearServicioRutasOnboarding, ErrorRutaOnboarding } from '@/lib/rutas-onboarding';
import { crearRepositorioRutasPrisma } from '@/lib/rutas-onboarding-prisma';

const servicioRutas = () => crearServicioRutasOnboarding(crearRepositorioRutasPrisma());

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) {
    return NextResponse.json({ ok: false, error: 'El identificador de la ruta no es válido.' }, { status: 400 });
  }

  try {
    const datos = await servicioRutas().activarRuta(id);
    return NextResponse.json(
      { ok: true, mensaje: 'Ruta de onboarding activada correctamente.', datos },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    if (error instanceof ErrorRutaOnboarding) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: 'No pudimos activar la ruta de onboarding.' }, { status: 503 });
  }
}
