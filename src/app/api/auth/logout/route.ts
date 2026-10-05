import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NOMBRE_COOKIE, obtenerSecretoAuth, opcionesCookie, usarCookieSegura, verificarToken } from '@/lib/autenticacion';
import { esSolicitudMismoOrigen } from '@/lib/origen';

export async function POST(solicitud: NextRequest) {
  if (!esSolicitudMismoOrigen(solicitud)) return NextResponse.json({ error: 'Solicitud no permitida' }, { status: 403 });
  const contenido = await verificarToken(solicitud.cookies.get(NOMBRE_COOKIE)?.value, obtenerSecretoAuth());
  try {
    if (contenido) await prisma.sesion.deleteMany({ where: { id: contenido.sid, usuarioId: contenido.sub } });
    const respuesta = NextResponse.json({ destino: '/' });
    const esHttps = solicitud.headers.get('x-forwarded-proto') === 'https' ||
                    solicitud.nextUrl.protocol === 'https:' ||
                    usarCookieSegura(process.env.APP_URL, process.env.NODE_ENV);
    respuesta.cookies.set(NOMBRE_COOKIE, '', opcionesCookie(esHttps, true));
    respuesta.headers.set('Cache-Control', 'no-store');
    return respuesta;
  } catch { return NextResponse.json({ error: 'No pudimos cerrar la sesión. Inténtalo nuevamente.' }, { status: 503 }); }
}
