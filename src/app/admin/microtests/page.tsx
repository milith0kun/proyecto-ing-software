import Link from 'next/link';
import { CabeceraAdminCgb } from '@/components/institucional/CabeceraAdminCgb';
import { PieCgb } from '@/components/institucional/PieCgb';
import { listarCapacitacionesParaMicrotest } from '@/lib/repositorio-configuracion-microtest';
import {
  CapacitacionConMicrotestUI,
  ConstructorMicrotest,
} from './ConstructorMicrotest';

export const dynamic = 'force-dynamic';

export default async function PaginaAdminMicrotests() {
  let capacitacionesIniciales: CapacitacionConMicrotestUI[] = [];
  try {
    const lista = await listarCapacitacionesParaMicrotest();
    capacitacionesIniciales = lista.map((cap) => ({
      id: cap.id,
      titulo: cap.titulo,
      unidad: cap.unidad,
      ambito: cap.ambito,
      estado: cap.estado,
      evaluacion: cap.evaluacion
        ? {
            id: cap.evaluacion.id,
            capacitacionId: cap.evaluacion.capacitacionId,
            titulo: cap.evaluacion.titulo,
            notaMinima: cap.evaluacion.notaMinima,
            maxIntentos: cap.evaluacion.maxIntentos,
            tiempoLimiteSeg: cap.evaluacion.tiempoLimiteSeg,
            preguntas: cap.evaluacion.preguntas.map((p) => ({
              id: p.id,
              enunciado: p.enunciado,
              opciones: p.opciones,
              correcta: p.correcta,
              retroalimentacion: p.retroalimentacion ?? null,
            })),
            _count: { intentos: cap.evaluacion._count.intentos },
          }
        : null,
    }));
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
