/**
 * Capa de controlador HTTP para `/api/microtests/[id]` (HU-013 / CGB-61).
 * Delega la lógica de negocio a `servicio-configuracion-microtest.ts`.
 */
import { NextRequest } from 'next/server';
import {
  actualizarMicrotest,
  eliminarMicrotest,
  obtenerMicrotest,
} from '@/lib/servicio-configuracion-microtest';

export const dynamic = 'force-dynamic';

type ContextoRuta = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: ContextoRuta) {
  const { id } = await params;
  return obtenerMicrotest(request, id);
}

export async function PUT(request: NextRequest, { params }: ContextoRuta) {
  const { id } = await params;
  return actualizarMicrotest(request, id);
}

export async function DELETE(request: NextRequest, { params }: ContextoRuta) {
  const { id } = await params;
  return eliminarMicrotest(request, id);
}
