/**
 * Reglas puras de política y fortaleza de contraseña (seguras para cliente y servidor).
 */

export interface DatosPerfilActivacion {
  nombre: string;
  email: string;
  puestoNombre: string | null;
  rutaNombre: string | null;
}

export interface FortalezaContrasena {
  nivel: 'DEBIL' | 'MEDIA' | 'FUERTE';
  porcentaje: number;
  criterios: {
    longitudMinima: boolean;
    tieneNumero: boolean;
    tieneSimbolo: boolean;
    tieneMayuscula: boolean;
  };
}

export function validarPoliticaContrasena(contrasena: string): {
  valido: boolean;
  errores: string[];
} {
  const errores: string[] = [];
  const texto = typeof contrasena === 'string' ? contrasena : '';

  if (texto.length < 8) {
    errores.push('La contraseña debe tener al menos 8 caracteres.');
  }
  if (new TextEncoder().encode(texto).length > 72) {
    errores.push('La contraseña no puede superar los 72 bytes.');
  }
  if (!/\d/.test(texto)) {
    errores.push('La contraseña debe incluir al menos un número.');
  }
  if (!/[^A-Za-z0-9\s]/.test(texto)) {
    errores.push('La contraseña debe incluir al menos un símbolo.');
  }

  return { valido: errores.length === 0, errores };
}

export function evaluarFortalezaContrasena(contrasena: string): FortalezaContrasena {
  const texto = typeof contrasena === 'string' ? contrasena : '';
  const criterios = {
    longitudMinima: texto.length >= 8,
    tieneNumero: /\d/.test(texto),
    tieneSimbolo: /[^A-Za-z0-9\s]/.test(texto),
    tieneMayuscula: /[A-Z]/.test(texto),
  };

  const cumplidos = Object.values(criterios).filter(Boolean).length;
  const porcentaje = Math.round((cumplidos / 4) * 100);
  const nivel: FortalezaContrasena['nivel'] =
    cumplidos <= 1 ? 'DEBIL' : cumplidos <= 3 ? 'MEDIA' : 'FUERTE';

  return { nivel, porcentaje, criterios };
}
