import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validarSlide } from '@/lib/slides';

export const dynamic = 'force-dynamic';

type ContextoRuta = { params: Promise<{ id: string; slideId: string }> };

export async function PUT(request: NextRequest, { params }: ContextoRuta) {
  try {
    const { id, slideId } = await params;
    const cuerpo = await request.json();

    if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) {
      return NextResponse.json({ ok: false, error: 'El cuerpo debe ser un objeto JSON.' }, { status: 400 });
    }

    const existente = await prisma.slide.findFirst({
      where: { id: slideId, capacitacionId: id },
    });

    if (!existente) {
      return NextResponse.json({ ok: false, error: 'Slide no encontrado.' }, { status: 404 });
    }

    const datos = {
      capacitacionId: id,
      titulo: cuerpo.titulo ?? existente.titulo,
      contenido: cuerpo.contenido ?? existente.contenido,
      tipo: cuerpo.tipo ?? existente.tipo,
      imagenUrl: cuerpo.imagenUrl ?? existente.imagenUrl ?? null,
      botonTexto: cuerpo.botonTexto ?? existente.botonTexto ?? null,
      botonUrl: cuerpo.botonUrl ?? existente.botonUrl ?? null,
      lista: cuerpo.lista ?? existente.lista ?? [],
    };
    const resultado = validarSlide(datos);

    if (!resultado.valido) {
      return NextResponse.json(
        { ok: false, error: 'Datos inválidos.', detalles: resultado.errores },
        { status: 400 }
      );
    }

    const slide = await prisma.slide.update({
      where: { id: slideId },
      data: {
        titulo: datos.titulo.trim(),
        contenido: datos.contenido.trim(),
        tipo: datos.tipo.toUpperCase().trim(),
        imagenUrl: datos.imagenUrl || null,
        botonTexto: datos.botonTexto || null,
        botonUrl: datos.botonUrl || null,
        lista: Array.isArray(datos.lista) ? datos.lista.map((item) => String(item).trim()).filter(Boolean) : [],
      },
    });

    return NextResponse.json({ ok: true, mensaje: 'Slide actualizado correctamente.', datos: slide });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Error al actualizar el slide.';
    return NextResponse.json({ ok: false, error: mensaje }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: ContextoRuta) {
  try {
    const { id, slideId } = await params;
    const slides = await prisma.slide.findMany({
      where: { capacitacionId: id },
      orderBy: { orden: 'asc' },
    });
    const slideAEliminar = slides.find((slide) => slide.id === slideId);

    if (!slideAEliminar) {
      return NextResponse.json({ ok: false, error: 'Slide no encontrado.' }, { status: 404 });
    }

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

    return NextResponse.json({
      ok: true,
      mensaje: 'Slide eliminado y secuencia reajustada correctamente.',
    });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Error al eliminar el slide.';
    return NextResponse.json({ ok: false, error: mensaje }, { status: 500 });
  }
}