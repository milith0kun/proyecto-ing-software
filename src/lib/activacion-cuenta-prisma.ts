import { prisma } from './prisma';
import type {
  RegistroActivacionColaborador,
  RepositorioActivacionCuenta,
} from './activacion-cuenta';

function mapearRegistro(colaborador: {
  id: string;
  userId: string | null;
  nombre: string;
  email: string;
  estado: string;
  tokenActivacion: string | null;
  tokenExpiraEn: Date | null;
  puesto?: { nombre: string } | null;
  rutaOnboarding?: { titulo: string | null; nombre?: string | null } | null;
  user?: { activo: boolean; passwordHash: string | null } | null;
}): RegistroActivacionColaborador {
  return {
    colaboradorId: colaborador.id,
    userId: colaborador.userId,
    nombre: colaborador.nombre,
    email: colaborador.email,
    estadoColaborador: colaborador.estado,
    puestoNombre: colaborador.puesto?.nombre ?? null,
    rutaNombre: colaborador.rutaOnboarding?.titulo ?? colaborador.rutaOnboarding?.nombre ?? null,
    userActivo: Boolean(colaborador.user?.activo),
    passwordHash: colaborador.user?.passwordHash ?? null,
    tokenActivacionHash: colaborador.tokenActivacion,
    tokenExpiraEn: colaborador.tokenExpiraEn,
  };
}

/**
 * Adaptador Prisma/MongoDB para RepositorioActivacionCuenta (Patrón Adapter).
 */
export function crearRepositorioActivacionPrisma(): RepositorioActivacionCuenta {
  return {
    async buscarPorTokenHash(tokenHash: string): Promise<RegistroActivacionColaborador | null> {
      const encontrado = await prisma.colaborador.findFirst({
        where: { tokenActivacion: tokenHash },
        include: {
          puesto: { select: { nombre: true } },
          rutaOnboarding: { select: { titulo: true, nombre: true } },
          user: { select: { activo: true, passwordHash: true } },
        },
      });
      return encontrado ? mapearRegistro(encontrado) : null;
    },

    async buscarPorEmail(email: string): Promise<RegistroActivacionColaborador | null> {
      const encontrado = await prisma.colaborador.findUnique({
        where: { email },
        include: {
          puesto: { select: { nombre: true } },
          rutaOnboarding: { select: { titulo: true, nombre: true } },
          user: { select: { activo: true, passwordHash: true } },
        },
      });
      return encontrado ? mapearRegistro(encontrado) : null;
    },

    async consumirTokenYActivar({ colaboradorId, userId, tokenHash, passwordHash, ahora }): Promise<boolean> {
      return prisma.$transaction(async tx => {
        const consumo = await tx.colaborador.updateMany({
          where: {
            id: colaboradorId,
            userId,
            tokenActivacion: tokenHash,
            tokenExpiraEn: { gt: ahora },
          },
          data: {
            estado: 'ACTIVO',
            tokenActivacion: null,
            tokenExpiraEn: null,
          },
        });
        if (consumo.count !== 1) return false;

        await tx.user.update({
          where: { id: userId },
          data: { passwordHash, activo: true },
        });
        return true;
      });
    },

    async actualizarTokenReenvio({ colaboradorId, tokenHash, expiraEn }): Promise<boolean> {
      const res = await prisma.colaborador.updateMany({
        where: { id: colaboradorId, estado: 'PENDIENTE_ACTIVACION' },
        data: {
          tokenActivacion: tokenHash,
          tokenExpiraEn: expiraEn,
        },
      });
      return res.count === 1;
    },

    async crearSesion({ id, usuarioId, expiraEn }): Promise<void> {
      await prisma.sesion.create({
        data: { id, usuarioId, expiraEn },
      });
    },
  };
}
