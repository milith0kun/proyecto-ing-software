import { createHash, randomBytes } from 'node:crypto';
import {
  evaluarFortalezaContrasena,
  validarPoliticaContrasena,
  type DatosPerfilActivacion,
  type FortalezaContrasena,
} from './politica-contrasena';

export {
  evaluarFortalezaContrasena,
  validarPoliticaContrasena,
  type DatosPerfilActivacion,
  type FortalezaContrasena,
};

export const DURACION_TOKEN_ACTIVACION_MS = 1000 * 60 * 60 * 48; // 48 horas

export type CodigoErrorActivacion =
  | 'TOKEN_INVALIDO_O_EXPIRADO'
  | 'CONTRASENA_INVALIDA'
  | 'CORREO_INVALIDO';

export class ErrorActivacionCuenta extends Error {
  constructor(
    message: string,
    public readonly codigo: CodigoErrorActivacion,
  ) {
    super(message);
    this.name = 'ErrorActivacionCuenta';
  }
}

export interface RegistroActivacionColaborador {
  colaboradorId: string;
  userId: string | null;
  nombre: string;
  email: string;
  estadoColaborador: string;
  puestoNombre: string | null;
  rutaNombre: string | null;
  userActivo: boolean;
  passwordHash: string | null;
  tokenActivacionHash: string | null;
  tokenExpiraEn: Date | null;
}

export interface ResultadoActivacionCuenta {
  activada: true;
  usuario: {
    id: string;
    email: string;
    name: string | null;
    role: 'COLABORADOR';
  };
  redireccion: '/colaborador';
}

export interface RepositorioActivacionCuenta {
  buscarPorTokenHash(tokenHash: string): Promise<RegistroActivacionColaborador | null>;
  buscarPorEmail(email: string): Promise<RegistroActivacionColaborador | null>;
  consumirTokenYActivar(datos: {
    colaboradorId: string;
    userId: string;
    tokenHash: string;
    passwordHash: string;
    ahora: Date;
  }): Promise<boolean>;
  actualizarTokenReenvio(datos: {
    colaboradorId: string;
    tokenHash: string;
    enlaceActivacion: string;
    expiraEn: Date;
  }): Promise<boolean>;
}

export type HashearClaveFn = (clave: string) => Promise<string>;

export function hashTokenActivacion(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function calcularExpiracion48h(ahora = new Date()): Date {
  return new Date(ahora.getTime() + DURACION_TOKEN_ACTIVACION_MS);
}

function esRegistroActivacionVigente(
  registro: RegistroActivacionColaborador | null,
  ahora: Date,
): registro is RegistroActivacionColaborador & { userId: string; tokenExpiraEn: Date } {
  if (!registro || !registro.userId || !registro.tokenExpiraEn) return false;
  if (registro.userActivo || registro.estadoColaborador === 'ACTIVO') return false;
  return registro.tokenExpiraEn.getTime() > ahora.getTime();
}

export function crearServicioActivacionCuenta(
  repositorio: RepositorioActivacionCuenta,
  hashearClave: HashearClaveFn,
) {
  return {
    async validarToken(tokenPlano: string, ahora = new Date()): Promise<DatosPerfilActivacion> {
      const token = typeof tokenPlano === 'string' ? tokenPlano.trim() : '';
      if (!token) {
        throw new ErrorActivacionCuenta(
          'El enlace de activación es inválido o ha expirado.',
          'TOKEN_INVALIDO_O_EXPIRADO',
        );
      }

      const registro = await repositorio.buscarPorTokenHash(hashTokenActivacion(token));
      if (!esRegistroActivacionVigente(registro, ahora)) {
        throw new ErrorActivacionCuenta(
          'El enlace de activación ha vencido o no es válido.',
          'TOKEN_INVALIDO_O_EXPIRADO',
        );
      }

      return {
        nombre: registro.nombre,
        email: registro.email,
        puestoNombre: registro.puestoNombre,
        rutaNombre: registro.rutaNombre,
      };
    },

    async activarCuenta(
      datos: { token?: string; contrasena?: string },
      ahora = new Date(),
    ): Promise<ResultadoActivacionCuenta> {
      const token = typeof datos.token === 'string' ? datos.token.trim() : '';
      if (!token) {
        throw new ErrorActivacionCuenta(
          'El enlace de activación es inválido o ha expirado.',
          'TOKEN_INVALIDO_O_EXPIRADO',
        );
      }

      const politica = validarPoliticaContrasena(datos.contrasena ?? '');
      if (!politica.valido) {
        throw new ErrorActivacionCuenta(politica.errores[0], 'CONTRASENA_INVALIDA');
      }

      const tokenHash = hashTokenActivacion(token);
      const registro = await repositorio.buscarPorTokenHash(tokenHash);
      if (!esRegistroActivacionVigente(registro, ahora)) {
        throw new ErrorActivacionCuenta(
          'El enlace de activación ha vencido o ya fue utilizado.',
          'TOKEN_INVALIDO_O_EXPIRADO',
        );
      }

      const passwordHash = await hashearClave(datos.contrasena!);
      const consumido = await repositorio.consumirTokenYActivar({
        colaboradorId: registro.colaboradorId,
        userId: registro.userId,
        tokenHash,
        passwordHash,
        ahora,
      });

      if (!consumido) {
        throw new ErrorActivacionCuenta(
          'El enlace de activación ha vencido o ya fue utilizado.',
          'TOKEN_INVALIDO_O_EXPIRADO',
        );
      }

      return {
        activada: true,
        usuario: {
          id: registro.userId,
          email: registro.email,
          name: registro.nombre,
          role: 'COLABORADOR',
        },
        redireccion: '/colaborador',
      };
    },

    async solicitarNuevoEnlace(
      emailEntrada: string,
      ahora = new Date(),
      baseUrl = 'https://app.cgb.latam',
    ): Promise<{ enviado: true; tokenNuevo?: string; enlaceActivacion?: string }> {
      const email = typeof emailEntrada === 'string' ? emailEntrada.trim().toLowerCase() : '';
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new ErrorActivacionCuenta('Ingresa un correo electrónico válido.', 'CORREO_INVALIDO');
      }

      const registro = await repositorio.buscarPorEmail(email);
      if (!registro || registro.userActivo || registro.estadoColaborador === 'ACTIVO') {
        // Respuesta neutra para no revelar existencia de cuentas
        return { enviado: true };
      }

      const tokenNuevo = randomBytes(32).toString('base64url');
      const tokenHash = hashTokenActivacion(tokenNuevo);
      const origen = String(baseUrl || 'https://app.cgb.latam').replace(/\/+$/, '');
      const enlaceActivacion = `${origen}/activar-cuenta?token=${encodeURIComponent(tokenNuevo)}`;
      const expiraEn = calcularExpiracion48h(ahora);

      await repositorio.actualizarTokenReenvio({
        colaboradorId: registro.colaboradorId,
        tokenHash,
        enlaceActivacion,
        expiraEn,
      });

      return { enviado: true, tokenNuevo, enlaceActivacion };
    },
  };
}
