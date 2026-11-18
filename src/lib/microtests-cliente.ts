// Cliente HTTP de navegador para la configuración de microtests formativos (HU-013 / CGB-61).
import type { ConfiguracionMicrotestNormalizada } from '@/lib/configuracion-microtest';
import type { EvaluacionResumenUI } from '@/lib/servicio-configuracion-microtest';

export interface RespuestaApiMicrotest<T = unknown> {
  ok: boolean;
  datos?: T;
  error?: string;
  detalles?: Record<string, string>;
}

export async function guardarMicrotestCliente(
  datos: ConfiguracionMicrotestNormalizada,
  evaluacionId?: string
): Promise<RespuestaApiMicrotest<EvaluacionResumenUI>> {
  const esEdicion = Boolean(evaluacionId);
  const url = esEdicion ? `/api/microtests/${evaluacionId}` : '/api/microtests';
  const metodo = esEdicion ? 'PUT' : 'POST';

  const respuesta = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  const resultado = (await respuesta.json()) as RespuestaApiMicrotest<EvaluacionResumenUI>;
  return { ...resultado, ok: Boolean(respuesta.ok && resultado.ok) };
}

export async function eliminarMicrotestCliente(
  evaluacionId: string
): Promise<RespuestaApiMicrotest> {
  const respuesta = await fetch(`/api/microtests/${evaluacionId}`, {
    method: 'DELETE',
  });
  const resultado = (await respuesta.json()) as RespuestaApiMicrotest;
  return { ...resultado, ok: Boolean(respuesta.ok && resultado.ok) };
}
