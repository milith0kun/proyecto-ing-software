// Controlador HTTP para `/api/microtests/[id]` (HU-013 / CGB-61).
import { NextRequest, NextResponse } from 'next/server';
import { exigirAdministrador } from '@/lib/permisos';
import {
  SIN_CACHE,
  leerObjetoJson,
  responderErrorMicrotest,
  responderJsonInvalido,
} from '@/lib/microtests-http';
import {
  actualizarMicrotestEnServicio,
  eliminarMicrotestEnServicio,
  obtenerMicrotestEnServicio,
} from '@/lib/servicio-configuracion-microtest';

export const dynamic = 'force-dynamic';

type ContextoRuta = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: ContextoRuta) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const { id } = await params;
    const datos = await obtenerMicrotestEnServicio(id);
    return NextResponse.json({ ok: true, datos }, { headers: SIN_CACHE });
  } catch (error) {
    return responderErrorMicrotest(error, 'No pudimos obtener el microtest.');
  }
}

export async function PUT(request: NextRequest, { params }: ContextoRuta) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const { id } = await params;
    const cuerpo = await leerObjetoJson(request);
    if (!cuerpo) return responderJsonInvalido();

    const datos = await actualizarMicrotestEnServicio(id, cuerpo);
    return NextResponse.json({ ok: true, datos });
  } catch (error) {
    return responderErrorMicrotest(
      error,
      'No pudimos actualizar el microtest. Inténtalo nuevamente.'
    );
  }
}

export async function DELETE(request: NextRequest, { params }: ContextoRuta) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const { id } = await params;
    const resultado = await eliminarMicrotestEnServicio(id);
    return NextResponse.json({ ok: true, mensaje: resultado.mensaje });
  } catch (error) {
    return responderErrorMicrotest(
      error,
      'No pudimos eliminar el microtest. Inténtalo nuevamente.'
    );
  }
}
