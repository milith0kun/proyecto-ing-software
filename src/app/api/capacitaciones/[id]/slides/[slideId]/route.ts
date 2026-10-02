import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validarSlide } from '@/lib/slides';
import { exigirAdministrador } from '@/lib/permisos';

export const dynamic = 'force-dynamic';

type ContextoRuta = { params: Promise<{ id: string; slideId: string }> };

export async function PUT(request: NextRequest, { params }: ContextoRuta) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

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
      capacitacionId: id,
      titulo: cuerpo.titulo ?? existente.titulo,
      contenido: cuerpo.contenido ?? existente.contenido,
      tipo: cuerpo.tipo ?? existente.tipo,
    };

    const resultado = validarSlide(datos);
    if (!resultado.valido) {
      return NextResponse.json(
        { ok: false, error: 'Revisa los datos del slide.', detalles: resultado.errores },
        { status: 400 }
      );
    }

    const slide = await prisma.slide.update({
      where: { id: slideId },
      data: {
        titulo: String(datos.titulo).trim(),
        contenido: String(datos.contenido).trim(),
        tipo: String(datos.tipo).toUpperCase().trim(),
      },
    });

    return NextResponse.json({ ok: true, mensaje: 'Slide actualizado correctamente.', datos: slide });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar el slide.';
    return NextResponse.json({ ok: false, error: mensaje }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: ContextoRuta) {
  const rechazo = await exigirAdministrador(_request);
  if (rechazo) return rechazo;

  try {
    const { id, slideId } = await params;
    if (!/^[a-f\d]{24}$/i.test(id) || !/^[a-f\d]{24}$/i.test(slideId)) {
      return NextResponse.json({ ok: false, error: 'El identificador no es válido.' }, { status: 400 });
    }

    const existente = await prisma.slide.findFirst({ where: { id: slideId, capacitacionId: id }, select: { id: true } });
    if (!existente) {
      return NextResponse.json({ ok: false, error: 'Slide no encontrado.' }, { status: 404 });
    }

    const slides = await prisma.slide.findMany({
      where: { capacitacionId: id },
      orderBy: { orden: 'asc' },
    });

    const restantes = slides.filter((slide) => slide.id !== slideId);
    await prisma.$transaction(async (transaccion) => {
      await transaccion.slide.delete({ where: { id: slideId } });
      for (const [indice, slide] of restantes.entries()) {
        await transaccion.slide.update({
          where: { id: slide.id },
          data: { orden: indice + 1 },
        });
      }
    });

    return NextResponse.json({ ok: true, mensaje: 'Slide eliminado y secuencia reajustada correctamente.' });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Error al eliminar el slide.';
    return NextResponse.json({ ok: false, error: mensaje }, { status: 500 });
  }
}
