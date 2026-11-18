/**
 * Cliente HTTP dedicado para el Constructor de Rutas de Onboarding (HU-008).
 * Separa la comunicación fetch del estado visual de React.
 */

export interface PasoRutaVista {
  id: string;
  rutaId: string;
  capacitacionId: string;
  orden: number;
  obligatorio: boolean;
  capacitacionTitulo?: string;
}

export interface RutaOnboardingVista {
  id: string;
  titulo: string;
  objetivo: string;
  estado: string;
  areaId: string;
  puestoId: string | null;
  activadaEn: string | null;
  pasos: PasoRutaVista[];
}

export interface CapacitacionCatalogoVista {
  id: string;
  titulo: string;
  unidad: string;
  duracionMin: number | null;
}

export interface AreaConstructorVista {
  id: string;
  nombre: string;
  puestos: Array<{ id: string; nombre: string; areaId: string }>;
}

async function parsearRespuestaRuta(resp: Response, fallbackError: string): Promise<RutaOnboardingVista> {
  const json = await resp.json();
  if (!resp.ok || !json.ok) {
    throw new Error(json.error || fallbackError);
  }
  return json.datos as RutaOnboardingVista;
}

export async function crearRutaCliente(payload: {
  titulo: string;
  objetivo: string;
  areaId: string;
  puestoId: string | null;
}): Promise<RutaOnboardingVista> {
  const resp = await fetch('/api/rutas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parsearRespuestaRuta(resp, 'No se pudo crear la ruta.');
}

export async function guardarSecuenciaCliente(
  rutaId: string,
  capacitacionIds: string[],
): Promise<RutaOnboardingVista> {
  const resp = await fetch(`/api/rutas/${rutaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ capacitacionIds }),
  });
  return parsearRespuestaRuta(resp, 'No se pudo guardar la secuencia.');
}

export async function activarRutaCliente(rutaId: string): Promise<RutaOnboardingVista> {
  const resp = await fetch(`/api/rutas/${rutaId}/activar`, { method: 'POST' });
  return parsearRespuestaRuta(resp, 'No se pudo activar la ruta.');
}
