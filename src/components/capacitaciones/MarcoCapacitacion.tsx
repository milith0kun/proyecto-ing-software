import type { ReactNode } from 'react';
import { CabeceraCgb } from '@/components/institucional/CabeceraCgb';
import { PieCgb } from '@/components/institucional/PieCgb';

export function MarcoCapacitacion({ children, controles, vistaPrevia = false }: { children: ReactNode; controles?: ReactNode; vistaPrevia?: boolean }) {
  return <div className={`capacitacion-pagina${vistaPrevia ? ' capacitacion-pagina--previa' : ''}`}>
    <CabeceraCgb variant="capacitacion" contexto="Centro de capacitación" mostrarSesion={!vistaPrevia} />
    <main className="capacitacion-pagina__principal">
      <div className="publicacion-contenedor">
        {controles}
        {children}
      </div>
    </main>
    <PieCgb />
  </div>;
}
