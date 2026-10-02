import Link from 'next/link';
import { MarcaCgb } from './MarcaCgb';

type CabeceraCgbProps = {
  variant?: 'inicio' | 'catalogo';
  contexto?: string;
};

function IconoFlecha({ atras = false }: { atras?: boolean }) {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {atras ? <path d="m15 18-6-6 6-6" /> : <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>}
    </svg>
  );
}

export function CabeceraCgb({ variant = 'inicio', contexto }: CabeceraCgbProps) {
  const esCatalogo = variant === 'catalogo';

  return (
    <header className="cabecera-cgb">
      <div className="cabecera-cgb__inner">
        <MarcaCgb />
        <nav className="cabecera-cgb__acciones" aria-label="Navegación principal">
          {contexto && <span className="cabecera-cgb__contexto">{contexto}</span>}
          {esCatalogo ? (
            <Link href="/" className="boton-secundario cabecera-cgb__boton cabecera-cgb__boton--secundario">
              <IconoFlecha atras />
              <span className="cabecera-cgb__texto-desktop">Volver a inicio</span>
              <span className="cabecera-cgb__texto-movil">Inicio</span>
            </Link>
          ) : (
            <Link href="/capacitaciones" className="boton-primario header-cgb__cta">
              <span className="cabecera-cgb__texto-desktop">Explorar capacitaciones</span>
              <span className="cabecera-cgb__texto-movil">Capacitaciones</span>
              <IconoFlecha />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
