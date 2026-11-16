import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exigirAdministrador } from '@/lib/permisos';
import { registrarColaboradorConRuta } from '@/lib/colaboradores';

const ESTADOS_VALIDOS = ['PENDIENTE_ACTIVACION', 'ACTIVO', 'EN_PROGRESO'] as const;

function obtenerCorreo(email: unknown): string {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function obtenerTexto(valor: unknown): string {
  return typeof valor === 'string' ? valor.trim() : '';
}

export async function GET(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const { searchParams } = request.nextUrl;
    const estado = searchParams.get('estado');
    const rutaId = searchParams.get('rutaId');

    const colaboradores = await prisma.colaborador.findMany({
      where: {
        ...(estado && ESTADOS_VALIDOS.includes(estado as (typeof ESTADOS_VALIDOS)[number]) ? { estado } : {}),
        ...(rutaId ? { rutaOnboardingId: rutaId } : {}),
      },
      include: {
        puesto: true,
        rutaOnboarding: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      {
        ok: true,
        total: colaboradores.length,
        datos: colaboradores.map((colaborador) => ({
          id: colaborador.id,
          nombre: colaborador.nombre,
          email: colaborador.email,
          dni: colaborador.dni,
          estado: colaborador.estado,
          progreso: colaborador.progreso,
          puesto: colaborador.puesto ? { id: colaborador.puesto.id, nombre: colaborador.puesto.nombre } : null,
          rutaAsignada: colaborador.rutaOnboarding ? { id: colaborador.rutaOnboarding.id, nombre: colaborador.rutaOnboarding.nombre } : null,
          enlaceActivacion: colaborador.enlaceActivacion,
          createdAt: colaborador.createdAt,
        })),
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return NextResponse.json({ ok: false, error: 'No pudimos obtener los colaboradores.' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const cuerpo = await request.json().catch(() => null);
    if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) {
      return NextResponse.json({ ok: false, error: 'El cuerpo de la solicitud debe ser un objeto JSON válido.' }, { status: 400 });
    }

    const nombre = obtenerTexto(cuerpo.nombre);
    const email = obtenerCorreo(cuerpo.email);
    const dni = obtenerTexto(cuerpo.dni);
    const puestoId = obtenerTexto(cuerpo.puestoId);

    if (!nombre) {
      return NextResponse.json({ ok: false, error: 'El nombre es obligatorio.' }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'El correo del colaborador no es válido.' }, { status: 400 });
    }
    if (!dni) {
      return NextResponse.json({ ok: false, error: 'El DNI es obligatorio.' }, { status: 400 });
    }
    if (!puestoId) {
      return NextResponse.json({ ok: false, error: 'Debe indicarse un puesto para registrar al colaborador.' }, { status: 400 });
    }

    const existe = await prisma.colaborador.findUnique({ where: { email } });
    if (existe) {
      return NextResponse.json({ ok: false, error: 'Ya existe un colaborador registrado con ese correo.' }, { status: 409 });
    }

    const puesto = await prisma.puesto.findUnique({
      where: { id: puestoId },
      include: { rutaOnboarding: true },
    });

    if (!puesto) {
      return NextResponse.json({ ok: false, error: 'El puesto indicado no existe.' }, { status: 404 });
    }

    const registro = registrarColaboradorConRuta({
      nombre,
      email,
      dni,
      puestoId: puesto.id,
      puesto: {
        id: puesto.id,
        nombre: puesto.nombre,
        rutaOnboardingId: puesto.rutaOnboardingId,
      },
      ruta: puesto.rutaOnboarding
        ? {
            id: puesto.rutaOnboarding.id,
            nombre: puesto.rutaOnboarding.nombre,
            descripcion: puesto.rutaOnboarding.descripcion ?? undefined,
            activa: puesto.rutaOnboarding.activa,
          }
        : null,
      baseUrl: process.env.APP_URL || 'https://app.cgb.latam',
    });

    const colaboradorCreado = await prisma.colaborador.create({
      data: {
        nombre: registro.nombre,
        email: registro.email,
        dni: registro.dni,
        puestoId: puesto.id,
        estado: registro.estado,
        progreso: registro.progreso,
        rutaOnboardingId: registro.rutaAsignada?.id ?? null,
        tokenActivacion: registro.tokenActivacion,
        enlaceActivacion: registro.enlaceActivacion,
      },
      include: {
        puesto: true,
        rutaOnboarding: true,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        mensaje: 'Colaborador registrado correctamente.',
        datos: {
          id: colaboradorCreado.id,
          nombre: colaboradorCreado.nombre,
          email: colaboradorCreado.email,
          dni: colaboradorCreado.dni,
          estado: colaboradorCreado.estado,
          progreso: colaboradorCreado.progreso,
          puesto: colaboradorCreado.puesto ? { id: colaboradorCreado.puesto.id, nombre: colaboradorCreado.puesto.nombre } : null,
          rutaAsignada: colaboradorCreado.rutaOnboarding ? { id: colaboradorCreado.rutaOnboarding.id, nombre: colaboradorCreado.rutaOnboarding.nombre } : null,
          enlaceActivacion: colaboradorCreado.enlaceActivacion,
          tokenActivacion: colaboradorCreado.tokenActivacion,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al registrar colaborador:', error);
    return NextResponse.json({ ok: false, error: 'No pudimos registrar al colaborador.' }, { status: 503 });
  }
}
