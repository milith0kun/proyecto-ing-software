// Capa de controlador del microtest (HU-014): autentica, traduce HTTP al servicio y los errores de dominio a respuestas.
import { NextRequest, NextResponse } from 'next/server';
import { exigirSesionInterna } from '@/lib/permisos';
import { ErrorMicrotest } from '@/lib/microtest';
import { ErrorProgreso } from '@/lib/progreso-capacitacion';
import * as servicio from '@/lib/servicio-evaluacion';

const SIN_CACHE = { 'Cache-Control': 'no-store' };
const falla = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status, headers: SIN_CACHE });

// POST /api/evaluaciones/evaluar: califica un intento del microtest del colaborador autenticado.
export async function evaluarMicrotest(solicitud: NextRequest) {
  try {
    const sesion = await exigirSesionInterna(solicitud);
    if ('respuesta' in sesion) return sesion.respuesta;
    const cuerpo = await solicitud.json().catch(() => null);
    const datos = await servicio.evaluarMicrotest(sesion.usuario.id, cuerpo?.capacitacionId, cuerpo?.respuestas);
    return NextResponse.json({ ok: true, datos }, { headers: SIN_CACHE });
  } catch (error) {
    if (error instanceof ErrorMicrotest || error instanceof ErrorProgreso) return falla(error.message, error.status);
    return falla('No pudimos procesar tu evaluación. Inténtalo nuevamente.', 503);
  }
}
