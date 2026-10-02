import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { crearSlide, reordenarSlides } from '@/lib/slides';

export const dynamic = 'force-dynamic';

type ContextoRuta = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: ContextoRuta) {
  try {
    const { id } = await params;
    const capacitacion = await prisma.capacitacion.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!capacitacion) {
      return NextResponse.json({ ok: false, error: 'Capacitación no encontrada.' }, { status: 404 });
    }

    const slides = await prisma.slide.findMany({
      where: { capacitacionId: id },
      orderBy: { orden: 'asc' },
    });

    return NextResponse.json({ ok: true, total: slides.length, datos: slides });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Error al obtener los slides.';
    return NextResponse.json({ ok: false, error: mensaje }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: ContextoRuta) {
  try {
    const { id } = await params;
    const cuerpo = await request.json();

    if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) {
      return NextResponse.json({ ok: false, error: 'El cuerpo debe ser un objeto JSON.' }, { status: 400 });
    }

    const capacitacion = await prisma.capacitacion.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!capacitacion) {
      return NextResponse.json({ ok: false, error: 'Capacitación no encontrada.' }, { status: 404 });
    }

    const ultimoSlide = await prisma.slide.findFirst({
      where: { capacitacionId: id },
      orderBy: { orden: 'desc' },
      select: { orden: true },
    });
    const resultado = crearSlide({
      ...cuerpo,
      capacitacionId: id,
      orden: (ultimoSlide?.orden ?? 0) + 1,
    });

    if (!resultado.valido) {
      return NextResponse.json(
        { ok: false, error: 'Datos inválidos.', detalles: resultado.errores },
        { status: 400 }
      );
    }

    const slide = await prisma.slide.create({
      data: {
        capacitacionId: id,
        orden: resultado.slide.orden,
        titulo: resultado.slide.titulo,
        contenido: resultado.slide.contenido,
        tipo: resultado.slide.tipo,
        imagenUrl: resultado.slide.imagenUrl ?? null,
        botonTexto: resultado.slide.botonTexto ?? null,
        botonUrl: resultado.slide.botonUrl ?? null,
        lista: resultado.slide.lista,
      },
    });

    return NextResponse.json(
      { ok: true, mensaje: 'Slide creado correctamente.', datos: slide },
      { status: 201 }
    );
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Error al crear el slide.';
    return NextResponse.json({ ok: false, error: mensaje }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: ContextoRuta) {
  try {
    const { id } = await params;
    const cuerpo = await request.json();

    if (
      !cuerpo ||
      typeof cuerpo !== 'object' ||
      Array.isArray(cuerpo) ||
      typeof cuerpo.slideId !== 'string' ||
      !cuerpo.slideId.trim() ||
      !Number.isInteger(cuerpo.orden) ||
      cuerpo.orden < 1
    ) {
      return NextResponse.json(
        { ok: false, error: 'Se requiere slideId y un orden entero mayor que cero.' },
        { status: 400 }
      );
    }

    const slides = await prisma.slide.findMany({
      where: { capacitacionId: id },
      orderBy: { orden: 'asc' },
    });

    if (!slides.some((slide) => slide.id === cuerpo.slideId)) {
      return NextResponse.json({ ok: false, error: 'Slide no encontrado.' }, { status: 404 });
    }

    const slidesReordenados = reordenarSlides(slides, cuerpo.slideId, cuerpo.orden);
    await prisma.$transaction(
      slidesReordenados.map((slide) =>
        prisma.slide.update({ where: { id: slide.id }, data: { orden: slide.orden } })
      )
    );

    return NextResponse.json({
      ok: true,
      mensaje: 'Slides reordenados correctamente.',
      datos: slidesReordenados,
    });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : 'Error al reordenar los slides.';
    return NextResponse.json({ ok: false, error: mensaje }, { status: 500 });
  }
}