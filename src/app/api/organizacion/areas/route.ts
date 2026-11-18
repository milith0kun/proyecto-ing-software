// Controlador HTTP para `/api/organizacion/areas` (HU-007 / CGB-31).
import { NextRequest, NextResponse } from 'next/server';
import { exigirAdministrador } from '@/lib/permisos';
import {
  SIN_CACHE,
  leerObjetoJson,
  responderErrorOrganizacion,
  responderJsonInvalido,
} from '@/lib/organizacion-http';
import {
  obtenerEstructuraOrganizacional,
  registrarAreaOrganizacion,
} from '@/lib/servicio-organizacion';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const soloActivas = request.nextUrl.searchParams.get('soloActivas') === 'true';
    const datos = await obtenerEstructuraOrganizacional({ soloActivas });
    return NextResponse.json(
      { ok: true, total: datos.length, datos },
      { headers: SIN_CACHE }
    );
  } catch (error) {
    return responderErrorOrganizacion(
      error,
      'No pudimos obtener las áreas organizacionales.'
    );
  }
}

export async function POST(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const cuerpo = await leerObjetoJson(request);
    if (!cuerpo) return responderJsonInvalido();

    const creada = await registrarAreaOrganizacion(cuerpo);
    return NextResponse.json(
      {
        ok: true,
        mensaje: 'Área organizacional creada correctamente.',
        datos: creada,
      },
      { status: 201 }
    );
  } catch (error) {
    return responderErrorOrganizacion(
      error,
      'No pudimos crear el área organizacional.'
    );
  }
}
