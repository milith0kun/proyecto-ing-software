import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando datos reales de Inducción y Onboarding para nuevos miembros de CGB Academy...');

  // -------------------------------------------------------------------------
  // 1. Cuentas de Usuario de Prueba (Preservadas sin alteraciones)
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
  console.log('🧹 Limpiando capacitaciones anteriores para reestructurar el onboarding empresarial...');
  await prisma.slide.deleteMany({});
  await prisma.capacitacion.deleteMany({});

  // -------------------------------------------------------------------------
  // 3. Capacitaciones de Inducción para Nuevos Miembros de la Empresa CGB
  // -------------------------------------------------------------------------
  const capacitacionesOnboarding = [
    // ═══════════════════════════════════════════════════════════════════════
    // ÁREA GENERAL / CORPORATIVA: Inducción de Ingreso a la Empresa CGB
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Inducción General: Bienvenida al Equipo CGB y Cultura Organizacional',
      descripcion: 'Capacitación introductoria obligatoria para todo nuevo miembro que se incorpora a la empresa CGB. Conoce nuestra misión, estructura de unidades, pilares éticos y dinámica de trabajo.',
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
          titulo: '¡Te damos la bienvenida a la empresa CGB!',
          contenido: 'Es un gusto tenerte con nosotros. En CGB integramos la innovación tecnológica, la ingeniería geológica-minera y las ciencias biomédicas para brindar soluciones de alto impacto en Latinoamérica.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/cgb-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Conoce nuestras 3 marcas especializadas: CIIP, GEOMINA y BIOMEDIC',
            'Cultura basada en la excelencia técnica, colaboración y transparencia',
            'Tu rol como nuevo integrante es clave en el crecimiento del equipo',
          ],
        },
        {
          orden: 2,
          titulo: 'Nuestros Valores Corporativos y Pilares de Trabajo',
          contenido: 'En CGB trabajamos bajo cuatro pilares que orientan nuestro día a día y la toma de decisiones en todos los proyectos de la empresa.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Rigor y Calidad Técnica: Entregar siempre soluciones robustas y probadas',
            'Innovación Continua: Adoptar y perfeccionar tecnologías de vanguardia',
            'Compromiso y Responsabilidad Social con las comunidades y clientes',
            'Trabajo en Equipo: Comunicación asertiva y respeto mutuo',
          ],
        },
        {
          orden: 3,
          titulo: 'Código de Ética y Conducta Empresarial',
          contenido: 'Todo miembro del equipo CGB se compromete a mantener los más altos estándares éticos, confidencialidad de la información y un ambiente laboral inclusivo y seguro.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Protección estricta de datos confidenciales y propiedad intelectual de CGB',
            'Tolerancia cero a cualquier forma de discriminación o acoso',
            'Uso responsable de los equipos, cuentas institucionales y plataformas',
          ],
        },
        {
          orden: 4,
          titulo: 'Siguiente Paso: Explora el Catálogo de Inducción por Unidad',
          contenido: 'Has completado la inducción general. Ahora revisa la capacitación específica de tu área asignada (CIIP, GEOMINA o BIOMEDIC) para conocer tus procesos técnicos.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Explorar Capacitaciones de tu Unidad',
          botonUrl: '/capacitaciones',
          lista: [
            'Filtra por tu unidad de pertenencia en el catálogo',
            'Coordina con tu líder de área tu plan de onboarding de la primera semana',
          ],
        },
      ],
    },
    {
      titulo: 'Políticas Internas, Herramientas Digitales y Canales de Comunicación CGB',
      descripcion: 'Guía práctica sobre el ecosistema de herramientas de la empresa: correo institucional, gestión de tareas en Jira/Kanban, horarios, solicitudes de soporte y canales oficiales.',
      unidad: 'GENERAL',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-02T09:00:00Z'),
      categoria: 'Inducción',
      duracionMin: 20,
      icono: 'layout',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Herramientas Digitales de la Empresa',
          contenido: 'Para asegurar una coordinación fluida y eficiente, en CGB estandarizamos el uso de plataformas para la comunicación diaria y seguimiento de entregas.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/cgb-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Correo Institucional (@cgb.latam) para comunicaciones formales',
            'Jira y Tableros Kanban para la asignación y avance de tareas',
            'GitHub Enterprise para el versionamiento y revisión de código',
          ],
        },
        {
          orden: 2,
          titulo: 'Políticas de Horario, Asistencia y Trabajo Colaborativo',
          contenido: 'Respetamos los tiempos del equipo mediante una gestión basada en objetivos, entregas por sprints y puntualidad en las reuniones de sincronización.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Sincronización diaria breve (Daily) para reportar avances y bloqueos',
            'Registro oportuno de actividades en las tarjetas de trabajo',
            'Canales de solicitud de permisos y soporte administrativo',
          ],
        },
        {
          orden: 3,
          titulo: 'Mesa de Ayuda y Soporte Interno',
          contenido: 'Si requieres accesos, configuración de licencias o equipos de cómputo, nuestro equipo de soporte técnico institucional te asistirá de inmediato.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Contactar Soporte Interno CGB',
          botonUrl: 'https://cgb.latam/soporte',
          lista: [
            'Canal de soporte de TI para cuentas y permisos de plataforma',
            'Área de Recursos Humanos para consultas sobre tu incorporación',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // UNIDAD CIIP LATAM: Onboarding para nuevos miembros de Software y TI
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Onboarding Técnico CIIP: Estándares de Ingeniería de Software y Flujo de Trabajo en CGB',
      descripcion: 'Inducción técnica para nuevos desarrolladores e ingenieros de software de la unidad CIIP: estándares de código TypeScript, arquitectura Next.js, bases de datos Atlas y flujo de Git.',
      unidad: 'CIIP',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-02T11:30:00Z'),
      categoria: 'Estudiantes',
      duracionMin: 35,
      icono: 'code',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Bienvenida al Área de Desarrollo y Software CIIP',
          contenido: 'La unidad CIIP es responsable del desarrollo, mantenimiento y evolución de las plataformas digitales y sistemas empresariales de CGB.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/ciip-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Stack tecnológico estándar: Next.js (App Router), TypeScript y Prisma',
            'Persistencia escalable con MongoDB Atlas y esquemas tipados',
            'Arquitectura orientada a contratos BDD y cobertura con pruebas unitarias',
          ],
        },
        {
          orden: 2,
          titulo: 'Flujo de Ramas y Buenas Prácticas en Git',
          contenido: 'Para mantener la integridad del repositorio, cada nuevo desarrollador sigue el protocolo de ramas de la empresa antes de solicitar la integración de sus cambios.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Trabajar en tu rama personal asignada (ej. nombre-apellido)',
            'Escribir commits semánticos: feat(modulo), fix(auth), test(catalogo)',
            'Garantizar que npm test y npm run lint pasen al 100% antes de solicitar merge',
          ],
        },
        {
          orden: 3,
          titulo: 'Lineamientos de Seguridad y Variables de Entorno',
          contenido: 'Nunca se deben subir credenciales o secretos al repositorio. Los entornos locales y de producción se configuran mediante variables protegidas.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Uso de AUTH_SECRET y claves JWT de alta entropía (>= 32 bytes)',
            'Protección de cookies con atributos HttpOnly y SameSite estricto',
            'Sanitización de entradas de usuario para prevenir vulnerabilidades',
          ],
        },
        {
          orden: 4,
          titulo: 'Configura tu Entorno de Desarrollo Local',
          contenido: 'Sigue la guía técnica del repositorio institucional de CGB para clonar el proyecto, instalar dependencias e iniciar tu servidor de desarrollo.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Ver Manual de Instalación CIIP',
          botonUrl: 'https://cgb.latam/ciip/setup-dev',
          lista: [
            'Ejecutar npm install y npx prisma generate',
            'Ejecutar npm test para verificar los 68 contratos BDD',
            'Iniciar el servidor con npm run dev en http://localhost:3000',
          ],
        },
      ],
    },
    {
      titulo: 'Inducción a la Infraestructura Cloud, Despliegues y Monitoreo en CIIP',
      descripcion: 'Capacitación para nuevos miembros del equipo sobre la infraestructura VPS, automatización con Dokploy/Nixpacks y monitoreo de salud de servicios en producción.',
      unidad: 'CIIP',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-03T10:00:00Z'),
      categoria: 'Docentes',
      duracionMin: 30,
      icono: 'cpu',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Infraestructura y Servidores de Producción',
          contenido: 'Las aplicaciones de CGB Academy operan sobre servidores VPS optimizados bajo contenedores ligeros para maximizar el rendimiento con recursos controlados.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/ciip-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Despliegues automáticos a través de Dokploy y Nixpacks',
            'Configuración de Node.js runtime versión 20 LTS',
            'Manejo de dominios y certificados SSL/TLS automáticos con Let\'s Encrypt',
          ],
        },
        {
          orden: 2,
          titulo: 'Endpoint de Health Check y Métricas Operativas',
          contenido: 'Todos los servicios de CGB exponen endpoints estandarizados para que las herramientas de supervisión verifiquen el estado en tiempo real.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Ruta /api/health para verificar latencia y conexión con la base de datos',
            'Registro centralizado de logs para depuración de incidencias',
            'Políticas de reinicio automático ante excepciones no controladas',
          ],
        },
        {
          orden: 3,
          titulo: 'Protocolo de Despliegue a Producción',
          contenido: 'Revisa la lista de verificación (checklist) obligatoria que debe validarse antes de realizar un pase a producción en la rama principal.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Ver Checklist de Despliegue',
          botonUrl: 'https://cgb.latam/ciip/deploy-checklist',
          lista: [
            'Verificación de variables de entorno en el panel de Dokploy',
            'Validación del build de Next.js sin errores de TypeScript',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // UNIDAD GEOMINA LATAM: Onboarding para nuevos miembros de Minería y Geología
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Inducción Operacional GEOMINA: Normativa de Seguridad y Protocolos de Trabajo en Campo',
      descripcion: 'Capacitación obligatoria para nuevos ingenieros, geólogos y practicantes de la unidad GEOMINA: lineamientos de seguridad minera, uso de EPPs y matriz IPERC.',
      unidad: 'GEOMINA',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-03T15:00:00Z'),
      categoria: 'Inducción',
      duracionMin: 35,
      icono: 'shield',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Seguridad en Operaciones GEOMINA',
          contenido: 'En la unidad GEOMINA de la empresa CGB la vida y la salud de nuestro personal son lo primero. Cero incidentes es el estándar innegociable en campo.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/geomina-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Cumplimiento estricto del Reglamento de Seguridad Minera (D.S. 024-2016-EM)',
            'Conocimiento y firma diaria de la matriz IPERC Continuo',
            'Uso de Equipos de Protección Personal (EPP) certificados',
          ],
        },
        {
          orden: 2,
          titulo: 'Procedimiento IPERC Continuo antes de Iniciar Labores',
          contenido: 'Antes de realizar cualquier muestreo, mapeo o inspección geológica en terreno, todo miembro debe completar la evaluación de peligros y controles.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Identificar peligros del entorno (caída de rocas, taludes, clima extremo)',
            'Evaluar el nivel de riesgo y aplicar la jerarquía de controles de CGB',
            'Comunicar de inmediato cualquier condición de riesgo a tu supervisor',
          ],
        },
        {
          orden: 3,
          titulo: 'Equipos y Herramientas Homologadas en GEOMINA',
          contenido: 'La empresa provee los instrumentos y elementos de seguridad necesarios para las labores de exploración y topografía.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Casco de seguridad minera con barbiquejo y chaleco de alta visibilidad',
            'Calzado de seguridad con suela antideslizante para terreno agreste',
            'GPS geodésico, brújula geológica y martillo de geólogo debidamente custodiados',
          ],
        },
        {
          orden: 4,
          titulo: 'Manual de Emergencias y Canales de Rescate',
          contenido: 'Familiarízate con las frecuencias de radio, zonas de seguridad y protocolos de primeros auxilios en zonas de campo remoto.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Descargar Protocolo de Emergencias GEOMINA',
          botonUrl: 'https://cgb.latam/geomina/seguridad-campo',
          lista: [
            'Puntos de encuentro y botiquín de primeros auxilios de la cuadrilla',
            'Procedimiento de comunicación satelital y reporte de incidentes',
          ],
        },
      ],
    },
    {
      titulo: 'Protocolo de Gestión de Datos Geoespaciales, Cartografía y QGIS en GEOMINA',
      descripcion: 'Inducción técnica sobre el manejo del repositorio cartográfico de la empresa CGB: estándares de coordenadas UTM WGS84, simbología geológica y capas SIG.',
      unidad: 'GEOMINA',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-04T08:30:00Z'),
      categoria: 'Estudiantes',
      duracionMin: 30,
      icono: 'map',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Estándares Cartográficos de la Empresa',
          contenido: 'Todos los planos, mapas temáticos y modelos de elevación generados en GEOMINA deben respetar la nomenclatura institucional y proyecciones geodésicas vigentes.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/geomina-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Sistema de Referencia: WGS84 Zona 18S / 19S según la ubicación del proyecto',
            'Nomenclatura estandarizada de capas vectoriales (Shapefile y GeoPackage)',
            'Plantilla de membrete oficial de CGB para entrega de planos a clientes',
          ],
        },
        {
          orden: 2,
          titulo: 'Flujo de Almacenamiento y Control de Versiones SIG',
          contenido: 'Los archivos geoespaciales de los proyectos de CGB se respaldan en el repositorio institucional estructurado por carpetas de concesión y fecha.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Carpeta 01_RAW para datos crudos de GPS y vuelos fotogramétricos',
            'Carpeta 02_PROCESSED para modelos DEM interpolados y curvas de nivel',
            'Carpeta 03_MAPS para salidas gráficas en formato PDF de alta resolución',
          ],
        },
        {
          orden: 3,
          titulo: 'Descargar Plantilla Oficial de QGIS de la Empresa',
          contenido: 'Configura tu estación de trabajo con la simbología, estilos y membretes corporativos preconfigurados.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Obtener Plantilla QGIS Institucional',
          botonUrl: 'https://cgb.latam/geomina/plantilla-qgis',
          lista: [
            'Archivo .qgz con paleta de colores oficial de GEOMINA',
            'Biblioteca de estilos .qml para litologías y fallas estructurales',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // UNIDAD BIOMEDIC: Onboarding para nuevos miembros de Tecnología Médica
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Inducción Técnica BIOMEDIC: Protocolos de Calidad y Mantenimiento de Equipamiento Hospitalario',
      descripcion: 'Capacitación para nuevos ingenieros y técnicos biomédicos de la empresa CGB: estándares de inspección técnica, seguridad eléctrica hospitalaria y fichas de servicio.',
      unidad: 'BIOMEDIC',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-04T14:00:00Z'),
      categoria: 'Estudiantes',
      duracionMin: 35,
      icono: 'activity',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Área de Ingeniería Biomédica CGB',
          contenido: 'En la unidad BIOMEDIC nos especializamos en brindar soporte técnico de alta precisión, calibración metrológica y mantenimiento preventivo a clínicas y hospitales.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/biomedic-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Mantenimiento preventivo y correctivo según manuales de fabricante',
            'Pruebas de seguridad eléctrica bajo estándar internacional IEC 60601',
            'Emisión de certificados técnicos de operatividad con trazabilidad',
          ],
        },
        {
          orden: 2,
          titulo: 'Procedimiento de Servicio Técnico en Instalaciones Clínicas',
          contenido: 'Todo colaborador de BIOMEDIC debe seguir el protocolo de ingreso, intervención y entrega de equipos en centros hospitalarios.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Coordinar previamente con el jefe de servicio o biomédico del hospital',
            'Portar indumentaria institucional limpia y credencial visible de CGB',
            'Realizar checklist funcional antes y después de cada mantenimiento',
          ],
        },
        {
          orden: 3,
          titulo: 'Llenado de Fichas Técnicas e Informes de Servicio',
          contenido: 'Cada intervención debe registrarse en la plataforma digital de BIOMEDIC para emitir el informe técnico correspondiente al cliente.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Ver Formatos de Mantenimiento BIOMEDIC',
          botonUrl: 'https://cgb.latam/biomedic/formatos-servicio',
          lista: [
            'Registro de número de serie, marca, modelo y ubicación del equipo',
            'Firma de conformidad del responsable del área hospitalaria',
          ],
        },
      ],
    },
    {
      titulo: 'Bioseguridad y Procedimientos de Trabajo Seguro en Laboratorios e Instalaciones de Salud',
      descripcion: 'Capacitación para nuevos miembros sobre bioprotección, uso de barreras primarias, manejo de autoclaves y protocolos de desinfección en áreas críticas.',
      unidad: 'BIOMEDIC',
      ambito: 'PUBLICO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-05T10:00:00Z'),
      categoria: 'Docentes',
      duracionMin: 30,
      icono: 'shield',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Protocolo de Bioseguridad en Ambientes de Salud',
          contenido: 'La protección de nuestro personal técnico frente a agentes biológicos y sustancias químicas es prioritaria en cada servicio realizado por BIOMEDIC.',
          tipo: 'IMAGE',
          imagenUrl: '/logos/recortados/biomedic-logo.png',
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Uso obligatorio de guantes de nitrilo, mascarilla N95/FFP2 y bata descartable',
            'Higiene de manos conforme a las directrices de la OMS',
            'Desinfección previa del equipamiento médico antes de su manipulación',
          ],
        },
        {
          orden: 2,
          titulo: 'Segregación y Manejo de Residuos Biocontaminados',
          contenido: 'Cumplimiento riguroso de la norma técnica de gestión integral de residuos sólidos en establecimientos de salud.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Disposición en bolsas rojas para material en contacto con fluidos biológicos',
            'Contenedores rígidos de bioseguridad para elementos punzocortantes',
            'Transporte seguro en recipientes herméticos debidamente identificados',
          ],
        },
        {
          orden: 3,
          titulo: 'Evaluación y Acreditación de Bioseguridad',
          contenido: 'Completa la comprobación de conocimientos de bioseguridad requerida por la empresa antes de tu primera salida a campo.',
          tipo: 'INTERACTIVE',
          imagenUrl: null,
          botonTexto: 'Realizar Test de Bioseguridad',
          botonUrl: 'https://cgb.latam/biomedic/test-bioseguridad',
          lista: [
            'Cuestionario formativo con retroalimentación instantánea',
            'Habilitación técnica para intervenciones en quirófanos y UCI',
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CAPACITACIÓN INTERNA: Exclusiva para Colaboradores con Sesión Activa
    // ═══════════════════════════════════════════════════════════════════════
    {
      titulo: 'Protocolo Interno: Resguardo de Información Confidencial y Ciberseguridad CGB',
      descripcion: 'Directivas de seguridad digital interna para el personal de la empresa CGB: gestión de contraseñas, doble factor de autenticación y prevención de phishing.',
      unidad: 'GENERAL',
      ambito: 'INTERNO',
      estado: 'PUBLICADA',
      publicadaEn: new Date('2026-10-05T15:00:00Z'),
      categoria: 'Inducción',
      duracionMin: 20,
      icono: 'lock',
      creadoPor: admin.id,
      slides: [
        {
          orden: 1,
          titulo: 'Ciberseguridad y Protección de Datos en CGB',
          contenido: 'Directivas internas de cumplimiento estricto para colaboradores de todas las unidades de la empresa.',
          tipo: 'TEXT',
          imagenUrl: null,
          botonTexto: null,
          botonUrl: null,
          lista: [
            'Uso mandatorio de contraseñas robustas y gestor seguro institucional',
            'Activación de autenticación en dos pasos (2FA) en todos los servicios de la empresa',
            'Reporte inmediato ante sospechas de correos fraudulentos o enlaces no verificados',
          ],
        },
      ],
    },
  ];

  // -------------------------------------------------------------------------
  // 4. Inserción en la base de datos MongoDB Atlas
  // -------------------------------------------------------------------------
  for (const cap of capacitacionesOnboarding) {
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

    console.log(`  ➕ Capacitación de Onboarding creada: [${creada.unidad}] "${creada.titulo}" (${slides.length} slides, ${creada.ambito})`);
  }

  console.log('✨ Siembra de Inducción y Onboarding completada exitosamente en MongoDB Atlas.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el proceso de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
