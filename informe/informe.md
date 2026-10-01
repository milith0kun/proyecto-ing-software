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
1. **Especificar y priorizar los requerimientos funcionales y no funcionales** del MVP mediante 15 historias de usuario redactadas en formato estándar (*Como/Quiero/Para*) y sustentadas en criterios de aceptación verificables (*Dado/Cuando/Entonces*).
2. **Diseñar una arquitectura web ligera y desacoplada** para frontend y backend, optimizada para desplegarse en infraestructura VPS de recursos controlados (2 vCPU y 8 GB de RAM) priorizando componentes interactivos ligeros.
3. **Implementar el motor de creación y visualización de capacitaciones mediante slides**, permitiendo la administración no-code de contenidos de inducción tanto para el ámbito público como privado.
4. **Construir el módulo de onboarding organizacional jerárquico**, modelando la relación *Área $\rightarrow$ Puesto $\rightarrow$ Ruta de Onboarding $\rightarrow$ Capacitaciones*, garantizando la activación segura de colaboradores y la persistencia automática de su progreso.
5. **Incorporar microtests formativos de evaluación inmediata**, brindando retroalimentación pedagógica al colaborador sin penalizaciones de puntajes punitivos.
6. **Aplicar un método de desarrollo ágil híbrido (Scrum base, Kanban visual y prácticas técnicas de XP)** con integración continua, revisión de código por pares y validación asistida por Inteligencia Artificial.

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

### 5.2 Restricciones del Sistema
- **RNF-001 (Diseño Responsive):** Adaptación fluida a computadoras de escritorio, tablets y dispositivos móviles.
- **RNF-002 (Idioma):** Interfaz disponible íntegramente en español sin soporte de internacionalización inicial.
- **RNF-003 (Infraestructura Objetivo):** Capacidad de operar en una VPS de **2 vCPU y 8 GB de RAM** bajo contenedores Docker o servicios Node.js livianos.
- **RNF-004 (Contenido Ligero):** Arquitectura sin streaming de video propio ni gestor de archivos binarios pesados; priorización de texto e imágenes optimizadas en WebP/SVG.
- **RNF-005 (Seguridad de Acceso Interno):** Segmentación estricta de rutas privadas protegidas por tokens de sesión; redirección forzada de usuarios anónimos al login.
- **RNF-006 (Protección de Credenciales):** Almacenamiento no legible de credenciales (hashing robusto con bcrypt/argon2) y tokens de activación de un solo uso.
- **RNF-007 (Minimización de Datos):** Registro simplificado sin solicitud obligatoria de DNI, teléfono o dirección; únicamente nombres, correo institucional, rol y asignaciones.
- **RNF-008 (Consistencia Visual):** Uso de un sistema de componentes prediseñados bajo la identidad de marca de CGB Academy para evitar el diseño ad-hoc de pantallas.
- **RNF-009 (Facilidad de Administración):** Creación y ordenamiento de slides mediante interfaz gráfica intuitiva (*no-code*).
- **RNF-010 (Integridad de Información):** Restricciones de integridad referencial para impedir el borrado huérfano de áreas o puestos con colaboradores activos.

---

## 6. Tecnologías Utilizadas

De acuerdo a la arquitectura técnica definida para la plataforma (Frontend, Backend, Prisma, MongoDB Atlas y Next.js App), se seleccionó la siguiente pila tecnológica:

| Capa / Componente | Tecnología Seleccionada | Justificación Técnica de Selección |
|---|---|---|
| **Base de Datos** | **MongoDB Atlas** | Base de datos NoSQL documental en la nube; flexible, altamente escalable y óptima para almacenar la estructura dinámica de slides enriquecidos y progresos. |
| **ORM / Acceso a Datos** | **Prisma ORM** | Modelado declarativo de esquemas (`schema.prisma` con provider `mongodb`), generación de cliente fuertemente tipado en TypeScript y seguridad en consultas. |
| **Arquitectura Full-Stack** | **Next.js (App Router)** | Framework unificado que resuelve tanto el **Frontend** (React con Server y Client Components) como el **Backend** (Route Handlers `/app/api/...` y Server Actions). |
| **Aplicación Web (App)** | **Next.js Web App** | Aplicación web responsiva, optimizada para SEO y tiempos de carga instantáneos en accesos públicos e internos. |
| **Estilos y Maquetación** | TailwindCSS / CSS Moderno | Diseño responsive basado en utilidades, coherente con la identidad visual corporativa de CGB Academy. |
| **Lenguaje de Desarrollo** | TypeScript | Tipado estático de extremo a extremo (base de datos, API y componentes de interfaz). |
| **Control de Versiones** | Git & GitHub | Ramificación con rama principal `edmil-saire`, rama de integración `desarrollo` y ramas individuales por desarrollador. |
| **Gestión Ágil** | Jira / GitHub Projects | Backlog de historias de usuario, tablero Kanban por fases y seguimiento de métricas ágiles. |

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
- **Tablero Visual por Fases:** En lugar de simples columnas "To Do / Doing / Done", el tablero descompone cada HU en sus 5 fases consecutivas de ingeniería.
- **Límite WIP (Work In Progress):** Cada desarrollador tiene permitido un límite estricto de **WIP = 1 HU activa**. No se inicia una nueva historia hasta culminar las 5 fases de la actual.
- **Carril de Bloqueo (*Blocked Lane*):** Cualquier tarea paralizada por causas técnicas o dependencias externas se traslada a la columna de bloqueo para intervención inmediata.

### 9.3 Aportes de Programación Extrema (XP)
- **Integración Continua (CI):** Cada pull request a `develop` compila y ejecuta pruebas automáticas en GitHub.
- **Revisión de Código por Pares (*Peer Review*):** Ningún código entra a la rama común sin al menos una aprobación formal de otro integrante.
- **Diseño Simple y Refactorización:** El código se escribe priorizando claridad semántica, eliminando duplicidad y optimizando componentes.
- **Pruebas Automatizadas de Aceptación:** Cada criterio de aceptación (`Dado/Cuando/Entonces`) se traduce en una validación de prueba reproducible.

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

La unidad central de entrega es la **Historia de Usuario (HU)** tratada como un incremento vertical completo. Cada desarrollador recorre obligatoriamente **cinco fases consecutivas**:

```
[ BACKLOG ] ──> [ 1. PLAN ] ──> [ 2. DISEÑO UI/UX ] ──> [ 3. FRONTEND ] ──> [ 4. BACKEND ] ──> [ 5. TEST ] ──> [ DONE ]
                      │                                                                                │
                      └───────────────────────────────[ ⚠️ BLOQUEADO ]─────────────────────────────────┘
```

### 11.1 Estados del Tablero Kanban
1. **Backlog:** Historias priorizadas en espera del siguiente sprint.
2. **1. Plan:** Refinamiento de la HU, formulación de criterios de aceptación BDD y estimación en Planning Poker.
3. **2. Diseño UI/UX:** Creación y validación de wireframes/pantallas en Figma bajo los lineamientos visuales de CGB Academy.
4. **3. Frontend:** Construcción de componentes, formularios e interfaces responsivas en React/Next.js.
5. **4. Backend:** Implementación de endpoints RESTful con Route Handlers de Next.js (`/app/api/...`), modelos Prisma y base de datos MongoDB Atlas.
6. **5. Test:** Ejecución de pruebas unitarias, verificación de criterios de aceptación y validación de regresión.
7. **Done:** Incremento probado, revisado por pares y fusionado en `desarrollo`.
8. **Bloqueado (Carril Transversal):** Tareas interrumpidas por dependencias de terceros, credenciales o fallos bloqueantes.

### 11.2 Límites WIP (Work In Progress)
- **Límite Estricto:** Máximo **1 HU activa en desarrollo por persona**. Queda prohibido avanzar una segunda historia si la anterior no ha superado la fase de pruebas y alcanzado el estado de *Done*.

### 11.3 Política de Bloqueo
- Si una historia permanece detenida por más de 24 horas continuas, el desarrollador debe asignarle la etiqueta `Bloqueado` y comunicarlo de inmediato en la Daily Scrum para que el Scrum Master coordine la resolución colaborativa del impedimento.

### 11.4 Definición de Hecho (*Definition of Done* — DoD)
Para que una Historia de Usuario sea declarada formalmente **Done**, debe satisfacer sin excepciones:
- [x] Cumplir al 100% todos los Criterios de Aceptación especificados (CA-01, CA-02, etc.).
- [x] No generar errores de compilación en Next.js ni advertencias críticas de TypeScript.
- [x] Contar con persistencia correcta en MongoDB Atlas a través de Prisma ORM.
- [x] Haber sido revisada y aprobada por al menos otro desarrollador (*Peer Review* en GitHub).
- [x] Estar fusionada e integrada limpiamente en la rama `desarrollo` habiendo superado el testeo conjunto.
- [x] Haber sido demostrada y validada por el Product Owner antes del merge a `edmil-saire`.

---

## 12. Incrementos Presentados del Proyecto

### 12.1 Incremento 1 (Sprint 1 — Núcleo de Capacitación y Acceso Público)
El primer incremento del proyecto comprende la construcción del núcleo operativo funcional de la plataforma:

| Código HU | Título de la Historia | Responsable | Resultado Funcional Entregado |
|---|---|---|---|
| **HU-001** | Acceder al área interna | [Asignado 1] | Formulario de autenticación, validación de credenciales JWT y redirección por rol (Admin / Colaborador). |
| **HU-002** | Crear una capacitación | [Asignado 2] | Panel de gestión de capacitaciones, creación de registros en BD y edición de datos generales. |
| **HU-003** | Construir contenido mediante slides | [Asignado 3] | Editor interactivo de diapositivas con soporte para textos, imágenes, listas, indicaciones y botones. |
| **HU-004** | Previsualizar y publicar una capacitación | [Asignado 1] | Flujo de estados (Borrador/Publicada), vista previa interactiva y publicación según ámbito (público/interno). |
| **HU-005** | Explorar capacitaciones públicas | [Asignado 2] | Catálogo abierto para estudiantes y docentes accesible sin necesidad de inicio de sesión. |
| **HU-006** | Consultar una capacitación pública | [Asignado 3] | Visualizador dinámico de slides interactivos con navegación fluida y ejecución de enlaces/botones. |

- **Evidencias de Funcionamiento:**
  - Interfaces construidas bajo estándares responsive en Next.js.
  - Repositorio activo con control de versiones en GitHub (`main` y `develop`).
  - Base de datos relacional con modelos para `Usuario`, `Rol`, `Capacitación` y `Slide`.
- **Pruebas y Validaciones Realizadas:**
  - Pruebas de integración sobre endpoints de autenticación y CRUD de capacitaciones.
  - Verificación manual de los Criterios de Aceptación (CA-01 a CA-04 de HU-001 a HU-006).
- **Cambios Respecto al Avance Anterior:**
  - Consolidación del alcance MVP reduciendo funcionalidades superfluas (eliminación de pasarelas de pago y módulos pesados de video) para asegurar entrega vertical terminada.

---

## 13. Métricas y Seguimiento del Proceso

El equipo utiliza métricas cuantitativas para evaluar la estabilidad del flujo y la cadencia de entrega:

1. **Velocidad del Sprint (Sprint Velocity):** 4 Historias de Usuario completadas por sprint (equivalente a 100% de la capacidad comprometida del equipo).
2. **Tiempo de Ciclo (*Cycle Time*):** Tiempo promedio medido desde que una HU pasa de `Plan` a `Done` (meta promedio: 3 a 4 días laborables por HU).
3. **Tasa de Criterios de Aceptación Superados:** 100% de criterios de aceptación verificados antes del cierre de cada historia.
4. **Métricas de Calidad de Código:** Cero regresiones críticas en la rama `develop` mediante validación por pares.

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

1. **Eficacia del Método Híbrido:** La combinación de la estructura cadenciada de Scrum, el control visual con límites WIP de Kanban y las prácticas de ingeniería de XP proporciona un equilibrio óptimo entre previsibilidad de entregas, calidad técnica y autonomía para un equipo universitario de cuatro desarrolladores.
2. **Acotamiento Riguroso del MVP:** La delimitación precisa del alcance de CGB Academy (evitando LMS pesados, pasarelas de pago o hosting de video) asegura que el equipo entregue un producto de software terminado, funcional y de alto valor institucional dentro de los plazos académicos previstos.
3. **Calidad Integrada por Fases:** Obligar a que cada historia de usuario atraviese consecutivamente las cinco fases (Plan, Diseño UI/UX, Frontend, Backend y Test) previene el fenómeno común del "software a medio terminar" y garantiza que cada incremento cuente con respaldo visual, persistencia de datos y pruebas verificables.

---

## 17. Referencias Bibliográficas

- Sommerville, I. (2011). *Ingeniería del Software* (9na ed.). Madrid: Pearson Educación.
- Pressman, R. S. (2010). *Ingeniería del Software: Un enfoque práctico* (7ma ed.). México D.F.: McGraw-Hill.
- Schwaber, K., & Sutherland, J. (2020). *La Guía de Scrum: Las reglas del juego*. Scrum.org.
- Anderson, D. J. (2010). *Kanban: Successful Evolutionary Change for Your Technology Business*. Sequim, WA: Blue Hole Press.
- Beck, K. (2000). *Extreme Programming Explained: Embrace Change*. Boston: Addison-Wesley.
- CGB Academy. (2026). *Documento de Requerimientos Funcionales y No Funcionales: Centro de Capacitación e Inducción (Versión 1.0)*. Cusco: Documentación Técnica de Proyecto.
