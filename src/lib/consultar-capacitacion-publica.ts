import { capacitacionDisponible } from './visor-capacitacion';

interface FiltrosCapacitacionPublica {
  id: string;
  estado: 'PUBLICADA';
  ambito: 'PUBLICO';
}

interface EstadoCapacitacion {
  estado: string;
  ambito: string;
}

// Centraliza el ID válido y el filtro público antes de consultar el repositorio.
export async function consultarCapacitacionPublica<T extends EstadoCapacitacion>(
  id: string,
  buscar: (filtros: FiltrosCapacitacionPublica) => Promise<T | null>,
): Promise<T | null> {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;

  const capacitacion = await buscar({ id, estado: 'PUBLICADA', ambito: 'PUBLICO' });
  return capacitacionDisponible(capacitacion) ? capacitacion : null;
}