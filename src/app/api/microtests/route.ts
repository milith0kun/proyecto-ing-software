/**
 * Capa de controlador HTTP para `/api/microtests` (HU-013 / CGB-61).
 * Delega la lógica de negocio a `servicio-configuracion-microtest.ts`.
 */
import {
  crearMicrotest,
  listarMicrotests,
} from '@/lib/servicio-configuracion-microtest';

export const dynamic = 'force-dynamic';
export const GET = listarMicrotests;
export const POST = crearMicrotest;
