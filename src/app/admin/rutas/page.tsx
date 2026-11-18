import { obtenerServicioRutas } from '@/lib/rutas-http';
import ConstructorRutas from './ConstructorRutas';

export const dynamic = 'force-dynamic';

export default async function PaginaRutasOnboarding() {
  const { areas, capacitaciones, rutas } = await obtenerServicioRutas().obtenerDatosConstructor();

  const rutasIniciales = rutas.map(r => ({
    id: r.id,
    titulo: r.titulo,
    objetivo: r.objetivo,
    estado: r.estado,
    areaId: r.areaId,
    puestoId: r.puestoId,
    activadaEn: r.activadaEn ? r.activadaEn.toISOString() : null,
    pasos: r.pasos.map(p => ({
      id: p.id,
      rutaId: p.rutaId,
      capacitacionId: p.capacitacionId,
      orden: p.orden,
      obligatorio: p.obligatorio,
      capacitacionTitulo: p.capacitacionTitulo,
    })),
  }));

  return (
    <ConstructorRutas
      areas={areas}
      capacitaciones={capacitaciones}
      rutasIniciales={rutasIniciales}
    />
  );
}
