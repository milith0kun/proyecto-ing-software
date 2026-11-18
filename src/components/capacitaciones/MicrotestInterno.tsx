'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SIN_RESPUESTA, type DetallePregunta } from '@/lib/microtest';

export interface PreguntaResolver { id: string; enunciado: string; opciones: string[] }
interface ResultadoApi {
  puntaje: number; aciertos: number; total: number; aprobado: boolean; notaMinima: number;
  intentosRestantes: number; puedeReintentar: boolean; detalle: DetallePregunta[];
}

export const formatearTiempo = (segundos: number) =>
  `${String(Math.floor(segundos / 60)).padStart(2, '0')}:${String(segundos % 60).padStart(2, '0')}`;

// Microtest formativo (HU-014). Las respuestas correctas solo llegan desde la API después de calificar.
export function MicrotestInterno({ capacitacionId, preguntas, notaMinima, intentosRestantes, tiempoLimiteSeg, alAprobar, alRevisarMaterial }: {
  capacitacionId: string; preguntas: PreguntaResolver[]; notaMinima: number; intentosRestantes: number;
  tiempoLimiteSeg: number | null; alAprobar: () => void; alRevisarMaterial: () => void;
}) {
  const vacias = useCallback(() => preguntas.map(() => SIN_RESPUESTA), [preguntas]);
  const [respuestas, setRespuestas] = useState<number[]>(vacias);
  const [resultado, setResultado] = useState<ResultadoApi | null>(null);
  const [restantes, setRestantes] = useState(intentosRestantes);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [segundos, setSegundos] = useState<number | null>(tiempoLimiteSeg);
  const enviado = useRef(false);
  const ultimas = useRef(respuestas);
  useEffect(() => { ultimas.current = respuestas; }, [respuestas]);

  const enviar = useCallback(async (respuestasAEnviar: number[]) => {
    if (enviado.current) return;
    enviado.current = true;
    setEnviando(true);
    setError(null);
    try {
      const respuesta = await fetch('/api/evaluaciones/evaluar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capacitacionId, respuestas: respuestasAEnviar }),
      });
      const cuerpo = await respuesta.json().catch(() => null);
      if (!respuesta.ok || !cuerpo?.ok) throw new Error(cuerpo?.error ?? 'No pudimos calificar tu microtest.');
      setResultado(cuerpo.datos);
      setRestantes(cuerpo.datos.intentosRestantes);
      if (cuerpo.datos.aprobado) alAprobar();
    } catch (e) {
      enviado.current = false;
      setError(e instanceof Error ? e.message : 'No pudimos calificar tu microtest.');
    } finally {
      setEnviando(false);
    }
  }, [capacitacionId, alAprobar]);

  // Temporizador opcional: al llegar a cero se envía lo respondido hasta ese momento.
  useEffect(() => {
    if (segundos === null || resultado) return;
    const reloj = setTimeout(() => {
      if (segundos <= 1) void enviar(ultimas.current);
      setSegundos(segundos - 1);
    }, 1000);
    return () => clearTimeout(reloj);
  }, [segundos, resultado, enviar]);

  function reintentar() {
    enviado.current = false;
    setResultado(null);
    setRespuestas(vacias());
    setSegundos(tiempoLimiteSeg);
    setError(null);
  }

  if (!resultado && restantes === 0) {
    return (
      <section aria-labelledby="titulo-microtest" className="microtest" role="status">
        <h2 id="titulo-microtest">Microtest</h2>
        <p>Agotaste los intentos disponibles. Consulta con tu responsable.</p>
        <button type="button" className="visor-control microtest__secundario" onClick={alRevisarMaterial}>Revisar el material</button>
      </section>
    );
  }

  if (resultado) {
    return (
      <section aria-labelledby="titulo-microtest" className="microtest">
        <h2 id="titulo-microtest">Resultado del microtest</h2>
        <p role="status" className={resultado.aprobado ? 'microtest__estado microtest__estado--aprobado' : 'microtest__estado microtest__estado--reprobado'}>
          {resultado.aprobado ? '¡Aprobado!' : 'No aprobado'} · {resultado.puntaje}% ({resultado.aciertos} de {resultado.total}). Nota mínima: {resultado.notaMinima}%.
        </p>
        <ol className="microtest__detalle">
          {resultado.detalle.map(d => (
            <li key={d.preguntaId} className={d.esCorrecta ? 'microtest__item microtest__item--ok' : 'microtest__item microtest__item--mal'}>
              <p className="microtest__enunciado">{d.enunciado}</p>
              <p>
                <strong>{d.esCorrecta ? 'Correcta' : 'Incorrecta'}.</strong>{' '}
                Tu respuesta: {d.elegida === SIN_RESPUESTA ? 'sin responder' : d.opciones[d.elegida]}.
                {!d.esCorrecta && <> Respuesta correcta: {d.opciones[d.correcta]}.</>}
              </p>
              {d.retroalimentacion && <p className="microtest__retro">{d.retroalimentacion}</p>}
            </li>
          ))}
        </ol>
        {resultado.aprobado ? (
          <Link href="/colaborador" className="visor-control microtest__primario">Capacitación completada · Volver a mi espacio</Link>
        ) : resultado.puedeReintentar ? (
          <div className="microtest__acciones">
            <p>Te quedan {resultado.intentosRestantes} {resultado.intentosRestantes === 1 ? 'intento' : 'intentos'}.</p>
            <button type="button" className="visor-control microtest__secundario" onClick={alRevisarMaterial}>Revisar el material</button>
            <button type="button" className="visor-control microtest__primario" onClick={reintentar}>Reintentar ahora</button>
          </div>
        ) : (
          <p role="status">Agotaste los intentos disponibles. Consulta con tu responsable.</p>
        )}
      </section>
    );
  }

  const completo = respuestas.every(r => r !== SIN_RESPUESTA);
  return (
    <section aria-labelledby="titulo-microtest" className="microtest">
      <h2 id="titulo-microtest">Microtest</h2>
      <p className="microtest__info">
        {preguntas.length} {preguntas.length === 1 ? 'pregunta' : 'preguntas'} · Nota mínima {notaMinima}% · Intentos disponibles: {restantes}
      </p>
      {segundos !== null && <p role="timer" aria-live="off" className="microtest__tiempo">Tiempo restante: {formatearTiempo(Math.max(segundos, 0))}</p>}
      <form onSubmit={e => { e.preventDefault(); if (completo) void enviar(respuestas); }}>
        {preguntas.map((p, i) => (
          <fieldset key={p.id} className="microtest__pregunta" disabled={enviando}>
            <legend>{i + 1}. {p.enunciado}</legend>
            {p.opciones.map((opcion, j) => (
              <label key={j} className="microtest__opcion">
                <input type="radio" name={`pregunta-${p.id}`} checked={respuestas[i] === j}
                  onChange={() => setRespuestas(r => r.map((v, k) => (k === i ? j : v)))} />
                <span>{opcion}</span>
              </label>
            ))}
          </fieldset>
        ))}
        {error && <p role="alert" className="microtest__error">{error}</p>}
        <button type="submit" className="visor-control microtest__primario" disabled={!completo || enviando}>
          {enviando ? 'Calificando…' : 'Enviar respuestas'}
        </button>
        {!completo && <p className="microtest__ayuda">Responde todas las preguntas para enviar.</p>}
      </form>
    </section>
  );
}
