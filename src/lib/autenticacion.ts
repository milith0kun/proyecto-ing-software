import { compare, hash } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { z } from 'zod';

export const NOMBRE_COOKIE = 'cgb_sesion';
export const DURACION_SESION = 60 * 60 * 8;
export type RolInterno = 'ADMINISTRADOR' | 'COLABORADOR';
export interface CuentaInterna {
  id: string; email: string; name: string | null; role: string;
  activo: boolean; passwordHash: string | null;
}
export type UsuarioSesion = Pick<CuentaInterna, 'id' | 'email' | 'name'> & { role: RolInterno };
export const credencialesSchema = z.object({
  correo: z.string().trim().toLowerCase().email().max(254),
  contrasena: z.string().min(1).max(256).refine(valor => new TextEncoder().encode(valor).length <= 72),
});
const hashInexistente = hash('cuenta-inexistente-no-utilizable', 12);

export async function autenticar(datos: unknown, buscarCuenta: (correo: string) => Promise<CuentaInterna | null>): Promise<UsuarioSesion> {
  const entrada = credencialesSchema.safeParse(datos);
  if (!entrada.success) throw new Error('Credenciales inválidas');
  const cuenta = await buscarCuenta(entrada.data.correo);
  const coincide = await compare(entrada.data.contrasena, cuenta?.passwordHash || await hashInexistente);
  if (!cuenta || !coincide || !cuenta.activo || !['ADMINISTRADOR', 'COLABORADOR'].includes(cuenta.role)) {
    throw new Error('Credenciales inválidas');
  }
  return { id: cuenta.id, email: cuenta.email, name: cuenta.name, role: cuenta.role as RolInterno };
}

export function obtenerSecretoAuth(): string {
  const secreto = process.env.AUTH_SECRET?.trim();
  if (!secreto || new TextEncoder().encode(secreto).length < 32) {
    throw new Error('AUTH_SECRET debe configurarse con al menos 32 bytes');
  }
  return secreto;
}

function claveFirma(secreto: string) {
  if (new TextEncoder().encode(secreto).length < 32) throw new Error('AUTH_SECRET requiere al menos 32 bytes');
  return new TextEncoder().encode(secreto);
}

export async function crearToken(usuario: { id: string; role: string }, sesionId: string, secreto: string, duracion = DURACION_SESION) {
  const ahora = Math.floor(Date.now() / 1000);
  return new SignJWT({ rol: usuario.role, sid: sesionId })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' }).setSubject(usuario.id)
    .setIssuer('cgb-academy').setAudience('cgb-interno').setIssuedAt(ahora)
    .setExpirationTime(ahora + duracion).sign(claveFirma(secreto));
}

export async function verificarToken(token: string | undefined, secreto: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, claveFirma(secreto), {
      algorithms: ['HS256'], issuer: 'cgb-academy', audience: 'cgb-interno',
    });
    if (!payload.sub || typeof payload.sid !== 'string' || !['ADMINISTRADOR', 'COLABORADOR'].includes(String(payload.rol))) return null;
    return payload as typeof payload & { sub: string; sid: string; rol: RolInterno };
  } catch { return null; }
}

export function destinoPorRol(rol: string) {
  return rol === 'ADMINISTRADOR' ? '/admin/capacitaciones' : '/colaborador';
}

export interface SesionPersistida {
  usuarioId: string;
  expiraEn: Date;
  usuario: CuentaInterna;
}

export async function resolverSesion(
  token: string | undefined,
  secreto: string,
  buscarSesion: (id: string) => Promise<SesionPersistida | null>,
): Promise<UsuarioSesion | null> {
  const contenido = await verificarToken(token, secreto);
  if (!contenido) return null;
  const sesion = await buscarSesion(contenido.sid);
  if (!sesion || sesion.expiraEn <= new Date() || sesion.usuarioId !== contenido.sub) return null;
  const usuario = sesion.usuario;
  if (!usuario.activo || !['ADMINISTRADOR', 'COLABORADOR'].includes(usuario.role)) return null;
  return { id: usuario.id, email: usuario.email, name: usuario.name, role: usuario.role as RolInterno };
}

export function opcionesCookie(produccion: boolean, eliminar = false) {
  return { httpOnly: true, secure: produccion, sameSite: 'lax' as const, path: '/', maxAge: eliminar ? 0 : DURACION_SESION };
}

// Secure sólo cuando la aplicación se sirve por HTTPS: un navegador descarta cookies Secure recibidas por HTTP.
export function usarCookieSegura(appUrl: string | undefined, entorno: string | undefined) {
  if (appUrl) return appUrl.trim().toLowerCase().startsWith('https://');
  return entorno === 'production';
}

export function solicitudMismoOrigen(origen: string | null, url: string, host?: string | null) {
  if (!origen) return false;
  try {
    const destino = new URL(url);
    if (host) destino.host = host;
    return new URL(origen).origin === destino.origin;
  } catch { return false; }
}
