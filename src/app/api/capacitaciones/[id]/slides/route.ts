import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validarSlide } from '@/lib/validaciones-slide';
import { exigirAdministrador } from '@/lib/permisos';

export const dynamic = 'force-dynamic';

type ContextoRuta = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: ContextoRuta) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;
  try {
    const { id } = await params;
    if (!/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json({ ok: false, error: 'El identificador no es válido.' }, { status: 400 });
    }

    const capacitacion = await prisma.capacitacion.findUnique({ where: { id }, select: { id: true } });
    if (!capacitacion) {
      return NextResponse.json({ ok: false, error: 'Capacitación no encontrada.' }, { status: 404 });
    }

    const cuerpo = await request.json().catch(() => null);
    if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) {
      return NextResponse.json({ ok: false, error: 'El cuerpo JSON no es válido.' }, { status: 400 });
    }

    const { valido, errores } = validarSlide(cuerpo);
    if (!valido) {
      return NextResponse.json({ ok: false, error: 'Revisa los datos del slide.', detalles: errores }, { status: 400 });
    }

    const ultimoSlide = await prisma.slide.findFirst({
      where: { capacitacionId: id },
      orderBy: { orden: 'desc' },
      select: { orden: true },
    });

    const slide = await prisma.slide.create({
      data: {
        capacitacionId: id,
        orden: (ultimoSlide?.orden ?? 0) + 1,
        titulo: String(cuerpo.titulo).trim(),
        contenido: String(cuerpo.contenido).trim(),
        tipo: 'INFO',
      },
    });

    return NextResponse.json({ ok: true, datos: slide }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: 'No se pudo guardar el slide.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: ContextoRuta) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;
  try {
    const { id } = await params;
    if (!/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json({ ok: false, error: 'El identificador no es válido.' }, { status: 400 });
    }

    const capacitacion = await prisma.capacitacion.findUnique({ where: { id }, select: { id: true } });
    if (!capacitacion) {
      return NextResponse.json({ ok: false, error: 'Capacitación no encontrada.' }, { status: 404 });
    }

    const cuerpo = await request.json().catch(() => null);
    const orden = cuerpo && typeof cuerpo === 'object' && !Array.isArray(cuerpo) ? cuerpo.orden : null;
    if (!Array.isArray(orden) || orden.some((slideId) => typeof slideId !== 'string')) {
      return NextResponse.json({ ok: false, error: 'La lista de orden no es válida.' }, { status: 400 });
    }

    const slides = await prisma.slide.findMany({
      where: { capacitacionId: id },
      select: { id: true },
    });
    const idsActuales = new Set(slides.map((slide) => slide.id));
    const idsSolicitados = new Set(orden as string[]);
    if (idsSolicitados.size !== orden.length || idsActuales.size !== orden.length ||
        [...idsActuales].some((slideId) => !idsSolicitados.has(slideId))) {
      return NextResponse.json({ ok: false, error: 'La lista debe incluir cada slide de esta capacitación una sola vez.' }, { status: 400 });
    }

    if (orden.length > 0) {
      await prisma.$transaction(
        (orden as string[]).map((slideId, index) =>
          prisma.slide.update({ where: { id: slideId }, data: { orden: index + 1 } })
        )
      );
    }

    return NextResponse.json({ ok: true, mensaje: 'Orden actualizado.' });
  } catch {
    return NextResponse.json({ ok: false, error: 'No se pudo actualizar el orden.' }, { status: 500 });
  }
}
