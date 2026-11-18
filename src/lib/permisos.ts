import { NextRequest, NextResponse } from 'next/server';
import { obtenerSesion } from './sesion';
import type { UsuarioSesion } from './autenticacion';
import { NOMBRE_COOKIE } from './autenticacion';
import { esSolicitudMismoOrigen } from './origen';

async function exigirRoles(solicitud: NextRequest, rolesPermitidos: string[]) {
  if (solicitud.method !== 'GET' && !esSolicitudMismoOrigen(solicitud)) {
    return NextResponse.json({ ok: false, error: 'Solicitud no permitida' }, { status: 403 });
  }
  try {
    const usuario = await obtenerSesion(solicitud.cookies.get(NOMBRE_COOKIE)?.value);
    if (!usuario) return NextResponse.json({ ok: false, error: 'Debes iniciar sesión' }, { status: 401 });
    if (!rolesPermitidos.includes(usuario.role)) return NextResponse.json({ ok: false, error: 'No tienes permiso para esta acción' }, { status: 403 });
    return null;
  } catch { return NextResponse.json({ ok: false, error: 'No pudimos verificar tu sesión' }, { status: 503 }); }
}

export async function exigirAdministrador(solicitud: NextRequest) {
  return exigirRoles(solicitud, ['ADMINISTRADOR']);
}

export async function exigirGestorColaboradores(solicitud: NextRequest) {
  return exigirRoles(solicitud, ['ADMINISTRADOR']);
}

export async function esAdministrador(solicitud: NextRequest) {
  const usuario = await obtenerSesion(solicitud.cookies.get(NOMBRE_COOKIE)?.value);
  return usuario?.role === 'ADMINISTRADOR';
}

// Cualquier cuenta interna autenticada; el avance siempre se asocia a la sesión, nunca al cuerpo de la solicitud.
export async function exigirSesionInterna(solicitud: NextRequest): Promise<{ usuario: UsuarioSesion } | { respuesta: NextResponse }> {
  if (solicitud.method !== 'GET' && !esSolicitudMismoOrigen(solicitud)) {
    return { respuesta: NextResponse.json({ ok: false, error: 'Solicitud no permitida' }, { status: 403 }) };
  }
  try {
    const usuario = await obtenerSesion(solicitud.cookies.get(NOMBRE_COOKIE)?.value);
    if (!usuario) return { respuesta: NextResponse.json({ ok: false, error: 'Debes iniciar sesión' }, { status: 401 }) };
    return { usuario };
  } catch { return { respuesta: NextResponse.json({ ok: false, error: 'No pudimos verificar tu sesión' }, { status: 503 }) }; }
}
