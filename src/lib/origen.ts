import type { NextRequest } from 'next/server';
import { solicitudMismoOrigen } from './autenticacion';

export function esSolicitudMismoOrigen(solicitud: NextRequest): boolean {
  // 1. Cabecera estándar de navegadores modernos
  const fetchSite = solicitud.headers.get('sec-fetch-site');
  if (fetchSite === 'same-origin') {
    return true;
  }

  // 2. Extraer origen de la petición (Origin o Referer)
  const originHeader = solicitud.headers.get('origin');
  let origen = originHeader;
  if (!origen) {
    const referer = solicitud.headers.get('referer');
    if (referer) {
      try {
        origen = new URL(referer).origin;
      } catch {
        origen = null;
      }
    }
  }

  // 3. Comparar con el Host de la petición entrante (ej. localhost:3000, 10.0.1.197:3000)
  const host = solicitud.headers.get('host');
  if (origen && host) {
    try {
      const parsedOrigen = new URL(origen);
      if (parsedOrigen.host.toLowerCase() === host.toLowerCase()) {
        return true;
      }
    } catch {
      // Ignorar parsing inválido
    }
  }

  // 4. Comparar con la URL resuelta por Next.js
  if (origen) {
    try {
      if (new URL(origen).origin === solicitud.nextUrl.origin) {
        return true;
      }
    } catch {
      // Ignorar
    }
  }

  // 5. Comparar usando solicitudMismoOrigen contra la URL de la solicitud
  if (solicitudMismoOrigen(origen, solicitud.url, host)) {
    return true;
  }

  // 6. Comparar contra APP_URL configurado si existe
  const configurado = process.env.APP_URL;
  if (configurado && solicitudMismoOrigen(origen, configurado)) {
    return true;
  }

  // 7. En entorno local o desarrollo, permitir hosts locales
  if (process.env.NODE_ENV !== 'production') {
    if (!origen) return true;
    try {
      const hostname = new URL(origen).hostname;
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '::1' ||
        hostname.startsWith('10.') ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('172.')
      ) {
        return true;
      }
    } catch {
      // Ignorar
    }
  }

  return false;
}

