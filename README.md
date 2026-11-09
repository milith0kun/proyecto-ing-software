# Centro de Capacitación e Inducción — CGB Academy
**Proyecto de Ingeniería de Software — Universidad Nacional de San Antonio Abad del Cusco (UNSAAC)**
*Facultad de Ingeniería Eléctrica, Electrónica, Informática y Mecánica | Semestre 2026-I*

---

## 👥 Equipo de trabajo

El equipo está conformado por Saire Bustamante, Edmil Jampier; Barazorda Cuellar, Hector; Carpio Hermoza, Alex; Quispe Mamani, Domingo de Guzman; y Ticona Jancco, Ronaldo. Desde el Sprint 2, Edmil Saire es Product Owner y Scrum Master, y Hector Barazorda, Alex Carpio, Domingo Quispe y Ronaldo Ticona son los cuatro desarrolladores; las asignaciones vigentes están en Jira. Las ramas de Git representan tareas, no integrantes.

**Punto de entrada de la evidencia:** ver [Evidencia y trazabilidad](#evidencia-y-trazabilidad). Las reglas vigentes para trabajar en el repositorio están en [`docs/FLUJO_DE_TRABAJO.md`](docs/FLUJO_DE_TRABAJO.md), la [`Definition of Done`](docs/definition-of-done.md) y la [gestión de configuración](docs/configuracion.md).

---

## 🛠️ Pila Tecnológica (Stack de Arquitectura)

De acuerdo a la arquitectura técnica del sistema:

```
[ Base de Datos: MongoDB Atlas ]
               ▲
               │  (Conector MongoDB)
     [ ORM: Prisma ]
               ▲
               │  (Acceso tipado en TypeScript)
[ Framework Full-Stack: Next.js (App Router) ]
         ├── Backend: Route Handlers (/app/api/...)
         └── Frontend: React Components (SSR / Client)
               ▲
               │
     [ App Web Next.js ]
```

- **Base de Datos:** MongoDB Atlas (Cloud NoSQL DB documental).
- **ORM / Mapeo de Datos:** Prisma ORM (`provider = "mongodb"` en `schema.prisma`).
- **Arquitectura Full-Stack:** Next.js con App Router unificando Backend (APIs y lógica) y Frontend (vistas responsivas e interactivas).
- **Estilos:** TailwindCSS / CSS Moderno adaptativo.
- **Plataforma:** Aplicación Web Next.js.

---

## 🌿 Flujo de trabajo y ramas

**Estrategia elegida: Flujo de GitHub (*GitHub Flow*)**, no Git Flow: sin `develop` ni `release` permanentes, por ser un equipo pequeño con sprints de dos semanas. `main` es la única rama permanente de integración. Cada cambio parte de `origin/main` en una rama corta por tarea Jira y llega a `main` mediante Pull Request revisado. No se crean ramas permanentes por integrante ni una rama intermedia `develop`/`desarrollo`. La guía completa incluye comandos seguros, nombres de rama, commits, limpieza, revisión y control de cambios: [`docs/FLUJO_DE_TRABAJO.md`](docs/FLUJO_DE_TRABAJO.md).

## Actividad: validación de necesidades

El [informe breve de necesidades y requisitos](informe/actividad-necesidades-latex/actividad_necesidades.pdf) y su [proyecto LaTeX](informe/actividad-necesidades-latex/main.tex) enlazan las historias refinadas [CGB-51](https://cgb-academy.atlassian.net/browse/CGB-51) y [CGB-56](https://cgb-academy.atlassian.net/browse/CGB-56). La [fuente Markdown](informe/actividad_necesidades.md), el [registro anonimizado de conversatorios y análisis documental](informe/registro_conversatorios.md), la [plantilla de entrevista y observación](informe/plantilla_entrevista_usuario.md) y la [evaluación de pendientes](docs/ANALISIS_FALTANTES_ACTIVIDAD_INGENIERIA_REQUISITOS.md) explican qué está documentado y qué sigue por validar.

## 📊 Metodología de Desarrollo: Scrum + Kanban con Límites WIP + TDD

El proyecto combina la cadencia de **Scrum** (sprints de 2 semanas), la fluidez de **Kanban** y el rigor técnico de **TDD**:

```
[ BACKLOG ] ──> [ SPRINT ] ──> [ POR HACER ] ──> [ EN DESARROLLO (WIP 4) ] ──> [ EN REVISIÓN (WIP 2) ] ──> [ HECHO en main ]
```

### 📋 Tablero Kanban Oficial del Equipo:
| Columna | Significado | Límite WIP | Justificación Operativa |
|---|---|:---:|---|
| **POR HACER** | HUs preparadas y comprometidas para el Sprint, aún no iniciadas | Sin límite | La historia cumple la Definition of Ready. |
| **DESARROLLO** | HUs en codificación activa y construcción de pruebas | **4** | **1 desarrollador = máx. 1 HU activa** (4 integrantes Development desde el Sprint 2; eran 3 en el Sprint 1). |
| **REVISIÓN** | En espera de *Peer Review*, pruebas e integración | **2** | Si llega a **2/2**, el equipo detiene trabajo nuevo y ayuda a desatorar revisión. |
| **HECHO** | Integradas en `main`, aceptadas por el PO | Sin límite | Cumplen con la [Definition of Done](docs/definition-of-done.md) y enlazan Jira, PR y commit. |

### 🧪 TDD en historias con cambios de comportamiento
La Historia de Usuario es la tarjeta principal del tablero. Para cambios de comportamiento se aplica el ciclo TDD; sus pasos se representan como subtareas Jira cuando ayudan a coordinar el trabajo, no como subtareas vacías obligatorias:
1. **T1 — Pruebas / RED:** Diseñar pruebas unitarias e integración que inicialmente fallan.
2. **T2 — Implementación / GREEN:** Programar el código necesario para pasar las pruebas a verde.
3. **T3 — Refactorización:** Limpiar el código, modularizar y optimizar sin romper la funcionalidad.
4. **T4 — Validación y PR:** verificar criterios BDD (*Dado/Cuando/Entonces*) y preparar el PR hacia `main`. En tareas documentales se revisan contenido, enlaces y consistencia, sin inventar pruebas de comportamiento.

### 🚫 Gestión de Bloqueos:
No existe columna "Bloqueado". Las tarjetas impedidas permanecen en su columna con la etiqueta **`🚫 BLOQUEADA`**, detallando en Jira: *Motivo, Responsable y Acción requerida*. El Scrum Master prioriza su remoción en la Daily Scrum.

### 🎯 Plan inicial de las 15 HUs del MVP

Esta distribución es una referencia de planificación inicial; Jira determina el sprint y estado vigentes.

- **Sprint 1 (HU-001 a HU-006):** Núcleo de capacitación y acceso público (19 SP, 3 desarrolladores).
- **Sprint 2 (HU-007 a HU-014, 32 SP, 09/11–23/11/2026):** Áreas, puestos, onboarding de colaboradores y microtest formativo (HU-013 y HU-014 se adelantaron desde el Sprint 3). Reparto vigente en Jira: Alex → HU-007 y HU-013; Domingo → HU-008 y HU-010; Ronaldo → HU-009 y HU-011; Hector → HU-012 y HU-014.
- **Sprint 3:** HU-015 (reportes de avance).

---

## 📁 Estructura del Repositorio

```
Proyecto Doctores Ing de Sotfware/
├── .env.example                        # Plantilla de variables de entorno para desarrolladores
├── .gitignore                          # Exclusión estricta de secretos (.env) y dependencias
├── next.config.ts                      # Configuración de Next.js (Turbopack)
├── package.json                        # Dependencias (Next.js 16, React 19, Prisma 6)
├── tsconfig.json                       # Configuración de TypeScript
├── prisma/
│   └── schema.prisma                   # Esquema de datos para MongoDB Atlas (provider: "mongodb")
├── src/
│   ├── app/
│   │   ├── api/health/route.ts         # Endpoint de verificación de estado y conexión a MongoDB
│   │   ├── layout.tsx                  # Layout principal de la aplicación
│   │   ├── page.tsx                    # Landing page sobria de bienvenida CGB Academy
│   │   └── globals.css                 # Estilos globales con Tailwind CSS
│   └── lib/
│       └── prisma.ts                   # Cliente singleton de conexión a MongoDB Atlas
├── MANUAL_DE_MARCA_Y_SISTEMA_DISENO.md # Guía Maestra de Estilo y Sistema de Diseño Oficial (Capacitación/Inducción)
├── informe/
│   ├── informe.md                      # Informe académico en Markdown (Metodología, Requisitos, Stack)
│   ├── informe.tex                     # Código fuente LaTeX estándar UNSAAC
│   ├── informe.pdf                     # PDF oficial compilado (15 páginas con estándares ISO/IEEE/SWEBOK)
│   └── referencias.bib                 # Bibliografía académica en formato BibTeX
├── logos/                              # Identidad visual de CGB Academy, CIIP, GEOMINA y BIOMEDIC
├── public/logos/                       # Logotipos optimizados servidos estáticamente
└── README.md                           # Documentación central y directrices del equipo
```

---

## 🎨 Manual de Marca y Sistema de Diseño (Obligatorio)

Todo desarrollo de interfaz de usuario debe ceñirse estrictamente a las directrices de la plataforma de **Capacitación e Inducción**:

👉 **Consulta el documento maestro:** [`MANUAL_DE_MARCA_Y_SISTEMA_DISENO.md`](./MANUAL_DE_MARCA_Y_SISTEMA_DISENO.md)

### 📌 Reglas de Oro para Desarrolladores:
1. **Paleta Institucional:** Usar variables CSS oficiales (`--brand-navy: #092A60`, `--brand-blue: #146287`, `--brand-cyan: #4DC4D3`).
2. **Accesibilidad WCAG Innegociable:** El cian (`#4DC4D3`) **nunca** se usa como texto sobre fondos claros. Solo como fondo con texto Navy `#092A60` o foco de inputs.
3. **Superficies Canónicas:** Lienzo `#F9FAFB` $\rightarrow$ alternancia `#F3F6FA` $\rightarrow$ tarjetas `#FFFFFF`. **Prohibido el uso de grises slate (`#f1f5f9`).**
4. **Tipografía Oficial:** `Montserrat` para títulos y botones; `Inter` para cuerpo de texto; `Georgia` solo para diplomas y certificados.
5. **Componentes de Inducción:** Utilizar `.boton-primario` (1 por bloque), `.tarjeta-cgb` (alturas al ras con `flex: 1`), `.barra-progreso` y `.chip-estado`.
6. **Iconos:** Exclusivamente SVG inline vectoriales limpios (estilo Lucide). **Cero emojis en componentes de interfaz.**
7. **Nomenclatura:** Clases, variables y propiedades 100% redactadas en español.

---

## Evidencia y trazabilidad

Punto de entrada para recorrer la evidencia del proyecto (repositorio, tablero, workflow y Definition of Done):

| Elemento | Dónde |
|---|---|
| Repositorio, inventario y regla de aprobación | [`docs/configuracion.md`](docs/configuracion.md) |
| Workflow: ramas, commits, PR y revisión | [`docs/FLUJO_DE_TRABAJO.md`](docs/FLUJO_DE_TRABAJO.md), [plantilla de PR](.github/PULL_REQUEST_TEMPLATE.md) |
| Definition of Done | [`docs/definition-of-done.md`](docs/definition-of-done.md) |
| Tablero y backlog | [Jira CGB](https://cgb-academy.atlassian.net/jira/software/projects/CGB/boards/4) |
| Estado de ramas y GitHub | [`docs/ESTADO_RAMAS.md`](docs/ESTADO_RAMAS.md) |
| Laboratorios | [`Labos/`](Labos/), incluido el [Sprint Planning del Laboratorio 7](Labos/Guia7/INFORME_LABORATORIO_7.md) |

Trazabilidad de las historias integradas (Jira → PR → commit en `main`): CGB-1 → PR #1 → `43d3425`; CGB-21 → PR #2 → `6380337`; CGB-11 → PR #3 → `c0016ca`; CGB-6 → PR #4 → `13c65e5`; CGB-16 → PR #5 → `47103c0`. Las claves de Jira enlazan estos PR y commits.

**Línea base:** pendiente de aprobación. No hay tags ni releases; se creará uno cuando el equipo apruebe una entrega según [`docs/configuracion.md`](docs/configuracion.md).

**Uso de IA:** los asistentes proponen y resumen; la decisión sobre cada recomendación se registra en el PR (o "sin uso"). Hasta ahora no hay decisiones de IA registradas en un PR.
