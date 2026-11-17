/**
 * Módulo de dominio para HU-008 (CGB-36): Crear y secuenciar ruta de onboarding.
 * Aplica SRP (validación, secuenciación y correlatividad separadas),
 * ISP (interfaz mínima de repositorio) y DIP (inyección de dependencias).
 */

export const ESTADOS_RUTA_VALIDOS = ['BORRADOR', 'ACTIVA'] as const;
export type EstadoRutaOnboarding = (typeof ESTADOS_RUTA_VALIDOS)[number];

export interface AreaBasica {
  id: string;
  nombre: string;
  activa: boolean;
}

export interface PuestoBasico {
  id: string;
  nombre: string;
  areaId: string;
}

export interface CapacitacionBasica {
  id: string;
  titulo: string;
  estado: string;
}

export interface PasoRutaEntrada {
  capacitacionId: string;
  orden: number;
  obligatorio?: boolean;
}

export interface PasoRutaRegistro {
  id: string;
  rutaId: string;
  capacitacionId: string;
  orden: number;
  obligatorio: boolean;
  capacitacionTitulo?: string;
}

export interface RutaOnboardingRegistro {
  id: string;
  titulo: string;
  objetivo: string;
  estado: EstadoRutaOnboarding | string;
  areaId: string;
  puestoId: string | null;
  activadaEn: Date | null;
  pasos: PasoRutaRegistro[];
}

export interface DatosNuevaRuta {
  titulo?: string;
  objetivo?: string;
  areaId?: string;
  puestoId?: string | null;
}

export interface ResultadoValidacionRuta {
  valido: boolean;
  errores: Record<string, string>;
}

export interface ResultadoCorrelatividad {
  permitido: boolean;
  prerequisitoPendiente?: string;
  mensaje?: string;
}

export interface RepositorioRutasOnboarding {
  buscarAreaPorId(id: string): Promise<AreaBasica | null>;
  buscarPuestoPorId(id: string): Promise<PuestoBasico | null>;
  buscarCapacitacionesPorIds(ids: string[]): Promise<CapacitacionBasica[]>;
  crearRuta(datos: {
    titulo: string;
    objetivo: string;
    estado: EstadoRutaOnboarding;
    areaId: string;
    puestoId: string | null;
  }): Promise<RutaOnboardingRegistro>;
  buscarRutaPorId(id: string): Promise<RutaOnboardingRegistro | null>;
  guardarPasosRuta(rutaId: string, pasos: PasoRutaEntrada[]): Promise<RutaOnboardingRegistro | null>;
  actualizarEstadoRuta(
    rutaId: string,
    estado: EstadoRutaOnboarding,
    activadaEn: Date,
  ): Promise<RutaOnboardingRegistro | null>;
  listarRutas(): Promise<RutaOnboardingRegistro[]>;
}

export class ErrorRutaOnboarding extends Error {
  constructor(
    message: string,
    public readonly detalles?: Record<string, string>,
  ) {
    super(message);
    this.name = 'ErrorRutaOnboarding';
  }
}

export function validarDatosRuta(datos: DatosNuevaRuta = {}): ResultadoValidacionRuta {
  const errores: Record<string, string> = {};

  const titulo = typeof datos.titulo === 'string' ? datos.titulo.trim() : '';
  if (!titulo || titulo.length < 3) {
    errores.titulo = 'El título de la ruta es obligatorio y debe tener al menos 3 caracteres.';
  }

  const objetivo = typeof datos.objetivo === 'string' ? datos.objetivo.trim() : '';
  if (!objetivo || objetivo.length < 10) {
    errores.objetivo = 'El objetivo es obligatorio y debe tener al menos 10 caracteres.';
  }

  const areaId = typeof datos.areaId === 'string' ? datos.areaId.trim() : '';
  if (!areaId) {
    errores.areaId = 'Debes seleccionar un área organizacional válida.';
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores,
  };
}

export function construirPasosSecuenciales(capacitacionIds: string[]): PasoRutaEntrada[] {
  if (!Array.isArray(capacitacionIds)) {
    throw new ErrorRutaOnboarding('La lista de capacitaciones debe ser un arreglo.');
  }

  const idsLimpios = capacitacionIds.map(id => (typeof id === 'string' ? id.trim() : '')).filter(Boolean);
  if (idsLimpios.length !== capacitacionIds.length) {
    throw new ErrorRutaOnboarding('Cada paso debe referenciar un identificador de capacitación válido.');
  }

  const unicos = new Set(idsLimpios);
  if (unicos.size !== idsLimpios.length) {
    throw new ErrorRutaOnboarding('No se permiten capacitaciones repetidas dentro de la misma ruta.');
  }

  return idsLimpios.map((capacitacionId, indice) => ({
    capacitacionId,
    orden: indice + 1,
    obligatorio: true,
  }));
}

export function puedeIniciarPaso(
  pasos: Array<{ orden: number; capacitacionId: string }>,
  ordenObjetivo: number,
  capacitacionesCompletadas: string[],
): ResultadoCorrelatividad {
  const ordenados = [...pasos].sort((a, b) => a.orden - b.orden);
  const objetivo = ordenados.find(p => p.orden === ordenObjetivo);
  if (!objetivo) {
    return { permitido: false, mensaje: 'El paso solicitado no existe en esta ruta.' };
  }

  const completadas = new Set(capacitacionesCompletadas);
  for (const paso of ordenados) {
    if (paso.orden >= ordenObjetivo) break;
    if (!completadas.has(paso.capacitacionId)) {
      return {
        permitido: false,
        prerequisitoPendiente: paso.capacitacionId,
        mensaje: `Debes completar el Paso ${paso.orden} antes de iniciar el Paso ${ordenObjetivo}.`,
      };
    }
  }

  return { permitido: true };
}

export function crearServicioRutasOnboarding(repositorio: RepositorioRutasOnboarding) {
  return {
    async listarRutas(): Promise<RutaOnboardingRegistro[]> {
      return repositorio.listarRutas();
    },

    async obtenerRuta(rutaId: string): Promise<RutaOnboardingRegistro> {
      const ruta = await repositorio.buscarRutaPorId(rutaId);
      if (!ruta) {
        throw new ErrorRutaOnboarding('La ruta de onboarding solicitada no existe.');
      }
      return ruta;
    },

    async crearRuta(datos: DatosNuevaRuta): Promise<RutaOnboardingRegistro> {
      const validacion = validarDatosRuta(datos);
      if (!validacion.valido) {
        throw new ErrorRutaOnboarding('Los datos de la ruta de onboarding no son válidos.', validacion.errores);
      }

      const areaId = datos.areaId!.trim();
      const area = await repositorio.buscarAreaPorId(areaId);
      if (!area) {
        throw new ErrorRutaOnboarding('El área seleccionada no existe.');
      }
      if (!area.activa) {
        throw new ErrorRutaOnboarding('El área seleccionada no se encuentra activa.');
      }

      const puestoId = typeof datos.puestoId === 'string' && datos.puestoId.trim() ? datos.puestoId.trim() : null;
      if (puestoId) {
        const puesto = await repositorio.buscarPuestoPorId(puestoId);
        if (!puesto) {
          throw new ErrorRutaOnboarding('El puesto de trabajo seleccionado no existe.');
        }
        if (puesto.areaId !== area.id) {
          throw new ErrorRutaOnboarding('El puesto seleccionado no pertenece al área indicada.');
        }
      }

      return repositorio.crearRuta({
        titulo: datos.titulo!.trim(),
        objetivo: datos.objetivo!.trim(),
        estado: 'BORRADOR',
        areaId: area.id,
        puestoId,
      });
    },

    async secuenciarCapacitaciones(rutaId: string, capacitacionIds: string[]): Promise<RutaOnboardingRegistro> {
      const ruta = await repositorio.buscarRutaPorId(rutaId);
      if (!ruta) {
        throw new ErrorRutaOnboarding('La ruta de onboarding no existe.');
      }

      const pasos = construirPasosSecuenciales(capacitacionIds);
      if (pasos.length > 0) {
        const encontradas = await repositorio.buscarCapacitacionesPorIds(pasos.map(p => p.capacitacionId));
        const mapa = new Map(encontradas.map(c => [c.id, c]));

        for (const paso of pasos) {
          const cap = mapa.get(paso.capacitacionId);
          if (!cap) {
            throw new ErrorRutaOnboarding('Una o más capacitaciones seleccionadas no existen.');
          }
          if (cap.estado !== 'PUBLICADA') {
            throw new ErrorRutaOnboarding(
              `La capacitación "${cap.titulo}" debe estar PUBLICADA para integrarse a una ruta.`,
            );
          }
        }
      }

      const actualizada = await repositorio.guardarPasosRuta(rutaId, pasos);
      if (!actualizada) {
        throw new ErrorRutaOnboarding('No se pudo guardar la secuencia de pasos de la ruta.');
      }
      return actualizada;
    },

    async activarRuta(rutaId: string, ahora = new Date()): Promise<RutaOnboardingRegistro> {
      const ruta = await repositorio.buscarRutaPorId(rutaId);
      if (!ruta) {
        throw new ErrorRutaOnboarding('La ruta de onboarding no existe.');
      }
      if (ruta.pasos.length === 0) {
        throw new ErrorRutaOnboarding('Debe asociar al menos una capacitación antes de activar la ruta.');
      }

      const activada = await repositorio.actualizarEstadoRuta(
        rutaId,
        'ACTIVA',
        ruta.estado === 'ACTIVA' && ruta.activadaEn ? ruta.activadaEn : ahora,
      );
      if (!activada) {
        throw new ErrorRutaOnboarding('No se pudo activar la ruta de onboarding.');
      }
      return activada;
    },
  };
}

/**
 * Reordena de forma inmutable un arreglo de pasos para el constructor visual (drag & drop / botones).
 */
export function moverPasoSecuencia<T>(lista: readonly T[], indiceOrigen: number, indiceDestino: number): T[] {
  if (
    indiceOrigen < 0 ||
    indiceDestino < 0 ||
    indiceOrigen >= lista.length ||
    indiceDestino >= lista.length ||
    indiceOrigen === indiceDestino
  ) {
    return [...lista];
  }
  const copia = [...lista];
  const [movido] = copia.splice(indiceOrigen, 1);
  copia.splice(indiceDestino, 0, movido);
  return copia;
}
