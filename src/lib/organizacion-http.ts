// Auxiliares HTTP de la capa de controlador para estructura organizacional (HU-007 / CGB-31).
import { NextRequest, NextResponse } from 'next/server';
import { ErrorOrganizacion } from '@/lib/servicio-organizacion';

export const SIN_CACHE = { 'Cache-Control': 'no-store' };

export async function leerObjetoJson(
  request: NextRequest
): Promise<Record<string, unknown> | null> {
  const cuerpo = await request.json().catch(() => null);
  if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) return null;
  return cuerpo as Record<string, unknown>;
}

export function responderJsonInvalido(): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'El cuerpo de la solicitud debe ser un objeto JSON válido.' },
    { status: 400 }
  );
}

export function responderErrorOrganizacion(
  error: unknown,
  mensajeGenerico: string
): NextResponse {
  if (error instanceof ErrorOrganizacion) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
        ...(error.detalles ? { detalles: error.detalles } : {}),
      },
      { status: error.status }
    );
  }
  return NextResponse.json({ ok: false, error: mensajeGenerico }, { status: 503 });
}
