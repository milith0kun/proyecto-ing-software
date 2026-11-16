import { NextRequest, NextResponse } from 'next/server';
import { NOMBRE_COOKIE } from '@/lib/autenticacion';
import { prisma } from '@/lib/prisma';
import { obtenerSesion } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

export async function PUT(solicitud: NextRequest) {
  try {
    const usuario = await obtenerSesion(solicitud.cookies.get(NOMBRE_COOKIE)?.value);
    if (!usuario || usuario.role !== 'COLABORADOR') {
      return NextResponse.json({ ok: false, error: 'Debes iniciar sesión como colaborador.' }, {
        status: 401,
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    const body = await solicitud.json().catch(() => null);
    const capacitacionId = typeof body?.capacitacionId === 'string' ? body.capacitacionId : '';
    const slideOrden = Number(body?.slideOrden);
    if (!/^[a-f\d]{24}$/i.test(capacitacionId) || !Number.isInteger(slideOrden) || slideOrden < 1) {
      return NextResponse.json({ ok: false, error: 'El punto de avance no es válido.' }, {
        status: 400,
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    const colaborador = await prisma.colaborador.findUnique({
      where: { userId: usuario.id },
      select: {
        id: true,
        rutaOnboarding: {
          select: {
            capacitaciones: {
              where: { capacitacionId },
              select: {
                capacitacion: {
                  select: { id: true, slides: { select: { orden: true } } },
                },
              },
            },
          },
        },
      },
    });
    const asignacion = colaborador?.rutaOnboarding?.capacitaciones[0];
    if (!colaborador || !asignacion) {
      return NextResponse.json({ ok: false, error: 'Esta capacitación no pertenece a tu ruta.' }, {
        status: 404,
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    const totalSlides = asignacion.capacitacion.slides.length;
    if (slideOrden > totalSlides) {
      return NextResponse.json({ ok: false, error: 'La diapositiva indicada no existe.' }, {
        status: 400,
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    const completada = slideOrden === totalSlides;
    await prisma.progresoCapacitacion.upsert({
      where: { colaboradorId_capacitacionId: { colaboradorId: colaborador.id, capacitacionId } },
      create: {
        colaboradorId: colaborador.id,
        capacitacionId,
        ultimoSlideOrden: slideOrden,
        completada,
        completadaEn: completada ? new Date() : null,
      },
      update: {
        ultimoSlideOrden: slideOrden,
        completada,
        completadaEn: completada ? new Date() : null,
      },
    });

    return NextResponse.json({ ok: true, slideOrden, completada }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ ok: false, error: 'No pudimos guardar tu avance.' }, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}