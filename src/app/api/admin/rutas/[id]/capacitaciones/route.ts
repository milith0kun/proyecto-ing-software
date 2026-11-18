import { NextRequest, NextResponse } from 'next/server';
import { exigirAdministrador } from '@/lib/permisos';
import {
  consultarAsignacionesRuta,
  ErrorAsignacionesRuta,
  reemplazarAsignacionesRuta,
} from '@/lib/servicio-asignaciones-rutas';

type ContextoRuta = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: ContextoRuta) {
  const rechazo = await exigirAdministrador(_request);
  if (rechazo) return rechazo;

  try {
    const { id } = await params;
    const datos = await consultarAsignacionesRuta(id);
    return NextResponse.json({ ok: true, datos }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof ErrorAsignacionesRuta) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ ok: false, error: 'No pudimos consultar las asignaciones.' }, { status: 503 });
  }
}

export async function PUT(request: NextRequest, { params }: ContextoRuta) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const { id } = await params;
    const cuerpo = await request.json().catch(() => null);
    const resultado = await reemplazarAsignacionesRuta(id, cuerpo);
    return NextResponse.json({ ok: true, ...resultado }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof ErrorAsignacionesRuta) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    return NextResponse.json({ ok: false, error: 'No pudimos actualizar las asignaciones.' }, { status: 503 });
  }
}
