import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando capacitaciones por ámbitos (PÚBLICO / INTERNO) y estados (PUBLICADA / BORRADOR)...');

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
  // 3. Capacitaciones Completas: Públicas, Internas y en Borrador
  // -------------------------------------------------------------------------
  const capacitacionesData = [
    // ═══════════════════════════════════════════════════════════════════════
    // SECCIÓN 1: CAPACITACIONES PÚBLICAS (Catálogo Abierto)
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Inducción al Área de Ventas y Finanzas: Facturación, Pasarelas y Matrículas CGB',
      descripcion: 'Capacitación para el equipo comercial y financiero: manejo del panel de ingresos, emisión de comprobantes, control de suscripciones y validación de pagos de estudiantes.',
      unidad: 'GENERAL',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-01T08:00:00Z'),
      categoria: 'Docentes',
      duracionMin: 30,
      icono: 'dollar-sign',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Paso 1: Panel de Analítica Financiera y Ventas (Dashboard)',
          contenido: 'El módulo financiero permite supervisar en tiempo real los ingresos por inscripciones, estado de pagos de estudiantes (Pagado, Pendiente, Vencido) y cursos más vendidos.',
          tipo: 'IMAGE',
          imagenUrl: '/images/slides/dashboard_ventas_finanzas.jpg',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Monitoreo de ingresos totales y margen neto de la academia',
            'Seguimiento a facturas emitidas por cada matrícula de curso',
            'Filtros por rango de fechas y métodos de pago habilitados',
          ],
        },
        {
          orden: 2,
          titulo: 'Paso 2: Validación de Pagos y Habilitación de Cursos',
          contenido: 'Procedimiento operativo para confirmar transferencias y pasarelas de pago antes de otorgar acceso automático al estudiante en la plataforma LEDS.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Verificación de voucher o confirmación electrónica de la pasarela',
            'Cambio de estado de la orden a Aprobado en el sistema comercial',
            'Notificación automática de bienvenida con credenciales al estudiante',
          ],
        },
        {
          orden: 3,
          titulo: 'Paso 3: Acceder al Módulo Financiero',
          contenido: 'Ingresa al sistema de administración comercial para gestionar las cuentas y reportes de ventas.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Abrir Panel Comercial en cgbacademy.com',
          botonUrl: 'https://cgbacademy.com',
          lista: [
            'Portal administrativo: https://cgbacademy.com',
            'Consultas de tesorería: finanzas@cgb.latam',
          ],
        },
      ],
    },
    {
      titulo: 'Portal Docente y Asesoría Académica: Calificaciones, Asistencia y Tutorías',
      descripcion: 'Guía para profesores, coordinadores y asesores pedagógicos: registro de asistencia, calificación de evaluaciones formativas, edición de módulos de clase y retroalimentación a alumnos.',
      unidad: 'CIIP',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-02T09:00:00Z'),
      categoria: 'Docentes',
      duracionMin: 35,
      icono: 'users',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Paso 1: Portal del Instructor y Asesor Académico',
          contenido: 'Desde tu panel docente puedes gestionar la lista de estudiantes matriculados, registrar la asistencia a sesiones en vivo y revisar las tareas pendientes de calificar.',
          tipo: 'IMAGE',
          imagenUrl: '/images/slides/portal_gestion_docente.jpg',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Control de asistencia rápida: Presente, Ausente o Justificado',
            'Gestor de calificaciones y retroalimentación con comentarios personalizados',
            'Editor de módulos para organizar semanas temáticas y diapositivas de clase',
          ],
        },
        {
          orden: 2,
          titulo: 'Paso 2: Acompañamiento y Tutoría Estudiantil',
          contenido: 'Pautas para responder dudas académicas en menos de 24 horas y orientar a los alumnos que requieran nivelación en sus cursos.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Revisión del buzón de preguntas y dudas por cada lección',
            'Publicación de anuncios importantes y recordatorios de entregas',
            'Seguimiento al porcentaje de avance de los estudiantes en riesgo académico',
          ],
        },
        {
          orden: 3,
          titulo: 'Paso 3: Ingresar al Portal Docente',
          contenido: 'Accede a la plataforma para gestionar tus cursos asignados en el presente periodo.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Entrar al Portal Docente (leds.cgbacademy.tech)',
          botonUrl: 'https://leds.cgbacademy.tech',
          lista: [
            'Campus virtual docente: https://leds.cgbacademy.tech',
            'Coordinación académica: academico@cgb.latam',
          ],
        },
      ],
    },
    {
      titulo: 'Inducción al Área de TI: Administración de Cuentas, Servidores y Soporte LEDS',
      descripcion: 'Capacitación para nuevos desarrolladores, ingenieros de soporte y administradores de sistemas: gestión de accesos, monitoreo de infraestructura VPS y mantenimiento de plataformas.',
      unidad: 'CIIP',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-02T11:00:00Z'),
      categoria: 'Estudiantes',
      duracionMin: 30,
      icono: 'cpu',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Paso 1: Consola de Administración Técnica y Monitoreo',
          contenido: 'El equipo de TI supervisa la disponibilidad de las plataformas web de la empresa, asegurando tiempos de respuesta rápidos y seguridad en las bases de datos.',
          tipo: 'IMAGE',
          imagenUrl: '/images/capacitaciones/gestion_plataforma.jpg',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Supervisión del estado de servicios y endpoints en /api/health',
            'Gestión de roles y asignación de permisos a nuevos colaboradores',
            'Control de despliegues continuos mediante contenedores en Dokploy',
          ],
        },
        {
          orden: 2,
          titulo: 'Paso 2: Protocolo de Atención de Tickets de TI',
          contenido: 'Flujo estándar para solucionar problemas de acceso, restablecimiento de contraseñas y errores reportados por usuarios.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Priorización de tickets según nivel de impacto (Crítico, Alto, Normal)',
            'Verificación de identidad antes de modificar credenciales de cuentas',
            'Documentación de soluciones en la base de conocimientos interna',
          ],
        },
        {
          orden: 3,
          titulo: 'Paso 3: Mesa de Soporte Técnico',
          contenido: 'Revisa las herramientas y canales de atención de TI para coordinar con el equipo de infraestructura.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Acceder a Consola de TI CGB',
          botonUrl: 'https://cgbacademy.com/soporte',
          lista: [
            'Canal de soporte de TI: soporte@cgb.latam',
            'Repositorio oficial de plataformas: GitHub Enterprise CGB',
          ],
        },
      ],
    },
    {
      titulo: 'Guía de Inicio del Estudiante: Creación de Cuenta y Acceso a CGB Academy',
      descripcion: 'Manual paso a paso para alumnos e ingresantes: registro en cgbacademy.com, activación de cuenta, exploración del catálogo y matrícula en cursos de CIIP, GEOMINA y BIOMEDIC.',
      unidad: 'GENERAL',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-03T08:00:00Z'),
      categoria: 'Estudiantes',
      duracionMin: 15,
      icono: 'user-plus',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Paso 1: Registro en el Portal Oficial cgbacademy.com',
          contenido: 'Ingresa al formulario de registro, escribe tu nombre completo, tu correo electrónico y genera tu contraseña para crear tu perfil de estudiante.',
          tipo: 'IMAGE',
          imagenUrl: '/images/slides/registro_cuenta_cgb.jpg',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Escribe tus nombres exactos para la emisión de tus certificados',
            'Usa tu correo principal donde recibirás los avisos de tus clases',
            'Acepta los términos de servicio para completar el registro',
          ],
        },
        {
          orden: 2,
          titulo: 'Paso 2: Activación y Acceso al Catálogo de Cursos',
          contenido: 'Revisa tu correo para confirmar tu registro y navega por el catálogo seleccionando tu unidad de interés: CIIP (Software), GEOMINA (Minería) o BIOMEDIC (Salud).',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Haz clic en el enlace de verificación recibido por correo',
            'Explora los cursos disponibles y sus requisitos de inicio',
            'Inscríbete con un solo clic en las capacitaciones abiertas',
          ],
        },
        {
          orden: 3,
          titulo: 'Paso 3: Crear tu Cuenta de Alumno',
          contenido: 'Regístrate ahora mismo en el portal oficial para comenzar a estudiar.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Registrarme en cgbacademy.com',
          botonUrl: 'https://cgbacademy.com',
          lista: [
            'Sitio web oficial: https://cgbacademy.com',
          ],
        },
      ],
    },
    {
      titulo: 'Manual del Alumno: Navegación del Campus Virtual LEDS (leds.cgbacademy.tech)',
      descripcion: 'Instructivo interactivo sobre cómo avanzar en tus clases, visualizar diapositivas, descargar lecturas, participar en foros y obtener tus constancias en LEDS.',
      unidad: 'GENERAL',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-03T10:00:00Z'),
      categoria: 'Estudiantes',
      duracionMin: 20,
      icono: 'layout',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Paso 1: Conoce tu Dashboard en leds.cgbacademy.tech',
          contenido: 'Al ingresar verás todos tus cursos matriculados con sus barras de progreso, accesos a módulos por unidad y accesos directos a tus tareas pendientes.',
          tipo: 'IMAGE',
          imagenUrl: '/images/slides/campus_virtual_leds.jpg',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Pestañas rápidas para alternar entre CIIP, GEOMINA y BIOMEDIC',
            'Seguimiento automático de tu porcentaje de avance por tema',
            'Menú lateral con accesos a calendario de clases y avisos',
          ],
        },
        {
          orden: 2,
          titulo: 'Paso 2: Uso del Visor Interactivo de Lecciones',
          contenido: 'Recorre las diapositivas de cada lección utilizando las teclas de navegación de tu teclado o deslizando en tu smartphone.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Navegación fluida con flechas de teclado o swipe táctil',
            'Botones interactivos para acceder a recursos y talleres prácticos',
            'Haz clic en Terminar Capacitación en el último slide para registrar tu avance',
          ],
        },
        {
          orden: 3,
          titulo: 'Paso 3: Entrar al Campus Virtual LEDS',
          contenido: 'Ingresa al aula virtual para continuar con tus lecciones.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Abrir leds.cgbacademy.tech',
          botonUrl: 'https://leds.cgbacademy.tech',
          lista: [
            'Campus virtual: https://leds.cgbacademy.tech',
          ],
        },
      ],
    },
    {
      titulo: 'Inducción General: Cultura Organizacional y Valores del Equipo CGB',
      descripcion: 'Capacitación de bienvenida para todo el personal de la empresa: pilares de calidad, dinámica de trabajo por sprints, código de ética y canales de comunicación.',
      unidad: 'GENERAL',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-04T08:00:00Z'),
      categoria: 'Inducción',
      duracionMin: 25,
      icono: 'award',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Bienvenida a la Empresa CGB',
          contenido: 'Un cordial saludo de bienvenida. En CGB fomentamos un ambiente laboral colaborativo, innovador y orientado a la excelencia profesional.',
          tipo: 'IMAGE',
          imagenUrl: '/images/capacitaciones/induccion_personal.jpg',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Estructura de nuestras unidades especializadas: CIIP, GEOMINA y BIOMEDIC',
            'Cultura de mejora continua y acompañamiento al nuevo personal',
            'Participación activa en las ceremonias y proyectos del equipo',
          ],
        },
        {
          orden: 2,
          titulo: 'Políticas de Trabajo y Convivencia',
          contenido: 'Valores institucionales indispensables para el buen clima laboral y la seguridad de la información en la empresa.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Puntualidad y compromiso en las entregas de cada sprint',
            'Confidencialidad absoluta sobre datos de clientes y plataformas',
            'Comunicación horizontal y respeto entre todos los integrantes',
          ],
        },
        {
          orden: 3,
          titulo: 'Conoce más en el Portal Corporativo',
          contenido: 'Visita el sitio oficial de la academia para conocer nuestras novedades y eventos.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Visitar cgbacademy.com',
          botonUrl: 'https://cgbacademy.com',
          lista: [
            'Portal institucional: https://cgbacademy.com',
          ],
        },
      ],
    },
    {
      titulo: 'Protocolo de Seguridad Operacional y Trabajo en Campo para Personal GEOMINA',
      descripcion: 'Capacitación en seguridad minera para colaboradores de la unidad GEOMINA: lineamientos D.S. 024-2016-EM, matriz IPERC Continuo y uso obligatorio de EPPs.',
      unidad: 'GEOMINA',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-04T11:00:00Z'),
      categoria: 'Inducción',
      duracionMin: 35,
      icono: 'shield',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Seguridad en Operaciones GEOMINA',
          contenido: 'La seguridad es el valor primordial en cada salida de campo y estudio geológico realizado por nuestro personal.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/geomina-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Llenado obligatorio de la matriz IPERC antes de iniciar labores',
            'Porte de casco con barbiquejo, chaleco reflectivo y botas de seguridad',
            'Conocimiento de las rutas de evacuación y canales de radio de emergencia',
          ],
        },
        {
          orden: 2,
          titulo: 'Protocolo de Emergencias en Campo',
          contenido: 'Procedimientos de primeros auxilios y comunicación inmediata ante incidentes.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Uso de botiquín de primeros auxilios y camilla de rescate',
            'Reporte inmediato a la central de seguridad de la empresa',
          ],
        },
        {
          orden: 3,
          titulo: 'Manual de Seguridad GEOMINA',
          contenido: 'Descarga el reglamento interno de seguridad en operaciones mineras de la empresa.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Ver Protocolos GEOMINA',
          botonUrl: 'https://cgbacademy.com',
          lista: [
            'Portal: https://cgbacademy.com',
          ],
        },
      ],
    },
    {
      titulo: 'Protocolos de Calidad Técnica y Bioseguridad para Personal BIOMEDIC',
      descripcion: 'Capacitación para técnicos e ingenieros de la unidad BIOMEDIC: calibración de equipos médicos, seguridad eléctrica IEC 60601 y bioprotección en clínicas.',
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
          titulo: 'Servicio Técnico Biomédico Hospitalario',
          contenido: 'Nuestro equipo garantiza la máxima precisión y seguridad clínica en el mantenimiento de equipamiento médico hospitalario.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/biomedic-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Pruebas de seguridad eléctrica bajo estándar IEC 60601-1',
            'Calibración metrológica con instrumentos patrones certificados',
            'Llenado de fichas de servicio y firmas de conformidad médica',
          ],
        },
        {
          orden: 2,
          titulo: 'Bioseguridad en Instalaciones de Salud',
          contenido: 'Uso obligatorio de barreras de protección personal al intervenir en áreas críticas hospitalarias.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Uso de guantes de nitrilo, mascarillas N95 y batas de protección',
            'Desinfección de herramientas antes y después de cada servicio',
            'Disposición de residuos biocontaminados en contenedores autorizados',
          ],
        },
        {
          orden: 3,
          titulo: 'Formatos de Servicio BIOMEDIC',
          contenido: 'Accede a las órdenes de trabajo digitales del área biomédica.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Abrir Formatos BIOMEDIC',
          botonUrl: 'https://cgbacademy.com',
          lista: [
            'Portal institucional: https://cgbacademy.com',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SECCIÓN 2: CAPACITACIONES INTERNAS (Exclusivas para Personal Autenticado)
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Protocolo Interno de Seguridad de la Información y Gestión de Accesos CGB',
      descripcion: 'Directiva confidencial para colaboradores: custodia de credenciales, activación de doble factor (2FA), resguardo de datos sensibles y auditorías periódicas de accesos.',
      unidad: 'GENERAL',
      ambito: 'INTERNO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-05T09:00:00Z'),
      categoria: 'Inducción',
      duracionMin: 20,
      icono: 'lock',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Política de Ciberseguridad y Accesos Corporativos',
          contenido: 'Cada miembro de CGB es responsable de la protección de las cuentas institucionales y del resguardo estricto de los datos de nuestros estudiantes y clientes.',
          tipo: 'IMAGE',
          imagenUrl: '/images/capacitaciones/gestion_plataforma.jpg',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Uso mandatorio de gestores de contraseñas y claves de al menos 12 caracteres',
            'Activación obligatoria de 2FA en correos institucionales (@cgb.latam)',
            'Bloqueo automático de pantalla ante ausencia temporal del puesto',
          ],
        },
        {
          orden: 2,
          titulo: 'Respuesta ante Incidentes de Seguridad',
          contenido: 'Flujo de reporte inmediato ante sospechas de phishing, correos no autorizados o pérdida de equipos corporativos.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Notificar inmediatamente a seguridad-ti@cgb.latam',
            'No ingresar credenciales en enlaces sospechosos o redes Wi-Fi públicas',
            'Procedimiento de revocación inmediata de sesiones activas',
          ],
        },
      ],
    },
    {
      titulo: 'Manual Interno de Contratos, Remuneraciones y Beneficios Laborales CGB',
      descripcion: 'Guía exclusiva para colaboradores internos sobre el calendario de pagos, políticas de horas extras, seguro de salud complementario y trámite de permisos y vacaciones.',
      unidad: 'GENERAL',
      ambito: 'INTERNO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-05T11:00:00Z'),
      categoria: 'Inducción',
      duracionMin: 25,
      icono: 'file-text',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Gestión de Planilla y Beneficios del Colaborador',
          contenido: 'Información oficial sobre el cronograma de pago mensual, entrega de boletas electrónicas y cobertura de salud para el personal de la empresa CGB.',
          tipo: 'IMAGE',
          imagenUrl: '/images/capacitaciones/induccion_personal.jpg',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Abono de haberes el último día hábil de cada mes',
            'Emisión de boletas digitales firmadas en el portal del colaborador',
            'Beneficios de capacitaciones continuas gratuitas en todas las unidades',
          ],
        },
        {
          orden: 2,
          titulo: 'Procedimiento para Solicitud de Permisos y Vacaciones',
          contenido: 'Cómo solicitar licencias, días libres y periodos vacacionales mediante el formulario digital del área de Gestión del Talento.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Presentar la solicitud con al menos 15 días de anticipación',
            'Coordinación previa con el líder de área para garantizar la continuidad operativa',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // SECCIÓN 3: CAPACITACIONES EN ESTADO BORRADOR (Para pruebas del Admin)
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Taller en Preparación: Automatización y Procesamiento con IA Generativa en CGB',
      descripcion: 'Módulo formativo en construcción para el personal de innovación. Contiene guías para integrar modelos LLM en flujos de trabajo administrativos.',
      unidad: 'CIIP',
      ambito: 'PUBLICO',
      estado: 'BORRADOR',
      publicadaEn: null,
      categoria: 'Docentes',
      duracionMin: 40,
      icono: 'cpu',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Borrador 1: Alcance del Taller de IA',
          contenido: 'Este contenido se encuentra actualmente en fase de redacción por el equipo pedagógico de la unidad CIIP antes de su publicación oficial.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Definición de casos de uso en atención al cliente y soporte',
            'Diseño de prompts estructurados para resúmenes de reuniones',
          ],
        },
        {
          orden: 2,
          titulo: 'Borrador 2: Prácticas y Ejercicios',
          contenido: 'Ejercicios de laboratorio que los docentes podrán realizar en el entorno de pruebas.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Conexión mediante API Keys de prueba',
            'Validación de salidas estructuradas en formato JSON',
          ],
        },
      ],
    },
    {
      titulo: 'Procedimiento Interno de Adquisiciones y Logística de Equipamiento de Campo',
      descripcion: 'Borrador interno sobre el flujo de compra, recepción y calibración de instrumental geológico y minero para la unidad GEOMINA.',
      unidad: 'GEOMINA',
      ambito: 'INTERNO',
      estado: 'BORRADOR',
      publicadaEn: null,
      categoria: 'Inducción',
      duracionMin: 30,
      icono: 'truck',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Flujo de Requerimientos de Compra',
          contenido: 'Guía en borrador para la solicitud y cotización de equipos topográficos e indumentaria de seguridad.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Llenado del formato de orden de compra interna',
            'Revisión técnica de especificaciones por el jefe de operaciones',
          ],
        },
      ],
    },
  ];

  // -------------------------------------------------------------------------
  // 4. Inserción en MongoDB Atlas
  // -------------------------------------------------------------------------
  for (const cap of capacitacionesData) {
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

    console.log(`  ➕ Capacitación creada: [${creada.unidad}] [${creada.ambito}] [${creada.estado}] "${creada.titulo}" (${slides.length} slides)`);
  }

  console.log('✨ Siembra completa con ámbitos INTERNO/PÚBLICO y estados PUBLICADA/BORRADOR exitosa.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el proceso de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
