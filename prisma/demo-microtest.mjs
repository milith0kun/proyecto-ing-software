// Datos TEMPORALES para probar el microtest (HU-014) en el navegador.
//   node prisma/demo-microtest.mjs crear   -> crea la capacitación [DEMO] y su evaluación
//   node prisma/demo-microtest.mjs borrar  -> elimina solo lo creado por este script
// No toca otras capacitaciones ni usuarios.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const TITULO = '[DEMO] Microtest HU-014';

async function borrar() {
  const demo = await prisma.capacitacion.findMany({ where: { titulo: TITULO }, select: { id: true } });
  const ids = demo.map(c => c.id);
  const evaluaciones = await prisma.evaluacion.findMany({ where: { capacitacionId: { in: ids } }, select: { id: true } });
  const r = {
    intentos: (await prisma.intentoEvaluacion.deleteMany({ where: { evaluacionId: { in: evaluaciones.map(e => e.id) } } })).count,
    evaluaciones: (await prisma.evaluacion.deleteMany({ where: { capacitacionId: { in: ids } } })).count,
    progresos: (await prisma.progresoCapacitacion.deleteMany({ where: { capacitacionId: { in: ids } } })).count,
    slides: (await prisma.slide.deleteMany({ where: { capacitacionId: { in: ids } } })).count,
    capacitaciones: (await prisma.capacitacion.deleteMany({ where: { id: { in: ids } } })).count,
  };
  console.log('Borrado:', r);
}

async function crear() {
  await borrar();
  const capacitacion = await prisma.capacitacion.create({
    data: {
      titulo: TITULO, descripcion: 'Capacitación temporal para validar el microtest.',
      unidad: 'GENERAL', ambito: 'INTERNO', estado: 'PUBLICADA', publicadaEn: new Date(),
      slides: { create: [1, 2, 3].map(n => ({ orden: n, titulo: `Diapositiva ${n}`, contenido: `Contenido de la diapositiva ${n}.`, tipo: 'INFO' })) },
    },
  });
  await prisma.evaluacion.create({
    data: {
      capacitacionId: capacitacion.id, titulo: 'Microtest de prueba', notaMinima: 70, maxIntentos: 2, tiempoLimiteSeg: 120,
      preguntas: [
        { id: 'p1', enunciado: '¿Cuántas diapositivas tiene esta capacitación?', opciones: ['Dos', 'Tres', 'Cuatro'], correcta: 1, retroalimentacion: 'Tiene tres diapositivas.' },
        { id: 'p2', enunciado: '¿Qué nota mínima se exige para aprobar?', opciones: ['50%', '70%', '90%'], correcta: 1, retroalimentacion: 'La nota mínima configurada es 70%.' },
        { id: 'p3', enunciado: '¿Cuántos intentos permite este microtest?', opciones: ['Uno', 'Dos', 'Ilimitados'], correcta: 1, retroalimentacion: 'Permite dos intentos.' },
      ],
    },
  });
  console.log(`Listo. Entra con colaborador@cgb.latam y abre:\nhttp://localhost:3000/colaborador/capacitaciones/${capacitacion.id}`);
  console.log('Respuestas correctas: 2.ª opción en las tres preguntas. Para reprobar, elige otras.');
}

const modo = process.argv[2];
if (modo === 'crear') await crear();
else if (modo === 'borrar') await borrar();
else console.log('Uso: node prisma/demo-microtest.mjs crear|borrar');
await prisma.$disconnect();
