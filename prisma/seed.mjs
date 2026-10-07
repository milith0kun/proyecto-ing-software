import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando siembra (seed) de datos reales para CGB Academy...');

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

  console.log(`✅ Usuarios preservados: ${admin.email} y ${colaborador.email}`);

  // -------------------------------------------------------------------------
  // 2. Limpieza de capacitaciones previas para recarga limpia
  // -------------------------------------------------------------------------
  console.log('🧹 Limpiando capacitaciones anteriores para reestructuración con datos reales...');
  await prisma.slide.deleteMany({});
  await prisma.capacitacion.deleteMany({});

  // -------------------------------------------------------------------------
  // 3. Catálogo de Capacitaciones Reales por Unidad Institucional
  // -------------------------------------------------------------------------
  const capacitacionesData = [
    // ═══════════════════════════════════════════════════════════════════════
    // UNIDAD CIIP: Software, Inteligencia Artificial e Innovación
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Ingeniería de Software y Arquitectura Cloud con Next.js y MongoDB Atlas',
      descripcion: 'Aprende los fundamentos de diseño arquitectónico moderno, APIs RESTful seguras, modelado de esquemas en MongoDB Atlas con Prisma ORM y despliegue continuo en entornos de producción.',
      unidad: 'CIIP',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-01T10:00:00Z'),
      categoria: 'Estudiantes',
      duracionMin: 45,
      icono: 'code',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Bienvenida a la Unidad CIIP',
          contenido: 'El Centro de Investigación e Innovación Productiva (CIIP) lidera iniciativas tecnológicas de vanguardia. En esta capacitación dominarás el ciclo completo de desarrollo de software escalable.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/ciip-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Arquitectura orientada a componentes desacoplados',
            'Modelado y migración de esquemas en MongoDB Atlas',
            'Buenas prácticas de seguridad, CORS y cookies HTTPS',
          ],
        },
        {
          orden: 2,
          titulo: 'Patrones Arquitectónicos y Prisma ORM',
          contenido: 'Implementamos el patrón repositorio y separación estricta de capas para garantizar que los modelos de base de datos se mantengan aislados de la lógica de presentación.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Generación determinística de clientes con prisma generate',
            'Manejo seguro de conexiones agrupadas (Connection Pooling)',
            'Tipado estricto de extremo a extremo con TypeScript',
          ],
        },
        {
          orden: 3,
          titulo: 'Despliegue Continuo y Monitoreo',
          contenido: 'Los estándares de la unidad CIIP exigen despliegues reproducibles mediante Nixpacks y contenedores ligeros en Dokploy, con variables de entorno protegidas.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Pipeline automatizado de pruebas unitarias y de integración',
            'Health checks continuos en el endpoint /api/health',
            'Políticas de revocación y expiración de tokens JWT',
          ],
        },
        {
          orden: 4,
          titulo: 'Taller Práctico y Repositorio de Código',
          contenido: 'Pon a prueba tus conocimientos clonando la plantilla base y ejecutando la suite de validación BDD. Puedes acceder a los lineamientos y repositorio oficial.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Consultar Guía Técnica CIIP',
          botonUrl: 'https://cgb.latam/ciip/docs',
          lista: [
            'Ejecutar npm test para verificar contratos BDD',
            'Configurar DATABASE_URL y AUTH_SECRET localmente',
            'Realizar un Pull Request siguiendo la guía de estilo',
          ],
        },
      ],
    },
    {
      titulo: 'Inteligencia Artificial Aplicada: Modelos LLM y Procesamiento del Lenguaje',
      descripcion: 'Capacitación integral para docentes sobre integración de modelos de lenguaje natural, prompting estructurado, evaluación de sesgos y aplicaciones prácticas en entornos académicos.',
      unidad: 'CIIP',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-02T14:30:00Z'),
      categoria: 'Docentes',
      duracionMin: 60,
      icono: 'cpu',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Introducción a la Inteligencia Artificial Generativa',
          contenido: 'Comprende la evolución de los modelos transformadores y cómo los LLMs procesan el contexto semántico para asistir en la docencia e investigación.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/ciip-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Mecanismos de atención y contexto de ventana',
            'Diferencias entre fine-tuning y Retrieval-Augmented Generation (RAG)',
            'Políticas de privacidad y confidencialidad de datos',
          ],
        },
        {
          orden: 2,
          titulo: 'Estrategias de Prompting Estructurado',
          contenido: 'Diseño sistemático de instrucciones: Few-Shot Prompting, Chain-of-Thought y generación de respuestas en formatos estrictos como JSON estructurado.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Delimitación de roles y restricciones de salida',
            'Validación sintáctica de respuestas automáticas',
            'Prevención de inyecciones de prompts en aplicaciones web',
          ],
        },
        {
          orden: 3,
          titulo: 'Recursos Didácticos y Casos de Estudio',
          contenido: 'Accede al repositorio de herramientas docentes preparadas por la Unidad CIIP para la elaboración interactiva de rúbricas y material pedagógico.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Acceder a Recursos Docentes',
          botonUrl: 'https://cgb.latam/ciip/ia-docentes',
          lista: [
            'Guías de citación de contenido generado por IA',
            'Plantillas de evaluación basadas en rúbricas estandarizadas',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // UNIDAD GEOMINA: Geología, Topografía y Minería
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Seguridad Operacional y Prevención de Riesgos en Minería Moderna',
      descripcion: 'Protocolos indispensables de seguridad en mina según el D.S. 024-2016-EM, matriz IPERC continuo, uso correcto de EPPs y planes de respuesta a emergencias.',
      unidad: 'GEOMINA',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-03T08:15:00Z'),
      categoria: 'Inducción',
      duracionMin: 40,
      icono: 'shield',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Inducción de Seguridad Minera GEOMINA',
          contenido: 'La seguridad es el valor primordial de la Unidad GEOMINA. Cero accidentes es nuestra meta permanente en cada frente de exploración y explotación.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/geomina-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Marco normativo del D.S. 024-2016-EM y modificatorias',
            'Reglas de oro de seguridad en operaciones mineras',
            'Derecho a la negativa al trabajo inseguro',
          ],
        },
        {
          orden: 2,
          titulo: 'Identificación de Peligros y Evaluación de Riesgos (IPERC)',
          contenido: 'El IPERC continuo debe ser completado antes de iniciar cualquier labor crítica en campo o labor subterránea.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Evaluación de la probabilidad y severidad del riesgo',
            'Jerarquía de controles: Eliminación, Sustitución, Ingeniería, Administrativo y EPP',
            'Reporte inmediato de condiciones y actos subestándar',
          ],
        },
        {
          orden: 3,
          titulo: 'Equipos de Protección Personal (EPP) Específicos',
          contenido: 'Todo colaborador y estudiante debe portar los elementos homologados según la zona de trabajo.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Casco de seguridad tipo ala completa con barbiquejo',
            'Botas con puntera de acero y suela dieléctrica antideslizante',
            'Respirador con filtros para polvo y gases P100',
            'Protector auditivo tipo copa o tapón certificado',
          ],
        },
        {
          orden: 4,
          titulo: 'Protocolo de Emergencias y Canales de Alerta',
          contenido: 'Familiarízate con las rutas de escape, estaciones de refugio y números de auxilio rápido ante sismos, desprendimiento de rocas o fugas de gas.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Descargar Manual de Evacuación',
          botonUrl: 'https://cgb.latam/geomina/seguridad',
          lista: [
            'Identificación de refugios mineros y líneas de vida',
            'Comunicación radial en canal de emergencia asignado',
          ],
        },
      ],
    },
    {
      titulo: 'Topografía Digital y Sistemas de Información Geográfica (QGIS)',
      descripcion: 'Manejo de modelos digitales de elevación (DEM), georreferenciación en coordenadas UTM WGS84, fotogrametría con drones y cartografía geológica aplicada.',
      unidad: 'GEOMINA',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-04T11:00:00Z'),
      categoria: 'Estudiantes',
      duracionMin: 50,
      icono: 'map',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Fundamentos de SIG y Cartografía Digital',
          contenido: 'La unidad GEOMINA integra tecnologías geoespaciales para la planificación territorial, delimitación de concesiones y monitoreo geológico.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/geomina-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Sistemas de coordenadas de referencia (CRS) y proyecciones UTM',
            'Estructuras de datos vectoriales (Shapefile, GeoJSON) y raster',
            'Importación de datos de campo tomados con GPS diferencial',
          ],
        },
        {
          orden: 2,
          titulo: 'Procesamiento de Modelos Digitales de Terreno (DEM)',
          contenido: 'Generación de curvas de nivel, cálculo de pendientes, perfiles longitudinales y estimación de volúmenes de movimiento de tierras.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Interpolación de nubes de puntos LiDAR y fotogrametría',
            'Análisis hidrológico de cuencas y drenajes superficiales',
            'Diseño de mapas temáticos con simbología normalizada',
          ],
        },
        {
          orden: 3,
          titulo: 'Descarga de Capas y Datos de Práctica',
          contenido: 'Descarga el paquete cartográfico oficial de la Unidad GEOMINA para realizar los ejercicios del taller.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Descargar Capas QGIS de Prueba',
          botonUrl: 'https://cgb.latam/geomina/gis-datasets',
          lista: [
            'Proyecto base .qgz configurado con simbología institucional',
            'Capas geológicas e hidrológicas de libre distribución',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // UNIDAD BIOMEDIC: Tecnología Médica y Bioseguridad
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Gestión y Mantenimiento Preventivo de Equipamiento Hospitalario',
      descripcion: 'Metodología de inspección técnica, calibración de monitores multiparámetro, seguridad eléctrica bajo la norma IEC 60601 y trazabilidad metrológica hospitalaria.',
      unidad: 'BIOMEDIC',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-04T16:45:00Z'),
      categoria: 'Estudiantes',
      duracionMin: 35,
      icono: 'activity',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Mantenimiento Biomédico Hospitalario',
          contenido: 'La Unidad BIOMEDIC vela por la disponibilidad, precisión y seguridad clínica de los dispositivos médicos en áreas críticas como UCI, quirófanos y emergencias.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/biomedic-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Clasificación por riesgo de dispositivos (Clase I, IIa, IIb, III)',
            'Protocolo de seguridad eléctrica hospitalaria IEC 60601-1',
            'Gestión de inventario de equipos y hoja de vida técnica',
          ],
        },
        {
          orden: 2,
          titulo: 'Calibración y Pruebas Funcionales',
          contenido: 'Inspección de parámetros vitales: ECG, presión no invasiva (NIBP), saturación de oxígeno (SpO2) y capnografía con simuladores de paciente calibrados.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Medición de corrientes de fuga a tierra y de chasis',
            'Verificación de curvas de respuesta y tiempos de alarma',
            'Etiquetado metrológico con fecha de vencimiento visible',
          ],
        },
        {
          orden: 3,
          titulo: 'Protocolos Clínicos y Bitácoras de Entrega',
          contenido: 'Consulta las guías de mantenimiento preventivo y los formatos de recepción y conformidad de equipos médicos.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Ver Formatos de Mantenimiento',
          botonUrl: 'https://cgb.latam/biomedic/protocolos',
          lista: [
            'Llenado de fichas técnicas de inspección preventiva',
            'Procedimiento de baja y disposición final de equipos',
          ],
        },
      ],
    },
    {
      titulo: 'Bioseguridad, Esterilización y Normativa Sanitaria en Laboratorios',
      descripcion: 'Estándares de biocustodia, clasificación de niveles de contención (BSL-1 a BSL-3), manejo de autoclaves y gestión segura de residuos biocontaminados.',
      unidad: 'BIOMEDIC',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-05T09:20:00Z'),
      categoria: 'Docentes',
      duracionMin: 45,
      icono: 'shield',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Bioseguridad y Control de Infecciones',
          contenido: 'Normativas de la OMS y el MINSA para salvaguardar la integridad de docentes, investigadores y alumnos en laboratorios de biotecnología médica.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/biomedic-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Barreras primarias y secundarias de contención',
            'Cabinas de flujo laminar y seguridad biológica clase II',
            'Protocolos de desinfección química y esterilización por vapor',
          ],
        },
        {
          orden: 2,
          titulo: 'Segregación de Residuos Biocontaminados',
          contenido: 'Código de colores y rotulado obligatorio para recipientes de residuos punzocortantes, muestras biológicas y sustancias químicas controladas.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Bolsas rojas para residuos biocontaminados infecciosos',
            'Contenedores rígidos imperforables para agujas y bisturís',
            'Tratamiento previo mediante autoclave antes de disposición externa',
          ],
        },
        {
          orden: 3,
          titulo: 'Certificación y Evaluación de Bioseguridad',
          contenido: 'Completa la evaluación de conocimientos para obtener la acreditación de ingreso a los laboratorios de la Unidad BIOMEDIC.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Iniciar Evaluación de Bioseguridad',
          botonUrl: 'https://cgb.latam/biomedic/evaluacion',
          lista: [
            'Cuestionario interactivo de 10 preguntas',
            'Constancia digital con validez de 1 año académico',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // UNIDAD GENERAL: Inducción Institucional y Cultura CGB
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Inducción Institucional CGB: Cultura, Misión y Valores Corporativos',
      descripcion: 'Conoce la historia, estructura de las unidades especializadas, políticas éticas de transparencia y beneficios para los miembros de la comunidad CGB Academy.',
      unidad: 'GENERAL',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-05T12:00:00Z'),
      categoria: 'Inducción',
      duracionMin: 30,
      icono: 'award',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Bienvenido a CGB Academy',
          contenido: 'CGB Academy es la plataforma insignia de formación continua e inducción institucional que articula el conocimiento de CIIP, GEOMINA y BIOMEDIC.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/cgb-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Excelencia técnica y rigor metodológico',
            'Compromiso con el desarrollo sostenible regional',
            'Innovación continua aplicada a problemas reales',
          ],
        },
        {
          orden: 2,
          titulo: 'Estructura de Unidades y Canales de Comunicación',
          contenido: 'Cada unidad cuenta con coordinadores especializados y canales directos de soporte para asistirte en tu trayectoria formativa.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'CIIP: Software, Inteligencia Artificial e Innovación Digital',
            'GEOMINA: Geología, Topografía y Seguridad en Minería',
            'BIOMEDIC: Equipamiento Médico, Bioseguridad y Telemedicina',
            'Mesa de Ayuda y Soporte Técnico Institucional',
          ],
        },
        {
          orden: 3,
          titulo: 'Código de Ética y Convivencia',
          contenido: 'Principios fundamentales de respeto mutuo, honestidad académica, no discriminación y protección estricta de la propiedad intelectual.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Integridad en evaluaciones y proyectos colaborativos',
            'Uso responsable de los recursos de cómputo y laboratorios',
            'Canales confidenciales de consulta y sugerencias',
          ],
        },
        {
          orden: 4,
          titulo: 'Exploración del Catálogo de Capacitaciones',
          contenido: '¡Felicitaciones por culminar la inducción inicial! Explora las capacitaciones disponibles en todas las unidades y continúa aprendiendo.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Explorar Todo el Catálogo',
          botonUrl: '/capacitaciones',
          lista: [
            'Filtra cursos por unidad y categoría de interés',
            'Sigue tu avance en cualquier dispositivo móvil o de escritorio',
          ],
        },
      ],
    },
    {
      titulo: 'Metodologías Ágiles Scrum y Gestión Visual con Tableros Kanban',
      descripcion: 'Marco de trabajo para la gestión ágil de proyectos: definición de historias de usuario con criterios BDD, estimación con Planning Poker y límites de trabajo en curso (WIP).',
      unidad: 'GENERAL',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-06T09:00:00Z'),
      categoria: 'Docentes',
      duracionMin: 40,
      icono: 'layout',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Fundamentos de la Agilidad y Scrum',
          contenido: 'Descubre cómo los marcos ágiles promueven entregas continuas de valor, transparencia y adaptación rápida a los cambios.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/cgb-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Roles clave: Product Owner, Scrum Master y Equipo de Desarrollo',
            'Ceremonias: Sprint Planning, Daily Scrum, Review y Retrospectiva',
            'Artefactos: Product Backlog, Sprint Backlog e Incremento',
          ],
        },
        {
          orden: 2,
          titulo: 'Historias de Usuario y Criterios de Aceptación BDD',
          contenido: 'Redacción de requerimientos bajo la sintaxis Given-When-Then (Dado / Cuando / Entonces) para asegurar que el código cumpla exactamente con lo esperado.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Formato: Como [rol], quiero [funcionalidad] para [beneficio]',
            'Criterios de aceptación verificables mediante pruebas automatizadas',
            'Reducción de ambigüedades entre el equipo y los interesados',
          ],
        },
        {
          orden: 3,
          titulo: 'Guía de Dinámicas Ágiles CGB',
          contenido: 'Accede a la plantilla oficial de Jira y tableros Kanban configurados con los límites WIP del equipo.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Ver Tablero Ágil de Ejemplo',
          botonUrl: 'https://cgb.latam/agile-guide',
          lista: [
            'Límites WIP estrictos para evitar cuellos de botella',
            'Métricas de flujo: Lead Time, Cycle Time y Diagrama de Flujo Acumulado',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CAPACITACIÓN INTERNA (Para verificar filtros de seguridad en catálogo)
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Protocolo de Seguridad de la Información y Gestión de Accesos Internos',
      descripcion: 'Lineamientos internos de auditoría, gestión de secretos, rotación de claves y resguardo de datos sensibles de la plataforma CGB.',
      unidad: 'GENERAL',
      ambito: 'INTERNO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-06T11:00:00Z'),
      categoria: 'Inducción',
      duracionMin: 25,
      icono: 'lock',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Confidencialidad y Seguridad Interna',
          contenido: 'Esta capacitación contiene directivas de cumplimiento obligatorio para administradores y colaboradores autorizados.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Políticas de autenticación de dos factores',
            'Manejo seguro de variables de entorno en producción',
            'Protocolo ante detección de accesos no autorizados',
          ],
        },
      ],
    },
  ];

  // -------------------------------------------------------------------------
  // 4. Inserción de Capacitaciones y Diapositivas en Base de Datos
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

    console.log(`  ➕ Capacitación creada: [${creada.unidad}] "${creada.titulo}" (${slides.length} slides, ${creada.ambito})`);
  }

  console.log('✨ Siembra de datos reales completada exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el proceso de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
