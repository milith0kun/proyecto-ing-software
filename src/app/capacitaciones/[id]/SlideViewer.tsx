'use client';

import { useEffect, useState } from 'react';
import {
  calcularProgresoLectura,
  navegarPorTeclado,
  obtenerAccionSlide,
  obtenerSiguienteSlide,
  obtenerSlideAnterior,
  type SlideVisor,
} from '@/lib/visor-capacitacion';

/* eslint-disable @next/next/no-img-element */
export default function SlideViewer({ slides }: { slides: SlideVisor[] }) {
  const [slideActual, setSlideActual] = useState(1);
  const totalSlides = slides.length;
  const progreso = calcularProgresoLectura(slideActual, totalSlides);
  const slide = slides[slideActual - 1];

  useEffect(() => {
    function manejarTeclado(evento: KeyboardEvent) {
      if (evento.altKey || evento.ctrlKey || evento.metaKey) return;
      const elemento = evento.target as HTMLElement | null;
      if (elemento && ['INPUT', 'TEXTAREA', 'SELECT'].includes(elemento.tagName)) return;

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
      <section role="status" style={{ padding: '28px 0', color: 'var(--text-muted)' }}>
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

      <div
        role="progressbar"
        aria-label="Progreso de lectura"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progreso}
        style={{ height: '8px', overflow: 'hidden', borderRadius: '999px', backgroundColor: '#DCE5EF', marginBottom: '24px' }}
      >
        <div className="barra-progreso-avance" style={{ width: `${progreso}%` }} />
      </div>

      <article
        key={slide.id}
        className="visor-slide-entrada"
        aria-live="polite"
        aria-atomic="true"
        style={{ minHeight: '260px', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '16px', backgroundColor: '#FFFFFF', border: '1px solid var(--borde-sutil)', boxShadow: 'var(--sombra-tarjeta)' }}
      >
        {slide.imagenUrl && (
          <img
            src={slide.imagenUrl}
            alt={slide.titulo}
            loading="lazy"
            style={{ display: 'block', width: '100%', maxHeight: '420px', objectFit: 'contain', marginBottom: '24px', borderRadius: '8px' }}
          />
        )}
        <p style={{ margin: '0 0 10px', color: 'var(--brand-blue)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
          {slide.tipo}
        </p>
        <h2 style={{ margin: '0 0 16px', color: 'var(--brand-navy)', fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 4vw, 32px)', lineHeight: 1.2 }}>
          {slide.titulo}
        </h2>
        <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '16px', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
          {slide.contenido}
        </p>
        {slide.lista.length > 0 && (
          <ul style={{ display: 'grid', gap: '10px', margin: '20px 0 0', paddingLeft: '22px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
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

      <nav aria-label="Navegación de diapositivas" style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginTop: '20px' }}>
        <button
          type="button"
          onClick={() => setSlideActual((actual) => obtenerSlideAnterior(actual, totalSlides))}
          disabled={slideActual === 1}
          style={{ minHeight: '46px', padding: '0 20px', border: '1px solid var(--borde-sutil)', borderRadius: '999px', backgroundColor: '#FFFFFF', color: 'var(--brand-navy)', fontWeight: 700, cursor: slideActual === 1 ? 'not-allowed' : 'pointer', opacity: slideActual === 1 ? 0.55 : 1 }}
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => setSlideActual((actual) => obtenerSiguienteSlide(actual, totalSlides))}
          disabled={slideActual === totalSlides}
          style={{ minHeight: '46px', padding: '0 22px', border: 0, borderRadius: '999px', backgroundColor: 'var(--brand-navy)', color: '#FFFFFF', fontWeight: 700, cursor: slideActual === totalSlides ? 'not-allowed' : 'pointer', opacity: slideActual === totalSlides ? 0.55 : 1 }}
        >
          Siguiente
        </button>
      </nav>
    </section>
  );
}
