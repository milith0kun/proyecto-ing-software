import { NextRequest, NextResponse } from 'next/server';
import { NOMBRE_COOKIE } from '@/lib/autenticacion';
import { construirPanelMiOnboarding } from '@/lib/mi-onboarding';
import { prisma } from '@/lib/prisma';
import { obtenerSesion } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

export async function GET(solicitud: NextRequest) {
  try {
    const usuario = await obtenerSesion(solicitud.cookies.get(NOMBRE_COOKIE)?.value);
    if (!usuario || usuario.role !== 'COLABORADOR') {
      return NextResponse.json({ ok: false, error: 'Debes iniciar sesión como colaborador.' }, {
        status: 401,
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    const colaborador = await prisma.colaborador.findUnique({
      where: { userId: usuario.id },
      select: {
        rutaOnboarding: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            capacitaciones: {
              orderBy: { orden: 'asc' },
              select: {
                orden: true,
                capacitacion: {
                  select: {
                    id: true,
                    titulo: true,
                    descripcion: true,
                    slides: {
                      orderBy: { orden: 'asc' },
                      select: { id: true, orden: true },
                    },
                  },
                },
              },
            },
          },
        },
        progresos: {
          select: { capacitacionId: true, ultimoSlideOrden: true, completada: true },
        },
      },
    });

    const panel = construirPanelMiOnboarding(colaborador?.rutaOnboarding, colaborador?.progresos ?? []);
    return NextResponse.json({ ok: true, ...panel }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ ok: false, error: 'No pudimos consultar tu ruta de onboarding.' }, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}