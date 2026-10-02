import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validarSlide } from '@/lib/validaciones-slide';

export const dynamic = 'force-dynamic';

type ContextoRuta = { params: Promise<{ id: string; slideId: string }> };

export async function PUT(request: NextRequest, { params }: ContextoRuta) {
  try {
    const { id, slideId } = await params;
    if (!/^[a-f\d]{24}$/i.test(id) || !/^[a-f\d]{24}$/i.test(slideId)) {
      return NextResponse.json({ ok: false, error: 'El identificador no es válido.' }, { status: 400 });
    }

    const cuerpo = await request.json().catch(() => null);
    if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) {
      return NextResponse.json({ ok: false, error: 'El cuerpo JSON no es válido.' }, { status: 400 });
    }

    const existente = await prisma.slide.findFirst({ where: { id: slideId, capacitacionId: id } });
    if (!existente) {
      return NextResponse.json({ ok: false, error: 'Slide no encontrado.' }, { status: 404 });
    }

    const datos = {
      titulo: cuerpo.titulo ?? existente.titulo,
      contenido: cuerpo.contenido ?? existente.contenido,
    };
    const { valido, errores } = validarSlide(datos);
    if (!valido) {
      return NextResponse.json({ ok: false, error: 'Revisa los datos del slide.', detalles: errores }, { status: 400 });
    }

    const slide = await prisma.slide.update({
      where: { id: slideId },
      data: { titulo: String(datos.titulo).trim(), contenido: String(datos.contenido).trim() },
    });
    return NextResponse.json({ ok: true, datos: slide });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'No se pudo actualizar el slide.';
    return NextResponse.json({ ok: false, error: mensaje }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: ContextoRuta) {
  try {
    const { id, slideId } = await params;
    if (!/^[a-f\d]{24}$/i.test(id) || !/^[a-f\d]{24}$/i.test(slideId)) {
      return NextResponse.json({ ok: false, error: 'El identificador no es válido.' }, { status: 400 });
    }

    const existente = await prisma.slide.findFirst({ where: { id: slideId, capacitacionId: id }, select: { id: true } });
    if (!existente) {
      return NextResponse.json({ ok: false, error: 'Slide no encontrado.' }, { status: 404 });
    }

    await prisma.slide.delete({ where: { id: slideId } });
    return NextResponse.json({ ok: true, mensaje: 'Slide eliminado.' });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'No se pudo eliminar el slide.';
    return NextResponse.json({ ok: false, error: mensaje }, { status: 500 });
  }
}
