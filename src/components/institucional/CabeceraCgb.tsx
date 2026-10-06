'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MarcaCgb } from './MarcaCgb';
import { CerrarSesion } from '@/components/cerrar-sesion';

type CabeceraCgbProps = {
  variant?: 'inicio' | 'catalogo' | 'capacitacion';
  contexto?: string;
  mostrarSesion?: boolean;
};

type EstadoSesion = { autenticado: boolean; nombre?: string; rol?: string; destino?: string };

function IconoFlecha({ atras = false }: { atras?: boolean }) {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {atras ? <path d="m15 18-6-6 6-6" /> : <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>}
    </svg>
  );
}

export function CabeceraCgb({ variant = 'inicio', contexto, mostrarSesion = true }: CabeceraCgbProps) {
  const esCatalogo = variant === 'catalogo';
  const esCapacitacion = variant === 'capacitacion';
  const [sesion, establecerSesion] = useState<EstadoSesion | null>(null);

  useEffect(() => {
    if (!mostrarSesion) return;
    let activo = true;
    fetch('/api/auth/sesion', { cache: 'no-store' })
      .then((respuesta) => respuesta.json())
      .then((datos: EstadoSesion) => { if (activo) establecerSesion(datos); })
      .catch(() => { if (activo) establecerSesion({ autenticado: false }); });
    return () => { activo = false; };
  }, [mostrarSesion]);

  return (
    <header className="cabecera-cgb">
      <div className="cabecera-cgb__inner">
        <MarcaCgb />
        <nav className="cabecera-cgb__acciones" aria-label="Navegación principal">
          {contexto && <span className="cabecera-cgb__contexto">{contexto}</span>}
          {esCatalogo || esCapacitacion ? (
            <Link href={esCapacitacion ? '/capacitaciones' : '/'} className="boton-secundario cabecera-cgb__boton cabecera-cgb__boton--secundario">
              <IconoFlecha atras />
              <span className="cabecera-cgb__texto-desktop">{esCapacitacion ? 'Volver al catálogo' : 'Volver a inicio'}</span>
              <span className="cabecera-cgb__texto-movil">{esCapacitacion ? 'Catálogo' : 'Inicio'}</span>
            </Link>
          ) : (
            <Link href="/capacitaciones" className="boton-primario header-cgb__cta">
              <span className="cabecera-cgb__texto-desktop">Explorar capacitaciones</span>
              <span className="cabecera-cgb__texto-movil">Capacitaciones</span>
              <IconoFlecha />
            </Link>
          )}

          {mostrarSesion && (sesion?.autenticado ? (
            <div className="cabecera-cgb__sesion">
              <Link href={sesion.destino || '/colaborador'} className="boton-secundario cabecera-cgb__boton cabecera-cgb__boton--secundario" title={sesion.nombre}>
                <span className="cabecera-cgb__texto-desktop">{sesion.rol === 'ADMINISTRADOR' ? 'Panel de administración' : 'Mi espacio'}</span>
                <span className="cabecera-cgb__texto-movil">Mi panel</span>
              </Link>
              <CerrarSesion />
            </div>
          ) : sesion ? (
            <Link href="/login" className="boton-secundario cabecera-cgb__boton cabecera-cgb__boton--secundario">
              <span className="cabecera-cgb__texto-desktop">Acceso interno</span>
              <span className="cabecera-cgb__texto-movil">Ingresar</span>
            </Link>
          ) : null)}
        </nav>
      </div>
    </header>
  );
}
