// Cliente HTTP de navegador para la administración de áreas y puestos (HU-007 / CGB-31).
import type { AreaEstructura } from '@/lib/organizacion';

export interface RespuestaApiOrganizacion<T = unknown> {
  ok: boolean;
  datos?: T;
  error?: string;
  detalles?: Record<string, string>;
}

export async function consultarEstructuraCliente(): Promise<AreaEstructura[]> {
  const respuesta = await fetch('/api/organizacion/areas', { cache: 'no-store' });
  const resultado = (await respuesta.json()) as RespuestaApiOrganizacion<AreaEstructura[]>;
  if (!respuesta.ok || !resultado.ok || !resultado.datos) {
    throw new Error(resultado.error || 'No se pudo cargar la estructura organizacional.');
  }
  return resultado.datos;
}

export async function crearAreaCliente(
  nombre: string
): Promise<RespuestaApiOrganizacion<{ id: string }>> {
  const respuesta = await fetch('/api/organizacion/areas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre }),
  });
  const resultado = (await respuesta.json()) as RespuestaApiOrganizacion<{ id: string }>;
  return { ...resultado, ok: Boolean(respuesta.ok && resultado.ok) };
}

export async function crearPuestoCliente(datos: {
  nombre: string;
  areaId: string;
}): Promise<RespuestaApiOrganizacion<{ id: string }>> {
  const respuesta = await fetch('/api/organizacion/puestos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  const resultado = (await respuesta.json()) as RespuestaApiOrganizacion<{ id: string }>;
  return { ...resultado, ok: Boolean(respuesta.ok && resultado.ok) };
}

export async function cambiarEstadoAreaCliente(
  areaId: string,
  activa: boolean
): Promise<void> {
  const respuesta = await fetch(`/api/organizacion/areas/${areaId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activa }),
  });
  const resultado = (await respuesta.json()) as RespuestaApiOrganizacion;
  if (!respuesta.ok || !resultado.ok) {
    throw new Error(resultado.error || 'No se pudo actualizar el estado del área.');
  }
}
