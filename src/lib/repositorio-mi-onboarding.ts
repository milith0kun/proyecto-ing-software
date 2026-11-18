import { prisma } from '@/lib/prisma';

export function buscarDatosMiOnboarding(usuarioId: string) {
  return prisma.user.findUnique({
    where: { id: usuarioId },
    select: {
      rutaOnboarding: {
        select: {
          id: true,
          titulo: true,
          nombre: true,
          descripcion: true,
          objetivo: true,
          pasos: {
            orderBy: { orden: 'asc' },
            select: {
              orden: true,
              capacitacion: {
                select: {
                  id: true,
                  titulo: true,
                  descripcion: true,
                  slides: {
                    orderBy: { orden: 'asc' },
                    select: { id: true, orden: true },
                  },
                },
              },
            },
          },
        },
      },
      progresos: {
        select: { capacitacionId: true, ultimoSlide: true, estado: true },
      },
    },
  });
}