// Controlador HTTP para `/api/microtests` (HU-013 / CGB-61).
import { NextRequest, NextResponse } from 'next/server';
import { exigirAdministrador } from '@/lib/permisos';
import {
  SIN_CACHE,
  leerObjetoJson,
  responderErrorMicrotest,
  responderJsonInvalido,
} from '@/lib/microtests-http';
import {
  listarMicrotestsEnServicio,
  registrarMicrotestEnServicio,
} from '@/lib/servicio-configuracion-microtest';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const capacitacionId = request.nextUrl.searchParams.get('capacitacionId')?.trim();
    const datos = await listarMicrotestsEnServicio(capacitacionId);
    return NextResponse.json(
      { ok: true, total: datos.length, datos },
      { headers: SIN_CACHE }
    );
  } catch (error) {
    return responderErrorMicrotest(
      error,
      'No pudimos consultar los microtests configurados.'
    );
  }
}

export async function POST(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const cuerpo = await leerObjetoJson(request);
    if (!cuerpo) return responderJsonInvalido();

    const creado = await registrarMicrotestEnServicio(cuerpo);
    return NextResponse.json({ ok: true, datos: creado }, { status: 201 });
  } catch (error) {
    return responderErrorMicrotest(
      error,
      'No pudimos registrar el microtest. Inténtalo nuevamente.'
    );
  }
}
