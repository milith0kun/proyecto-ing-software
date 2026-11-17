import { NextRequest, NextResponse } from 'next/server';
import { exigirAdministrador } from '@/lib/permisos';
import { obtenerServicioRutas, responderErrorRuta, validarIdRutaHttp } from '@/lib/rutas-http';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  const { id } = await params;
  const errorId = validarIdRutaHttp(id);
  if (errorId) return errorId;

  try {
    const datos = await obtenerServicioRutas().activarRuta(id);
    return NextResponse.json(
      { ok: true, mensaje: 'Ruta de onboarding activada correctamente.', datos },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    return responderErrorRuta(error, 'No pudimos activar la ruta de onboarding.');
  }
}
