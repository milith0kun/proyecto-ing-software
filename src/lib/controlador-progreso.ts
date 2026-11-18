// Capa de controlador: autentica, traduce la solicitud HTTP a llamadas al servicio y los errores de dominio a respuestas.
import { NextRequest, NextResponse } from 'next/server';
import { exigirSesionInterna } from '@/lib/permisos';
import { ErrorProgreso } from '@/lib/progreso-capacitacion';
import * as servicio from '@/lib/servicio-progreso';

const SIN_CACHE = { 'Cache-Control': 'no-store' };
type Contexto = { params: Promise<{ id: string }> };

const falla = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status, headers: SIN_CACHE });

async function ejecutar(
  solicitud: NextRequest, { params }: Contexto,
  accion: (usuarioId: string, id: string) => Promise<unknown>,
) {
  try {
    const sesion = await exigirSesionInterna(solicitud);
    if ('respuesta' in sesion) return sesion.respuesta;
    const { id } = await params;
    const datos = await accion(sesion.usuario.id, id);
    return NextResponse.json({ ok: true, datos }, { headers: SIN_CACHE });
  } catch (error) {
    if (error instanceof ErrorProgreso) return falla(error.message, error.status);
    return falla('No pudimos procesar tu avance. Inténtalo nuevamente.', 503);
  }
}

export const consultarProgreso = (solicitud: NextRequest, contexto: Contexto) =>
  ejecutar(solicitud, contexto, servicio.consultarProgreso);

export const guardarProgreso = (solicitud: NextRequest, contexto: Contexto) =>
  ejecutar(solicitud, contexto, async (usuarioId, id) => {
    const cuerpo = await solicitud.json().catch(() => null);
    return servicio.guardarProgreso(usuarioId, id, cuerpo?.slide);
  });

export const finalizarProgreso = (solicitud: NextRequest, contexto: Contexto) =>
  ejecutar(solicitud, contexto, servicio.finalizarProgreso);
