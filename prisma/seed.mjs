import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando capacitaciones e inducciones reales para el personal de CGB Academy...');

  // -------------------------------------------------------------------------
  // 1. Cuentas de Usuario de Prueba (Sin modificar roles ni credenciales)
  // -------------------------------------------------------------------------
  const claveAdmin = 'Admin2026!*';
  const claveColab = 'Colab2026!*';

  const hashAdmin = await hash(claveAdmin, 10);
  const hashColab = await hash(claveColab, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@cgb.latam' },
    update: {
      name: 'Administrador Institucional',
      role: 'ADMINISTRADOR',
      passwordHash: hashAdmin,
      activo: true,
    },
    create: {
      email: 'admin@cgb.latam',
      name: 'Administrador Institucional',
      role: 'ADMINISTRADOR',
      passwordHash: hashAdmin,
      activo: true,
    },
  });

  const colaborador = await prisma.user.upsert({
    where: { email: 'colaborador@cgb.latam' },
    update: {
      name: 'Colaborador Académico',
      role: 'COLABORADOR',
      passwordHash: hashColab,
      activo: true,
    },
    create: {
      email: 'colaborador@cgb.latam',
      name: 'Colaborador Académico',
      role: 'COLABORADOR',
      passwordHash: hashColab,
      activo: true,
    },
  });

  console.log(`✅ Usuarios preservados: ${admin.email} (ADMINISTRADOR) y ${colaborador.email} (COLABORADOR)`);

  // -------------------------------------------------------------------------
  // 2. Limpieza de capacitaciones anteriores
  // -------------------------------------------------------------------------
  console.log('🧹 Limpiando capacitaciones anteriores...');
  await prisma.slide.deleteMany({});
  await prisma.capacitacion.deleteMany({});

  // -------------------------------------------------------------------------
  // 3. Capacitaciones del Personal de la Empresa CGB
  // -------------------------------------------------------------------------
  const capacitacionesPersonal = [
    // ═══════════════════════════════════════════════════════════════════════
    // 1. INDUCCIÓN GENERAL PARA EL PERSONAL DE CGB
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Inducción al Personal: Bienvenida a la Empresa CGB y Cultura Laboral',
      descripcion: 'Capacitación obligatoria para todo el personal que se incorpora al equipo CGB. Conoce nuestra estructura organizacional, valores institucionales, canales de comunicación y dinámica de trabajo.',
      unidad: 'GENERAL',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-01T08:00:00Z'),
      categoria: 'Inducción',
      duracionMin: 25,
      icono: 'award',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Bienvenida al Equipo de Trabajo CGB',
          contenido: 'En CGB valoramos el talento y el compromiso de cada colaborador. Esta inducción te brindará las pautas esenciales para integrarte rápidamente a nuestras actividades operativas y proyectos.',
          tipo: 'IMAGE',
          imagenUrl: '/images/capacitaciones/induccion_personal.jpg',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Conoce nuestras áreas especializadas: CIIP, GEOMINA y BIOMEDIC',
            'Ambiente colaborativo enfocado en la excelencia y el respeto mutuo',
            'Canales de acompañamiento y mentoría durante tus primeras semanas',
          ],
        },
        {
          orden: 2,
          titulo: 'Valores Corporativos y Convivencia Laboral',
          contenido: 'Nuestra cultura se fundamenta en principios claros que guían el desempeño de todo el personal en la empresa.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Compromiso y puntualidad en los compromisos laborales',
            'Comunicación transparente, horizontal y constructiva',
            'Protección estricta de la información confidencial de la empresa',
            'Cero tolerancia a cualquier conducta discriminatoria o de acoso',
          ],
        },
        {
          orden: 3,
          titulo: 'Canales Oficiales y Portal Corporativo',
          contenido: 'Accede al portal institucional de la empresa para conocer nuestras iniciativas y novedades académicas.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Visitar Portal CGB Academy',
          botonUrl: 'https://cgbacademy.com',
          lista: [
            'Portal web principal: cgbacademy.com',
            'Coordinación de bienvenida con el área de Talento Humano',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 2. OPERACIÓN DE LA PLATAFORMA LEDS (leds.cgbacademy.tech)
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Operación y Gestión de la Plataforma LEDS para el Personal CGB',
      descripcion: 'Capacitación para colaboradores y personal administrativo sobre el uso, administración y monitoreo de nuestra plataforma educativa LEDS (leds.cgbacademy.tech).',
      unidad: 'CIIP',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-02T09:30:00Z'),
      categoria: 'Estudiantes',
      duracionMin: 30,
      icono: 'layout',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Administración de la Plataforma LEDS CGB',
          contenido: 'La plataforma LEDS (leds.cgbacademy.tech) es el entorno centralizado donde los estudiantes y docentes interactúan con los programas y contenidos de CGB Academy.',
          tipo: 'IMAGE',
          imagenUrl: '/images/capacitaciones/gestion_plataforma.jpg',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Gestión de matrículas y habilitación de usuarios',
            'Monitoreo de progreso y métricas de participación estudiantil',
            'Publicación y actualización de contenidos formativos',
          ],
        },
        {
          orden: 2,
          titulo: 'Flujo de Soporte y Asistencia a Usuarios',
          contenido: 'Pautas para el personal encargado de resolver dudas técnicas y académicas de los participantes en la plataforma LEDS.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Revisión diaria del buzón de consultas y tickets de ayuda',
            'Restablecimiento seguro de accesos y contraseñas',
            'Derivación oportuna de casos especiales al docente o coordinador',
          ],
        },
        {
          orden: 3,
          titulo: 'Acceso Directo a la Plataforma LEDS',
          contenido: 'Ingresa a la plataforma oficial LEDS para explorar el entorno operativo con tu cuenta institucional asignada.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Abrir Plataforma LEDS (leds.cgbacademy.tech)',
          botonUrl: 'https://leds.cgbacademy.tech',
          lista: [
            'Entorno de gestión: leds.cgbacademy.tech',
            'Inicio de sesión mediante credenciales institucionales CGB',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 3. ATENCIÓN Y COORDINACIÓN ACADÉMICA CON ESTUDIANTES Y DOCENTES
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Protocolo de Atención, Coordinación Académica y Soporte al Usuario',
      descripcion: 'Guía de servicio y atención de calidad para el personal que coordina con estudiantes y docentes de la comunidad CGB Academy.',
      unidad: 'GENERAL',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-03T11:00:00Z'),
      categoria: 'Docentes',
      duracionMin: 25,
      icono: 'message-circle',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Excelencia en el Servicio y Atención CGB',
          contenido: 'La satisfacción de nuestros estudiantes y docentes depende de una comunicación empática, clara y oportuna en todos los canales de la empresa.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/cgb-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Respuesta ágil y personalizada en menos de 24 horas laborables',
            'Lenguaje profesional, cordial y respetuoso en todo momento',
            'Registro y seguimiento de sugerencias de mejora',
          ],
        },
        {
          orden: 2,
          titulo: 'Gestión de Incidencias y Preguntas Frecuentes',
          contenido: 'Manejo de consultas recurrentes sobre accesos a clases, materiales didácticos y constancias de participación.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Uso de plantillas de respuesta estandarizadas para agilizar la atención',
            'Escalamiento inmediato de problemas técnicos a la unidad CIIP',
            'Validación de datos antes de proporcionar información de cuentas',
          ],
        },
        {
          orden: 3,
          titulo: 'Mesa de Ayuda Institucional',
          contenido: 'Consulta la base de conocimientos y guías rápidas para el personal de soporte.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Acceder a Base de Conocimientos',
          botonUrl: 'https://cgbacademy.com/soporte',
          lista: [
            'Directorio de coordinadores por unidad',
            'Manuales de usuario para estudiantes y profesores',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 4. PROTOCOLOS DE SEGURIDAD OPERACIONAL PARA PERSONAL GEOMINA
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Protocolo de Seguridad Operacional y Trabajo en Campo para Personal GEOMINA',
      descripcion: 'Capacitación para colaboradores y personal técnico de GEOMINA en procedimientos de seguridad laboral, uso de EPPs y protocolos en salidas de campo.',
      unidad: 'GEOMINA',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-04T08:30:00Z'),
      categoria: 'Inducción',
      duracionMin: 35,
      icono: 'shield',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Seguridad en Operaciones y Salidas de Campo',
          contenido: 'Todo el personal de la unidad GEOMINA debe aplicar de manera irrestricta las normas de prevención de riesgos en cada inspección técnica.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/geomina-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Revisión y llenado obligatorio de la matriz IPERC Continuo',
            'Porte permanente de Equipos de Protección Personal (EPP)',
            'Reporte preventivo de actos y condiciones subestándar',
          ],
        },
        {
          orden: 2,
          titulo: 'Equipamiento de Protección Personal (EPP) Requerido',
          contenido: 'Elementos indispensables asignados al personal para actividades en campo y zonas de estudio geológico.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Casco de seguridad certificado con barbiquejo',
            'Chaleco de alta visibilidad con cintas reflectivas',
            'Calzado de seguridad con suela antideslizante y puntera reforzada',
            'Protección visual y solar con filtro UV homologado',
          ],
        },
        {
          orden: 3,
          titulo: 'Plan de Emergencia y Contacto de Auxilio',
          contenido: 'Revisa las vías de comunicación y números de emergencia establecidos por la empresa CGB para el personal en campo.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Ver Protocolo de Emergencias GEOMINA',
          botonUrl: 'https://cgbacademy.com/geomina/seguridad',
          lista: [
            'Canal radial y teléfono de enlace de la cuadrilla',
            'Ubicación del botiquín y equipos de primeros auxilios',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 5. PROTOCOLOS DE CALIDAD Y BIOSEGURIDAD PARA PERSONAL BIOMEDIC
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Protocolos de Calidad Técnica y Bioseguridad para Personal BIOMEDIC',
      descripcion: 'Capacitación para el personal técnico y colaboradores de la unidad BIOMEDIC sobre estándares de servicio en clínicas, calibración de equipos y bioseguridad.',
      unidad: 'BIOMEDIC',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-04T15:00:00Z'),
      categoria: 'Inducción',
      duracionMin: 30,
      icono: 'activity',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Estándares de Servicio y Calidad Técnica BIOMEDIC',
          contenido: 'El personal de BIOMEDIC representa a CGB en cada centro de salud, garantizando la precisión, seguridad eléctrica y operatividad del equipamiento médico.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/biomedic-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Cumplimiento de protocolos de seguridad eléctrica IEC 60601',
            'Calibración metrológica con patrones certificados vigentes',
            'Emisión y firma de informes de conformidad de servicio',
          ],
        },
        {
          orden: 2,
          titulo: 'Normas de Bioseguridad en Áreas Hospitalarias',
          contenido: 'Pautas de bioprotección obligatorias para el personal durante intervenciones técnicas en laboratorios, quirófanos y salas de cuidados intensivos.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Uso estricto de guantes, mascarilla N95 y batas de bioseguridad',
            'Desinfección previa y posterior de herramientas de medición',
            'Segregación responsable de residuos biocontaminados en contenedores rojos',
          ],
        },
        {
          orden: 3,
          titulo: 'Formatos Digitales de Servicio Técnico',
          contenido: 'Accede al sistema de gestión de órdenes de trabajo para registrar las intervenciones técnicas del personal.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Abrir Formatos de Servicio BIOMEDIC',
          botonUrl: 'https://cgbacademy.com/biomedic/formatos',
          lista: [
            'Ficha técnica de mantenimiento preventivo y correctivo',
            'Control de inventario de repuestos y accesorios biomédicos',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // 6. CAPACITACIÓN INTERNA DE SEGURIDAD DE LA INFORMACIÓN
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Protocolo de Seguridad de la Información y Gestión de Accesos del Personal',
      descripcion: 'Capacitación interna sobre políticas de seguridad informática, resguardo de credenciales corporativas y protección de datos de la empresa CGB.',
      unidad: 'GENERAL',
      ambito: 'INTERNO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-05T10:00:00Z'),
      categoria: 'Inducción',
      duracionMin: 20,
      icono: 'lock',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Seguridad Digital y Manejo de Cuentas',
          contenido: 'Cada colaborador es responsable de custodiar sus credenciales de acceso y de proteger la información confidencial de la empresa.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Uso de contraseñas complejas y activación de doble factor (2FA)',
            'Prohibición estricta de compartir accesos con terceros',
            'Bloqueo de pantalla obligatorio al ausentarse del puesto de trabajo',
          ],
        },
      ],
    },
  ];

  // -------------------------------------------------------------------------
  // 4. Inserción en MongoDB Atlas
  // -------------------------------------------------------------------------
  for (const cap of capacitacionesPersonal) {
    const { slides, ...datosCapacitacion } = cap;
    const creada = await prisma.capacitacion.create({
      data: datosCapacitacion,
    });

    if (slides && slides.length > 0) {
      for (const slide of slides) {
        await prisma.slide.create({
          data: {
            ...slide,
            capacitacionId: creada.id,
          },
        });
      }
    }

    console.log(`  ➕ Capacitación de Personal CGB creada: [${creada.unidad}] "${creada.titulo}" (${slides.length} slides, ${creada.ambito})`);
  }

  console.log('✨ Siembra de capacitaciones del personal completada exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el proceso de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
