import { NextRequest, NextResponse } from 'next/server';
import { NOMBRE_COOKIE } from '@/lib/autenticacion';
import { obtenerSesion } from '@/lib/sesion';
import { consultarProgreso, guardarProgreso } from '@/lib/servicio-progreso';

export const dynamic = 'force-dynamic';

async function usuarioColaborador(solicitud: NextRequest) {
  const usuario = await obtenerSesion(solicitud.cookies.get(NOMBRE_COOKIE)?.value);
  if (!usuario || usuario.role !== 'COLABORADOR') return null;
  return usuario;
}

export async function GET(solicitud: NextRequest) {
  const usuario = await usuarioColaborador(solicitud);
  if (!usuario) {
    return NextResponse.json({ ok: false, error: 'Debes iniciar sesión como colaborador.' }, {
      status: 401,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const capacitacionId = solicitud.nextUrl.searchParams.get('capacitacionId') ?? '';
  try {
    const datos = await consultarProgreso(usuario.id, capacitacionId);
    return NextResponse.json({ ok: true, datos }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 503;
    return NextResponse.json({ ok: false, error: 'No pudimos consultar tu avance.' }, {
      status,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}

export async function PUT(solicitud: NextRequest) {
  const usuario = await usuarioColaborador(solicitud);
  if (!usuario) {
    return NextResponse.json({ ok: false, error: 'Debes iniciar sesión como colaborador.' }, {
      status: 401,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const cuerpo = await solicitud.json().catch(() => null);
  const capacitacionId = typeof cuerpo?.capacitacionId === 'string' ? cuerpo.capacitacionId : '';
  const slideOrden = cuerpo?.slideOrden ?? cuerpo?.slide;

  try {
    const datos = await guardarProgreso(usuario.id, capacitacionId, slideOrden);
    return NextResponse.json({ ok: true, datos }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const estado = error as { status?: number; message?: string };
    return NextResponse.json({ ok: false, error: estado.message ?? 'No pudimos guardar tu avance.' }, {
      status: estado.status ?? 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}