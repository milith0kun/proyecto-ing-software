import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando guías interactivas de inducción y acceso a plataformas para CGB Academy...');

  // -------------------------------------------------------------------------
  // 1. Cuentas de Usuario de Prueba
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
  // 2. Limpieza de datos anteriores
  // -------------------------------------------------------------------------
  console.log('🧹 Limpiando capacitaciones anteriores...');
  await prisma.slide.deleteMany({});
  await prisma.capacitacion.deleteMany({});

  // -------------------------------------------------------------------------
  // 3. Cursos e Instructivos Paso a Paso con Capturas de Plataforma
  // -------------------------------------------------------------------------
  const cursosGuias = [
    // ═══════════════════════════════════════════════════════════════════════
    // GUÍA 1: CÓMO CREAR TU CUENTA Y ACCEDER A CGB ACADEMY
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Guía de Inicio: Cómo Crear tu Cuenta y Acceder a CGB Academy',
      descripcion: 'Instructivo paso a paso para nuevos estudiantes, docentes y miembros de la empresa. Aprende a registrarte en el portal oficial cgbacademy.com, validar tu correo y activar tu perfil institucional.',
      unidad: 'GENERAL',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-01T08:00:00Z'),
      categoria: 'Inducción',
      duracionMin: 15,
      icono: 'user-plus',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Paso 1: Formulario de Registro en cgbacademy.com',
          contenido: 'Para ingresar a nuestros programas, primero debes crear tu cuenta en la plataforma. Completa tus nombres completos, correo electrónico institucional o personal y define una contraseña segura.',
          tipo: 'IMAGE',
          imagenUrl: '/images/slides/registro_cuenta_cgb.jpg',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Ingresa tus nombres y apellidos completos para la emisión de tus constancias',
            'Utiliza un correo electrónico al que tengas acceso continuo',
            'Define una contraseña de al menos 8 caracteres con letras y números',
          ],
        },
        {
          orden: 2,
          titulo: 'Paso 2: Confirmación y Validación de Acceso',
          contenido: 'Una vez enviado el formulario, recibirás un mensaje de verificación para confirmar tu cuenta. Haz clic en el enlace para habilitar tu acceso al catálogo de capacitaciones.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Revisa tu bandeja de entrada o carpeta de spam si no ves el mensaje de activación',
            'Inicia sesión con tu correo y contraseña registrados',
            'Si eres colaborador de la empresa CGB, solicita a tu supervisor la asignación de tu rol',
          ],
        },
        {
          orden: 3,
          titulo: 'Paso 3: Ingresar al Portal Oficial de CGB Academy',
          contenido: '¡Listo! Ya puedes acceder directamente al portal web para explorar todos los programas y contenidos formativos disponibles.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Crear Cuenta en cgbacademy.com',
          botonUrl: 'https://cgbacademy.com',
          lista: [
            'Portal web principal: https://cgbacademy.com',
            'Soporte técnico de cuentas: soporte@cgb.latam',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // GUÍA 2: CÓMO NAVEGAR Y ACCEDER A CURSOS EN LEDS (leds.cgbacademy.tech)
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Manual del Usuario: Navegación y Acceso a Cursos en LEDS (leds.cgbacademy.tech)',
      descripcion: 'Aprende a utilizar el campus virtual LEDS. Explora tu panel de cursos inscritos, filtra contenidos por unidad (CIIP, GEOMINA, BIOMEDIC), revisa tus avances y accede a los materiales interactivos.',
      unidad: 'CIIP',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-02T09:00:00Z'),
      categoria: 'Estudiantes',
      duracionMin: 20,
      icono: 'layout',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Paso 1: Panel Principal de Cursos (Dashboard LEDS)',
          contenido: 'Al ingresar a leds.cgbacademy.tech con tu cuenta, verás tu panel principal con los cursos asignados, porcentaje de avance por lección y pestañas de filtrado por área técnica (CIIP, GEOMINA, BIOMEDIC).',
          tipo: 'IMAGE',
          imagenUrl: '/images/slides/campus_virtual_leds.jpg',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Pestañas de unidad: filtra cursos de CIIP, GEOMINA o BIOMEDIC con un solo clic',
            'Barra de progreso en tiempo real que registra cada diapositiva visualizada',
            'Acceso rápido a tareas, asignaciones y comunidad académica en el menú lateral',
          ],
        },
        {
          orden: 2,
          titulo: 'Paso 2: Visualizador Interactivo y Descarga de Materiales',
          contenido: 'Cada curso está compuesto por diapositivas interactivas con recursos multimedia, guías paso a paso y enlaces directos a herramientas de práctica.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Navega con las flechas de tu teclado o mediante los botones Anterior / Siguiente',
            'En dispositivos móviles puedes deslizar horizontalmente (swipe)',
            'Al llegar a la última diapositiva haz clic en Terminar Capacitación para registrar tu conformidad',
          ],
        },
        {
          orden: 3,
          titulo: 'Paso 3: Entrar al Campus Virtual LEDS',
          contenido: 'Accede a la plataforma de aprendizaje para comenzar con tus cursos matriculados.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Entrar a leds.cgbacademy.tech',
          botonUrl: 'https://leds.cgbacademy.tech',
          lista: [
            'Campus virtual en vivo: https://leds.cgbacademy.tech',
            'Disponible 24/7 desde cualquier navegador móvil o de escritorio',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // GUÍA 3: INDUCCIÓN A LOS CURSOS DE LA UNIDAD CIIP
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Inducción CIIP: Guía de Acceso a Programas de Innovación y Software',
      descripcion: 'Instructivo para estudiantes y nuevos miembros sobre cómo matricularse y seguir la ruta formativa de la unidad CIIP en la plataforma.',
      unidad: 'CIIP',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-03T10:30:00Z'),
      categoria: 'Estudiantes',
      duracionMin: 20,
      icono: 'code',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Oferta Formativa de la Unidad CIIP',
          contenido: 'La unidad CIIP ofrece programas en ingeniería de software, arquitectura en la nube, inteligencia artificial aplicada y desarrollo web moderno.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/ciip-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Cursos teóricos y talleres prácticos orientados a proyectos reales',
            'Uso de tecnologías líderes: Next.js, TypeScript, Docker y MongoDB',
            'Acompañamiento docente y resolución de consultas técnicas',
          ],
        },
        {
          orden: 2,
          titulo: 'Inscripción y Rutas de Aprendizaje CIIP',
          contenido: 'Revisa los requisitos previos de cada módulo y activa tu participación directamente desde tu panel de usuario.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Selecciona el filtro CIIP en el catálogo de cursos',
            'Sigue la secuencia recomendada desde fundamentos hasta nivel avanzado',
          ],
        },
        {
          orden: 3,
          titulo: 'Explorar Cursos CIIP en LEDS',
          contenido: 'Ingresa a la sección especializada de CIIP en la plataforma de aprendizaje.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Ver Cursos CIIP en leds.cgbacademy.tech',
          botonUrl: 'https://leds.cgbacademy.tech',
          lista: [
            'Plataforma: https://leds.cgbacademy.tech',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // GUÍA 4: INDUCCIÓN A LOS CURSOS DE LA UNIDAD GEOMINA
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Inducción GEOMINA: Guía de Acceso a Programas de Minería y Geología',
      descripcion: 'Instructivo para participantes sobre la oferta formativa de la unidad GEOMINA: topografía digital, seguridad minera, QGIS y geotecnia.',
      unidad: 'GEOMINA',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-04T09:00:00Z'),
      categoria: 'Estudiantes',
      duracionMin: 20,
      icono: 'shield',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Programas de Capacitación GEOMINA',
          contenido: 'La unidad GEOMINA brinda formación especializada en seguridad minera, sistemas de información geográfica (SIG/QGIS) y análisis geológico.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/geomina-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Normativa de seguridad y protocolos en operaciones de campo',
            'Manejo de datos espaciales y modelos digitales de elevación',
            'Certificaciones alineadas a estándares de la industria minera',
          ],
        },
        {
          orden: 2,
          titulo: 'Requisitos y Materiales de Descarga',
          contenido: 'Cada capacitación incluye paquetes cartográficos y manuales en PDF para seguir las sesiones prácticas.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Descarga las capas de prueba y formatos de inspección técnica',
            'Participa en las evaluaciones de comprobación de conocimientos',
          ],
        },
        {
          orden: 3,
          titulo: 'Acceder a Programas GEOMINA',
          contenido: 'Conoce los cursos abiertos de la unidad GEOMINA en la plataforma institucional.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Ver Cursos GEOMINA en leds.cgbacademy.tech',
          botonUrl: 'https://leds.cgbacademy.tech',
          lista: [
            'Portal oficial: https://cgbacademy.com',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // GUÍA 5: INDUCCIÓN A LOS CURSOS DE LA UNIDAD BIOMEDIC
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Inducción BIOMEDIC: Guía de Acceso a Programas de Tecnología Médica',
      descripcion: 'Instructivo para estudiantes y personal sobre los programas de la unidad BIOMEDIC: mantenimiento hospitalario, seguridad eléctrica IEC 60601 y bioseguridad.',
      unidad: 'BIOMEDIC',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-04T16:00:00Z'),
      categoria: 'Docentes',
      duracionMin: 20,
      icono: 'activity',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Programas de Ingeniería y Tecnología Biomédica',
          contenido: 'La unidad BIOMEDIC capacita en protocolos de calibración metrológica, gestión de equipamiento clínico y normativas sanitarias hospitalarias.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/biomedic-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Mantenimiento preventivo de monitores, ecógrafos y autoclaves',
            'Seguridad del paciente y gestión de riesgo clínico',
            'Talleres prácticos con simuladores e instrumentos certificados',
          ],
        },
        {
          orden: 2,
          titulo: 'Metodología de Estudio y Evaluación',
          contenido: 'Revisa las diapositivas de cada módulo y completa el cuestionario de bioseguridad para validar tus competencias.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Lectura correlativa de todas las diapositivas del visor',
            'Registro automático de tu avance al finalizar la experiencia',
          ],
        },
        {
          orden: 3,
          titulo: 'Ver Cursos BIOMEDIC en la Plataforma',
          contenido: 'Ingresa al catálogo para iniciar tu formación en la unidad BIOMEDIC.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Acceder a Cursos BIOMEDIC',
          botonUrl: 'https://leds.cgbacademy.tech',
          lista: [
            'Plataforma: https://leds.cgbacademy.tech',
          ],
        },
      ],
    },
  ];

  // -------------------------------------------------------------------------
  // 4. Inserción en MongoDB Atlas
  // -------------------------------------------------------------------------
  for (const cap of cursosGuias) {
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

    console.log(`  ➕ Guía / Curso creado: [${creada.unidad}] "${creada.titulo}" (${slides.length} slides, ${creada.ambito})`);
  }

  console.log('✨ Siembra de guías e instructivos de plataforma completada exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el proceso de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
