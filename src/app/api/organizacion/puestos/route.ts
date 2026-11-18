// Controlador HTTP para `/api/organizacion/puestos` (HU-007 / CGB-31).
import { NextRequest, NextResponse } from 'next/server';
import { exigirAdministrador } from '@/lib/permisos';
import {
  SIN_CACHE,
  leerObjetoJson,
  responderErrorOrganizacion,
  responderJsonInvalido,
} from '@/lib/organizacion-http';
import {
  listarPuestosEnServicio,
  registrarPuestoOrganizacion,
} from '@/lib/servicio-organizacion';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const areaId = request.nextUrl.searchParams.get('areaId')?.trim();
    const puestos = await listarPuestosEnServicio(areaId);
    return NextResponse.json(
      { ok: true, total: puestos.length, datos: puestos },
      { headers: SIN_CACHE }
    );
  } catch (error) {
    return responderErrorOrganizacion(
      error,
      'No pudimos obtener los puestos de trabajo.'
    );
  }
}

export async function POST(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const cuerpo = await leerObjetoJson(request);
    if (!cuerpo) return responderJsonInvalido();

    const creado = await registrarPuestoOrganizacion(cuerpo);
    return NextResponse.json(
      {
        ok: true,
        mensaje: 'Puesto de trabajo creado correctamente.',
        datos: creado,
      },
      { status: 201 }
    );
  } catch (error) {
    return responderErrorOrganizacion(
      error,
      'No pudimos crear el puesto de trabajo.'
    );
  }
}
