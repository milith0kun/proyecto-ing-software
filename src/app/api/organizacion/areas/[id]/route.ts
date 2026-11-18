import {
  actualizarAreaOrganizacion,
  eliminarAreaOrganizacion,
} from '@/lib/servicio-organizacion';

export const dynamic = 'force-dynamic';

export const PATCH = actualizarAreaOrganizacion;
export const DELETE = eliminarAreaOrganizacion;
