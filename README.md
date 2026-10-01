# Centro de Capacitación e Inducción — CGB Academy
**Proyecto de Ingeniería de Software — Universidad Nacional de San Antonio Abad del Cusco (UNSAAC)**  
*Facultad de Ingeniería Eléctrica, Electrónica, Informática y Mecánica | Semestre 2026-I*

---

## 👥 Equipo de Trabajo y Roles (Sprint 1)

El equipo aplica una política de **roles rotativos por sprint** para alternar responsabilidades de liderazgo y gestión:

| N° | Integrante | Rol en Sprint 1 | Rama de Trabajo Personal |
|---|---|---|---|
| 1 | **Saire Bustamante, Edmil Jampier** | **Product Owner** (Sprint 1) / Dev Full-Stack | `edmil-saire` (Rama Principal / Main) |
| 2 | **Barazorda Cuellar, Hector** | **Scrum Master** (Sprint 1) / Dev Full-Stack | `hector-barazorda` |
| 3 | **Carpio Hermoza, Alex** | **Desarrollador Full-Stack** | `alex-carpio` |
| 4 | **Quispe Mamani, Domingo de Guzman** | **Desarrollador Full-Stack** | `domingo-quispe` |
| 5 | **Ticona Jancco, Ronaldo** | **Desarrollador Full-Stack** | `ronaldo-ticona` |

> [!NOTE]
> Al concluir el Sprint 1 (en la sesión de Retrospectiva), se evalúa el desempeño de la dinámica de trabajo y se acuerda la rotación de los roles de Product Owner y Scrum Master hacia los demás integrantes para los siguientes sprints.

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

## 🌿 Arquitectura y Flujo de Ramas en Git

El repositorio opera bajo un esquema colaborativo diseñado para testear los avances antes de pasar a la rama principal:

```
[ edmil-saire ] (MAIN / PRODUCCIÓN - Siempre estable y sin errores)
       ▲
       │  (Merge tras validación completa del equipo)
[ desarrollo ]  (DESARROLLO - Testeo conjunto y unión de todos los devs)
       ▲
       ├── [ hector-barazorda ]  (Pull Request individual con cuenta de GitHub)
       ├── [ alex-carpio ]       (Pull Request individual con cuenta de GitHub)
       ├── [ domingo-quispe ]    (Pull Request individual con cuenta de GitHub)
       ├── [ edmil-saire ]       (Desarrollo de historias individuales)
       └── [ ronaldo-ticona ]    (Pull Request individual con cuenta de GitHub)
```

### 📋 Guía Rápida para cada Desarrollador:

1. **Situarse en su rama y traer lo último de desarrollo:**
   ```bash
   git checkout <tu-nombre-de-rama>
   git pull origin desarrollo
   ```
2. **Desarrollar y subir cambios con su cuenta de GitHub:**
   ```bash
   git add .
   git commit -m "feat(modulo): avance de la funcionalidad HU-xxx"
   git push origin <tu-nombre-de-rama>
   ```
3. **Crear Pull Request en GitHub:**
   - **Base:** `desarrollo` $\leftarrow$ **Compare:** `<tu-nombre-de-rama>`
4. **Testeo en `desarrollo`:**
   El equipo prueba conjuntamente que la unión de componentes y endpoints funcione sin fallos.
5. **Pase a la rama principal (`edmil-saire`):**
   Una vez probado y libre de errores en `desarrollo`, el Scrum Master / Product Owner realiza la integración final a `edmil-saire`.

---

---

## 📊 Metodología de Desarrollo: Scrum + Kanban con Límites WIP + TDD

El proyecto combina la cadencia de **Scrum** (sprints de 2 semanas), la fluidez de **Kanban** y el rigor técnico de **TDD**:

```
[ BACKLOG ] ──> [ SPRINT ] ──> [ TO DO ] ──> [ DESARROLLO (WIP 3) ] ──> [ REVISIÓN (WIP 2) ] ──> [ DONE ]
```

### 📋 Tablero Kanban Oficial del Equipo:
| Columna | Significado | Límite WIP | Justificación Operativa |
|---|---|:---:|---|
| **TO DO** | HUs del Sprint comprometidas aún no iniciadas | Sin límite | Backlog priorizado del Sprint. |
| **DESARROLLO** | HUs en codificación activa y construcción de pruebas | **3** | **1 desarrollador = máx. 1 HU activa** (3 integrantes Development). |
| **REVISIÓN** | En espera de *Peer Review*, pruebas e integración | **2** | Si llega a **2/2**, el equipo detiene trabajo nuevo y ayuda a desatorar revisión. |
| **DONE** | Integradas en `desarrollo`, aceptadas por el PO | Sin límite | Cumplen con la *Definition of Done* al 100%. |

### 🧪 Ciclo TDD en 4 Subtareas Técnicas dentro de cada HU:
Cada Historia de Usuario es la tarjeta principal que viaja por el tablero y contiene en su interior 4 subtareas técnicas:
1. **T1 — Pruebas / RED:** Diseñar pruebas unitarias e integración que inicialmente fallan.
2. **T2 — Implementación / GREEN:** Programar el código necesario para pasar las pruebas a verde.
3. **T3 — Refactorización:** Limpiar el código, modularizar y optimizar sin romper la funcionalidad.
4. **T4 — Validación e integración:** Verificar criterios BDD (*Dado/Cuando/Entonces*) y preparar el PR a `desarrollo`.

### 🚫 Gestión de Bloqueos:
No existe columna "Bloqueado". Las tarjetas impedidas permanecen en su columna con la etiqueta **`🚫 BLOQUEADA`**, detallando en Jira: *Motivo, Responsable y Acción requerida*. El Scrum Master prioriza su remoción en la Daily Scrum.

### 🎯 Distribución de las 15 HUs del MVP por Sprints:
- **Sprint 1 (HU-001 a HU-006):** Núcleo de capacitación y acceso público.  
  *Arranque:* Dev 1 $\rightarrow$ HU-001 | Dev 2 $\rightarrow$ HU-002 | Dev 3 $\rightarrow$ HU-003. Luego ingresan HU-004, HU-005, HU-006.
- **Sprint 2 (HU-007 a HU-012):** Estructura organizacional (Áreas, Puestos) y Onboarding de colaboradores.  
  *Arranque:* Dev 1 $\rightarrow$ HU-007 | Dev 2 $\rightarrow$ HU-008 | Dev 3 $\rightarrow$ HU-009. Luego ingresan HU-010, HU-011, HU-012.
- **Sprint 3 (HU-013 a HU-015):** Microtests formativos y supervisión de colaboradores.  
  *Arranque:* Dev 1 $\rightarrow$ HU-013 | Dev 2 $\rightarrow$ HU-014 | Dev 3 $\rightarrow$ HU-015 (3 HUs para 3 Devs).

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