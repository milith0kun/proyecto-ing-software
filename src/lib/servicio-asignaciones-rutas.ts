import {
  buscarCapacitacionesPublicadas,
  buscarRutaAsignaciones,
  listarCapacitacionesPublicadas,
  listarPasosRuta,
  listarRutasAdministracion,
  reemplazarPasosRuta,
} from '@/lib/repositorio-asignaciones-rutas';

const ID_VALIDO = /^[a-f\d]{24}$/i;

export class ErrorAsignacionesRuta extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message);
    this.name = 'ErrorAsignacionesRuta';
  }
}

export async function listarRutasParaAdministracion() {
  const rutas = await listarRutasAdministracion();
  return rutas.map(ruta => ({
    id: ruta.id,
    nombre: ruta.nombre ?? 'Ruta sin nombre',
    descripcion: ruta.descripcion ?? ruta.objetivo,
    activa: ruta.activa ?? ruta.estado === 'ACTIVA',
    totalCapacitaciones: ruta._count.pasos,
    totalColaboradores: ruta._count.usuarios,
  }));
}

export async function consultarAsignacionesRuta(id: string) {
  exigirIdRuta(id);
  const ruta = await buscarRutaAsignaciones(id);
  if (!ruta) throw new ErrorAsignacionesRuta('Ruta no encontrada.', 404);

  const [asignadas, disponibles] = await Promise.all([
    listarPasosRuta(id),
    listarCapacitacionesPublicadas(),
  ]);
  const idsAsignados = new Set(asignadas.map(item => item.capacitacion.id));

  return {
    ruta,
    asignadas: asignadas.map(item => ({ ...item.capacitacion, orden: item.orden })),
    disponibles: disponibles
      .filter(item => !idsAsignados.has(item.id))
      .map(item => ({ ...item, orden: null })),
  };
}

export async function reemplazarAsignacionesRuta(id: string, cuerpo: unknown) {
  exigirIdRuta(id);
  const ruta = await buscarRutaAsignaciones(id);
  if (!ruta) throw new ErrorAsignacionesRuta('Ruta no encontrada.', 404);

  const solicitudes = cuerpo && typeof cuerpo === 'object' && !Array.isArray(cuerpo)
    ? (cuerpo as { capacitaciones?: unknown }).capacitaciones
    : null;
  if (!Array.isArray(solicitudes) || solicitudes.length > 100) {
    throw new ErrorAsignacionesRuta('Debes enviar una lista válida de hasta 100 capacitaciones.');
  }

  const asignaciones = solicitudes.map((item: unknown) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
    const dato = item as { id?: unknown; orden?: unknown };
    const orden = Number(dato.orden);
    return typeof dato.id === 'string' && ID_VALIDO.test(dato.id) && Number.isInteger(orden) && orden >= 1
      ? { capacitacionId: dato.id, orden }
      : null;
  });
  if (asignaciones.some(asignacion => asignacion === null)) {
    throw new ErrorAsignacionesRuta('Cada asignación debe tener ID válido y orden positivo.');
  }

  const asignacionesValidas = asignaciones as Array<{ capacitacionId: string; orden: number }>;
  const ids = asignacionesValidas.map(asignacion => asignacion.capacitacionId);
  if (new Set(ids).size !== ids.length) {
    throw new ErrorAsignacionesRuta('Una capacitación no puede asignarse dos veces.');
  }
  const ordenes = asignacionesValidas.map(asignacion => asignacion.orden).sort((a, b) => a - b);
  if (ordenes.some((orden, indice) => orden !== indice + 1)) {
    throw new ErrorAsignacionesRuta('El orden debe ser consecutivo desde 1.');
  }

  const existentes = await buscarCapacitacionesPublicadas(ids);
  if (existentes.length !== ids.length) {
    throw new ErrorAsignacionesRuta('Todas las capacitaciones deben existir y estar publicadas.');
  }

  await reemplazarPasosRuta(id, asignacionesValidas);
  return { mensaje: 'Asignaciones de la ruta actualizadas.', total: asignacionesValidas.length };
}

function exigirIdRuta(id: string) {
  if (!ID_VALIDO.test(id)) throw new ErrorAsignacionesRuta('Ruta no válida.');
}