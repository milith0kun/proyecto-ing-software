'use client';

import { useState } from 'react';
import type { CapacitacionCatalogoVista } from '@/lib/rutas-cliente';

interface PropsListaPasosRuta {
  secuenciaIds: string[];
  mapaCapacitaciones: Map<string, CapacitacionCatalogoVista>;
  bloqueada: boolean;
  onMover: (origen: number, destino: number) => void;
  onQuitar: (capacitacionId: string) => void;
}

export function ListaPasosRuta({
  secuenciaIds,
  mapaCapacitaciones,
  bloqueada,
  onMover,
  onQuitar,
}: PropsListaPasosRuta) {
  const [indiceArrastrado, setIndiceArrastrado] = useState<number | null>(null);

  if (secuenciaIds.length === 0) {
    return (
      <div
        role="status"
        className="rounded-xl border border-dashed border-[#D8E2EE] bg-[#F9FAFB] p-6 text-center text-sm text-[#146287]"
      >
        Esta ruta aún no tiene capacitaciones asignadas.
      </div>
    );
  }

  return (
    <ol className="space-y-2" aria-label="Secuencia ordenada de capacitaciones">
      {secuenciaIds.map((capId, indice) => {
        const info = mapaCapacitaciones.get(capId);
        const nombre = info?.titulo || capId;
        return (
          <li
            key={capId}
            draggable={!bloqueada}
            aria-label={`Paso ${indice + 1}: ${nombre}`}
            onDragStart={() => !bloqueada && setIndiceArrastrado(indice)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => {
              if (!bloqueada && indiceArrastrado !== null) {
                onMover(indiceArrastrado, indice);
                setIndiceArrastrado(null);
              }
            }}
            className={`flex items-center justify-between gap-3 rounded-xl border border-[#D8E2EE] bg-[#F3F6FA] px-4 py-3 ${
              bloqueada ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#146287"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="9" cy="6" r="1" />
                <circle cx="9" cy="12" r="1" />
                <circle cx="9" cy="18" r="1" />
                <circle cx="15" cy="6" r="1" />
                <circle cx="15" cy="12" r="1" />
                <circle cx="15" cy="18" r="1" />
              </svg>
              <span className="inline-flex items-center justify-center rounded-lg bg-[#092A60] text-white text-xs font-bold px-2.5 py-1">
                Paso {indice + 1}
              </span>
              <span className="font-medium text-sm text-[#092A60] truncate">{nombre}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => onMover(indice, indice - 1)}
                disabled={bloqueada || indice === 0}
                aria-label={`Subir ${nombre}`}
                className="rounded-lg border border-[#D8E2EE] bg-white px-2.5 py-1 text-xs font-semibold text-[#092A60] hover:bg-[#F9FAFB] disabled:opacity-40"
              >
                Subir
              </button>
              <button
                type="button"
                onClick={() => onMover(indice, indice + 1)}
                disabled={bloqueada || indice === secuenciaIds.length - 1}
                aria-label={`Bajar ${nombre}`}
                className="rounded-lg border border-[#D8E2EE] bg-white px-2.5 py-1 text-xs font-semibold text-[#092A60] hover:bg-[#F9FAFB] disabled:opacity-40"
              >
                Bajar
              </button>
              <button
                type="button"
                onClick={() => onQuitar(capId)}
                disabled={bloqueada}
                aria-label={`Quitar ${nombre}`}
                className="rounded-lg border border-[#FECACA] bg-white px-2.5 py-1 text-xs font-semibold text-[#991B1B] hover:bg-[#FEF2F2] disabled:opacity-40"
              >
                Quitar
              </button>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
