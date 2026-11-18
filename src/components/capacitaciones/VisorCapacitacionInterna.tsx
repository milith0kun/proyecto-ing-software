'use client';

import { useCallback, useMemo } from 'react';
import SlideViewer from '@/app/capacitaciones/[id]/SlideViewer';
import type { SlideVisor } from '@/lib/visor-capacitacion';
import { MicrotestInterno, type PreguntaResolver } from '@/components/capacitaciones/MicrotestInterno';

export interface ConfiguracionMicrotest {
  preguntas: PreguntaResolver[]; notaMinima: number; intentosRestantes: number; tiempoLimiteSeg: number | null;
}

// Conecta el visor con los endpoints de avance; el usuario siempre sale de la sesión (cookie).
export function VisorCapacitacionInterna({ capacitacionId, slides, slideInicial, completada, microtest }: {
  capacitacionId: string; slides: SlideVisor[]; slideInicial: number; completada: boolean; microtest?: ConfiguracionMicrotest | null;
}) {
  const base = `/api/colaborador/capacitaciones/${capacitacionId}/progreso`;
  const guardar = useCallback(async (slide: number) => {
    const respuesta = await fetch(base, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slide }) });
    return respuesta.ok;
  }, [base]);
  const finalizar = useCallback(async () => (await fetch(`${base}/finalizar`, { method: 'POST' })).ok, [base]);
  const seguimiento = useMemo(() => ({
    guardar, finalizar, completada,
    microtest: microtest ? ({ alAprobar, alRevisarMaterial }: { alAprobar: () => void; alRevisarMaterial: () => void }) => (
      <MicrotestInterno capacitacionId={capacitacionId} {...microtest} alAprobar={alAprobar} alRevisarMaterial={alRevisarMaterial} />
    ) : undefined,
  }), [guardar, finalizar, completada, microtest, capacitacionId]);
  return <SlideViewer slides={slides} slideInicial={slideInicial} seguimiento={seguimiento} />;
}
