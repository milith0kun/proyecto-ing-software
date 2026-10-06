import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { sesionActual } from '@/lib/sesion';
import { consultarVistaPrevia } from '@/lib/consultar-vista-previa';
import { ExperienciaCapacitacion } from '@/components/capacitaciones/ExperienciaCapacitacion';
import { PublicarCapacitacion } from '@/components/capacitaciones/PublicarCapacitacion';
import { MarcoCapacitacion } from '@/components/capacitaciones/MarcoCapacitacion';

export const dynamic = 'force-dynamic';

export default async function PaginaVistaPrevia({ params }: { params: Promise<{ id: string }> }) {
  const usuario = await sesionActual();
  if (!usuario) redirect('/login');
  if (usuario.role !== 'ADMINISTRADOR') redirect('/colaborador');
  const { id } = await params;
  const capacitacion = await consultarVistaPrevia(id, identificador => prisma.capacitacion.findUnique({ where: { id: identificador }, include: { slides: { orderBy: { orden: 'asc' } } } }));
  if (!capacitacion) notFound();

  return <MarcoCapacitacion vistaPrevia controles={
      <aside className="publicacion-panel" aria-label="Controles de vista previa">
        <div><p className="kicker-cgb">Vista previa · {capacitacion.estado === 'PUBLICADA' ? 'Publicada' : 'Borrador'}</p>
          <p>Revisa la experiencia final. Abrir esta vista no publica ni cambia la capacitación.</p>
          <p>Ámbito: {capacitacion.ambito === 'PUBLICO' ? 'Público' : 'Interno'}{capacitacion.publicadaEn && <> · Publicada el {capacitacion.publicadaEn.toLocaleString('es-PE', { timeZone: 'America/Lima' })}</>}</p>
        </div>
        <div className="publicacion-acciones"><Link className="boton-secundario" href={`/admin/capacitaciones/${id}/contenido`}>Volver al contenido</Link>
          <PublicarCapacitacion id={id} titulo={capacitacion.titulo} ambito={capacitacion.ambito} estado={capacitacion.estado} />
        </div>
      </aside>
    }>
      <ExperienciaCapacitacion capacitacion={capacitacion} />
      {capacitacion.estado === 'PUBLICADA' && capacitacion.ambito === 'PUBLICO' && <div className="publicacion-enlace-final"><Link className="boton-secundario" href={`/capacitaciones/${id}`}>Abrir capacitación pública</Link></div>}
  </MarcoCapacitacion>;
}
