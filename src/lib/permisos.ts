import { NextRequest, NextResponse } from 'next/server';
import { obtenerSesion } from './sesion';
import { NOMBRE_COOKIE } from './autenticacion';
import { esSolicitudMismoOrigen } from './origen';

export async function exigirAdministrador(solicitud: NextRequest) {
  if (solicitud.method !== 'GET' && !esSolicitudMismoOrigen(solicitud)) {
    return NextResponse.json({ ok: false, error: 'Solicitud no permitida' }, { status: 403 });
  }
  try {
    const usuario = await obtenerSesion(solicitud.cookies.get(NOMBRE_COOKIE)?.value);
    if (!usuario) return NextResponse.json({ ok: false, error: 'Debes iniciar sesión' }, { status: 401 });
    if (usuario.role !== 'ADMINISTRADOR') return NextResponse.json({ ok: false, error: 'No tienes permiso para esta acción' }, { status: 403 });
    return null;
  } catch { return NextResponse.json({ ok: false, error: 'No pudimos verificar tu sesión' }, { status: 503 }); }
}

export async function esAdministrador(solicitud: NextRequest) {
  const usuario = await obtenerSesion(solicitud.cookies.get(NOMBRE_COOKIE)?.value);
  return usuario?.role === 'ADMINISTRADOR';
}
