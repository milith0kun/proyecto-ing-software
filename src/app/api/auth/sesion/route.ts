import { NextRequest, NextResponse } from 'next/server';
import { obtenerSesion } from '@/lib/sesion';
import { NOMBRE_COOKIE, destinoPorRol } from '@/lib/autenticacion';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/sesion
 * Informa a las pantallas públicas si hay una sesión interna válida
 * (token firmado + sesión persistida vigente). No expone datos sensibles.
 */
export async function GET(solicitud: NextRequest) {
  const cabeceras = { 'Cache-Control': 'no-store' };
  try {
    const usuario = await obtenerSesion(solicitud.cookies.get(NOMBRE_COOKIE)?.value);
    if (!usuario) return NextResponse.json({ autenticado: false }, { headers: cabeceras });
    return NextResponse.json({
      autenticado: true,
      nombre: usuario.name || usuario.email,
      rol: usuario.role,
      destino: destinoPorRol(usuario.role),
    }, { headers: cabeceras });
  } catch {
    return NextResponse.json({ autenticado: false }, { headers: cabeceras });
  }
}
