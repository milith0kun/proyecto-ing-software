import {
  crearAreaOrganizacion,
  listarAreasOrganizacion,
} from '@/lib/servicio-organizacion';

export const dynamic = 'force-dynamic';

export const GET = listarAreasOrganizacion;
export const POST = crearAreaOrganizacion;
