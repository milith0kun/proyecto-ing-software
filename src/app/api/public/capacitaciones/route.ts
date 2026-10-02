import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { filtrarCapacitacionesPublicas, buscarEnCatalogoPublico, ItemCapacitacionPublica } from '@/lib/catalogo-publico';

export const dynamic = 'force-dynamic';

/**
 * GET /api/public/capacitaciones
 * Devuelve el catálogo de capacitaciones públicas disponibles para estudiantes,
 * docentes y visitantes generales de CGB Academy (HU-005).
 *
 * Criterio de Aceptación CA-01:
 *   Solo expone registros con ambito = "PUBLICO" y estado = "PUBLICADA".
 * Criterio de Aceptación CA-02:
 *   Soporta filtrado por unidad (?unidad=CIIP), categoría (?categoria=Estudiantes) y búsqueda (?q=mineria).
 * Criterio de Aceptación CA-03:
 *   Acceso 100% abierto sin requerir credenciales ni alterar el avance del usuario.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unidadParam = searchParams.get('unidad');
    const categoriaParam = searchParams.get('categoria');
    const qParam = searchParams.get('q');

    // 1. Consulta estricta a MongoDB Atlas garantizando aislamiento de visibilidad (CA-01)
    const registros = await prisma.capacitacion.findMany({
      where: {
        ambito: 'PUBLICO',
        estado: 'PUBLICADA',
      },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { slides: true } },
      },
    });

    // 2. Mapeo a estructura limpia para consumo público
    const capacitacionesPublicas: ItemCapacitacionPublica[] = registros.map((r) => ({
      id: r.id,
      titulo: r.titulo,
      descripcion: r.descripcion,
      unidad: r.unidad,
      ambito: r.ambito,
      estado: r.estado,
      categoria: r.categoria,
      duracionMin: r.duracionMin,
      icono: r.icono,
      slidesCount: r._count?.slides ?? 0,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));

    // 3. Aplicación de filtros de unidad y categoría (CA-02)
    let resultado = filtrarCapacitacionesPublicas(capacitacionesPublicas, {
      unidad: unidadParam && unidadParam !== 'TODAS' ? unidadParam : undefined,
      categoria: categoriaParam && categoriaParam !== 'TODAS' ? categoriaParam : undefined,
    });

    // 4. Búsqueda por texto coincidente si se proporciona parámetro 'q' (CA-02)
    if (qParam && qParam.trim() !== '') {
      resultado = buscarEnCatalogoPublico(resultado, qParam);
    }

    return NextResponse.json({
      ok: true,
      total: resultado.length,
      datos: resultado,
      filtrosAplicados: {
        unidad: unidadParam || 'TODAS',
        categoria: categoriaParam || 'TODAS',
        q: qParam || '',
      },
    });
  } catch (error: unknown) {
    const mensaje =
      error instanceof Error ? error.message : 'Error al obtener el catálogo público.';
    return NextResponse.json({ ok: false, error: mensaje }, { status: 500 });
  }
}
