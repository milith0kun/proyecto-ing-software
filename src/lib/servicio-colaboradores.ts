import {
  buscarColaboradores,
  buscarPuestoTrabajo,
  crearColaborador,
  crearUsuarioColaborador,
  existeColaboradorPorEmail,
  existeUsuarioPorEmail,
  listarPuestosConRutas,
  revertirRegistroColaborador,
} from '@/lib/repositorio-colaboradores';
import { enviarCorreoInvitacion } from '@/lib/correo-invitacion';
import { construirRegistroColaborador, asignarRutaOnboarding } from '@/lib/colaboradores';
import { crearIdentificadorColaborador, crearInvitacionColaborador } from '@/lib/invitacion-colaborador';

export const ESTADOS_COLABORADOR_VALIDOS = ['PENDIENTE_ACTIVACION', 'ACTIVO', 'EN_PROGRESO'] as const;

export async function listarColaboradores(filtros: { estado?: string; rutaId?: string }) {
  const [colaboradores, puestos] = await Promise.all([buscarColaboradores(filtros), listarPuestosConRutas()]);
  return {
    total: colaboradores.length,
    puestos: puestos.map(puesto => ({
      id: puesto.id,
      nombre: puesto.nombre,
      rutaActiva: puesto.rutas.some(ruta => ruta.estado === 'ACTIVA'),
    })),
    datos: colaboradores.map(colaborador => ({
      id: colaborador.id,
      nombre: colaborador.nombre,
      email: colaborador.email,
      estado: colaborador.estado,
      progreso: colaborador.progreso,
      puesto: colaborador.puesto ? { id: colaborador.puesto.id, nombre: colaborador.puesto.nombre } : null,
      rutaAsignada: colaborador.rutaOnboarding ? { id: colaborador.rutaOnboarding.id, nombre: colaborador.rutaOnboarding.nombre ?? colaborador.rutaOnboarding.titulo ?? 'Ruta de onboarding' } : null,
      createdAt: colaborador.createdAt,
    })),
  };
}

export async function registrarColaborador(cuerpo: Record<string, unknown>) {
  const nombre = typeof cuerpo.nombre === 'string' ? cuerpo.nombre.trim() : '';
  const email = typeof cuerpo.email === 'string' ? cuerpo.email.trim().toLowerCase() : '';
  const puestoId = typeof cuerpo.puestoId === 'string' ? cuerpo.puestoId.trim() : '';

  if (!nombre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !puestoId) {
    throw new Error('Nombre, correo válido y puesto son obligatorios.');
  }
  if (await existeColaboradorPorEmail(email) || await existeUsuarioPorEmail(email)) {
    throw new Error('Ya existe una cuenta registrada con ese correo.');
  }

  const puesto = await buscarPuestoTrabajo(puestoId);
  if (!puesto) throw new Error('El puesto indicado no existe.');
  const rutaActiva = puesto.rutas.find(ruta => ruta.estado === 'ACTIVA') ?? null;
  const registroBase = construirRegistroColaborador({
    id: crearIdentificadorColaborador(),
    nombre,
    email,
    puestoId: puesto.id,
  });
  const registro = asignarRutaOnboarding(
    registroBase,
    { id: puesto.id, nombre: puesto.nombre, rutaOnboardingId: rutaActiva?.id ?? null },
    rutaActiva ? {
      id: rutaActiva.id,
      nombre: rutaActiva.nombre ?? rutaActiva.titulo ?? 'Ruta de onboarding',
      descripcion: rutaActiva.descripcion ?? rutaActiva.objetivo ?? undefined,
      activa: true,
    } : null,
  );
  const invitacion = crearInvitacionColaborador(registro, process.env.APP_URL || 'https://app.cgb.latam');

  const usuario = await crearUsuarioColaborador({ email, name: nombre, role: 'COLABORADOR', activo: false });
  try {
    const colaborador = await crearColaborador({
      nombre: registro.nombre,
      email: registro.email,
      puestoId: puesto.id,
      estado: 'PENDIENTE_ACTIVACION',
      progreso: registro.progreso,
      rutaOnboardingId: registro.rutaAsignada?.id ?? null,
      userId: usuario.id,
      tokenActivacion: invitacion.tokenActivacionHash,
      tokenExpiraEn: invitacion.expiraEn,
    });
    await enviarCorreoInvitacion({ nombre, email, enlaceActivacion: invitacion.enlaceActivacion });
    return {
      id: colaborador.id,
      nombre: colaborador.nombre,
      email: colaborador.email,
      estado: colaborador.estado,
      progreso: colaborador.progreso,
      puesto: colaborador.puesto ? { id: colaborador.puesto.id, nombre: colaborador.puesto.nombre } : null,
      rutaAsignada: colaborador.rutaOnboarding ? { id: colaborador.rutaOnboarding.id, nombre: colaborador.rutaOnboarding.nombre } : null,
      invitacionEnviada: true,
    };
  } catch (error) {
    await revertirRegistroColaborador(usuario.id);
    throw error instanceof Error && error.message.includes('correo')
      ? error
      : new Error('No pudimos enviar la invitación. Verifica la configuración de correo e inténtalo nuevamente.');
  }
}
