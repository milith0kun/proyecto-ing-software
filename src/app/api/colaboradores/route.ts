import { NextRequest, NextResponse } from 'next/server';
import { registrarColaboradorConRuta } from '@/lib/colaboradores';
import { enviarCorreoInvitacion } from '@/lib/correo-invitacion';
import { prisma } from '@/lib/prisma';
import { exigirGestorColaboradores } from '@/lib/permisos';

const ESTADOS_VALIDOS = ['PENDIENTE_ACTIVACION', 'ACTIVO', 'EN_PROGRESO'] as const;

function obtenerCorreo(email: unknown): string {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

function obtenerTexto(valor: unknown): string {
  return typeof valor === 'string' ? valor.trim() : '';
}

export async function GET(request: NextRequest) {
  const rechazo = await exigirGestorColaboradores(request);
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
    const puestos = await prisma.puesto.findMany({
      include: { rutaOnboarding: true },
      orderBy: { nombre: 'asc' },
    });

    return NextResponse.json(
      {
        ok: true,
        total: colaboradores.length,
        puestos: puestos.map(puesto => ({
          id: puesto.id,
          nombre: puesto.nombre,
          rutaActiva: Boolean(puesto.rutaOnboarding?.activa),
        })),
        datos: colaboradores.map((colaborador) => ({
          id: colaborador.id,
          nombre: colaborador.nombre,
          email: colaborador.email,
          dni: colaborador.dni,
          estado: colaborador.estado,
          progreso: colaborador.progreso,
          puesto: colaborador.puesto ? { id: colaborador.puesto.id, nombre: colaborador.puesto.nombre } : null,
          rutaAsignada: colaborador.rutaOnboarding ? { id: colaborador.rutaOnboarding.id, nombre: colaborador.rutaOnboarding.nombre } : null,
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
  const rechazo = await exigirGestorColaboradores(request);
  if (rechazo) return rechazo;

  try {
    const cuerpo = await request.json().catch(() => null);
    const lista: unknown[] = Array.isArray(cuerpo)
      ? cuerpo
      : cuerpo && typeof cuerpo === 'object' && Array.isArray(cuerpo.colaboradores)
        ? cuerpo.colaboradores
        : [cuerpo];
    if (!lista.length || lista.length > 100 || lista.some(elemento => !elemento || typeof elemento !== 'object' || Array.isArray(elemento))) {
      return NextResponse.json({ ok: false, error: 'Envía de 1 a 100 registros válidos.' }, { status: 400 });
    }

    const resultados = [];
    for (const elemento of lista as Record<string, unknown>[]) {
      try {
        resultados.push({ ok: true, datos: await registrarUno(elemento) });
      } catch (error) {
        const mensaje = mensajeSeguroRegistro(error);
        resultados.push({ ok: false, email: obtenerCorreo(elemento.email), error: mensaje });
      }
    }

    const exitosos = resultados.filter(resultado => resultado.ok).length;
    const status = exitosos === resultados.length ? 201 : exitosos ? 207 : 400;
    const respuesta = {
      ok: exitosos === resultados.length,
      mensaje: `${exitosos} de ${resultados.length} colaboradores registrados e invitados.`,
      resultados,
      ...(lista.length === 1 && resultados[0]?.ok ? { datos: resultados[0].datos } : {}),
    };
    return NextResponse.json(respuesta, { status });
  } catch (error) {
    console.error('Error al registrar colaborador:', error);
    return NextResponse.json({ ok: false, error: 'No pudimos registrar al colaborador.' }, { status: 503 });
  }
}

function mensajeSeguroRegistro(error: unknown): string {
  const mensaje = error instanceof Error ? error.message : '';
  const erroresEsperados = [
    'Nombre, correo válido, DNI y puesto son obligatorios.',
    'Ya existe una cuenta registrada con ese correo.',
    'El puesto indicado no existe.',
    'No pudimos enviar la invitación. Verifica la configuración de correo e inténtalo nuevamente.',
  ];
  return erroresEsperados.includes(mensaje) ? mensaje : 'No pudimos registrar al colaborador.';
}

async function registrarUno(cuerpo: Record<string, unknown>) {
  const nombre = obtenerTexto(cuerpo.nombre);
  const email = obtenerCorreo(cuerpo.email);
  const dni = obtenerTexto(cuerpo.dni);
  const puestoId = obtenerTexto(cuerpo.puestoId);

  if (!nombre || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !dni || !puestoId) {
    throw new Error('Nombre, correo válido, DNI y puesto son obligatorios.');
  }
  if (await prisma.colaborador.findUnique({ where: { email } }) || await prisma.user.findUnique({ where: { email } })) {
    throw new Error('Ya existe una cuenta registrada con ese correo.');
  }

  const puesto = await prisma.puesto.findUnique({ where: { id: puestoId }, include: { rutaOnboarding: true } });
  if (!puesto) throw new Error('El puesto indicado no existe.');

  const registro = registrarColaboradorConRuta({
    nombre,
    email,
    dni,
    puestoId: puesto.id,
    puesto: { id: puesto.id, nombre: puesto.nombre, rutaOnboardingId: puesto.rutaOnboardingId },
    ruta: puesto.rutaOnboarding ? {
      id: puesto.rutaOnboarding.id,
      nombre: puesto.rutaOnboarding.nombre,
      descripcion: puesto.rutaOnboarding.descripcion ?? undefined,
      activa: puesto.rutaOnboarding.activa,
    } : null,
    baseUrl: process.env.APP_URL || 'https://app.cgb.latam',
  });

  const rutaAsignadaId = registro.rutaAsignada?.id ?? null;
  const usuario = await prisma.user.create({
    data: { email, name: nombre, role: 'COLABORADOR', activo: false, rutaOnboardingId: rutaAsignadaId },
  });
  try {
    const colaborador = await prisma.colaborador.create({
      data: {
        nombre: registro.nombre,
        email: registro.email,
        dni: registro.dni,
        puestoId: puesto.id,
        estado: 'PENDIENTE_ACTIVACION',
        progreso: registro.progreso,
        rutaOnboardingId: registro.rutaAsignada?.id ?? null,
        userId: usuario.id,
        tokenActivacion: registro.tokenActivacionHash,
        enlaceActivacion: registro.enlaceActivacion,
        tokenExpiraEn: registro.expiraEn,
      },
      include: { puesto: true, rutaOnboarding: true },
    });

    await enviarCorreoInvitacion({ nombre, email, enlaceActivacion: registro.enlaceActivacion });

    return {
      id: colaborador.id,
      nombre: colaborador.nombre,
      email: colaborador.email,
      estado: colaborador.estado,
      progreso: colaborador.progreso,
      puesto: colaborador.puesto ? { id: colaborador.puesto.id, nombre: colaborador.puesto.nombre } : null,
      rutaAsignada: colaborador.rutaOnboarding ? { id: colaborador.rutaOnboarding.id, nombre: colaborador.rutaOnboarding.nombre } : null,
      invitacionEnviada: true,
    };
  } catch (error) {
    await prisma.colaborador.deleteMany({ where: { userId: usuario.id } });
    await prisma.user.deleteMany({ where: { id: usuario.id } });
    throw error instanceof Error && error.message.includes('correo')
      ? error
      : new Error('No pudimos enviar la invitación. Verifica la configuración de correo e inténtalo nuevamente.');
  }
}
