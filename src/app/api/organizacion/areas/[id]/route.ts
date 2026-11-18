// Controlador HTTP para `/api/organizacion/areas/[id]` (HU-007 / CGB-31).
import { NextRequest, NextResponse } from 'next/server';
import { exigirAdministrador } from '@/lib/permisos';
import {
  leerObjetoJson,
  responderErrorOrganizacion,
  responderJsonInvalido,
} from '@/lib/organizacion-http';
import {
  actualizarAreaEnServicio,
  eliminarAreaEnServicio,
} from '@/lib/servicio-organizacion';

export const dynamic = 'force-dynamic';

type ContextoId = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: ContextoId) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const { id } = await params;
    const cuerpo = await leerObjetoJson(request);
    if (!cuerpo) return responderJsonInvalido();

    const resultado = await actualizarAreaEnServicio(id, cuerpo);
    return NextResponse.json({
      ok: true,
      mensaje: resultado.mensaje,
      datos: resultado.datos,
    });
  } catch (error) {
    return responderErrorOrganizacion(
      error,
      'No pudimos actualizar el área organizacional.'
    );
  }
}

export async function DELETE(request: NextRequest, { params }: ContextoId) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const { id } = await params;
    const resultado = await eliminarAreaEnServicio(id);
    return NextResponse.json({
      ok: true,
      mensaje: resultado.mensaje,
    });
  } catch (error) {
    return responderErrorOrganizacion(
      error,
      'No pudimos eliminar el área organizacional.'
    );
  }
}
