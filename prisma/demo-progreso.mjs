// Datos TEMPORALES para probar el avance de capacitación (HU-012) en el navegador.
//   node prisma/demo-progreso.mjs crear | borrar
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const TITULO = '[DEMO] Avance HU-012';
async function borrar() {
  const ids = (await prisma.capacitacion.findMany({ where: { titulo: TITULO }, select: { id: true } })).map(c => c.id);
  console.log('Borrado:', {
    progresos: (await prisma.progresoCapacitacion.deleteMany({ where: { capacitacionId: { in: ids } } })).count,
    slides: (await prisma.slide.deleteMany({ where: { capacitacionId: { in: ids } } })).count,
    capacitaciones: (await prisma.capacitacion.deleteMany({ where: { id: { in: ids } } })).count,
  });
}
async function crear() {
  await borrar();
  const c = await prisma.capacitacion.create({ data: {
    titulo: TITULO, descripcion: 'Capacitación temporal para validar guardar, reanudar y finalizar.',
    unidad: 'GENERAL', ambito: 'INTERNO', estado: 'PUBLICADA', publicadaEn: new Date(),
    slides: { create: [1, 2, 3].map(n => ({ orden: n, titulo: `Diapositiva ${n}`, contenido: `Contenido de la diapositiva ${n}.`, tipo: 'INFO' })) },
  } });
  console.log(`http://localhost:3000/colaborador/capacitaciones/${c.id}`);
}
const m = process.argv[2];
if (m === 'crear') await crear(); else if (m === 'borrar') await borrar(); else console.log('Uso: crear|borrar');
await prisma.$disconnect();
