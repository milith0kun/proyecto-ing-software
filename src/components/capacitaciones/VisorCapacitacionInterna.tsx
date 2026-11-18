'use client';

import { useCallback, useMemo } from 'react';
import SlideViewer from '@/app/capacitaciones/[id]/SlideViewer';
import type { SlideVisor } from '@/lib/visor-capacitacion';

// Conecta el visor con los endpoints de avance; el usuario siempre sale de la sesión (cookie).
export function VisorCapacitacionInterna({ capacitacionId, slides, slideInicial, completada }: {
  capacitacionId: string; slides: SlideVisor[]; slideInicial: number; completada: boolean;
}) {
  const base = `/api/colaborador/capacitaciones/${capacitacionId}/progreso`;
  const guardar = useCallback(async (slide: number) => {
    const respuesta = await fetch(base, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slide }) });
    return respuesta.ok;
  }, [base]);
  const finalizar = useCallback(async () => (await fetch(`${base}/finalizar`, { method: 'POST' })).ok, [base]);
  const seguimiento = useMemo(() => ({ guardar, finalizar, completada }), [guardar, finalizar, completada]);
  return <SlideViewer slides={slides} slideInicial={slideInicial} seguimiento={seguimiento} />;
}
