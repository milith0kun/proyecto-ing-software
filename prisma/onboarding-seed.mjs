const puestosIniciales = [
  { puesto: 'Analista de RR. HH.', ruta: 'Inducción de Recursos Humanos', descripcion: 'Ruta institucional para el equipo de Recursos Humanos.' },
  { puesto: 'Operador de Seguridad', ruta: 'Inducción de Seguridad', descripcion: 'Ruta institucional para operaciones de seguridad.' },
  { puesto: 'Analista Financiero', ruta: 'Inducción Financiera', descripcion: 'Ruta institucional para el equipo financiero.' },
  { puesto: 'Especialista de TI', ruta: 'Inducción de Tecnología', descripcion: 'Ruta institucional para el equipo de tecnología.' },
];

export async function sembrarPuestosRutas(prisma) {
  for (const inicial of puestosIniciales) {
    const rutaExistente = await prisma.rutaOnboarding.findFirst({ where: { nombre: inicial.ruta } });
    if (rutaExistente) {
      await prisma.rutaOnboarding.update({
        where: { id: rutaExistente.id },
        data: { descripcion: inicial.descripcion, activa: true },
      });
    } else {
      await prisma.rutaOnboarding.create({
        data: { nombre: inicial.ruta, descripcion: inicial.descripcion, activa: true },
      });
    }
  }
  console.log(`✅ Rutas de onboarding disponibles: ${puestosIniciales.length}`);
}