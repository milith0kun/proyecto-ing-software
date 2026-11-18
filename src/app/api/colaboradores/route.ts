import { NextRequest } from 'next/server';
import { GETColaboradores, POSTColaboradores } from '@/lib/controlador-colaboradores';

export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  return GETColaboradores(request);
}

export function POST(request: NextRequest) {
  return POSTColaboradores(request);
}
