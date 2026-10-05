import { NextRequest, NextResponse } from 'next/server';
import { NOMBRE_COOKIE, verificarToken, destinoPorRol, obtenerSecretoAuth } from './lib/autenticacion.ts';

// Primera barrera. Los layouts y endpoints verifican también la sesión persistida.
export async function proxy(solicitud: NextRequest) {
  const token = await verificarToken(solicitud.cookies.get(NOMBRE_COOKIE)?.value, obtenerSecretoAuth());
  if (!token) return NextResponse.redirect(new URL('/login', solicitud.url));
  if (solicitud.nextUrl.pathname.startsWith('/admin') && token.rol !== 'ADMINISTRADOR') {
    return NextResponse.redirect(new URL(destinoPorRol(token.rol), solicitud.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ['/admin/:path*', '/colaborador/:path*'] };
