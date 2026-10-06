import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exigirAdministrador } from '@/lib/permisos';
import { prepararPublicacion, ErrorPublicacion } from '@/lib/publicacion';

export async function POST(solicitud: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rechazo = await exigirAdministrador(solicitud);
  if (rechazo) return rechazo;
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) return NextResponse.json({ ok: false, error: 'El identificador de la capacitación no es válido.' }, { status: 400 });
  try {
    const datos = await prisma.$transaction(async transaccion => {
      const capacitacion = await transaccion.capacitacion.findUnique({ where: { id }, include: { slides: true } });
      if (!capacitacion) return null;
      return transaccion.capacitacion.update({ where: { id }, data: prepararPublicacion(capacitacion) });
    });
    if (!datos) return NextResponse.json({ ok: false, error: 'Capacitación no encontrada.' }, { status: 404 });
    return NextResponse.json({ ok: true, mensaje: 'Capacitación publicada correctamente.', datos }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof ErrorPublicacion) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    return NextResponse.json({ ok: false, error: 'No pudimos publicar la capacitación. Inténtalo nuevamente.' }, { status: 503 });
  }
}
