import { NextRequest, NextResponse } from 'next/server';
import { NOMBRE_COOKIE } from '@/lib/autenticacion';
import { obtenerSesion } from '@/lib/sesion';
import { consultarMiOnboarding } from '@/lib/servicio-mi-onboarding';

export const dynamic = 'force-dynamic';

export async function GET(solicitud: NextRequest) {
  try {
    const usuario = await obtenerSesion(solicitud.cookies.get(NOMBRE_COOKIE)?.value);
    if (!usuario || usuario.role !== 'COLABORADOR') {
      return NextResponse.json({ ok: false, error: 'Debes iniciar sesión como colaborador.' }, {
        status: 401,
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    const panel = await consultarMiOnboarding(usuario.id);
    return NextResponse.json({ ok: true, ...panel }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ ok: false, error: 'No pudimos consultar tu ruta de onboarding.' }, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}