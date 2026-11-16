'use client';

import { ExperienciaCapacitacion, type ContenidoCapacitacion } from '@/components/capacitaciones/ExperienciaCapacitacion';

export default function VisorOnboarding({
  capacitacion,
  slideInicial,
}: {
  capacitacion: ContenidoCapacitacion & { id: string };
  slideInicial: number;
}) {
  async function guardarProgreso(slideOrden: number) {
    const respuesta = await fetch('/api/colaborador/progreso', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ capacitacionId: capacitacion.id, slideOrden }),
      cache: 'no-store',
    });
    if (!respuesta.ok) {
      const resultado = await respuesta.json().catch(() => null);
      const mensaje = resultado?.error || 'No se pudo guardar tu avance. Revisa tu conexión y vuelve a intentarlo.';
      throw new Error(mensaje);
    }
  }

  return (
    <>
      <ExperienciaCapacitacion
        capacitacion={capacitacion}
        slideInicial={slideInicial}
        onSlideChange={guardarProgreso}
        alTerminarHref="/colaborador"
      />
    </>
  );
}