/**
 * Cliente HTTP dedicado para el flujo de activación de cuenta (HU-010 / CGB-46).
 * Separa la capa de presentación del transporte fetch hacia /api/auth/activar.
 */

import type { DatosPerfilActivacion } from './politica-contrasena';

export async function validarTokenActivacionApi(token: string): Promise<DatosPerfilActivacion> {
  const resp = await fetch(`/api/auth/activar?token=${encodeURIComponent(token)}`, {
    cache: 'no-store',
  });
  const json = await resp.json();
  if (!resp.ok || !json.ok) {
    throw new Error(json.error || 'El enlace de activación ha vencido o no es válido.');
  }
  return json.datos as DatosPerfilActivacion;
}

export async function activarCuentaApi(
  token: string,
  contrasena: string,
): Promise<{ redireccion: string }> {
  const resp = await fetch('/api/auth/activar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, contrasena }),
  });
  const json = await resp.json();
  if (!resp.ok || !json.ok) {
    throw new Error(json.error || 'No se pudo activar la cuenta.');
  }
  return { redireccion: json.redireccion || '/colaborador' };
}

export async function solicitarNuevoEnlaceApi(email: string): Promise<string> {
  const resp = await fetch('/api/auth/activar', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const json = await resp.json();
  if (!resp.ok || !json.ok) {
    throw new Error(json.error || 'No pudimos generar un nuevo enlace.');
  }
  return json.mensaje as string;
}
