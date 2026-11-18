'use client';

import React from 'react';
import {
  MAX_OPCIONES,
  MIN_OPCIONES,
  type PreguntaConfigurada,
} from '@/lib/configuracion-microtest';

export function TarjetaPreguntaMicrotest({
  pregunta,
  idxP,
  totalPreguntas,
  pesoPregunta,
  bloqueadoPorIntentos,
  erroresCampo,
  onEliminarPregunta,
  onActualizarPregunta,
  onAgregarOpcion,
  onEliminarOpcion,
  onActualizarOpcion,
}: {
  pregunta: PreguntaConfigurada;
  idxP: number;
  totalPreguntas: number;
  pesoPregunta: number;
  bloqueadoPorIntentos: boolean;
  erroresCampo: Record<string, string>;
  onEliminarPregunta: (idxP: number) => void;
  onActualizarPregunta: (
    idxP: number,
    cambios: Partial<PreguntaConfigurada>
  ) => void;
  onAgregarOpcion: (idxP: number) => void;
  onEliminarOpcion: (idxP: number, idxOp: number) => void;
  onActualizarOpcion: (idxP: number, idxOp: number, valor: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center rounded-lg bg-[#092A60] px-2.5 py-1 text-xs font-bold text-white">
            Pregunta {idxP + 1}
          </span>
          <span className="text-xs font-semibold text-slate-600">
            Valor: {pesoPregunta} pts
          </span>
        </div>

        {totalPreguntas > 1 && (
          <button
            type="button"
            disabled={bloqueadoPorIntentos}
            onClick={() => onEliminarPregunta(idxP)}
            className="text-xs font-semibold text-red-600 hover:underline"
          >
            Quitar pregunta
          </button>
        )}
      </div>

      <div>
        <label
          htmlFor={`enunciado-${idxP}`}
          className="block text-xs font-semibold text-slate-700 mb-1"
        >
          Enunciado de la pregunta {idxP + 1}
        </label>
        <input
          id={`enunciado-${idxP}`}
          type="text"
          placeholder="Escribe el enunciado de la pregunta..."
          value={pregunta.enunciado}
          disabled={bloqueadoPorIntentos}
          onChange={(e) =>
            onActualizarPregunta(idxP, { enunciado: e.target.value })
          }
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
        />
        {erroresCampo[`preguntas[${idxP}].enunciado`] && (
          <p className="mt-1 text-xs text-red-600">
            {erroresCampo[`preguntas[${idxP}].enunciado`]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">
            Alternativas (marca la opción correcta)
          </span>
          {pregunta.opciones.length < MAX_OPCIONES && (
            <button
              type="button"
              disabled={bloqueadoPorIntentos}
              onClick={() => onAgregarOpcion(idxP)}
              className="text-xs font-semibold text-[#092A60] hover:underline"
            >
              + Añadir alternativa
            </button>
          )}
        </div>

        {pregunta.opciones.map((opcion, idxOp) => (
          <div key={idxOp} className="flex items-center gap-2">
            <input
              type="radio"
              name={`correcta-${idxP}`}
              aria-label={`Marcar alternativa ${idxOp + 1} como correcta en pregunta ${idxP + 1}`}
              checked={pregunta.correcta === idxOp}
              disabled={bloqueadoPorIntentos}
              onChange={() => onActualizarPregunta(idxP, { correcta: idxOp })}
            />
            <input
              type="text"
              aria-label={`Alternativa ${idxOp + 1} de pregunta ${idxP + 1}`}
              placeholder={`Alternativa ${idxOp + 1}`}
              value={opcion}
              disabled={bloqueadoPorIntentos}
              onChange={(e) => onActualizarOpcion(idxP, idxOp, e.target.value)}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm"
            />
            {pregunta.opciones.length > MIN_OPCIONES && (
              <button
                type="button"
                disabled={bloqueadoPorIntentos}
                onClick={() => onEliminarOpcion(idxP, idxOp)}
                className="text-xs text-slate-500 hover:text-red-600"
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
        {erroresCampo[`preguntas[${idxP}].opciones`] && (
          <p className="mt-1 text-xs text-red-600">
            {erroresCampo[`preguntas[${idxP}].opciones`]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`retro-${idxP}`}
          className="block text-xs font-semibold text-slate-700 mb-1"
        >
          Retroalimentación formativa (opcional)
        </label>
        <input
          id={`retro-${idxP}`}
          type="text"
          placeholder="Explicación que verá el colaborador al calificar su intento..."
          value={pregunta.retroalimentacion ?? ''}
          disabled={bloqueadoPorIntentos}
          onChange={(e) =>
            onActualizarPregunta(idxP, {
              retroalimentacion: e.target.value,
            })
          }
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
        />
      </div>
    </article>
  );
}
