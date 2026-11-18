import { randomUUID } from 'node:crypto';
import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { esSolicitudMismoOrigen } from '@/lib/origen';
import {
  crearToken,
  DURACION_SESION,
  NOMBRE_COOKIE,
  obtenerSecretoAuth,
  opcionesCookie,
  usarCookieSegura,
} from '@/lib/autenticacion';
import {
  crearServicioActivacionCuenta,
  ErrorActivacionCuenta,
} from '@/lib/activacion-cuenta';
import { crearRepositorioActivacionPrisma } from '@/lib/activacion-cuenta-prisma';

export const dynamic = 'force-dynamic';

const servicioActivacion = () =>
  crearServicioActivacionCuenta(crearRepositorioActivacionPrisma(), clave => hash(clave, 12));

function responderErrorActivacion(error: unknown, mensajeGenerico: string): NextResponse {
  if (error instanceof ErrorActivacionCuenta) {
    return NextResponse.json(
      { ok: false, codigo: error.codigo, error: error.message },
      { status: 400 },
    );
  }
  return NextResponse.json({ ok: false, error: mensajeGenerico }, { status: 503 });
}

export async function GET(solicitud: NextRequest) {
  const token = solicitud.nextUrl.searchParams.get('token') ?? '';
  try {
    const datos = await servicioActivacion().validarToken(token);
    return NextResponse.json({ ok: true, datos }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return responderErrorActivacion(error, 'No pudimos validar el enlace de activación.');
  }
}

export async function POST(solicitud: NextRequest) {
  if (!esSolicitudMismoOrigen(solicitud)) {
    return NextResponse.json({ ok: false, error: 'Solicitud no permitida' }, { status: 403 });
  }

  const cuerpo = await solicitud.json().catch(() => null);
  const token = typeof cuerpo?.token === 'string' ? cuerpo.token : '';
  const contrasena = typeof cuerpo?.contrasena === 'string' ? cuerpo.contrasena : '';

  try {
    const resultado = await servicioActivacion().activarCuenta({ token, contrasena });

    // CA-04: Iniciar sesión automáticamente con JWT + cookie segura y redirigir a /colaborador
    const sesionId = randomUUID();
    const jwt = await crearToken(resultado.usuario, sesionId, obtenerSecretoAuth());
    await prisma.sesion.create({
      data: {
        id: sesionId,
        usuarioId: resultado.usuario.id,
        expiraEn: new Date(Date.now() + DURACION_SESION * 1000),
      },
    });

    const respuesta = NextResponse.json({
      ok: true,
      mensaje: 'Cuenta activada correctamente.',
      redireccion: resultado.redireccion,
    });
    const esHttps =
      solicitud.headers.get('x-forwarded-proto') === 'https' ||
      solicitud.nextUrl.protocol === 'https:' ||
      usarCookieSegura(process.env.APP_URL, process.env.NODE_ENV);
    respuesta.cookies.set(NOMBRE_COOKIE, jwt, opcionesCookie(esHttps));
    respuesta.headers.set('Cache-Control', 'no-store');
    return respuesta;
  } catch (error) {
    return responderErrorActivacion(
      error,
      'No pudimos activar la cuenta. Solicita un nuevo enlace.',
    );
  }
}

export async function PUT(solicitud: NextRequest) {
  if (!esSolicitudMismoOrigen(solicitud)) {
    return NextResponse.json({ ok: false, error: 'Solicitud no permitida' }, { status: 403 });
  }

  const cuerpo = await solicitud.json().catch(() => null);
  const email = typeof cuerpo?.email === 'string' ? cuerpo.email : '';

  try {
    const origen = solicitud.nextUrl.origin || process.env.APP_URL || 'https://app.cgb.latam';
    await servicioActivacion().solicitarNuevoEnlace(email, new Date(), origen);
    return NextResponse.json(
      {
        ok: true,
        mensaje: 'Si la cuenta está pendiente de activación, se generó un nuevo enlace por 48 horas.',
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    return responderErrorActivacion(error, 'No pudimos procesar la solicitud de nuevo enlace.');
  }
}
