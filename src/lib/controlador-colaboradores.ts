import { NextRequest, NextResponse } from 'next/server';
import { exigirGestorColaboradores } from '@/lib/permisos';
import { ESTADOS_COLABORADOR_VALIDOS, listarColaboradores, registrarColaborador } from '@/lib/servicio-colaboradores';

export async function GETColaboradores(solicitud: NextRequest) {
  const rechazo = await exigirGestorColaboradores(solicitud);
  if (rechazo) return rechazo;
  try {
    const estado = solicitud.nextUrl.searchParams.get('estado') ?? undefined;
    const rutaId = solicitud.nextUrl.searchParams.get('rutaId') ?? undefined;
    const estadoSeguro = estado && ESTADOS_COLABORADOR_VALIDOS.includes(estado as typeof ESTADOS_COLABORADOR_VALIDOS[number]) ? estado : undefined;
    return NextResponse.json({ ok: true, ...(await listarColaboradores({ estado: estadoSeguro, rutaId })) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ ok: false, error: 'No pudimos obtener los colaboradores.' }, { status: 503 });
  }
}

export async function POSTColaboradores(solicitud: NextRequest) {
  const rechazo = await exigirGestorColaboradores(solicitud);
  if (rechazo) return rechazo;
  try {
    const cuerpo = await solicitud.json().catch(() => null);
    const lista = Array.isArray(cuerpo)
      ? cuerpo
      : cuerpo && typeof cuerpo === 'object' && Array.isArray(cuerpo.colaboradores)
        ? cuerpo.colaboradores
        : [cuerpo];
    if (!lista.length || lista.length > 100 || lista.some((item: unknown) => !item || typeof item !== 'object' || Array.isArray(item))) {
      return NextResponse.json({ ok: false, error: 'Envía de 1 a 100 registros válidos.' }, { status: 400 });
    }

    const resultados: Array<{ ok: true; datos: unknown } | { ok: false; email: string; error: string }> = [];
    for (const item of lista as Record<string, unknown>[]) {
      try {
        resultados.push({ ok: true, datos: await registrarColaborador(item) });
      } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'No pudimos registrar al colaborador.';
        const seguros = ['Nombre, correo válido y puesto son obligatorios.', 'Ya existe una cuenta registrada con ese correo.', 'El puesto indicado no existe.', 'No pudimos enviar la invitación. Verifica la configuración de correo e inténtalo nuevamente.'];
        resultados.push({ ok: false, email: typeof item.email === 'string' ? item.email.trim().toLowerCase() : '', error: seguros.includes(mensaje) ? mensaje : 'No pudimos registrar al colaborador.' });
      }
    }
    const exitosos = resultados.filter(item => item.ok).length;
    const status = exitosos === resultados.length ? 201 : exitosos ? 207 : 400;
    return NextResponse.json({
      ok: exitosos === resultados.length,
      mensaje: `${exitosos} de ${resultados.length} colaboradores registrados e invitados.`,
      resultados,
      ...(lista.length === 1 && resultados[0]?.ok ? { datos: resultados[0].datos } : {}),
    }, { status });
  } catch {
    return NextResponse.json({ ok: false, error: 'No pudimos registrar al colaborador.' }, { status: 503 });
  }
}
