'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  calcularProgresoLectura,
  obtenerDireccionDeslizamiento,
  navegarPorTeclado,
  obtenerAccionSlide,
  obtenerSiguienteSlide,
  obtenerSlideAnterior,
  type SlideVisor,
} from '@/lib/visor-capacitacion';

// Seguimiento opcional (HU-012): el recorrido público no lo usa y se comporta igual que antes.
export interface SeguimientoVisor {
  guardar: (slide: number) => Promise<boolean>;
  finalizar: () => Promise<boolean>;
  completada: boolean;
  // Microtest opcional (HU-014): si existe, la capacitación se completa al aprobarlo y no con «Finalizar».
  microtest?: (acciones: { alAprobar: () => void; alRevisarMaterial: () => void }) => ReactNode;
}
type EstadoGuardado = 'guardando' | 'guardado' | 'error';
const TEXTO_GUARDADO: Record<EstadoGuardado, string> = {
  guardando: 'Guardando tu avance…',
  guardado: 'Avance guardado',
  error: 'No pudimos guardar tu avance.',
};

/* eslint-disable @next/next/no-img-element */
export default function SlideViewer({ slides, slideInicial = 1, seguimiento }: { slides: SlideVisor[]; slideInicial?: number; seguimiento?: SeguimientoVisor }) {
  const [slideActual, setSlideActual] = useState(() => Math.min(Math.max(Math.floor(slideInicial) || 1, 1), Math.max(slides.length, 1)));
  const [resultadoGuardado, setResultadoGuardado] = useState<{ clave: string; ok: boolean } | null>(null);
  const [intentoGuardado, setIntentoGuardado] = useState(0);
  const claveGuardado = `${slideActual}:${intentoGuardado}`;
  const estadoGuardado: EstadoGuardado = resultadoGuardado?.clave !== claveGuardado ? 'guardando' : resultadoGuardado.ok ? 'guardado' : 'error';
  const [finalizando, setFinalizando] = useState(false);
  const [completada, setCompletada] = useState(seguimiento?.completada ?? false);
  const [errorFinalizar, setErrorFinalizar] = useState(false);
  const [microtestAbierto, setMicrotestAbierto] = useState(false);
  const inicioToqueX = useRef<number | null>(null);
  const totalSlides = slides.length;
  const progreso = calcularProgresoLectura(slideActual, totalSlides);
  const slide = slides[slideActual - 1];

  // Cada slide al que se llega se confirma en el servidor; reintentar repite la misma confirmación idempotente.
  const guardar = seguimiento?.guardar;
  useEffect(() => {
    if (!guardar || slides.length === 0) return;
    let vigente = true;
    guardar(slideActual).then(
      (ok) => { if (vigente) setResultadoGuardado({ clave: claveGuardado, ok }); },
      () => { if (vigente) setResultadoGuardado({ clave: claveGuardado, ok: false }); },
    );
    return () => { vigente = false; };
  }, [guardar, slideActual, slides.length, claveGuardado]);

  async function finalizarCapacitacion() {
    if (!seguimiento) return;
    setFinalizando(true);
    setErrorFinalizar(false);
    try {
      const ok = await seguimiento.finalizar();
      setCompletada(ok);
      setErrorFinalizar(!ok);
    } catch {
      setErrorFinalizar(true);
    } finally {
      setFinalizando(false);
    }
  }

  useEffect(() => {
    function manejarTeclado(evento: KeyboardEvent) {
      if (evento.altKey || evento.ctrlKey || evento.metaKey) return;
      const elemento = evento.target as HTMLElement | null;
      if (elemento?.isContentEditable || elemento?.closest('input, textarea, select')) return;

      const siguiente = navegarPorTeclado(evento.key, slideActual, totalSlides);
      if (siguiente !== slideActual) {
        evento.preventDefault();
        setSlideActual(siguiente);
      }
    }

    window.addEventListener('keydown', manejarTeclado);
    return () => window.removeEventListener('keydown', manejarTeclado);
  }, [slideActual, totalSlides]);

  if (!slide) {
    return (
      <section role="status" className="visor-sin-contenido">
        Esta capacitación todavía no tiene diapositivas.
      </section>
    );
  }

  const accion = obtenerAccionSlide(slide);

  return (
    <section aria-label="Visor de diapositivas" style={{ width: '100%', maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '10px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>
          Diapositiva {slideActual} de {totalSlides}
        </span>
        <span style={{ color: 'var(--brand-navy)', fontSize: '14px', fontWeight: 700 }} aria-live="polite">
          {progreso}% completado
        </span>
      </div>

      {seguimiento && (
        <div style={{ marginBottom: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
          <p style={{ margin: 0 }}>Tu posición se guarda para que puedas reanudar esta capacitación más tarde.</p>
          <p role="status" style={{ margin: '4px 0 0', fontWeight: 600, color: estadoGuardado === 'error' ? '#B42318' : 'var(--text-muted)' }}>
            {TEXTO_GUARDADO[estadoGuardado]}
            {estadoGuardado === 'error' && (
              <button type="button" onClick={() => setIntentoGuardado((n) => n + 1)} style={{ marginLeft: '8px', border: 0, background: 'none', color: 'var(--brand-blue)', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>
                Reintentar
              </button>
            )}
          </p>
        </div>
      )}

      <div
        role="progressbar"
        aria-label="Progreso de lectura"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progreso}
        aria-valuetext={`${slideActual} de ${totalSlides} diapositivas, ${progreso}% completado`}
        style={{ height: '8px', overflow: 'hidden', borderRadius: '999px', backgroundColor: '#DCE5EF', marginBottom: '24px' }}
      >
        <div className="barra-progreso-avance" style={{ width: `${progreso}%` }} />
      </div>

      {microtestAbierto && seguimiento?.microtest ? seguimiento.microtest({
        alAprobar: () => setCompletada(true),
        alRevisarMaterial: () => { setMicrotestAbierto(false); setSlideActual(1); },
      }) : (<>
      <article
        key={slide.id}
        className="visor-slide-entrada"
        aria-live="polite"
        aria-atomic="true"
        onTouchStart={(evento) => {
          inicioToqueX.current = evento.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(evento) => {
          const inicioX = inicioToqueX.current;
          const finX = evento.changedTouches[0]?.clientX;
          inicioToqueX.current = null;
          if (inicioX === null || finX === undefined) return;

          const direccion = obtenerDireccionDeslizamiento(inicioX, finX);
          if (direccion === 'siguiente') {
            setSlideActual((actual) => obtenerSiguienteSlide(actual, totalSlides));
          } else if (direccion === 'anterior') {
            setSlideActual((actual) => obtenerSlideAnterior(actual, totalSlides));
          }
        }}
        onTouchCancel={() => {
          inicioToqueX.current = null;
        }}
        style={{ minHeight: '260px', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid var(--borde-sutil)', boxShadow: 'var(--sombra-tarjeta)', touchAction: 'pan-y' }}
      >
        {slide.imagenUrl && (
          <img
            src={slide.imagenUrl}
            alt={slide.titulo}
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="visor-imagen"
          />
        )}
        <p style={{ margin: '0 0 10px', color: 'var(--brand-blue)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
          {slide.tipo}
        </p>
        <h2 style={{ margin: '0 0 16px', color: 'var(--brand-navy)', fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 4vw, 32px)', lineHeight: 1.2, overflowWrap: 'anywhere' }}>
          {slide.titulo}
        </h2>
        <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '16px', lineHeight: 1.75, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
          {slide.contenido}
        </p>
        {slide.lista.length > 0 && (
          <ul style={{ display: 'grid', gap: '10px', margin: '20px 0 0', paddingLeft: '22px', color: 'var(--text-primary)', lineHeight: 1.6, overflowWrap: 'anywhere' }}>
            {slide.lista.map((elemento, indice) => <li key={`${slide.id}-${indice}`}>{elemento}</li>)}
          </ul>
        )}
        {accion && (
          <a
            href={accion.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', minHeight: '44px', marginTop: '24px', padding: '0 20px', borderRadius: '999px', backgroundColor: 'var(--brand-cyan)', color: 'var(--brand-navy)', fontWeight: 700, textDecoration: 'none' }}
          >
            {accion.texto}
          </a>
        )}
      </article>

      <nav aria-label="Navegación de diapositivas" className="visor-navegacion">
        <button
          type="button"
          className="visor-control"
          aria-label="Ir a la diapositiva anterior"
          onClick={() => setSlideActual((actual) => obtenerSlideAnterior(actual, totalSlides))}
          disabled={slideActual === 1}
          style={{ border: '1px solid var(--borde-sutil)', borderRadius: '999px', backgroundColor: '#FFFFFF', color: 'var(--brand-navy)', fontWeight: 700, cursor: slideActual === 1 ? 'not-allowed' : 'pointer', opacity: slideActual === 1 ? 0.55 : 1 }}
        >
          Anterior
        </button>
        {slideActual === totalSlides && seguimiento ? (
          completada ? (
            <Link
              href="/colaborador"
              className="visor-control"
              style={{ border: 0, borderRadius: '999px', backgroundColor: 'var(--brand-navy)', color: '#FFFFFF', fontWeight: 700, textDecoration: 'none' }}
            >
              Capacitación completada · Volver a mi espacio
            </Link>
          ) : seguimiento.microtest ? (
            <button
              type="button"
              className="visor-control"
              onClick={() => setMicrotestAbierto(true)}
              disabled={estadoGuardado !== 'guardado'}
              style={{ border: 0, borderRadius: '999px', backgroundColor: 'var(--brand-navy)', color: '#FFFFFF', fontWeight: 700, cursor: estadoGuardado !== 'guardado' ? 'not-allowed' : 'pointer', opacity: estadoGuardado !== 'guardado' ? 0.55 : 1 }}
            >
              Iniciar microtest
            </button>
          ) : (
            <button
              type="button"
              className="visor-control"
              onClick={finalizarCapacitacion}
              disabled={finalizando || estadoGuardado !== 'guardado'}
              style={{ border: 0, borderRadius: '999px', backgroundColor: 'var(--brand-navy)', color: '#FFFFFF', fontWeight: 700, cursor: finalizando || estadoGuardado !== 'guardado' ? 'not-allowed' : 'pointer', opacity: finalizando || estadoGuardado !== 'guardado' ? 0.55 : 1 }}
            >
              {finalizando ? 'Finalizando…' : 'Finalizar'}
            </button>
          )
        ) : slideActual === totalSlides ? (
          <Link
            href="/capacitaciones"
            className="visor-control"
            style={{ border: 0, borderRadius: '999px', backgroundColor: 'var(--brand-navy)', color: '#FFFFFF', fontWeight: 700, textDecoration: 'none' }}
          >
            Terminar capacitación
          </Link>
        ) : (
          <button
            type="button"
            className="visor-control"
            aria-label="Ir a la diapositiva siguiente"
            onClick={() => setSlideActual((actual) => obtenerSiguienteSlide(actual, totalSlides))}
            style={{ border: 0, borderRadius: '999px', backgroundColor: 'var(--brand-navy)', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
          >
            Siguiente
          </button>
        )}
      </nav>
      </>)}
      {errorFinalizar && <p role="alert" style={{ color: '#B42318', fontWeight: 600 }}>No pudimos finalizar. Revisa tu avance e inténtalo nuevamente.</p>}
    </section>
  );
}
