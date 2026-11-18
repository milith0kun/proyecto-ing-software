// Servicio de aplicación para la estructura organizacional (HU-007 / CGB-31).
// Orquesta reglas puras (`organizacion.ts`) y acceso a datos (`repositorio-organizacion.ts`) sin acoplamiento a HTTP.
import {
  MENSAJE_AREA_CON_PUESTOS,
  MENSAJE_AREA_INACTIVA,
  MENSAJE_DUPLICADO,
  armarEstructura,
  esObjectIdOrganizacionValido,
  existeNombreDuplicado,
  puedeAgregarPuestoAArea,
  puedeEliminarArea,
  validarArea,
  validarPuesto,
  type AreaEstructura,
} from '@/lib/organizacion';
import {
  borrarAreaPorId,
  buscarAreaConConteoPuestos,
  buscarAreaPorId,
  esErrorUnicidadPrisma,
  guardarArea,
  guardarPuesto,
  listarAreasExceptoId,
  listarAreasRepositorio,
  listarPuestosBasicos,
  listarPuestosRepositorio,
  modificarArea,
} from '@/lib/repositorio-organizacion';

export type { AreaEstructura };

export class ErrorOrganizacion extends Error {
  constructor(
    message: string,
    readonly status: 400 | 404 | 409,
    readonly detalles?: Record<string, string>
  ) {
    super(message);
  }
}

function lanzarDuplicado(): never {
  throw new ErrorOrganizacion(MENSAJE_DUPLICADO, 409, { nombre: MENSAJE_DUPLICADO });
}

/**
 * Obtiene la jerarquía completa de áreas y puestos para administración.
 * El conteo de colaboradores por puesto queda en 0 hasta integrar CGB-41.
 */
export async function obtenerEstructuraOrganizacional(options?: {
  soloActivas?: boolean;
}): Promise<AreaEstructura[]> {
  const [areas, puestos] = await Promise.all([
    listarAreasRepositorio(options),
    listarPuestosBasicos(),
  ]);

  return armarEstructura(areas, puestos, {});
}

export async function registrarAreaOrganizacion(cuerpo: Record<string, unknown>) {
  const validacion = validarArea(cuerpo);
  if (!validacion.valido || !validacion.datos) {
    throw new ErrorOrganizacion('Datos inválidos.', 400, validacion.errores);
  }

  const existentes = await listarAreasRepositorio();
  if (existeNombreDuplicado(existentes, validacion.datos.nombre)) {
    lanzarDuplicado();
  }

  try {
    return await guardarArea({
      nombre: validacion.datos.nombre,
      nombreClave: validacion.datos.nombreClave,
      activa: true,
    });
  } catch (error) {
    if (esErrorUnicidadPrisma(error)) lanzarDuplicado();
    throw error;
  }
}

export async function actualizarAreaEnServicio(
  id: string,
  cuerpo: Record<string, unknown>
) {
  if (!esObjectIdOrganizacionValido(id)) {
    throw new ErrorOrganizacion('El identificador del área no es válido.', 400);
  }

  const existente = await buscarAreaPorId(id);
  if (!existente) {
    throw new ErrorOrganizacion('Área organizacional no encontrada.', 404);
  }

  const cambios: { nombre?: string; nombreClave?: string; activa?: boolean } = {};

  if (cuerpo.nombre !== undefined) {
    const validacion = validarArea({ nombre: cuerpo.nombre });
    if (!validacion.valido || !validacion.datos) {
      throw new ErrorOrganizacion('Datos inválidos.', 400, validacion.errores);
    }
    const otras = await listarAreasExceptoId(id);
    if (existeNombreDuplicado(otras, validacion.datos.nombre)) {
      lanzarDuplicado();
    }
    cambios.nombre = validacion.datos.nombre;
    cambios.nombreClave = validacion.datos.nombreClave;
  }

  if (cuerpo.activa !== undefined) {
    if (typeof cuerpo.activa !== 'boolean') {
      throw new ErrorOrganizacion('El estado del área debe ser booleano.', 400);
    }
    cambios.activa = cuerpo.activa;
  }

  if (Object.keys(cambios).length === 0) {
    throw new ErrorOrganizacion(
      'Indica al menos un cambio válido para actualizar el área.',
      400
    );
  }

  try {
    const actualizada = await modificarArea(id, cambios);
    const mensaje =
      cambios.activa === false
        ? 'Área desactivada correctamente. Sus puestos e historial se conservan.'
        : 'Área organizacional actualizada correctamente.';
    return { datos: actualizada, mensaje };
  } catch (error) {
    if (esErrorUnicidadPrisma(error)) lanzarDuplicado();
    throw error;
  }
}

export async function eliminarAreaEnServicio(id: string) {
  if (!esObjectIdOrganizacionValido(id)) {
    throw new ErrorOrganizacion('El identificador del área no es válido.', 400);
  }

  const existente = await buscarAreaConConteoPuestos(id);
  if (!existente) {
    throw new ErrorOrganizacion('Área organizacional no encontrada.', 404);
  }

  if (!puedeEliminarArea(existente._count.puestos)) {
    throw new ErrorOrganizacion(MENSAJE_AREA_CON_PUESTOS, 409);
  }

  await borrarAreaPorId(id);
  return { mensaje: 'Área eliminada correctamente.' };
}

export async function listarPuestosEnServicio(areaId?: string) {
  if (areaId && !esObjectIdOrganizacionValido(areaId)) {
    throw new ErrorOrganizacion('El identificador del área no es válido.', 400);
  }
  return listarPuestosRepositorio(areaId);
}

export async function registrarPuestoOrganizacion(cuerpo: Record<string, unknown>) {
  const validacion = validarPuesto(cuerpo);
  if (!validacion.valido || !validacion.datos) {
    throw new ErrorOrganizacion('Datos inválidos.', 400, validacion.errores);
  }

  const { nombre, nombreClave, areaId } = validacion.datos;
  if (!esObjectIdOrganizacionValido(areaId)) {
    throw new ErrorOrganizacion('El identificador del área no es válido.', 400, {
      areaId: 'Selecciona un área válida',
    });
  }

  const area = await buscarAreaPorId(areaId);
  if (!area) {
    throw new ErrorOrganizacion('El área seleccionada no existe.', 404);
  }

  if (!puedeAgregarPuestoAArea(area)) {
    throw new ErrorOrganizacion(MENSAJE_AREA_INACTIVA, 409);
  }

  const puestosDelArea = await listarPuestosBasicos(areaId);
  if (existeNombreDuplicado(puestosDelArea, nombre, areaId)) {
    lanzarDuplicado();
  }

  try {
    return await guardarPuesto({ nombre, nombreClave, areaId });
  } catch (error) {
    if (esErrorUnicidadPrisma(error)) lanzarDuplicado();
    throw error;
  }
}
