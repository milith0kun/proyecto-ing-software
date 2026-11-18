import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
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

function crearServicioPorDefecto() {
  return crearServicioActivacionCuenta(crearRepositorioActivacionPrisma(), clave => hash(clave, 12));
}

function responderErrorActivacion(error: unknown, mensajeGenerico: string): NextResponse {
  if (error instanceof ErrorActivacionCuenta) {
    return NextResponse.json(
      { ok: false, codigo: error.codigo, error: error.message },
      { status: 400 },
    );
  }
  return NextResponse.json({ ok: false, error: mensajeGenerico }, { status: 503 });
}

/**
 * Controlador HTTP para validar el token de activación (GET /api/auth/activar).
 */
export async function manejarGetActivacion(
  solicitud: NextRequest,
  servicio = crearServicioPorDefecto(),
) {
  const token = solicitud.nextUrl.searchParams.get('token') ?? '';
  try {
    const datos = await servicio.validarToken(token);
    return NextResponse.json({ ok: true, datos }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return responderErrorActivacion(error, 'No pudimos validar el enlace de activación.');
  }
}

/**
 * Controlador HTTP para activar cuenta y emitir sesión persistida + JWT (POST /api/auth/activar).
 */
export async function manejarPostActivacion(
  solicitud: NextRequest,
  servicio = crearServicioPorDefecto(),
) {
  if (!esSolicitudMismoOrigen(solicitud)) {
    return NextResponse.json({ ok: false, error: 'Solicitud no permitida' }, { status: 403 });
  }

  const cuerpo = await solicitud.json().catch(() => null);
  const token = typeof cuerpo?.token === 'string' ? cuerpo.token : '';
  const contrasena = typeof cuerpo?.contrasena === 'string' ? cuerpo.contrasena : '';

  try {
    const resultado = await servicio.activarCuenta({ token, contrasena });

    // CA-04: Iniciar sesión automáticamente con JWT + cookie segura y redirigir a /colaborador
    const expiraEn = new Date(Date.now() + DURACION_SESION * 1000);
    const sesionId = await servicio.registrarSesion(resultado.usuario.id, expiraEn);
    const jwt = await crearToken(resultado.usuario, sesionId, obtenerSecretoAuth());

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

/**
 * Controlador HTTP para solicitar un nuevo enlace por 48 horas (PUT /api/auth/activar).
 */
export async function manejarPutActivacion(
  solicitud: NextRequest,
  servicio = crearServicioPorDefecto(),
) {
  if (!esSolicitudMismoOrigen(solicitud)) {
    return NextResponse.json({ ok: false, error: 'Solicitud no permitida' }, { status: 403 });
  }

  const cuerpo = await solicitud.json().catch(() => null);
  const email = typeof cuerpo?.email === 'string' ? cuerpo.email : '';

  try {
    const origen = solicitud.nextUrl.origin || process.env.APP_URL || 'https://app.cgb.latam';
    await servicio.solicitarNuevoEnlace(email, new Date(), origen);
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
