import { NextRequest, NextResponse } from 'next/server';
import { exigirAdministrador } from '@/lib/permisos';
import { obtenerServicioRutas, responderErrorRuta, validarIdRutaHttp } from '@/lib/rutas-http';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  const { id } = await params;
  const errorId = validarIdRutaHttp(id);
  if (errorId) return errorId;

  try {
    const datos = await obtenerServicioRutas().obtenerRuta(id);
    return NextResponse.json({ ok: true, datos }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return responderErrorRuta(error, 'No pudimos consultar la ruta de onboarding.', 404);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  const { id } = await params;
  const errorId = validarIdRutaHttp(id);
  if (errorId) return errorId;

  try {
    const cuerpo = await request.json().catch(() => null);
    if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo) || !Array.isArray(cuerpo.capacitacionIds)) {
      return NextResponse.json(
        { ok: false, error: 'Debes enviar el arreglo "capacitacionIds" con el orden de la ruta.' },
        { status: 400 },
      );
    }

    const datos = await obtenerServicioRutas().secuenciarCapacitaciones(id, cuerpo.capacitacionIds);
    return NextResponse.json(
      { ok: true, mensaje: 'Secuencia de capacitaciones actualizada correctamente.', datos },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    return responderErrorRuta(error, 'No pudimos actualizar la secuencia de la ruta.');
  }
}
