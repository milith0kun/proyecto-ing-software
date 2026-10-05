import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { autenticar, crearToken, destinoPorRol, DURACION_SESION, NOMBRE_COOKIE, obtenerSecretoAuth, opcionesCookie, usarCookieSegura } from '@/lib/autenticacion';
import { esSolicitudMismoOrigen } from '@/lib/origen';

export async function POST(solicitud: NextRequest) {
  if (!esSolicitudMismoOrigen(solicitud)) {
    return NextResponse.json({ error: 'Solicitud no permitida' }, { status: 403 });
  }
  let datos: unknown;
  try { datos = await solicitud.json(); } catch {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 400 });
  }
  try {
    const usuario = await autenticar(datos, correo => prisma.user.findUnique({ where: { email: correo } }));
    const identificador = randomUUID();
    const token = await crearToken(usuario, identificador, obtenerSecretoAuth());
    await prisma.sesion.create({ data: { id: identificador, usuarioId: usuario.id, expiraEn: new Date(Date.now() + DURACION_SESION * 1000) } });
    const respuesta = NextResponse.json({ destino: destinoPorRol(usuario.role) });
    const esHttps = solicitud.headers.get('x-forwarded-proto') === 'https' ||
                    solicitud.nextUrl.protocol === 'https:' ||
                    usarCookieSegura(process.env.APP_URL, process.env.NODE_ENV);
    respuesta.cookies.set(NOMBRE_COOKIE, token, opcionesCookie(esHttps));
    respuesta.headers.set('Cache-Control', 'no-store');
    return respuesta;
  } catch (error) {
    const credencialesInvalidas = error instanceof Error && error.message === 'Credenciales inválidas';
    return NextResponse.json({ error: credencialesInvalidas ? 'Credenciales inválidas' : 'No pudimos iniciar sesión. Inténtalo más tarde.' }, { status: credencialesInvalidas ? 401 : 503 });
  }
}
