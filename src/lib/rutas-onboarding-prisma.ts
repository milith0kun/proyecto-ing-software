import { prisma } from './prisma';
import type {
  AreaBasica,
  CapacitacionBasica,
  EstadoRutaOnboarding,
  PasoRutaEntrada,
  PuestoBasico,
  RepositorioRutasOnboarding,
  RutaOnboardingRegistro,
} from './rutas-onboarding';

function mapearRutaPrisma(ruta: {
  id: string;
  titulo: string;
  objetivo: string;
  estado: string;
  areaId: string;
  puestoId: string | null;
  activadaEn: Date | null;
  pasos: Array<{
    id: string;
    rutaId: string;
    capacitacionId: string;
    orden: number;
    obligatorio: boolean;
    capacitacion?: { titulo: string } | null;
  }>;
}): RutaOnboardingRegistro {
  return {
    id: ruta.id,
    titulo: ruta.titulo,
    objetivo: ruta.objetivo,
    estado: ruta.estado,
    areaId: ruta.areaId,
    puestoId: ruta.puestoId,
    activadaEn: ruta.activadaEn,
    pasos: [...ruta.pasos]
      .sort((a, b) => a.orden - b.orden)
      .map(paso => ({
        id: paso.id,
        rutaId: paso.rutaId,
        capacitacionId: paso.capacitacionId,
        orden: paso.orden,
        obligatorio: paso.obligatorio,
        capacitacionTitulo: paso.capacitacion?.titulo,
      })),
  };
}

/**
 * Adaptador de persistencia Prisma/MongoDB para RepositorioRutasOnboarding (Patrón Adapter).
 */
export function crearRepositorioRutasPrisma(): RepositorioRutasOnboarding {
  return {
    async buscarAreaPorId(id: string): Promise<AreaBasica | null> {
      return prisma.area.findUnique({
        where: { id },
        select: { id: true, nombre: true, activa: true },
      });
    },

    async buscarPuestoPorId(id: string): Promise<PuestoBasico | null> {
      return prisma.puestoTrabajo.findUnique({
        where: { id },
        select: { id: true, nombre: true, areaId: true },
      });
    },

    async buscarCapacitacionesPorIds(ids: string[]): Promise<CapacitacionBasica[]> {
      if (ids.length === 0) return [];
      return prisma.capacitacion.findMany({
        where: { id: { in: ids } },
        select: { id: true, titulo: true, estado: true },
      });
    },

    async crearRuta(datos): Promise<RutaOnboardingRegistro> {
      const creada = await prisma.rutaOnboarding.create({
        data: {
          titulo: datos.titulo,
          objetivo: datos.objetivo,
          estado: datos.estado,
          areaId: datos.areaId,
          puestoId: datos.puestoId,
        },
        include: {
          pasos: {
            orderBy: { orden: 'asc' },
            include: { capacitacion: { select: { titulo: true } } },
          },
        },
      });
      return mapearRutaPrisma(creada);
    },

    async buscarRutaPorId(id: string): Promise<RutaOnboardingRegistro | null> {
      const encontrada = await prisma.rutaOnboarding.findUnique({
        where: { id },
        include: {
          pasos: {
            orderBy: { orden: 'asc' },
            include: { capacitacion: { select: { titulo: true } } },
          },
        },
      });
      return encontrada ? mapearRutaPrisma(encontrada) : null;
    },

    async guardarPasosRuta(rutaId: string, pasos: PasoRutaEntrada[]): Promise<RutaOnboardingRegistro | null> {
      const actualizada = await prisma.$transaction(async tx => {
        await tx.pasoRuta.deleteMany({ where: { rutaId } });
        if (pasos.length > 0) {
          await tx.pasoRuta.createMany({
            data: pasos.map(p => ({
              rutaId,
              capacitacionId: p.capacitacionId,
              orden: p.orden,
              obligatorio: p.obligatorio ?? true,
            })),
          });
        }
        return tx.rutaOnboarding.findUnique({
          where: { id: rutaId },
          include: {
            pasos: {
              orderBy: { orden: 'asc' },
              include: { capacitacion: { select: { titulo: true } } },
            },
          },
        });
      });

      return actualizada ? mapearRutaPrisma(actualizada) : null;
    },

    async actualizarEstadoRuta(
      rutaId: string,
      estado: EstadoRutaOnboarding,
      activadaEn: Date,
    ): Promise<RutaOnboardingRegistro | null> {
      const actualizada = await prisma.rutaOnboarding.update({
        where: { id: rutaId },
        data: { estado, activadaEn },
        include: {
          pasos: {
            orderBy: { orden: 'asc' },
            include: { capacitacion: { select: { titulo: true } } },
          },
        },
      });
      return mapearRutaPrisma(actualizada);
    },

    async listarRutas(): Promise<RutaOnboardingRegistro[]> {
      const rutas = await prisma.rutaOnboarding.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          pasos: {
            orderBy: { orden: 'asc' },
            include: { capacitacion: { select: { titulo: true } } },
          },
        },
      });
      return rutas.map(mapearRutaPrisma);
    },
  };
}
