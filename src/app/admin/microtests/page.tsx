import Link from 'next/link';
import { CabeceraAdminCgb } from '@/components/institucional/CabeceraAdminCgb';
import { PieCgb } from '@/components/institucional/PieCgb';
import {
  obtenerCapacitacionesConMicrotestInicial,
  type CapacitacionConMicrotestUI,
} from '@/lib/servicio-configuracion-microtest';
import { ConstructorMicrotest } from './ConstructorMicrotest';

export const dynamic = 'force-dynamic';

export default async function PaginaAdminMicrotests() {
  let capacitacionesIniciales: CapacitacionConMicrotestUI[] = [];
  try {
    capacitacionesIniciales = await obtenerCapacitacionesConMicrotestInicial();
  } catch {
    capacitacionesIniciales = [];
  }

  return (
    <div className="capacitacion-pagina">
      <CabeceraAdminCgb>
        <div className="flex items-center gap-3">
          <Link href="/admin/capacitaciones" className="boton-secundario text-sm">
            ← Volver a Capacitaciones
          </Link>
        </div>
      </CabeceraAdminCgb>

      <main className="capacitacion-pagina__principal">
        <div className="publicacion-contenedor">
          <div className="experiencia-capacitacion__cabecera">
            <p className="kicker-cgb">CGB Academy · Evaluación Formativa (HU-013)</p>
            <h1>Configurar Microtest Formativo</h1>
            <p className="experiencia-capacitacion__descripcion">
              Crea y vincula cuestionarios de opción múltiple a una capacitación,
              define la nota mínima de aprobación y el límite de intentos para los
              colaboradores.
            </p>
          </div>

          <ConstructorMicrotest
            capacitacionesIniciales={capacitacionesIniciales}
          />
        </div>
      </main>

      <PieCgb />
    </div>
  );
}
