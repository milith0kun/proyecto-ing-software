/**
 * Capa de lógica de negocio (servicio de aplicación) para configurar microtests (HU-013 / CGB-61).
 * Orquesta autorización de administrador, reglas puras (`configuracion-microtest.ts`) y acceso a datos (`repositorio-configuracion-microtest.ts`).
 */
import { NextRequest, NextResponse } from 'next/server';
import { exigirAdministrador } from '@/lib/permisos';
import {
  MENSAJE_MICROTEST_DUPLICADO,
  calcularPesoPorPregunta,
  esObjectIdMicrotestValido,
  puedeModificarMicrotest,
  validarConfiguracionMicrotest,
} from '@/lib/configuracion-microtest';
import {
  actualizarMicrotestEnRepositorio,
  buscarCapacitacionPorId,
  buscarMicrotestPorCapacitacionId,
  buscarMicrotestPorId,
  crearMicrotestEnRepositorio,
  eliminarMicrotestEnRepositorio,
  esErrorUnicidadMicrotestPrisma,
  listarMicrotestsConfigurados,
} from '@/lib/repositorio-configuracion-microtest';

const CABECERAS_NO_CACHE = { 'Cache-Control': 'no-store' };

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

function responderConflicto(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 409 });
}

function responderErrorServidor(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 503 });
}

async function leerObjetoJson(
  request: NextRequest
): Promise<Record<string, unknown> | null> {
  const cuerpo = await request.json().catch(() => null);
  if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) return null;
  return cuerpo as Record<string, unknown>;
}

function enriquecerEvaluacion<
  T extends { preguntas: unknown[]; _count?: { intentos: number } }
>(evaluacion: T) {
  const totalPreguntas = evaluacion.preguntas.length;
  const totalIntentos = evaluacion._count?.intentos ?? 0;
  return {
    ...evaluacion,
    totalPreguntas,
    pesoPorPregunta: calcularPesoPorPregunta(totalPreguntas),
    totalIntentos,
    editable: puedeModificarMicrotest(totalIntentos).permitido,
  };
}

export async function listarMicrotests(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const capacitacionId = request.nextUrl.searchParams.get('capacitacionId')?.trim();
    if (capacitacionId && !esObjectIdMicrotestValido(capacitacionId)) {
      return NextResponse.json(
        { ok: false, error: 'El identificador de la capacitación no es válido.' },
        { status: 400 }
      );
    }

    const evaluaciones = await listarMicrotestsConfigurados(capacitacionId);
    const datos = evaluaciones.map((ev) => enriquecerEvaluacion(ev));

    return NextResponse.json(
      { ok: true, total: datos.length, datos },
      { headers: CABECERAS_NO_CACHE }
    );
  } catch {
    return responderErrorServidor('No pudimos consultar los microtests configurados.');
  }
}

export async function crearMicrotest(request: NextRequest) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  try {
    const cuerpo = await leerObjetoJson(request);
    if (!cuerpo) return responderJsonInvalido();

    const validacion = validarConfiguracionMicrotest(cuerpo);
    if (!validacion.valido || !validacion.datos) {
      return responderDatosInvalidos(validacion.errores);
    }

    const capacitacion = await buscarCapacitacionPorId(validacion.datos.capacitacionId);
    if (!capacitacion) {
      return NextResponse.json(
        { ok: false, error: 'La capacitación seleccionada no existe.' },
        { status: 404 }
      );
    }

    const existente = await buscarMicrotestPorCapacitacionId(
      validacion.datos.capacitacionId
    );
    if (existente) {
      return responderConflicto(MENSAJE_MICROTEST_DUPLICADO);
    }

    const creado = await crearMicrotestEnRepositorio(validacion.datos);
    return NextResponse.json(
      { ok: true, datos: enriquecerEvaluacion(creado) },
      { status: 201 }
    );
  } catch (error) {
    if (esErrorUnicidadMicrotestPrisma(error)) {
      return responderConflicto(MENSAJE_MICROTEST_DUPLICADO);
    }
    return responderErrorServidor(
      'No pudimos registrar el microtest. Inténtalo nuevamente.'
    );
  }
}

export async function obtenerMicrotest(request: NextRequest, id: string) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  if (!esObjectIdMicrotestValido(id)) {
    return NextResponse.json(
      { ok: false, error: 'El identificador del microtest no es válido.' },
      { status: 400 }
    );
  }

  try {
    const evaluacion = await buscarMicrotestPorId(id);
    if (!evaluacion) {
      return NextResponse.json(
        { ok: false, error: 'Microtest no encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { ok: true, datos: enriquecerEvaluacion(evaluacion) },
      { headers: CABECERAS_NO_CACHE }
    );
  } catch {
    return responderErrorServidor('No pudimos obtener el microtest.');
  }
}

export async function actualizarMicrotest(request: NextRequest, id: string) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  if (!esObjectIdMicrotestValido(id)) {
    return NextResponse.json(
      { ok: false, error: 'El identificador del microtest no es válido.' },
      { status: 400 }
    );
  }

  try {
    const existente = await buscarMicrotestPorId(id);
    if (!existente) {
      return NextResponse.json(
        { ok: false, error: 'Microtest no encontrado.' },
        { status: 404 }
      );
    }

    const permisoEdicion = puedeModificarMicrotest(existente._count.intentos);
    if (!permisoEdicion.permitido) {
      return responderConflicto(permisoEdicion.motivo!);
    }

    const cuerpo = await leerObjetoJson(request);
    if (!cuerpo) return responderJsonInvalido();

    const validacion = validarConfiguracionMicrotest({
      ...cuerpo,
      capacitacionId: cuerpo.capacitacionId ?? existente.capacitacionId,
    });
    if (!validacion.valido || !validacion.datos) {
      return responderDatosInvalidos(validacion.errores);
    }

    if (validacion.datos.capacitacionId !== existente.capacitacionId) {
      return responderDatosInvalidos({
        capacitacionId: 'No se puede cambiar la capacitación asociada al microtest.',
      });
    }

    const actualizado = await actualizarMicrotestEnRepositorio(id, {
      titulo: validacion.datos.titulo,
      notaMinima: validacion.datos.notaMinima,
      maxIntentos: validacion.datos.maxIntentos,
      tiempoLimiteSeg: validacion.datos.tiempoLimiteSeg,
      preguntas: validacion.datos.preguntas,
    });

    return NextResponse.json({
      ok: true,
      datos: enriquecerEvaluacion(actualizado),
    });
  } catch {
    return responderErrorServidor(
      'No pudimos actualizar el microtest. Inténtalo nuevamente.'
    );
  }
}

export async function eliminarMicrotest(request: NextRequest, id: string) {
  const rechazo = await exigirAdministrador(request);
  if (rechazo) return rechazo;

  if (!esObjectIdMicrotestValido(id)) {
    return NextResponse.json(
      { ok: false, error: 'El identificador del microtest no es válido.' },
      { status: 400 }
    );
  }

  try {
    const existente = await buscarMicrotestPorId(id);
    if (!existente) {
      return NextResponse.json(
        { ok: false, error: 'Microtest no encontrado.' },
        { status: 404 }
      );
    }

    const permisoEliminacion = puedeModificarMicrotest(existente._count.intentos);
    if (!permisoEliminacion.permitido) {
      return responderConflicto(permisoEliminacion.motivo!);
    }

    await eliminarMicrotestEnRepositorio(id);
    return NextResponse.json({
      ok: true,
      mensaje: 'Microtest eliminado correctamente.',
    });
  } catch {
    return responderErrorServidor(
      'No pudimos eliminar el microtest. Inténtalo nuevamente.'
    );
  }
}
