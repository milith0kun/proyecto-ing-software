import { createHash, randomBytes, randomUUID } from 'node:crypto';

export const ESTADOS_COLABORADOR = ['PENDIENTE_ACTIVACION', 'ACTIVO', 'EN_PROGRESO'] as const;
export type EstadoColaborador = (typeof ESTADOS_COLABORADOR)[number];

export interface RutaOnboardingResumen {
  id: string;
  nombre: string;
  descripcion?: string;
  activa?: boolean;
}

export interface PuestoResumen {
  id: string;
  nombre: string;
  rutaOnboardingId?: string | null;
}

export interface RegistraColaboradorInput {
  nombre: string;
  email: string;
  puestoId: string;
}

export interface ColaboradorRegistro {
  id: string;
  nombre: string;
  email: string;
  puestoId: string;
  estado: EstadoColaborador;
  rutaAsignada: RutaOnboardingResumen | null;
  progreso: number;
  tokenActivacion: string | null;
  enlaceActivacion: string | null;
  expiraEn: Date | null;
  fechaRegistro: Date;
}

export function normalizarCorreo(correo: string): string {
  return String(correo || '').trim().toLowerCase();
}

export function construirRegistroColaborador(input: RegistraColaboradorInput): ColaboradorRegistro {
  const nombre = String(input.nombre || '').trim();
  const email = normalizarCorreo(input.email);
  const puestoId = String(input.puestoId || '').trim();

  if (!nombre) throw new Error('El nombre del colaborador es obligatorio.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('El correo del colaborador no es válido.');
  }
  if (!puestoId) throw new Error('Debe indicarse un puesto para asignar la ruta de onboarding.');

  return {
    id: randomUUID(),
    nombre,
    email,
    puestoId,
    estado: 'PENDIENTE_ACTIVACION',
    rutaAsignada: null,
    progreso: 0,
    tokenActivacion: null,
    enlaceActivacion: null,
    expiraEn: null,
    fechaRegistro: new Date(),
  };
}

export function asignarRutaOnboarding(
  colaborador: Pick<ColaboradorRegistro, 'puestoId' | 'estado' | 'rutaAsignada' | 'progreso'>,
  puesto: PuestoResumen | null | undefined,
  ruta: RutaOnboardingResumen | null | undefined,
): ColaboradorRegistro {
  const rutaSegura = ruta ?? null;
  const tieneRutaValida = Boolean(puesto && rutaSegura && rutaSegura.activa !== false && puesto.rutaOnboardingId === rutaSegura.id);

  return {
    ...colaborador,
    estado: colaborador.estado || 'PENDIENTE_ACTIVACION',
    rutaAsignada: tieneRutaValida && rutaSegura
      ? { id: rutaSegura.id, nombre: rutaSegura.nombre, descripcion: rutaSegura.descripcion, activa: Boolean(rutaSegura.activa) }
      : null,
    progreso: tieneRutaValida ? 0 : Number(colaborador.progreso || 0),
  } as ColaboradorRegistro;
}

export function crearInvitacionColaborador(
  colaborador: Pick<ColaboradorRegistro, 'id' | 'email' | 'nombre'>,
  baseUrl = 'https://app.cgb.latam',
) {
  const token = randomBytes(32).toString('base64url');
  const origen = String(baseUrl || 'https://app.cgb.latam').replace(/\/+$/, '');
  const enlaceActivacion = `${origen}/login/activar?token=${encodeURIComponent(token)}`;

  return {
    ...colaborador,
    token,
    tokenActivacion: token,
    tokenActivacionHash: hashTokenActivacion(token),
    enlaceActivacion,
    expiraEn: new Date(Date.now() + 1000 * 60 * 60 * 48),
  };
}

export function hashTokenActivacion(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function filtrarColaboradoresPorEstado(
  colaboradores: Array<{
    id: string;
    nombre: string;
    email: string;
    estado: string;
    rutaAsignada?: { id: string; nombre: string } | null;
  }>,
  estado?: string,
  rutaId?: string,
) {
  return colaboradores.filter((colaborador) => {
    if (estado && colaborador.estado !== estado) return false;
    if (rutaId && colaborador.rutaAsignada?.id !== rutaId) return false;
    return true;
  });
}

export function registrarColaboradorConRuta({
  nombre,
  email,
  puestoId,
  puesto,
  ruta,
  baseUrl = 'https://app.cgb.latam',
}: RegistraColaboradorInput & {
  puesto?: PuestoResumen | null;
  ruta?: RutaOnboardingResumen | null;
  baseUrl?: string;
}): ColaboradorRegistro & {
  token?: string;
  tokenActivacion: string;
  tokenActivacionHash: string;
  enlaceActivacion: string;
  expiraEn: Date;
} {
  const registro = construirRegistroColaborador({ nombre, email, puestoId });
  const conRuta = asignarRutaOnboarding(registro, puesto ?? null, ruta ?? null);
  const conInvitacion = crearInvitacionColaborador(conRuta, baseUrl);

  return {
    ...conRuta,
    token: conInvitacion.token,
    tokenActivacion: conInvitacion.tokenActivacion,
    tokenActivacionHash: conInvitacion.tokenActivacionHash,
    enlaceActivacion: conInvitacion.enlaceActivacion,
    expiraEn: conInvitacion.expiraEn,
  };
}
