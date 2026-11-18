import { construirPanelMiOnboarding } from '@/lib/mi-onboarding';
import { buscarDatosMiOnboarding } from '@/lib/repositorio-mi-onboarding';

export async function consultarMiOnboarding(usuarioId: string) {
  const datos = await buscarDatosMiOnboarding(usuarioId);
  return construirPanelMiOnboarding(datos?.rutaOnboarding, datos?.progresos ?? []);
}