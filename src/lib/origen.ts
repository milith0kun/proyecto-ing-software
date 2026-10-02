import type { NextRequest } from 'next/server';
import { solicitudMismoOrigen } from './autenticacion';

export function esSolicitudMismoOrigen(solicitud: NextRequest) {
  // APP_URL fija el origen externo cuando se despliega detrás de un proxy HTTPS.
  const configurado = process.env.APP_URL;
  return solicitudMismoOrigen(solicitud.headers.get('origin'), configurado || solicitud.url,
    configurado ? undefined : solicitud.headers.get('host'));
}
