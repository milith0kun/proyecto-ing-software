import { prisma } from '@/lib/prisma';

export function buscarColaboradores(filtros: { estado?: string; rutaId?: string }) {
  return prisma.colaborador.findMany({
    where: {
      ...(filtros.estado ? { estado: filtros.estado } : {}),
      ...(filtros.rutaId ? { rutaOnboardingId: filtros.rutaId } : {}),
    },
    include: { puesto: true, rutaOnboarding: true },
    orderBy: { createdAt: 'desc' },
  });
}

export function listarPuestosConRutas() {
  return prisma.puestoTrabajo.findMany({ include: { area: true, rutas: true }, orderBy: { nombre: 'asc' } });
}

export function existeColaboradorPorEmail(email: string) {
  return prisma.colaborador.findUnique({ where: { email }, select: { id: true } });
}

export function existeUsuarioPorEmail(email: string) {
  return prisma.user.findUnique({ where: { email }, select: { id: true } });
}

export function buscarPuestoTrabajo(id: string) {
  return prisma.puestoTrabajo.findUnique({ where: { id }, include: { rutas: true } });
}

export function crearUsuarioColaborador(data: { email: string; name: string; role: 'COLABORADOR'; activo: false }) {
  return prisma.user.create({ data });
}

export function crearColaborador(data: {
  nombre: string;
  email: string;
  puestoId: string;
  estado: 'PENDIENTE_ACTIVACION';
  progreso: number;
  rutaOnboardingId: string | null;
  userId: string;
  tokenActivacion: string;
  tokenExpiraEn: Date;
}) {
  return prisma.colaborador.create({ data, include: { puesto: true, rutaOnboarding: true } });
}

export function revertirRegistroColaborador(userId: string) {
  return Promise.all([
    prisma.colaborador.deleteMany({ where: { userId } }),
    prisma.user.deleteMany({ where: { id: userId } }),
  ]);
}
