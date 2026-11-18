// Servicio de aplicación para la estructura organizacional (HU-007 / CGB-31).
// Orquesta autenticación, reglas puras (`organizacion.ts`) y acceso a datos (`repositorio-organizacion.ts`).
import { NextRequest, NextResponse } from 'next/server';
import { exigirAdministrador } from '@/lib/permisos';
import {
  MENSAJE_AREA_CON_PUESTOS,
  MENSAJE_AREA_INACTIVA,
  MENSAJE_DUPLICADO,
  esObjectIdOrganizacionValido,
  existeNombreDuplicado,
  puedeAgregarPuestoAArea,
  puedeEliminarArea,
  validarArea,
  validarPuesto,
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
  obtenerEstructuraOrganizacional,
} from '@/lib/repositorio-organizacion';

const SIN_CACHE = { 'Cache-Control': 'no-store' };

type ContextoId = { params: Promise<{ id: string }> };

function responderJsonInvalido() {
  return NextResponse.json(
    { ok: false, error: 'El cuerpo de la solicitud debe ser un objeto JSON válido.' },
    { status: 400 }
  );
}

function responderDatosInvalidos(detalles: Record<string, string>) {
  return NextResponse.json(
    { ok: false, error: 'Datos inválidos.', detalles },
    { status: 400 }
  );
}

function responderDuplicado() {
  return NextResponse.json(
    { ok: false, error: MENSAJE_DUPLICADO, detalles: { nombre: MENSAJE_DUPLICADO } },
    { status: 409 }
  );
}

function responderErrorServidor(error: unknown, mensaje: string) {
  if (esErrorUnicidadPrisma(error)) return responderDuplicado();
  return NextResponse.json({ ok: false, error: mensaje }, { status: 503 });
}

async function leerObjetoJson(request: NextRequest): Promise<Record<string, unknown> | null> {
  const cuerpo = await request.json().catch(() => null);
  if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) return null;
  return cuerpo as Record<string, unknown>;
}

export async function listarAreasOrganizacion(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const soloActivas = request.nextUrl.searchParams.get('soloActivas') === 'true';
    const datos = await obtenerEstructuraOrganizacional({ soloActivas });

    return NextResponse.json(
      { ok: true, total: datos.length, datos },
      { headers: SIN_CACHE }
    );
  } catch (error) {
    return responderErrorServidor(error, 'No pudimos obtener las áreas organizacionales.');
  }
}

export async function crearAreaOrganizacion(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const cuerpo = await leerObjetoJson(request);
    if (!cuerpo) return responderJsonInvalido();

    const validacion = validarArea(cuerpo);
    if (!validacion.valido || !validacion.datos) {
      return responderDatosInvalidos(validacion.errores);
    }

    const existentes = await listarAreasRepositorio();
    if (existeNombreDuplicado(existentes, validacion.datos.nombre)) {
      return responderDuplicado();
    }

    const creada = await guardarArea({
      nombre: validacion.datos.nombre,
      nombreClave: validacion.datos.nombreClave,
      activa: true,
    });

    return NextResponse.json(
      { ok: true, mensaje: 'Área organizacional creada correctamente.', datos: creada },
      { status: 201 }
    );
  } catch (error) {
    return responderErrorServidor(error, 'No pudimos crear el área organizacional.');
  }
}

export async function actualizarAreaOrganizacion(
  request: NextRequest,
  { params }: ContextoId
) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const { id } = await params;
    if (!esObjectIdOrganizacionValido(id)) {
      return NextResponse.json(
        { ok: false, error: 'El identificador del área no es válido.' },
        { status: 400 }
      );
    }

    const cuerpo = await leerObjetoJson(request);
    if (!cuerpo) return responderJsonInvalido();

    const existente = await buscarAreaPorId(id);
    if (!existente) {
      return NextResponse.json(
        { ok: false, error: 'Área organizacional no encontrada.' },
        { status: 404 }
      );
    }

    const cambios: { nombre?: string; nombreClave?: string; activa?: boolean } = {};

    if (cuerpo.nombre !== undefined) {
      const validacion = validarArea({ nombre: cuerpo.nombre });
      if (!validacion.valido || !validacion.datos) {
        return responderDatosInvalidos(validacion.errores);
      }
      const otras = await listarAreasExceptoId(id);
      if (existeNombreDuplicado(otras, validacion.datos.nombre)) {
        return responderDuplicado();
      }
      cambios.nombre = validacion.datos.nombre;
      cambios.nombreClave = validacion.datos.nombreClave;
    }

    if (cuerpo.activa !== undefined) {
      if (typeof cuerpo.activa !== 'boolean') {
        return NextResponse.json(
          { ok: false, error: 'El estado del área debe ser booleano.' },
          { status: 400 }
        );
      }
      cambios.activa = cuerpo.activa;
    }

    if (Object.keys(cambios).length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Indica al menos un cambio válido para actualizar el área.' },
        { status: 400 }
      );
    }

    const actualizada = await modificarArea(id, cambios);

    return NextResponse.json({
      ok: true,
      mensaje:
        cambios.activa === false
          ? 'Área desactivada correctamente. Sus puestos e historial se conservan.'
          : 'Área organizacional actualizada correctamente.',
      datos: actualizada,
    });
  } catch (error) {
    return responderErrorServidor(error, 'No pudimos actualizar el área organizacional.');
  }
}

export async function eliminarAreaOrganizacion(
  request: NextRequest,
  { params }: ContextoId
) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const { id } = await params;
    if (!esObjectIdOrganizacionValido(id)) {
      return NextResponse.json(
        { ok: false, error: 'El identificador del área no es válido.' },
        { status: 400 }
      );
    }

    const existente = await buscarAreaConConteoPuestos(id);
    if (!existente) {
      return NextResponse.json(
        { ok: false, error: 'Área organizacional no encontrada.' },
        { status: 404 }
      );
    }

    if (!puedeEliminarArea(existente._count.puestos)) {
      return NextResponse.json(
        { ok: false, error: MENSAJE_AREA_CON_PUESTOS },
        { status: 409 }
      );
    }

    await borrarAreaPorId(id);

    return NextResponse.json({
      ok: true,
      mensaje: 'Área eliminada correctamente.',
    });
  } catch (error) {
    return responderErrorServidor(error, 'No pudimos eliminar el área organizacional.');
  }
}

export async function listarPuestosOrganizacion(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const areaId = request.nextUrl.searchParams.get('areaId')?.trim();
    if (areaId && !esObjectIdOrganizacionValido(areaId)) {
      return NextResponse.json(
        { ok: false, error: 'El identificador del área no es válido.' },
        { status: 400 }
      );
    }

    const puestos = await listarPuestosRepositorio(areaId);

    return NextResponse.json(
      { ok: true, total: puestos.length, datos: puestos },
      { headers: SIN_CACHE }
    );
  } catch (error) {
    return responderErrorServidor(error, 'No pudimos obtener los puestos de trabajo.');
  }
}

export async function crearPuestoOrganizacion(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const cuerpo = await leerObjetoJson(request);
    if (!cuerpo) return responderJsonInvalido();

    const validacion = validarPuesto(cuerpo);
    if (!validacion.valido || !validacion.datos) {
      return responderDatosInvalidos(validacion.errores);
    }

    const { nombre, nombreClave, areaId } = validacion.datos;
    if (!esObjectIdOrganizacionValido(areaId)) {
      return NextResponse.json(
        {
          ok: false,
          error: 'El identificador del área no es válido.',
          detalles: { areaId: 'Selecciona un área válida' },
        },
        { status: 400 }
      );
    }

    const area = await buscarAreaPorId(areaId);
    if (!area) {
      return NextResponse.json(
        { ok: false, error: 'El área seleccionada no existe.' },
        { status: 404 }
      );
    }

    if (!puedeAgregarPuestoAArea(area)) {
      return NextResponse.json(
        { ok: false, error: MENSAJE_AREA_INACTIVA },
        { status: 409 }
      );
    }

    const puestosDelArea = await listarPuestosBasicos(areaId);
    if (existeNombreDuplicado(puestosDelArea, nombre, areaId)) {
      return responderDuplicado();
    }

    const creado = await guardarPuesto({ nombre, nombreClave, areaId });

    return NextResponse.json(
      { ok: true, mensaje: 'Puesto de trabajo creado correctamente.', datos: creado },
      { status: 201 }
    );
  } catch (error) {
    return responderErrorServidor(error, 'No pudimos crear el puesto de trabajo.');
  }
}
