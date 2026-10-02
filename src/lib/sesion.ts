import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { NOMBRE_COOKIE, resolverSesion, type UsuarioSesion } from './autenticacion.ts';

export async function obtenerSesion(token?: string): Promise<UsuarioSesion | null> {
  return resolverSesion(token, process.env.AUTH_SECRET || '',
    id => prisma.sesion.findUnique({ where: { id }, include: { usuario: true } }));
}

export async function sesionActual() {
  return obtenerSesion((await cookies()).get(NOMBRE_COOKIE)?.value);
}
