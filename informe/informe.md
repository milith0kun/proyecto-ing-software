# INFORME DEL PROYECTO DE INGENIERÍA DE SOFTWARE
**Centro de Capacitación e Inducción — CGB Academy**  
**Curso:** Ingeniería de Software I — IF614  
**Universidad Nacional de San Antonio Abad del Cusco (UNSAAC)**  
**Facultad de Ingeniería Eléctrica, Electrónica, Informática y Mecánica**  
**Escuela Profesional de Ingeniería de Sistemas e Informática**  
**Semestre Académico:** 2026-I  

---

## PORTADA Y DATOS GENERALES DEL PROYECTO

- **Nombre del Proyecto:** Centro de Capacitación e Inducción — CGB Academy
- **Equipo de Trabajo:**
  1. **Barazorda Cuellar, Hector** — *Scrum Master / Desarrollador Full-Stack*
  2. **Carpio Hermoza, Alex** — *Desarrollador Full-Stack*
  3. **Quispe Mamani, Domingo de Guzman** — *Desarrollador Full-Stack*
  4. **Saire Bustamante, Edmil Jampier** — *Product Owner / Desarrollador Full-Stack*
  5. **Ticona Jancco, Ronaldo** — *Desarrollador Full-Stack*
- **Entidad Beneficiaria:** CGB Academy (Integrando las unidades CIIP LATAM, GEOMINA LATAM y BIOMEDIC)
- **Repositorio Oficial en GitHub:** `https://github.com/milith0kun/proyecto-ing-software`
- **Ramas Principales de Trabajo:** `edmil-saire` (rama principal / producción) y `develop` (integración y pruebas conjuntas)

---

## 1. Datos Generales del Proyecto

| Parámetro | Detalle Institucional y Operativo |
|---|---|
| **Nombre del Sistema** | Centro de Capacitación e Inducción CGB Academy |
| **Tipo de Aplicación** | Plataforma Web Modular (Área Pública de Orientación y Entorno Privado de Onboarding) |
| **Organización Destino** | CGB Academy (Ecosistema corporativo: CIIP LATAM, GEOMINA LATAM, BIOMEDIC) |
| **Repositorio Central** | `https://github.com/milith0kun/proyecto-ing-software` |
| **Ramas Git** | `main` (entregas estables) y `develop` (integración ágil continua) |
| **Cadencia de Trabajo** | Sprints de 2 semanas (10 días hábiles por iteración) |
| **Tamaño del MVP** | 15 Historias de Usuario funcionales distribuidas en 3 Sprints |

---

## 2. Objetivo General y Específicos

### 2.1 Objetivo General
Desarrollar e implementar el **Centro de Capacitación e Inducción CGB Academy**, una plataforma web orientada a la capacitación introductoria de colaboradores internos y a la orientación pública de estudiantes y docentes, facilitando la creación ágil de contenidos estructurados en diapositivas interactivas (*slides*), la gestión jerárquica de rutas de aprendizaje organizacional y el seguimiento formativo del avance sin incurrir en la sobrecarga de un LMS tradicional.

### 2.2 Objetivos Específicos
1. **Especificar y priorizar los requerimientos funcionales y no funcionales** del MVP conforme al estándar internacional **ISO/IEC/IEEE 29148:2018** y bajo los atributos del marco **INVEST** (*Mike Cohn, 2004*), estructurando 15 historias de usuario atómicas con criterios de aceptación verificables en formato BDD (*Dado que / Cuando / Entonces*).
2. **Diseñar una arquitectura web ligera y desacoplada** para frontend y backend alineada con las áreas de conocimiento de Arquitectura y Construcción de Software de **SWEBOK V4.0 (IEEE, 2024)**, optimizada para ejecutarse en infraestructura VPS de recursos controlados (2 vCPU y 8 GB de RAM).
3. **Implementar el motor de creación y visualización de capacitaciones mediante slides**, permitiendo la administración intuitiva (*no-code*) de contenidos de inducción tanto para el ámbito público como privado.
4. **Construir el módulo de onboarding organizacional jerárquico**, modelando la relación *Área $\rightarrow$ Puesto $\rightarrow$ Ruta de Onboarding $\rightarrow$ Capacitaciones*, garantizando la activación segura de colaboradores y la persistencia automática de su progreso.
5. **Incorporar microtests formativos de evaluación inmediata**, brindando retroalimentación pedagógica al colaborador sin penalizaciones de puntajes punitivos.
6. **Aplicar un método de desarrollo ágil híbrido (Scrum base, Kanban visual con límites WIP y prácticas técnicas de XP/TDD)** respaldado matemáticamente por la teoría de colas (Ley de Little) e inspección continua de código.

---

## 3. Alcance del Sistema

### 3.1 Módulos y Funcionalidades Incluidas (In-Scope — MVP)
El MVP se encuentra estructurado en tres componentes fundamentales:

1. **Módulo de Gestión y Motor de Contenidos (Sprint 1):**
   - Autenticación interna basada en roles (Administrador y Colaborador) con sesiones seguras.
   - Creación, edición general y gestión de estados de capacitación (*Borrador*, *Publicada*).
   - Constructor de contenidos mediante *slides* administrables (soporte para bloques de texto enriquecido, imágenes optimizadas, listas, avisos/indicaciones, enlaces y botones de acción).
   - Previsualización en tiempo real previa a la publicación.
   - Catálogo y visualizador público para consulta libre de estudiantes y docentes sin necesidad de cuenta.

2. **Módulo de Estructura Organizacional y Onboarding Interno (Sprint 2):**
   - Mantenimiento integral de Áreas y Puestos de CGB Academy con integridad referencial.
   - Creación y secuenciación de rutas de onboarding asociadas a puestos o áreas.
   - Registro y gestión de colaboradores con asignación de rutas específicas.
   - Proceso de activación de cuenta mediante token seguro de uso único y contraseña protegida.
   - Panel personalizado *"Mi Onboarding"* con seguimiento automático de lectura de slides y rutas completadas.

3. **Módulo de Microtests Formativos y Supervisión Administrativa (Sprint 3):**
   - Creación y edición de preguntas de opción múltiple asociadas a capacitaciones.
   - Interfaz interactiva de resolución para el colaborador con retroalimentación inmediata en cada respuesta.
   - Panel administrativo de supervisión con métricas de avance general e individual por colaborador.

### 3.2 Exclusiones Expresas del Alcance Inicial (Out-of-Scope)
Para mantener el foco y evitar el sobredimensionamiento (*scope creep*), se excluyen explícitamente:
- Venta de cursos, pasarela de pagos y carritos de compra.
- Aulas virtuales en vivo, videoconferencias o funcionalidades de LMS académico pesado (tipo Moodle/Canvas).
- Emisión o generación de certificados académicos oficiales desde la plataforma.
- Almacenamiento y streaming de archivos de video pesados o biblioteca de descargas masivas.
- Soporte multilingüe (la versión 1.0 operará exclusivamente en español).
- Migración automatizada de datos históricos legados de colaboradores.

---

## 4. Justificación del Proyecto

### 4.1 Justificación Práctica y Organizacional
CGB Academy agrupa la oferta formativa de tres marcas especializadas: **CIIP LATAM**, **GEOMINA LATAM** y **BIOMEDIC**. En el modelo previo, la inducción de nuevos colaboradores y la orientación introductoria a estudiantes dependían de procesos manuales dispersos, documentos en PDF desactualizados o explicaciones verbales repetitivas que demandaban horas hombre y no ofrecían trazabilidad. El sistema centraliza y estandariza la orientación, reduce tiempos de inducción y asegura que cada colaborador domine los procesos clave de su puesto desde el primer día.

### 4.2 Justificación Académica y de Ingeniería de Software
Desde la perspectiva de la Ingeniería de Software (*Sommerville, 2011; Pressman, 2010*), el proyecto constituye un caso de estudio real para:
- Superar los vicios del desarrollo no estructurado aplicando un método formal con separación estricta de fases de ingeniería.
- Modelar requerimientos mediante historias de usuario granulares y criterios de aceptación verificables en estilo BDD (*Behavior-Driven Development*).
- Demostrar la viabilidad de arquitecturas web modernas de bajo consumo de recursos (VPS 2 vCPU / 8 GB RAM) con alta reactividad y consistencia de datos.

---

## 5. Contexto del Proyecto y Restricciones

### 5.1 Contexto Operativo
La plataforma operará en la nube, consumida por usuarios distribuidos geográficamente en Perú y Latinoamérica. Los usuarios públicos accederán principalmente desde computadoras personales y smartphones en busca de guías rápidas, mientras que los colaboradores accederán durante su jornada laboral para cumplir con sus rutas de inducción institucional.

### 5.2 Restricciones del Sistema (Mapeo Taxonómico ISO/IEC 25010:2023)

Para asegurar el rigor en el aseguramiento de la calidad, los diez Requerimientos No Funcionales (RNF) del sistema se clasifican formalmente bajo el modelo de calidad de producto de la norma internacional **ISO/IEC 25010:2023 (Serie SQuaRE)**:

| Código RNF | Requerimiento No Funcional | Característica ISO/IEC 25010:2023 | Subcaracterística | Justificación y Métrica de Cumplimiento |
|---|---|---|---|---|
| **RNF-001** | **Diseño Responsive** | Capacidad de Interacción (Usabilidad) | Flexibilidad de Interfaz de Usuario | Adaptación fluida a resoluciones móviles ($\ge 360\text{px}$), tablets y desktop sin pérdida de funcionalidad ni solapamiento. |
| **RNF-002** | **Idioma de Operación** | Capacidad de Interacción (Usabilidad) | Reconocimiento de Idoneidad / Comprensibilidad | Interfaz y contenidos disponibles 100% en español neutral, sin mezclas de idioma en mensajes del sistema. |
| **RNF-003** | **Infraestructura Objetivo** | Eficiencia de Rendimiento | Utilización de Recursos / Capacidad | Operación fluida en servidor VPS de 2 vCPU y 8 GB de RAM bajo contenedores o runtime Node.js sin degradación de memoria. |
| **RNF-004** | **Contenido Ligero** | Eficiencia de Rendimiento | Comportamiento Temporal | Tiempo de carga inicial $< 1.5\text{ s}$ en conexiones 4G; prohibición de video pesado y compresión de imágenes a formato WebP/SVG. |
| **RNF-005** | **Seguridad de Acceso Interno** | Seguridad | Confidencialidad y Control de Acceso | Segmentación estricta de rutas privadas protegidas por sesión/token; redirección inmediata con código HTTP 401/403 para usuarios anónimos. |
| **RNF-006** | **Protección de Credenciales** | Seguridad (NIST SSDF SP 800-218) | Integridad y Autenticidad | Hashing unidireccional no reversible de contraseñas (bcrypt con factor de costo $\ge 10$) y tokens de activación de un solo uso con caducidad temporal. |
| **RNF-007** | **Minimización de Datos** | Seguridad / Privacidad por Diseño | Confidencialidad de Información Personal | Captura exclusiva de datos indispensables para la inducción (nombre, correo institucional y rol), descartando datos sensibles (DNI, teléfono, dirección). |
| **RNF-008** | **Consistencia Visual** | Mantenibilidad / Usabilidad | Modularidad / Consistencia Estética | Empleo estricto de un sistema de componentes prediseñado bajo la identidad de marca de CGB Academy, evitando estilos ad-hoc aislados. |
| **RNF-009** | **Facilidad de Administración** | Capacidad de Interacción (Usabilidad) | Operabilidad / Aprendizaje | Creación, ordenamiento y edición de slides mediante interfaz gráfica intuitiva (*no-code*) sin requerir edición manual de código. |
| **RNF-010** | **Integridad de Información** | Fiabilidad | Tolerancia a Fallos / Consistencia | Reglas de integridad referencial para bloquear la eliminación accidental o huérfana de áreas o puestos que mantengan colaboradores activos. |

---

## 6. Tecnologías Utilizadas y Fundamentación Arquitectónica

Conforme a las directrices de las Áreas de Conocimiento de **Arquitectura de Software (KA 2)** y **Construcción de Software (KA 4)** de **SWEBOK V4.0 (IEEE, 2024)**, la selección tecnológica responde a criterios de mantenibilidad, eficiencia y desacoplamiento:

| Capa / Componente | Tecnología Seleccionada | Justificación Técnica de Selección y Patrones de Ingeniería |
|---|---|---|
| **Base de Datos** | **MongoDB Atlas** | Base de datos NoSQL documental en la nube (Cluster0); óptima para esquemas polimórficos de slides enriquecidos y persistencia de trazas de avance de onboarding en formato BSON/JSON. |
| **ORM / Acceso a Datos** | **Prisma ORM** | Capa de abstracción de datos fuertemente tipada en TypeScript (`provider = "mongodb"`). Implementa el patrón **Singleton** (*Gamma et al., 1994*) en `src/lib/prisma.ts` para reutilizar la conexión global y evitar la saturación de sockets en el pool ante recargas rápidas (*Fast Refresh*). |
| **Arquitectura Full-Stack** | **Next.js 16 (App Router)** | Framework unificado que materializa el patrón de arquitectura limpia: Backend mediante Route Handlers (`/app/api/...`) y Server Actions, y Frontend responsivo combinando React Server Components (RSC) y Client Components. Compilación ultrarrápida con el motor **Turbopack**. |
| **Aplicación Web (App)** | **Next.js Web App** | Arquitectura orientada a rendimiento y SEO (*Core Web Vitals*), optimizando el tiempo de primera pintura con contenido (*First Contentful Paint*) para la orientación pública e inducción privada. |
| **Estilos y Maquetación** | TailwindCSS / CSS Moderno | Sistema de diseño basado en clases utilitarias que previene la sobrecarga de hojas de estilo (*dead code elimination*) y garantiza consistencia visual corporativa. |
| **Lenguaje de Desarrollo** | TypeScript | Tipado estático de extremo a extremo que previene errores de tipo en tiempo de compilación entre modelos de base de datos, APIs y componentes de interfaz. |
| **Seguridad de Configuración** | Variables de Entorno (`.env`) | Gestión segura de credenciales y URIs de base de datos protegidas por `.gitignore`, cumpliendo con las pautas de prevención de fuga de secretos del marco **NIST SSDF SP 800-218**. |
| **Control de Versiones** | Git & GitHub | Arquitectura de ramas con rama principal `edmil-saire`, rama de integración `desarrollo` y ramas personales por desarrollador. |
| **Gestión Ágil** | Jira / GitHub Projects | Tablero Kanban con límites WIP, estimación con Planning Poker (*Mike Cohn, 2004*) y seguimiento de métricas DORA y Cycle Time. |

---

## 7. Stakeholders (Matriz de Interesados)

| Stakeholder / Actor | Rol en el Ecosistema | Tipo | Influencia | Interés Principal / Expectativa |
|---|---|---|:---:|---|
| **Colaborador CGB** | Usuario interno activo | Directo | Alto | Conocer de manera clara sus tareas, procesos y completar su inducción sin fricciones técnicas. |
| **Administrador** | Gestor de contenidos y personas | Directo | Alto | Facilidad para cargar slides, estructurar rutas por área y ver reportes de avance en tiempo real. |
| **Público (Estudiantes/Docentes)** | Visitantes anónimos | Directo | Medio | Acceso inmediato y gratuito a guías y orientaciones sobre CIIP, GEOMINA y BIOMEDIC sin registro obligatorio. |
| **Directorio CGB Academy** | Patrocinador institucional | Clave | Crítico | Reducción de costos de capacitación, estandarización de procesos y cumplimiento de plazos del MVP. |
| **Equipo de Desarrollo** | 5 Ingenieros de Sistemas | Interno | Alto | Código limpio, mantenible, arquitectura escalable y cumplimiento de los acuerdos del sprint. |
| **Docente Evaluador UNSAAC** | Evaluador académico | Académico | Crítico | Rigor metodológico en ingeniería de software, trazabilidad de requisitos y entrega de software funcional. |

---

## 8. Enfoque de Desarrollo Seleccionado y Justificación

Se ha seleccionado un **Enfoque Ágil Híbrido** que toma a **Scrum** como estructura marco e incorpora la visibilidad y límites de **Kanban**, junto con las disciplinas técnicas de la **Programación Extrema (XP)** y el soporte asistido de **Inteligencia Artificial**:

### 8.1 Descarte del Modelo Tradicional en Cascada (*Waterfall*)
El modelo secuencial en Cascada se descartó porque presupone requerimientos inmutables y difiere la integración y pruebas hasta etapas tardías, lo cual incrementa exponencialmente el riesgo de discrepancias funcionales al cierre del semestre.

### 8.2 Justificación del Modelo Híbrido
- **De Scrum se toma:** La cadencia fija en sprints cortos (2 semanas), las ceremonias de planificación, sincronización diaria, revisión y retrospectiva, y la unidad de trabajo en historias de usuario priorizadas.
- **De Kanban se toma:** La transparencia visual mediante el tablero Kanban por fases, la limitación explícita del trabajo en curso (*WIP limits*) y la política de bloqueo para visibilizar impedimentos.
- **De XP se toma:** Las prácticas de integración continua (*CI*), desarrollo guiado por pruebas (*TDD* en lógica crítica), propiedad colectiva del código, diseño simple y revisión por pares (*Peer Review*).

---

## 9. Prácticas Adoptadas del Proceso

### 9.1 Aportes de Scrum
- **Sprints de 2 Semanas:** Tres iteraciones para completar las 15 historias del MVP.
- **Capacidad Fija:** Cuatro historias de usuario por sprint (exactamente 1 HU completa por cada integrante del equipo).
- **Ceremonias Regulares:**
  - *Sprint Planning:* Estimación con Planning Poker y compromiso de entrega.
  - *Daily Scrum:* 15 minutos diarios para alinear avances y destrabar bloqueos.
  - *Sprint Review:* Demostración del software funcionando al Product Owner sobre la rama de integración.
  - *Retrospectiva:* Análisis introspectivo y formulación de acuerdos de mejora para la siguiente iteración.

### 9.2 Aportes de Kanban
- **Tablero Visual con Límites de Trabajo en Curso:** Estructura de flujo controlable de 4 columnas: $\text{TO DO} \rightarrow \text{DESARROLLO [WIP 3]} \rightarrow \text{REVISIÓN [WIP 2]} \rightarrow \text{DONE}$.
- **Límites WIP Justificados:** Para el equipo de 3 desarrolladores activos, se define $\text{WIP} = 3$ en Desarrollo (1 desarrollador = máximo 1 HU activa) y $\text{WIP} = 2$ en Revisión para evitar saturación y cuellos de botella.
- **Principio Fundamental de Flujo:** Cuando la columna Revisión alcanza su capacidad máxima (2/2), la prioridad del equipo cambia inmediatamente: *dejar de iniciar trabajo nuevo y colaborar en terminar la revisión e integración existente* (*"Stop starting, start finishing"*).
- **Gestión Visual de Bloqueos:** Identificación mediante etiqueta destacada `🚫 BLOQUEADA` en la columna actual, sin crear columnas artificiales que distorsionen las métricas.

### 9.3 Aportes de Programación Extrema (XP) y Ciclo TDD
- **Desarrollo Guiado por Pruebas (TDD):** Cada Historia de Usuario desglosa internamente 4 subtareas técnicas obligatorias:
  1. **T1 — Pruebas / RED:** Creación de pruebas unitarias y de integración que inicialmente fallan.
  2. **T2 — Implementación / GREEN:** Programación mínima necesaria para hacer pasar las pruebas con éxito.
  3. **T3 — Refactorización:** Optimización de estructura, legibilidad y rendimiento sin modificar el comportamiento funcional.
  4. **T4 — Validación e integración:** Verificación completa de criterios de aceptación y preparación del pull request.
- **Integración Continua (CI):** Cada pull request a la rama `desarrollo` compila y ejecuta verificaciones de TypeScript y pruebas automáticas.
- **Revisión de Código por Pares (*Peer Review*):** Ningún código se integra a la rama común sin al menos una aprobación formal de otro integrante.
- **Diseño Simple y Propiedad Colectiva del Código:** Código semántico, componentes modulares en Next.js y tipado estricto con Prisma y TypeScript.

### 9.4 Uso de Inteligencia Artificial en el Proceso
- **Asistencia en Generación de Estructuras y Casos de Prueba:** Apoyo en la formulación de fixtures de datos, esqueletos de controladores y escenarios de prueba unitaria.
- **Generación Asistida de Documentación:** Conversión de notas técnicas a formatos estándar Markdown y LaTeX.
- **Principio Ético y de Validación Humana Obligatoria:** Todo código o texto sugerido por modelos de lenguaje es minuciosamente revisado, comprendido, ejecutado y validado por los desarrolladores antes de integrarse.

---

## 10. Roles, Responsabilidades y Forma de Coordinación

### 10.1 Política de Roles Rotativos por Sprint
El equipo adopta una estructura de **roles rotativos**, donde las funciones de liderazgo ágil no son estáticas, sino que se alternan en cada iteración para que todos los integrantes adquieran experiencia en gestión de producto, facilitación técnica y desarrollo full-stack:

- **Sprint 1 (Sprint Piloto de Evaluación):**  
  Se establece la configuración inicial para medir la cadencia y dinamismo del equipo:
  - **Product Owner (Sprint 1):** Saire Bustamante, Edmil Jampier.
  - **Scrum Master (Sprint 1):** Barazorda Cuellar, Hector.
  - **Desarrolladores Full-Stack:** Carpio Hermoza, Alex; Quispe Mamani, Domingo de Guzman; Ticona Jancco, Ronaldo.
- **Mecanismo de Evaluación y Rotación:**  
  En la **Sprint Retrospective** al término del Sprint 1, se analizan los resultados del flujo, los bloqueos resueltos y la interacción con los requisitos. A partir de esa evaluación, se ejecutan las decisiones de rotación del Scrum Master y Product Owner para el Sprint 2 y Sprint 3, permitiendo la alternancia de roles entre los 5 integrantes.

| Integrante | Rol en Sprint 1 | Acciones y Responsabilidades Principales |
|---|---|---|
| **Saire Bustamante, Edmil Jampier** | **Product Owner** (Sprint 1) & Dev Full-Stack | Priorización del backlog, validación de criterios BDD (Dado/Cuando/Entonces), aprobación de entregables en la Review y desarrollo de su HU asignada. |
| **Barazorda Cuellar, Hector** | **Scrum Master** (Sprint 1) & Dev Full-Stack | Facilitación de las ceremonias diarias (Daily de 15 min), remoción de bloqueos técnicos, vigilancia de límites WIP y desarrollo de su HU asignada. |
| **Carpio Hermoza, Alex** | **Desarrollador Full-Stack** | Ejecución autónoma de las 5 fases de sus HU (Plan, Diseño, Frontend, Backend, Test), revisión de código por pares y elegible para rol en Sprint 2. |
| **Quispe Mamani, Domingo de Guzman** | **Desarrollador Full-Stack** | Ejecución autónoma de las 5 fases de sus HU (Plan, Diseño, Frontend, Backend, Test), revisión de código por pares y elegible para rol en Sprint 2. |
| **Ticona Jancco, Ronaldo** | **Desarrollador Full-Stack** | Ejecución autónoma de las 5 fases de sus HU (Plan, Diseño, Frontend, Backend, Test), revisión de código por pares y elegible para rol en Sprint 2. |

### 10.2 Protocolo de Coordinación y Ramas de Git para los Desarrolladores
Para asegurar un trabajo colaborativo ordenado y evitar colisiones de código, se establece la siguiente arquitectura de ramas:

1. **Rama Principal (`edmil-saire`):** Es la rama `main` del repositorio remoto. Contiene código 100% estable, validado y libre de errores para entregas oficiales.
2. **Rama de Desarrollo e Integración (`desarrollo` / `develop`):** Rama común donde confluyen todos los avances para testear la unión de los desarrolladores antes de enviar a producción.
3. **Ramas Individuales de cada Desarrollador:**  
   Cada desarrollador cuenta con su rama personal vinculada a su cuenta de GitHub:
   - `hector-barazorda`
   - `alex-carpio`
   - `domingo-quispe`
   - `edmil-saire`
   - `ronaldo-ticona`

#### Ciclo de Trabajo Obligatorio para cada Desarrollador:
```bash
# 1. Situarse en su rama y sincronizar los últimos cambios de desarrollo
git checkout <tu-nombre-de-rama>
git pull origin desarrollo

# 2. Realizar avances y confirmar con su cuenta de GitHub
git add .
git commit -m "feat(modulo): descripción del avance de la HU"
git push origin <tu-nombre-de-rama>

# 3. Crear Pull Request en GitHub:
#    Base: desarrollo  <---  Compare: <tu-nombre-de-rama>

# 4. Probar la integración conjunta en la rama 'desarrollo'.
# 5. Pase a la rama principal 'edmil-saire' una vez superado el testing.
```

---

## 11. Flujo de Trabajo del Equipo

Para garantizar un flujo de entrega ágil, continuo y predecible, el equipo implementa un **Tablero Kanban con Límites WIP** integrado al ciclo iterativo de Scrum y a las prácticas de desarrollo guiado por pruebas (TDD) de XP.

### 11.1 Arquitectura del Tablero Kanban Oficial
El tablero visual del equipo se estructura en cuatro columnas de flujo continuo:

$$\text{TO DO} \longrightarrow \text{DESARROLLO [WIP 3]} \longrightarrow \text{REVISIÓN [WIP 2]} \longrightarrow \text{DONE}$$

| Columna | Significado Operativo | Límite WIP Recomendado |
|---|---|:---:|
| **TO DO** | Historias de Usuario del Sprint comprometidas que aún no han sido iniciadas. | Sin límite fijo |
| **DESARROLLO** | Historias de Usuario que actualmente se encuentran en proceso activo de codificación y pruebas. | **3** |
| **REVISIÓN** | Desarrollo e implementación local terminados; pendiente de revisión por pares (*Peer Review*), pruebas automatizadas e integración. | **2** |
| **DONE** | Historias de Usuario completamente probadas, integradas en la rama común y aceptadas por el Product Owner según los criterios de aceptación. | Sin límite |

---

### 11.2 Justificación de los Límites WIP para el Equipo de 3 Desarrolladores

#### Fundamentación Matemática Mediante la Ley de Little
Desde la teoría matemática de colas (*Queuing Theory*), el comportamiento del flujo de trabajo se rige rigurosamente por la **Ley de Little** (*John D. C. Little, 1961*), adaptada a la ingeniería de software ágil (*David J. Anderson, 2010*):

$$\text{WIP} = \text{Throughput (TH)} \times \text{Cycle Time (CT)} \quad \Longrightarrow \quad \text{Cycle Time (CT)} = \frac{\text{WIP}}{\text{Throughput (TH)}}$$

Donde:
- **$\text{WIP}$ (Work In Progress):** Cantidad de Historias de Usuario admitidas simultáneamente en el sistema.
- **$\text{Throughput (TH)}$:** Tasa de entrega o velocidad efectiva del equipo (historias terminadas por unidad de tiempo).
- **$\text{Cycle Time (CT)}$:** Tiempo promedio que tarda una historia desde que inicia su implementación hasta ser desplegada y aceptada.

Bajo una capacidad productiva fija de 3 desarrolladores ($\text{TH}$ cuasi-constante), cualquier incremento descontrolado del $\text{WIP}$ genera un aumento lineal directo en el $\text{Cycle Time}$, disparando la multitarea, las esperas en cola y la probabilidad de defectos por cambio de contexto (*context switching*). Limitar el $\text{WIP}$ es la única garantía matemática de mantener un $\text{Cycle Time}$ mínimo, predecible y estable.

#### ¿Por qué Desarrollo = 3?
El equipo cuenta con **3 integrantes en el rol de Development** dedicados a la construcción técnica de las historias de usuario de cada Sprint (mientras que los roles de Product Owner y Scrum Master facilitan la priorización, refinamiento, gestión de bloqueos y apoyo técnico). La regla operativa fundamental es:

$$\mathbf{1\text{ Desarrollador} = \text{Máximo 1 HU activa en Desarrollo}}$$

Esta política previene la sobreproducción (*Muda* en filosofía Lean), garantizando que el esfuerzo intelectual esté focalizado al 100% en una sola entrega de valor vertical a la vez.

#### ¿Por qué Revisión = 2?
En sistemas de colas en serie, la fase de revisión representa una compuerta de calidad que previene la entrada de regresiones a producción. Si se asignara un límite excesivamente restrictivo ($\text{WIP} = 1$), cualquier demora mínima en una revisión por pares paralizaría de inmediato a los desarrolladores que terminan su codificación. Por el contrario, un límite abierto ($\text{WIP} \ge 3$) causaría que las historias se acumulen sin integrar, desfasando las pruebas conjuntas.

Con $\text{WIP} = 2$ en Revisión se alcanza el punto de amortiguamiento (*buffer*) óptimo. Si la columna se satura ($\text{Revisión} = 2/2$), **la política del equipo altera dinámicamente la prioridad operativa**:
$$\textbf{"Detener el inicio de nuevas historias y abocarse colaborativamente a revisar, probar e integrar las historias en cola"}$$
Esto materializa el axioma de ingeniería Lean: *"Stop starting, start finishing"*.

---

### 11.3 Unidad de Flujo: Las Historias de Usuario
En el tablero Kanban, la tarjeta que se mueve a través de las columnas es la **Historia de Usuario (HU)** completa (por ejemplo, *HU-002: Crear una capacitación*). Conforme a **ISO/IEC/IEEE 29148:2018**, la HU representa el incremento vertical de valor que viaja desde *TO DO* hasta *DONE*. **No se crean tarjetas separadas para cada paso técnico**.

---

### 11.4 Las 4 Subtareas Técnicas TDD dentro de cada Historia de Usuario
Para materializar las disciplinas de la Programación Extrema (XP) postuladas por *Kent Beck (2000, 2002)* y los estándares de verificación y prueba de **ISTQB CTFL v4.0 (2023)**, cada Historia de Usuario en Jira contiene internamente **cuatro subtareas técnicas estructuradas bajo el ciclo TDD**:

| Subtarea Técnica | Actividad Concreta en el Ciclo TDD | Fundamento de Ingeniería de Calidad |
|---|---|---|
| **T1 — Pruebas / RED** | Diseñar y codificar pruebas unitarias y de integración que inicialmente fallan por ausencia de implementación. | Prevención de defectos por diseño (*Defect Prevention* - ISTQB) y especificación ejecutable. |
| **T2 — Implementación / GREEN** | Desarrollar el código mínimo y necesario para que la suite de pruebas pase exitosamente a verde. | Verificación de funcionalidad básica y eliminación del sobre-diseño (*YAGNI - You Aren't Gonna Need It*). |
| **T3 — Refactorización** | Reestructurar el código interno sin alterar su comportamiento observable: modularizar en Next.js, optimizar consultas Prisma y suprimir duplicidades. | Control riguroso de la Deuda Técnica (*Martin Fowler, 2018; Robert C. Martin, 2008*) para mantener la mantenibilidad ISO 25010. |
| **T4 — Validación e integración** | Ejecutar la suite completa de pruebas de regresión, contrastar con los criterios de aceptación BDD (*Dado/Cuando/Entonces*) y preparar el Pull Request hacia la rama `desarrollo`. | Validación de integración continua (*Continuous Integration*) y cumplimiento de la Definition of Done. |

En el tablero de Jira, la tarjeta principal visualmente visible es la **HU**, y a medida que el desarrollador completa sus subtareas $T1 \rightarrow T2 \rightarrow T3 \rightarrow T4$, la historia transita fluidamente de Desarrollo a Revisión.

---

### 11.5 Reglas Formales de Movimiento entre Columnas (Políticas de Transición)

Para que una tarjeta pueda avanzar entre columnas, debe cumplir estrictamente las siguientes políticas explícitas:

#### 1. Transición: TO DO $\longrightarrow$ DESARROLLO
Una Historia de Usuario puede ingresar a Desarrollo únicamente cuando:
- Pertenece formalmente al Sprint actual aprobado en el Sprint Planning.
- Se encuentra suficientemente refinada y estimada por el equipo.
- Cuenta con Criterios de Aceptación verificables en formato BDD.
- El desarrollador comprende plenamente el alcance funcional y arquitectónico.
- **Existe capacidad disponible dentro del límite WIP de Desarrollo ($\le 3$).**

#### 2. Transición: DESARROLLO $\longrightarrow$ REVISIÓN
Una Historia de Usuario puede pasar a Revisión únicamente cuando:
- Las pruebas automáticas fueron escritas y superadas ($T1$ y $T2$ completadas).
- Se ejecutó el proceso de refactorización ($T3$).
- La funcionalidad completa opera correctamente en el entorno local.
- Las pruebas unitarias locales pasan al 100% sin advertencias.
- El código se encuentra confirmado y subido a la rama personal de GitHub del desarrollador.
- **Existe capacidad disponible dentro del límite WIP de Revisión ($\le 2$).**

#### 3. Transición: REVISIÓN $\longrightarrow$ DONE
Una Historia de Usuario alcanza el estado final de Done únicamente cuando:
- El código ha sido revisado y aprobado formalmente por al menos otro desarrollador (*Peer Review* en GitHub).
- Las pruebas de integración en la rama `desarrollo` pasan sin regresiones.
- No existen errores bloqueantes de compilación en Next.js ni TypeScript.
- Se validaron satisfactoriamente todos los criterios de aceptación junto al Product Owner.
- El Pull Request ha sido fusionado limpiamente en la rama `desarrollo`.

---

### 11.6 Protocolo de Gestión de Bloqueos (Etiqueta $\mathbf{\oslash\text{ BLOQUEADA}}$)
Para preservar la integridad del flujo y no distorsionar las métricas de tiempo de ciclo (*Cycle Time*), el equipo **no utiliza una columna separada llamada "Bloqueado"**. 

Cuando una historia de usuario se ve imposibilitada de continuar (por ejemplo, dependencias de otra HU, falta de credenciales o fallas de infraestructura externa):
1. **La tarjeta permanece en su columna actual** (Desarrollo o Revisión).
2. Se le asigna de inmediato una etiqueta visible: **$\mathbf{\oslash\text{ BLOQUEADA}}$**.
3. Se documenta formalmente en Jira:
   - **Motivo del bloqueo:** Causa técnica o dependencia exacta.
   - **Responsable:** Desarrollador afectado.
   - **Acción requerida:** Tarea concreta para levantar el impedimento.
4. El **Scrum Master** toma conocimiento prioritario en la Daily Scrum para actuar como facilitador y eliminar la traba con la mayor celeridad posible.

---

### 11.7 Dinámica del Flujo en Sprint 1 (HU-001 a HU-006)
El Sprint 1 comprende las primeras seis historias del MVP. El flujo operativo se distribuye de la siguiente manera:

#### Estado Inicial del Tablero (Arranque del Sprint 1):
| TO DO | DESARROLLO [WIP: 3] | REVISIÓN [WIP: 2] | DONE |
|---|---|---|---|
| HU-004 — Previsualizar y publicar | **HU-001** — Acceder al área interna *(Dev 1)* | *(vacío)* | *(vacío)* |
| HU-005 — Explorar públicas | **HU-002** — Crear una capacitación *(Dev 2)* | | |
| HU-006 — Consultar pública | **HU-003** — Slides interactivos *(Dev 3)* | | |

Los tres desarrolladores inician en paralelo sus respectivas historias de usuario.

#### Escenario de Saturación de Revisión y Aplicación de WIP:
Conforme avanza la iteración, puede presentarse el siguiente estado:

| TO DO | DESARROLLO [WIP: 3] | REVISIÓN [WIP: 2] | DONE |
|---|---|---|---|
| HU-006 — Consultar pública | HU-004 *(Dev 1)* | **HU-002** | HU-001 |
| | HU-005 *(Dev 2)* | **HU-003** | |

En este momento:
$$\text{Desarrollo} = 2/3 \quad | \quad \text{Revisión} = 2/2 \text{ (CAPACIDAD MÁXIMA ALCANZADA)}$$
**Regla de intervención:** Ningún desarrollador puede mover una nueva historia a Revisión hasta que se libere al menos una tarjeta. El equipo prioriza revisar el código de HU-002 o HU-003, realizar pruebas e integrarlas en `desarrollo` para que avancen a **DONE**, desbloqueando así el flujo.

---

### 11.8 Dinámica del Flujo en Sprint 2 (HU-007 a HU-012)
El Sprint 2 modela la estructura organizacional de Áreas, Puestos y Onboarding:
- **Arranque:**
  - `DESARROLLO [3]`: HU-007 (Crear área y puestos), HU-008 (Crear ruta de onboarding), HU-009 (Registrar colaboradores).
  - `TO DO [3]`: HU-010 (Activar cuenta con token), HU-011 (Consultar Mi Onboarding), HU-012 (Completar capacitación interna).
- **Flujo:** Conforme se liberan las historias del primer bloque hacia Revisión y Done, HU-010, HU-011 y HU-012 ingresan ordenadamente a Desarrollo, garantizando que nunca coexistan más de 3 historias simultáneas en codificación.

---

### 11.9 Dinámica del Flujo en Sprint 3 (HU-013 a HU-015)
El Sprint 3 aborda los microtests formativos y la supervisión de progreso:
- **Arranque:**
  - `DESARROLLO [3]`: HU-013 (Configurar microtest), HU-014 (Realizar microtest), HU-015 (Consultar avance de colaboradores).
  - `TO DO`: *(vacío)*.
- **Correspondencia Exacta:** 3 Historias de Usuario para 3 Desarrolladores $\rightarrow$ Asignación inicial de 1 HU por desarrollador.
- **Gestión de Dependencias Técnicas:** Dado que HU-014 depende funcionalmente de la estructura creada en HU-013, el desarrollador a cargo de HU-014 avanza en las pruebas ($T1$) y maquetación de componentes frontend, sincronizando la integración de backend una vez consolidado el modelo de datos de HU-013.

---

### 11.10 Política Oficial WIP del Equipo
El equipo adopta como norma de ingeniería de software vinculante la siguiente declaración:

> **POLÍTICA WIP OFICIAL — EQUIPO CGB ACADEMY**
>
> 1. **Límite de Desarrollo:** La columna *Desarrollo* tendrá un límite estricto de **3 Historias de Usuario simultáneas**, equivalente a los tres integrantes del rol Development.
> 2. **Dedicación Unitaria:** Cada desarrollador trabajará preferentemente sobre **una única Historia de Usuario activa a la vez**.
> 3. **Límite de Revisión:** La columna *Revisión* tendrá un límite estricto de **2 Historias de Usuario simultáneas**.
> 4. **Prioridad de Desatoro:** Cuando la columna *Revisión* alcance su límite (2/2), el equipo priorizará de forma absoluta revisar, probar e integrar las historias existentes antes de iniciar o promover nuevas historias.
> 5. **Manejo de Bloqueos:** Las tarjetas impedidas permanecerán en su columna física identificadas con la etiqueta visible **$\mathbf{\oslash\text{ BLOQUEADA}}$**, especificando causa técnica, responsable y acción mitigadora.
> 6. **Condición de Finalización:** Ninguna Historia de Usuario podrá pasar al estado **DONE** sin satisfacer al 100% sus criterios de aceptación, pruebas automatizadas en verde y fusión validada en la rama `desarrollo`.

---

### 11.11 Flujo Metodológico Integrado Scrum + Kanban + TDD
Sintetizando la arquitectura del método híbrido, el ciclo operativo global del proyecto se resume en el siguiente esquema:

$$\text{BACKLOG} \longrightarrow \text{SPRINT} \longrightarrow \text{TO DO} \longrightarrow \mathbf{\text{DESARROLLO [WIP 3]}} \longrightarrow \mathbf{\text{REVISIÓN [WIP 2]}} \longrightarrow \text{DONE}$$

y a nivel interno de cada Historia de Usuario en desarrollo:

$$\mathbf{\text{T1: RED (Pruebas)}} \longrightarrow \mathbf{\text{T2: GREEN (Código)}} \longrightarrow \mathbf{\text{T3: REFACTOR (Calidad)}} \longrightarrow \mathbf{\text{T4: VALIDACIÓN E INTEGRACIÓN}}$$

---

### 11.12 Definición de Hecho (*Definition of Done* — DoD)
Para que una Historia de Usuario sea declarada formalmente **Done**, debe satisfacer sin excepciones:
- [x] Cumplir al 100% todos los Criterios de Aceptación especificados en formato BDD (*Dado que / Cuando / Entonces*).
- [x] Contar con suite de pruebas automáticas superadas en verde (ciclo TDD).
- [x] No generar advertencias ni errores de compilación en Next.js 16 ni TypeScript.
- [x] Contar con persistencia validada en MongoDB Atlas a través de los esquemas de Prisma ORM.
- [x] Haber sido revisada y aprobada por pares mediante Pull Request en GitHub.
- [x] Estar fusionada e integrada limpiamente en la rama `desarrollo`.
- [x] Haber sido demostrada y validada por el Product Owner antes del paso a la rama principal `edmil-saire`.

---

## 12. Incrementos Presentados del Proyecto

### 12.1 Incremento 1 (Sprint 1 — Núcleo de Capacitación y Acceso Público)
El primer incremento del proyecto comprende la construcción del núcleo operativo funcional de la plataforma:

| Código HU | Título de la Historia | Responsable | Resultado Funcional Entregado |
|---|---|---|---|
| **HU-001** | Acceder al área interna | **Dev 1:** Carpio Hermoza, Alex | Formulario de autenticación, validación de credenciales JWT y redirección por rol (Admin / Colaborador). |
| **HU-002** | Crear una capacitación | **Dev 2:** Quispe Mamani, Domingo | Panel de gestión de capacitaciones, creación de registros en BD y edición de datos generales. |
| **HU-003** | Construir contenido mediante slides | **Dev 3:** Ticona Jancco, Ronaldo | Editor interactivo de diapositivas con soporte para textos, imágenes, listas, indicaciones y botones. |
| **HU-004** | Previsualizar y publicar una capacitación | **Dev 1:** Carpio Hermoza, Alex | Flujo de estados (Borrador/Publicada), vista previa interactiva y publicación según ámbito (público/interno). |
| **HU-005** | Explorar capacitaciones públicas | **Dev 2:** Quispe Mamani, Domingo | Catálogo abierto para estudiantes y docentes accesible sin necesidad de inicio de sesión. |
| **HU-006** | Consultar una capacitación pública | **Dev 3:** Ticona Jancco, Ronaldo | Visualizador dinámico de slides interactivos con navegación fluida y ejecución de enlaces/botones. |

- **Evidencias de Funcionamiento:**
  - Interfaces construidas bajo estándares responsive en Next.js.
  - Repositorio activo con control de versiones en GitHub (`edmil-saire` y `desarrollo`).
  - Base de datos relacional con modelos para `Usuario`, `Rol`, `Capacitación` y `Slide`.
- **Pruebas y Validaciones Realizadas:**
  - Pruebas de integración sobre endpoints de autenticación y CRUD de capacitaciones.
  - Verificación manual y automatizada de los Criterios de Aceptación (CA-01 a CA-04 de HU-001 a HU-006) bajo ciclo TDD.
- **Cambios Respecto al Avance Anterior:**
  - Consolidación del alcance MVP reduciendo funcionalidades superfluas (eliminación de pasarelas de pago y módulos pesados de video) para asegurar entrega vertical terminada.

---

## 13. Métricas y Seguimiento del Proceso

El equipo utiliza métricas cuantitativas para evaluar la estabilidad del flujo y la cadencia de entrega:

1. **Velocidad del Sprint (Sprint Velocity):** 
   - Sprint 1: 6 Historias de Usuario completadas (HU-001 a HU-006).
   - Sprint 2: 6 Historias de Usuario (HU-007 a HU-012).
   - Sprint 3: 3 Historias de Usuario (HU-013 a HU-015).
   - Total MVP: 15 Historias de Usuario terminadas bajo Definition of Done.
2. **Tiempo de Ciclo (*Cycle Time*):** Tiempo promedio medido desde que una HU pasa de `TO DO` a `DONE` (meta promedio: 3 a 4 días laborables por HU).
3. **Tasa de Criterios de Aceptación Superados:** 100% de criterios de aceptación verificados antes del cierre de cada historia.
4. **Métricas de Calidad de Código:** Cero regresiones críticas en la rama `desarrollo` mediante validación por pares y suite de pruebas TDD.

---

## 14. Acuerdos de Mejora para el Siguiente Incremento

Tras la retrospectiva del Sprint 1, el equipo adoptó los siguientes compromisos para el Sprint 2:
1. **Anticipación en el Diseño UI/UX:** Validar wireframes en Figma con el Product Owner a más tardar el Día 2 del sprint para evitar retrasos en la fase de frontend.
2. **Automatización de Pruebas de Endpoints:** Extender los tests de integración con Supertest en backend para cubrir casos de excepción y tokens inválidos.
3. **Refinamiento de Dependencias entre HUs:** En el Sprint 2 (Áreas, Puestos y Onboarding), coordinar la estructura de la base de datos de manera conjunta durante la sesión de Sprint Planning.

---

## 15. Política de Uso de IA y Registro de Uso

### 15.1 Política Ética de Uso de Inteligencia Artificial
En el marco de la formación profesional de la UNSAAC, la Inteligencia Artificial se adopta como un copiloto de desarrollo y acelerador de productividad técnica, bajo los siguientes principios inviolables:
1. **Transparencia y Trazabilidad:** Todo aporte generado por modelos de lenguaje (Claude, ChatGPT, Gemini) debe registrarse en la bitácora del proyecto.
2. **Autoría Responsable y Comprensión:** Ningún integrante del equipo puede incluir código o documentación sin comprender cabalmente su funcionamiento y justificación técnica.
3. **Validación Humana Obligatoria:** Todo componente, script de prueba o esquema de BD asistido por IA debe ser revisado, compilado y verificado empíricamente por los desarrolladores.

### 15.2 Registro de Uso de Herramientas de IA
| Fecha | Herramienta Empleada | Propósito / Actividad | Validación Técnica Realizada |
|---|---|---|---|
| 30/09/2026 | Gemini / Claude 3.5 Sonnet | Extracción estructurada y formateo de la especificación funcional CGB Academy | Revisión de coherencia con el documento oficial de 18 páginas y ajuste de alcances. |
| 30/09/2026 | ChatGPT / Copilot | Generación de la plantilla modular en LaTeX (`informe.tex`) y BibTeX | Compilación exitosa en MiKTeX con `pdflatex` y validación de márgenes e hipervínculos. |
| 30/09/2026 | Antigravity AI Assistant | Automatización de scripts de verificación de integridad y comandos Git | Ejecución local y verificación de sincronización de ramas en GitHub. |

---

## 16. Conclusiones

1. **Eficacia del Método Híbrido:** La sinergia entre la cadencia predecible de Scrum (sprints de 2 semanas), la limitación matemática del trabajo en curso de Kanban (Ley de Little con $\text{WIP} = 3$ en Desarrollo y $\text{WIP} = 2$ en Revisión) y la disciplina técnica de XP/TDD proporciona un flujo continuo, minimiza el tiempo de ciclo y previene la dispersión del equipo de cinco integrantes.
2. **Delimitación Rigurosa del MVP bajo Estándares:** La especificación de requerimientos conforme a **ISO/IEC/IEEE 29148:2018** y los atributos **INVEST**, sumada a la clasificación taxonómica de restricciones bajo **ISO/IEC 25010:2023**, asegura un producto de software enfocado, técnicamente verificable y de alto valor institucional sin incurrir en deuda técnica temprana.
3. **Calidad Integrada Mediante Ciclo TDD y Políticas Explícitas:** Estructurar cada Historia de Usuario en las cuatro subtareas técnicas de ingeniería ($T1$ Pruebas/RED, $T2$ Implementación/GREEN, $T3$ Refactorización y $T4$ Validación e Integración) garantiza que ningún incremento alcance el estado de *Done* sin respaldo automatizado, persistencia comprobada en MongoDB Atlas y validación por pares en GitHub.

---

## 17. Referencias Bibliográficas

- Anderson, D. J. (2010). *Kanban: Successful Evolutionary Change for Your Technology Business*. Sequim, WA: Blue Hole Press.
- Beck, K. (2000). *Extreme Programming Explained: Embrace Change*. Boston: Addison-Wesley.
- CGB Academy. (2026). *Documento de Requerimientos Funcionales y No Funcionales: Centro de Capacitación e Inducción (Versión 1.0)*. Cusco: Documentación Técnica de Proyecto.
- Cohn, M. (2004). *User Stories Applied: For Agile Software Development*. Boston: Addison-Wesley Professional.
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2da ed.). Boston: Addison-Wesley Professional.
- Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Reading, MA: Addison-Wesley.
- IEEE Computer Society. (2024). *Guide to the Software Engineering Body of Knowledge (SWEBOK Guide), Version 4.0*. Piscataway, NJ: IEEE Computer Society Standard.
- International Organization for Standardization. (2018). *ISO/IEC/IEEE 29148:2018 Systems and Software Engineering — Life Cycle Processes — Requirements Engineering*. Ginebra: ISO.
- International Organization for Standardization. (2023). *ISO/IEC 25010:2023 Systems and Software Engineering — Systems and Software Quality Requirements and Evaluation (SQuaRE) — Product Quality Model*. Ginebra: ISO.
- ISTQB. (2023). *Certified Tester Foundation Level (CTFL) Syllabus Version 4.0*. International Software Testing Qualifications Board.
- Little, J. D. C. (1961). A Proof for the Queuing Formula: $L = \lambda W$. *Operations Research*, 9(3), 383–387. https://doi.org/10.1287/opre.9.3.383
- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*. Upper Saddle River, NJ: Prentice Hall.
- Pressman, R. S. (2010). *Ingeniería del Software: Un enfoque práctico* (7ma ed.). México D.F.: McGraw-Hill.
- Schwaber, K., & Sutherland, J. (2020). *La Guía de Scrum: Las reglas del juego*. Scrum.org.
- Sommerville, I. (2011). *Ingeniería del Software* (9na ed.). Madrid: Pearson Educación.
- Souppaya, M., Scarfone, K., & Dodson, D. (2022). *Secure Software Development Framework (SSDF) Version 1.1: Recommendations for Mitigating the Risk of Software Vulnerabilities*. NIST Special Publication 800-218. https://doi.org/10.6028/NIST.SP.800-218
