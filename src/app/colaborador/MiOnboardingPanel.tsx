'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CapacitacionOnboarding {
  id: string;
  titulo: string;
  descripcion: string;
  estado: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';
  totalSlides: number;
  ultimoSlideOrden: number;
}

interface PanelOnboarding {
  ruta: { id: string; nombre: string; descripcion: string | null } | null;
  capacitaciones: CapacitacionOnboarding[];
  total: number;
  completadas: number;
  porcentaje: number;
  completada: boolean;
  continuar: { href: string; titulo: string; slide: number } | null;
  transparencia: string;
}

const ETIQUETAS_ESTADO = {
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En progreso',
  COMPLETADA: 'Completada',
};

export default function MiOnboardingPanel() {
  const [panel, setPanel] = useState<PanelOnboarding | null>(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vigente = true;
    fetch('/api/colaborador/mi-onboarding', { cache: 'no-store' })
      .then(async respuesta => {
        const resultado = await respuesta.json();
        if (!respuesta.ok || !resultado.ok) throw new Error(resultado.error || 'No pudimos cargar tu onboarding.');
        if (vigente) setPanel(resultado);
      })
      .catch(errorCarga => {
        if (vigente) setError(errorCarga instanceof Error ? errorCarga.message : 'No pudimos cargar tu onboarding.');
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => { vigente = false; };
  }, []);

  if (cargando) {
    return <section className="onboarding-panel" aria-labelledby="titulo-onboarding" aria-busy="true">
      <p className="kicker-cgb">Mi ruta</p>
      <h2 id="titulo-onboarding">Mi Onboarding</h2>
      <p role="status">Cargando tu ruta y avance…</p>
    </section>;
  }

  if (error) {
    return <section className="onboarding-panel" aria-labelledby="titulo-onboarding">
      <p className="kicker-cgb">Mi ruta</p>
      <h2 id="titulo-onboarding">Mi Onboarding</h2>
      <p role="alert">{error}</p>
    </section>;
  }

  if (!panel) return null;

  return (
    <section className="onboarding-panel" aria-labelledby="titulo-onboarding">
      <div className="onboarding-panel__encabezado">
        <div>
          <p className="kicker-cgb">Mi ruta</p>
          <h2 id="titulo-onboarding">{panel.ruta?.nombre || 'Mi Onboarding'}</h2>
          {panel.ruta?.descripcion && <p>{panel.ruta.descripcion}</p>}
        </div>
        {panel.completada && <span className="onboarding-panel__completada">Ruta completada</span>}
      </div>

      <div className="onboarding-panel__avance">
        <div className="onboarding-panel__avance-texto">
          <span>Avance de la ruta</span>
          <strong>{panel.porcentaje}%</strong>
        </div>
        <div role="progressbar" aria-label="Avance de Mi Onboarding" aria-valuemin={0} aria-valuemax={100} aria-valuenow={panel.porcentaje} aria-valuetext={`${panel.completadas} de ${panel.total} capacitaciones completadas, ${panel.porcentaje}%`} className="onboarding-panel__barra">
          <span style={{ width: `${panel.porcentaje}%` }} />
        </div>
        <p>{panel.completadas} de {panel.total} capacitaciones completadas</p>
      </div>

      <p className="onboarding-panel__privacidad">{panel.transparencia}</p>

      {!panel.ruta ? (
        <p className="onboarding-panel__vacio">Aún no tienes una ruta de onboarding asignada. Consulta con Recursos Humanos.</p>
      ) : panel.capacitaciones.length === 0 ? (
        <p className="onboarding-panel__vacio">Tu ruta todavía no tiene capacitaciones asignadas.</p>
      ) : (
        <ol className="onboarding-panel__lista">
          {panel.capacitaciones.map((capacitacion, indice) => (
            <li className="onboarding-panel__item" key={capacitacion.id}>
              <span className="onboarding-panel__orden" aria-hidden="true">{indice + 1}</span>
              <div className="onboarding-panel__contenido">
                <h3>{capacitacion.titulo}</h3>
                <p>{capacitacion.descripcion}</p>
                {capacitacion.estado === 'EN_PROGRESO' && <span className="onboarding-panel__slide">Último avance: diapositiva {capacitacion.ultimoSlideOrden} de {capacitacion.totalSlides}</span>}
              </div>
              <span className={`onboarding-estado onboarding-estado--${capacitacion.estado.toLowerCase()}`}>
                {ETIQUETAS_ESTADO[capacitacion.estado]}
              </span>
            </li>
          ))}
        </ol>
      )}

      {panel.continuar && <Link className="boton-primario onboarding-panel__continuar" href={panel.continuar.href}>
        Continuar: {panel.continuar.titulo}
      </Link>}
    </section>
  );
}