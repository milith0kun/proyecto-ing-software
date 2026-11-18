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
  titulo: string | null;
  objetivo: string | null;
  nombre?: string | null;
  descripcion?: string | null;
  activa?: boolean | null;
  estado: string | null;
  areaId: string | null;
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
    titulo: ruta.titulo ?? ruta.nombre ?? 'Ruta sin título',
    objetivo: ruta.objetivo ?? ruta.descripcion ?? '',
    estado: ruta.estado ?? (ruta.activa ? 'ACTIVA' : 'BORRADOR'),
    areaId: ruta.areaId ?? '',
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
          nombre: datos.titulo,
          descripcion: datos.objetivo,
          activa: datos.estado === 'ACTIVA',
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
        data: { estado, activa: estado === 'ACTIVA', activadaEn },
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

    async listarAreasActivasConPuestos() {
      const areas = await prisma.area.findMany({
        where: { activa: true },
        orderBy: { nombre: 'asc' },
        include: { puestos: { orderBy: { nombre: 'asc' } } },
      });
      return areas.map(a => ({
        id: a.id,
        nombre: a.nombre,
        puestos: a.puestos.map(p => ({ id: p.id, nombre: p.nombre, areaId: p.areaId })),
      }));
    },

    async listarCapacitacionesPublicadas() {
      return prisma.capacitacion.findMany({
        where: { estado: 'PUBLICADA' },
        orderBy: { titulo: 'asc' },
        select: { id: true, titulo: true, unidad: true, duracionMin: true },
      });
    },
  };
}
