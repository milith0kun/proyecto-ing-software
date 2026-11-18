// Auxiliares HTTP de la capa de controlador para configuración de microtests (HU-013 / CGB-61).
import { NextRequest, NextResponse } from 'next/server';
import { ErrorConfiguracionMicrotest } from '@/lib/servicio-configuracion-microtest';

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

export function responderErrorMicrotest(
  error: unknown,
  mensajeGenerico: string
): NextResponse {
  if (error instanceof ErrorConfiguracionMicrotest) {
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
