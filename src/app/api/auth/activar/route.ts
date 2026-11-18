import type { NextRequest } from 'next/server';
import {
  manejarGetActivacion,
  manejarPostActivacion,
  manejarPutActivacion,
} from '@/lib/activacion-http';

export const dynamic = 'force-dynamic';

export function GET(solicitud: NextRequest) {
  return manejarGetActivacion(solicitud);
}

export function POST(solicitud: NextRequest) {
  return manejarPostActivacion(solicitud);
}

export function PUT(solicitud: NextRequest) {
  return manejarPutActivacion(solicitud);
}
