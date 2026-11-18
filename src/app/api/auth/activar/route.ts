import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { hashTokenActivacion } from '@/lib/colaboradores';
import { esSolicitudMismoOrigen } from '@/lib/origen';
import { prisma } from '@/lib/prisma';

export async function POST(solicitud: NextRequest) {
  if (!esSolicitudMismoOrigen(solicitud)) {
    return NextResponse.json({ error: 'Solicitud no permitida' }, { status: 403 });
  }

  const cuerpo = await solicitud.json().catch(() => null);
  const token = typeof cuerpo?.token === 'string' ? cuerpo.token.trim() : '';
  const contrasena = typeof cuerpo?.contrasena === 'string' ? cuerpo.contrasena : '';
  if (!token || contrasena.length < 12 || new TextEncoder().encode(contrasena).length > 72) {
    return NextResponse.json({ error: 'El enlace o la contraseña no son válidos.' }, { status: 400 });
  }

  try {
    const colaborador = await prisma.colaborador.findFirst({
      where: { tokenActivacion: hashTokenActivacion(token), tokenExpiraEn: { gt: new Date() } },
      include: { user: true },
    });
    if (!colaborador?.user || !colaborador.userId || colaborador.user.activo) {
      return NextResponse.json({ error: 'El enlace de activación no es válido o ya venció.' }, { status: 400 });
    }

    const userId = colaborador.userId;
    const passwordHash = await hash(contrasena, 12);
    await prisma.$transaction(async transaccion => {
      const consumo = await transaccion.colaborador.updateMany({
        where: {
          id: colaborador.id,
          userId,
          tokenActivacion: hashTokenActivacion(token),
          tokenExpiraEn: { gt: new Date() },
        },
        data: {
          estado: 'ACTIVO',
          tokenActivacion: null,
          tokenExpiraEn: null,
        },
      });
      if (consumo.count !== 1) throw new Error('INVITACION_NO_DISPONIBLE');
      await transaccion.user.update({
        where: { id: userId },
        data: { passwordHash, activo: true },
      });
    });

    const respuesta = NextResponse.json({ ok: true, mensaje: 'Cuenta activada. Ya puedes iniciar sesión.' });
    respuesta.headers.set('Cache-Control', 'no-store');
    return respuesta;
  } catch (error) {
    if (error instanceof Error && error.message === 'INVITACION_NO_DISPONIBLE') {
      return NextResponse.json({ error: 'El enlace de activación no es válido o ya venció.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'No pudimos activar la cuenta. Solicita una nueva invitación.' }, { status: 503 });
  }
}