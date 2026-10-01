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

#### ¿Por qué Desarrollo = 3?
El equipo de trabajo cuenta con **3 integrantes en el rol de Development** dedicados a la construcción de las historias de usuario de cada Sprint (mientras que los roles de Product Owner y Scrum Master facilitan la gestión, refinamiento y apoyo técnico). La regla operativa fundamental es:

$$\mathbf{1\text{ Desarrollador} = \text{Máximo 1 HU activa en Desarrollo}}$$

Esta política elimina el cambio de contexto (*context switching*), la multitarea ineficiente y la acumulación de trabajo a medio terminar. Cada desarrollador asume una única historia de principio a fin hasta enviarla a Revisión.

#### ¿Por qué Revisión = 2?
En equipos de desarrollo ágil pequeños, la fase de revisión suele convertirse en un cuello de botella silencioso. Un límite de $\text{WIP} = 1$ resultaría demasiado restrictivo y bloquearía a los desarrolladores al terminar su historia, mientras que un límite sin control permitiría que el código pendiente de integración se acumule indefinidamente.

Con $\text{WIP} = 2$ en Revisión se logra el equilibrio perfecto. Si en algún momento la columna alcanza su tope ($\text{Revisión} = 2/2$), **la prioridad de todo el equipo cambia de inmediato**:
$$\textbf{"Dejar de iniciar trabajo nuevo y ayudar a terminar la revisión e integración existente"}$$
Ningún desarrollador puede ingresar una tercera historia a Revisión hasta que se libere un espacio, materializando el principio rector de Kanban: *"Stop starting, start finishing"*.

---

### 11.3 Unidad de Flujo: Las Historias de Usuario
En el tablero Kanban, la tarjeta que se mueve a través de las columnas es la **Historia de Usuario (HU)** completa (por ejemplo, *HU-002: Crear una capacitación*). **No se crean tarjetas separadas para cada paso técnico**. La HU representa el incremento vertical de valor que viaja desde *TO DO* hasta *DONE*.

---

### 11.4 Las 4 Subtareas Técnicas TDD dentro de cada Historia de Usuario
Para asegurar la excelencia técnica requerida por la Programación Extrema (XP), cada Historia de Usuario en Jira contiene internamente **cuatro subtareas técnicas estructuradas bajo el ciclo TDD**:

| Subtarea Técnica | Actividad Concreta en el Ciclo TDD |
|---|---|
| **T1 — Pruebas / RED** | Diseñar y programar pruebas automatizadas unitarias/integración que inicialmente fallan por no existir la implementación. |
| **T2 — Implementación / GREEN** | Desarrollar el código mínimo y necesario para que todas las pruebas pasen exitosamente a verde. |
| **T3 — Refactorización** | Limpiar el diseño, modularizar componentes en Next.js, optimizar consultas de Prisma y eliminar código redundante sin alterar el comportamiento. |
| **T4 — Validación e integración** | Ejecutar la suite completa de pruebas, contrastar con los criterios de aceptación BDD (*Dado/Cuando/Entonces*) y preparar el Pull Request hacia la rama `desarrollo`. |

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
