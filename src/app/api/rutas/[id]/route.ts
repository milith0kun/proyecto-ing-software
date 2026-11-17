import { NextRequest, NextResponse } from 'next/server';
import { exigirAdministrador } from '@/lib/permisos';
import { crearServicioRutasOnboarding, ErrorRutaOnboarding } from '@/lib/rutas-onboarding';
import { crearRepositorioRutasPrisma } from '@/lib/rutas-onboarding-prisma';

export const dynamic = 'force-dynamic';

const servicioRutas = () => crearServicioRutasOnboarding(crearRepositorioRutasPrisma());
const esObjectIdValido = (id: string) => /^[a-f\d]{24}$/i.test(id);

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  const { id } = await params;
  if (!esObjectIdValido(id)) {
    return NextResponse.json({ ok: false, error: 'El identificador de la ruta no es válido.' }, { status: 400 });
  }

  try {
    const datos = await servicioRutas().obtenerRuta(id);
    return NextResponse.json({ ok: true, datos }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof ErrorRutaOnboarding) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 404 });
    }
    return NextResponse.json({ ok: false, error: 'No pudimos consultar la ruta de onboarding.' }, { status: 503 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  const { id } = await params;
  if (!esObjectIdValido(id)) {
    return NextResponse.json({ ok: false, error: 'El identificador de la ruta no es válido.' }, { status: 400 });
  }

  try {
    const cuerpo = await request.json().catch(() => null);
    if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo) || !Array.isArray(cuerpo.capacitacionIds)) {
      return NextResponse.json(
        { ok: false, error: 'Debes enviar el arreglo "capacitacionIds" con el orden de la ruta.' },
        { status: 400 },
      );
    }

    const datos = await servicioRutas().secuenciarCapacitaciones(id, cuerpo.capacitacionIds);
    return NextResponse.json(
      { ok: true, mensaje: 'Secuencia de capacitaciones actualizada correctamente.', datos },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    if (error instanceof ErrorRutaOnboarding) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: 'No pudimos actualizar la secuencia de la ruta.' }, { status: 503 });
  }
}
