import {
  crearPuestoOrganizacion,
  listarPuestosOrganizacion,
} from '@/lib/servicio-organizacion';

export const dynamic = 'force-dynamic';

export const GET = listarPuestosOrganizacion;
export const POST = crearPuestoOrganizacion;
