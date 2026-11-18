import { NextResponse } from 'next/server';
import { crearServicioRutasOnboarding, ErrorRutaOnboarding } from './rutas-onboarding';
import { crearRepositorioRutasPrisma } from './rutas-onboarding-prisma';

export function obtenerServicioRutas() {
  return crearServicioRutasOnboarding(crearRepositorioRutasPrisma());
}

export function validarIdRutaHttp(id: string): NextResponse | null {
  if (!/^[a-f\d]{24}$/i.test(id)) {
    return NextResponse.json(
      { ok: false, error: 'El identificador de la ruta no es válido.' },
      { status: 400 },
    );
  }
  return null;
}

export function responderErrorRuta(
  error: unknown,
  mensajeGenerico: string,
  statusDominio = 400,
): NextResponse {
  if (error instanceof ErrorRutaOnboarding) {
    return NextResponse.json(
      { ok: false, error: error.message, ...(error.detalles ? { detalles: error.detalles } : {}) },
      { status: statusDominio },
    );
  }
  return NextResponse.json({ ok: false, error: mensajeGenerico }, { status: 503 });
}
