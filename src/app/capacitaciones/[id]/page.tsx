import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { consultarCapacitacionPublica } from '@/lib/consultar-capacitacion-publica';
import SlideViewer from './SlideViewer';

export const dynamic = 'force-dynamic';

type ContextoPagina = { params: Promise<{ id: string }> };

export default async function PaginaCapacitacionPublica({ params }: ContextoPagina) {
  const { id } = await params;

  const capacitacion = await consultarCapacitacionPublica(id, (where) =>
    prisma.capacitacion.findFirst({
      where,
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        unidad: true,
        estado: true,
        ambito: true,
        slides: {
          orderBy: { orden: 'asc' },
          select: {
            id: true,
            orden: true,
            titulo: true,
            contenido: true,
            tipo: true,
            imagenUrl: true,
            botonTexto: true,
            botonUrl: true,
            lista: true,
          },
        },
      },
    }),
  );

  if (!capacitacion) notFound();

  return (
    <main style={{ minHeight: '100vh', padding: 'clamp(20px, 5vw, 56px) 20px', backgroundColor: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-block', marginBottom: '28px', color: 'var(--brand-blue)', fontWeight: 700, textDecoration: 'none' }}>
          Volver al inicio
        </Link>
        <header style={{ marginBottom: '28px' }}>
          <p style={{ margin: '0 0 8px', color: 'var(--brand-blue)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
            {capacitacion.unidad}
          </p>
          <h1 style={{ margin: '0 0 12px', color: 'var(--brand-navy)', fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 5vw, 42px)', lineHeight: 1.15 }}>
            {capacitacion.titulo}
          </h1>
          <p style={{ maxWidth: '760px', margin: 0, color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.7 }}>
            {capacitacion.descripcion}
          </p>
        </header>
        <SlideViewer slides={capacitacion.slides} />
      </div>
    </main>
  );
}
