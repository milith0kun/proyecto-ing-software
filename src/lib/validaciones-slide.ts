export interface DatosSlideEntrada {
  titulo?: unknown;
  contenido?: unknown;
}

export interface ResultadoValidacionSlide {
  valido: boolean;
  errores: Record<string, string>;
}

export function validarSlide(datos: DatosSlideEntrada = {}): ResultadoValidacionSlide {
  const errores: Record<string, string> = {};
  const titulo = typeof datos.titulo === 'string' ? datos.titulo.trim() : '';
  const contenido = typeof datos.contenido === 'string' ? datos.contenido.trim() : '';

  if (titulo.length < 3 || titulo.length > 80) {
    errores.titulo = 'El título del slide debe tener entre 3 y 80 caracteres.';
  }

  if (!contenido) {
    errores.contenido = 'Agrega el contenido del slide antes de guardarlo.';
  } else if (contenido.length > 10000) {
    errores.contenido = 'El contenido no puede superar los 10 000 caracteres.';
  }

  return { valido: Object.keys(errores).length === 0, errores };
}
